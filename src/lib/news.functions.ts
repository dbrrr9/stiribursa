import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SEED_NEWS } from "./seed-news";
import type {
  ImpactLevel,
  NewsItem,
  NewsSource,
  Sentiment,
  ThemeTag,
  MarketRegion,
  ArticleAnalysis,
} from "./news-types";

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const AI_MODEL = "google/gemini-3-flash-preview";

// In-memory cache (per worker instance)
let newsCache: { items: NewsItem[]; ts: number } | null = null;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 min
const analysisCache = new Map<string, ArticleAnalysis>();

// ============================================================================
// RSS FEEDS — surse publice, fără API key
// Reuters & Bloomberg sunt agregate prin Google News (RSS public, gratuit, legal)
// pentru că ambele și-au închis feed-urile RSS oficiale.
// ============================================================================
// "primary" = Reuters, Bloomberg, Yahoo — cota 70-80% din feed
// "secondary" = restul (CNBC, MarketWatch, FT, Investing) — folosite doar
// pentru a completa cu știri de impact înalt când lipsesc primarele.
type FeedTier = "primary" | "secondary";
const RSS_FEEDS: { source: NewsSource; url: string; tier: FeedTier }[] = [
  // === PRIMARY (target ~75%) ===
  // Reuters via Google News — markets/business/economy
  {
    source: "Reuters",
    url: "https://news.google.com/rss/search?q=site:reuters.com+(markets+OR+stocks+OR+economy+OR+fed+OR+earnings)&hl=en-US&gl=US&ceid=US:en",
    tier: "primary",
  },
  // Bloomberg via Google News
  {
    source: "Bloomberg",
    url: "https://news.google.com/rss/search?q=site:bloomberg.com+(markets+OR+stocks+OR+economy+OR+fed+OR+earnings)&hl=en-US&gl=US&ceid=US:en",
    tier: "primary",
  },
  // Yahoo Finance — feed direct, încă funcțional
  {
    source: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    tier: "primary",
  },
  // Yahoo Finance via Google News (back-up + breadth)
  {
    source: "Yahoo Finance",
    url: "https://news.google.com/rss/search?q=site:finance.yahoo.com+(markets+OR+stocks+OR+earnings)&hl=en-US&gl=US&ceid=US:en",
    tier: "primary",
  },

  // === SECONDARY (umplem doar restul de ~25%, doar high/medium impact) ===
  { source: "CNBC", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html", tier: "secondary" },
  { source: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", tier: "secondary" },
  { source: "Financial Times", url: "https://www.ft.com/markets?format=rss", tier: "secondary" },
];

// % minim pentru sursele primare (Reuters + Bloomberg + Yahoo)
const PRIMARY_QUOTA = 0.75;
const TARGET_TOTAL = 60;

// ============================================================================
// AI helper (opțional — folosit doar dacă LOVABLE_API_KEY e configurat)
// ============================================================================
async function callAI(prompt: string, system: string, jsonSchema?: object) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY not configured");

  const body: Record<string, unknown> = {
    model: AI_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  };

  if (jsonSchema) {
    body.tools = [
      {
        type: "function",
        function: {
          name: "respond",
          description: "Returns the structured answer.",
          parameters: jsonSchema,
        },
      },
    ];
    body.tool_choice = { type: "function", function: { name: "respond" } };
  }

  const r = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`AI gateway ${r.status}: ${txt.slice(0, 200)}`);
  }

  const data = await r.json();
  if (jsonSchema) {
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return args ? JSON.parse(args) : null;
  }
  return data.choices?.[0]?.message?.content ?? "";
}

// ============================================================================
// RSS PARSER — fără dependințe, parsing manual XML
// ============================================================================
interface RawArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: NewsSource;
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m ? decodeEntities(m[1]) : "";
}

function parseRSS(xml: string, source: NewsSource): RawArticle[] {
  const items: RawArticle[] = [];
  // Suport RSS 2.0 (<item>) și Atom (<entry>)
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const entryBlocks = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];

  for (const block of itemBlocks) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "dc:date");
    const description =
      extractTag(block, "description") ||
      extractTag(block, "content:encoded") ||
      extractTag(block, "summary");
    if (title) items.push({ title, link, pubDate, description, source });
  }

  for (const block of entryBlocks) {
    const title = extractTag(block, "title");
    // Atom: <link href="..."/>
    const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["']/i);
    const link = linkMatch ? linkMatch[1] : extractTag(block, "link");
    const pubDate = extractTag(block, "updated") || extractTag(block, "published");
    const description = extractTag(block, "summary") || extractTag(block, "content");
    if (title) items.push({ title, link, pubDate, description, source });
  }

  return items;
}

async function fetchRSSFeed(url: string, source: NewsSource): Promise<RawArticle[]> {
  try {
    const r = await fetch(url, {
      headers: {
        // Multe site-uri blochează user agents de bot
        "User-Agent":
          "Mozilla/5.0 (compatible; CapitalTermBot/1.0; +https://capital-term.app)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      // 8s timeout via signal
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      console.error(`RSS ${source} ${url} -> ${r.status}`);
      return [];
    }
    const xml = await r.text();
    return parseRSS(xml, source);
  } catch (e) {
    console.error(`RSS fetch failed ${source}:`, e instanceof Error ? e.message : e);
    return [];
  }
}

// ============================================================================
// CLASIFICARE EURISTICĂ — fără AI, instant
// Recunoaște teme/impact/sentiment din keywords
// ============================================================================
const THEME_KEYWORDS: Record<ThemeTag, string[]> = {
  actiuni: ["stock", "shares", "equity", "equities", "nasdaq", "s&p", "dow", "ipo", "listing"],
  obligatiuni: ["bond", "yield", "treasury", "treasuries", "credit", "debt", "coupon"],
  indici: ["index", "indices", "s&p 500", "nasdaq", "dow jones", "ftse", "dax", "nikkei"],
  forex: ["dollar", "euro", "yen", "currency", "forex", "fx", "exchange rate", "yuan", "sterling"],
  marfuri: ["oil", "gold", "silver", "copper", "wheat", "gas", "commodit", "brent", "wti", "opec"],
  crypto: ["bitcoin", "btc", "ethereum", "eth", "crypto", "blockchain", "stablecoin", "binance"],
  macro: ["inflation", "gdp", "cpi", "ppi", "unemployment", "jobs", "recession", "growth", "pmi"],
  earnings: ["earnings", "revenue", "profit", "guidance", "quarter", "results", "beats", "misses"],
  "banci-centrale": ["fed", "ecb", "boe", "boj", "powell", "lagarde", "rate", "hike", "cut", "fomc", "interest rate"],
  geopolitica: ["war", "ukraine", "russia", "china", "tariff", "sanction", "iran", "trade war", "election"],
};

const REGION_KEYWORDS: Record<MarketRegion, string[]> = {
  SUA: ["us ", "u.s.", "wall street", "fed", "nasdaq", "dow", "s&p", "biden", "trump", "treasury"],
  Europa: ["europe", "ecb", "euro", "germany", "france", "uk ", "britain", "ftse", "dax"],
  Asia: ["china", "japan", "india", "korea", "asia", "boj", "yen", "yuan", "nikkei", "hang seng"],
  Emergente: ["emerging", "brazil", "mexico", "turkey", "india", "south africa"],
  Global: [],
};

const HIGH_IMPACT_TRIGGERS = [
  "fed", "fomc", "rate hike", "rate cut", "inflation", "cpi",
  "war", "crash", "surge", "plunge", "recession", "default",
  "earnings beat", "earnings miss", "ipo", "merger", "acquisition",
  "sanctions", "tariff",
];

const NEGATIVE_WORDS = ["fall", "drop", "plunge", "crash", "loss", "miss", "weak", "decline", "fear", "concern", "warn", "cut", "recession", "slump"];
const POSITIVE_WORDS = ["rise", "surge", "gain", "jump", "rally", "beat", "strong", "growth", "record", "high", "boost", "upgrade"];

function classifyArticle(raw: RawArticle, idx: number): NewsItem | null {
  const text = `${raw.title} ${raw.description}`.toLowerCase();

  // Filtrăm conținut clar non-financiar
  const financialHit = Object.values(THEME_KEYWORDS).flat().some((k) => text.includes(k));
  if (!financialHit) return null;

  // Themes
  const themes: ThemeTag[] = [];
  for (const [theme, kws] of Object.entries(THEME_KEYWORDS) as [ThemeTag, string[]][]) {
    if (kws.some((k) => text.includes(k))) themes.push(theme);
  }
  if (themes.length === 0) return null;

  // Regions
  const regions: MarketRegion[] = [];
  for (const [region, kws] of Object.entries(REGION_KEYWORDS) as [MarketRegion, string[]][]) {
    if (region === "Global") continue;
    if (kws.some((k) => text.includes(k))) regions.push(region);
  }
  if (regions.length === 0) regions.push("Global");

  // Impact
  let impact: ImpactLevel = "low";
  const highHits = HIGH_IMPACT_TRIGGERS.filter((k) => text.includes(k)).length;
  if (highHits >= 2) impact = "high";
  else if (highHits === 1 || themes.length >= 3) impact = "medium";

  // Sentiment
  const negHits = NEGATIVE_WORDS.filter((w) => text.includes(w)).length;
  const posHits = POSITIVE_WORDS.filter((w) => text.includes(w)).length;
  let sentiment: Sentiment = "mixed";
  if (negHits > posHits + 1) sentiment = "negative";
  else if (posHits > negHits + 1) sentiment = "positive";
  else if (negHits === 0 && posHits === 0) sentiment = "uncertain";

  // Markets
  const markets: string[] = [];
  if (themes.includes("actiuni") || themes.includes("indici")) markets.push("Equities");
  if (themes.includes("obligatiuni")) markets.push("Bonds");
  if (themes.includes("forex")) markets.push("FX");
  if (themes.includes("marfuri")) markets.push("Commodities");
  if (themes.includes("crypto")) markets.push("Crypto");

  // Relevance score: impact + theme breadth + freshness
  const impactScore = impact === "high" ? 80 : impact === "medium" ? 55 : 30;
  const themeBonus = Math.min(themes.length * 4, 15);
  const triggerBonus = Math.min(highHits * 3, 10);
  const relevanceScore = Math.min(100, impactScore + themeBonus + triggerBonus);

  // Published date — fallback la now staggered
  let publishedAt: string;
  try {
    const d = raw.pubDate ? new Date(raw.pubDate) : new Date();
    publishedAt = isNaN(d.getTime())
      ? new Date(Date.now() - idx * 60_000).toISOString()
      : d.toISOString();
  } catch {
    publishedAt = new Date(Date.now() - idx * 60_000).toISOString();
  }

  // Summary: first ~200 chars din description sau title
  const cleanDesc = raw.description.slice(0, 240).trim();
  const summary = cleanDesc.length > 30 ? cleanDesc : raw.title;

  // Stable ID din URL hash
  const id = `${raw.source.toLowerCase().replace(/[^a-z]/g, "")}-${hashString(raw.link || raw.title)}`;

  return {
    id,
    title: raw.title,
    source: raw.source,
    url: raw.link,
    publishedAt,
    summary,
    themes,
    impact,
    sentiment,
    regions,
    markets,
    relevanceScore,
  };
}

function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

// ============================================================================
// MAIN: fetch news from RSS feeds
// ============================================================================
export const fetchLatestNews = createServerFn({ method: "GET" }).handler(async () => {
  // Cache hit
  if (newsCache && Date.now() - newsCache.ts < CACHE_TTL_MS) {
    return { items: newsCache.items, cached: true, source: "cache" as const };
  }

  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map((f) => fetchRSSFeed(f.url, f.source)),
    );

    const allRaw: RawArticle[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") allRaw.push(...r.value);
    }

    // Dedupe by title (case-insensitive)
    const seen = new Set<string>();
    const deduped: RawArticle[] = [];
    for (const a of allRaw) {
      const key = a.title.toLowerCase().slice(0, 80);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(a);
      }
    }

    // Classify + filter only financially-relevant
    const classified = deduped
      .map((a, i) => classifyArticle(a, i))
      .filter((x): x is NewsItem => x !== null);

    if (classified.length >= 5) {
      // Sort by impact + relevance + recency
      classified.sort((a, b) => {
        const w = { high: 3, medium: 2, low: 1 } as const;
        const score = (n: NewsItem) =>
          w[n.impact] * 30 +
          n.relevanceScore -
          (Date.now() - new Date(n.publishedAt).getTime()) / (1000 * 60 * 60);
        return score(b) - score(a);
      });

      // Limităm la primele ~60 ca să nu copleșim UI-ul
      const items = classified.slice(0, 60);
      newsCache = { items, ts: Date.now() };
      return { items, cached: false, source: "live" as const };
    }
  } catch (e) {
    console.error("RSS aggregation failed:", e);
  }

  // Fallback to seed
  newsCache = { items: SEED_NEWS, ts: Date.now() };
  return { items: SEED_NEWS, cached: false, source: "seed" as const };
});

// ============================================================================
// AI ANALYSIS for article detail page
// ============================================================================
const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    summarySimple: {
      type: "string",
      description: "3-4 paragrafe scurte în română simplă, fără jargon. Explică știrea ca pentru un nou investitor.",
    },
    whyItMatters: {
      type: "string",
      description: "1-2 paragrafe: ce s-a schimbat și de ce urmăresc investitorii subiectul.",
    },
    shortTermImpact: {
      type: "string",
      description: "Impact pe termen scurt (zile-săptămâni).",
    },
    mediumTermImpact: {
      type: "string",
      description: "Impact pe termen mediu (1-6 luni).",
    },
    affectedMarkets: {
      type: "string",
      description: "Paragraf clar despre ce piețe sunt afectate concret (acțiuni, obligațiuni, FX, mărfuri, crypto, regiuni, sectoare).",
    },
    watchPoints: {
      type: "array",
      items: { type: "string" },
      description: "3-5 puncte concrete pe care un investitor ar trebui să le urmărească.",
    },
    bottomLine: {
      type: "array",
      items: { type: "string" },
      description: "3-5 bullets foarte scurte — esențialul.",
    },
  },
  required: [
    "summarySimple",
    "whyItMatters",
    "shortTermImpact",
    "mediumTermImpact",
    "affectedMarkets",
    "watchPoints",
    "bottomLine",
  ],
};

const analyzeArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(),
  summary: z.string(),
  themes: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
});

function fallbackAnalysis(data: { title: string; source: string; summary: string }): ArticleAnalysis {
  return {
    summarySimple: `${data.summary}\n\nAceastă știre vine de la ${data.source} și se referă la un eveniment relevant pentru piețele financiare. Pentru o analiză AI detaliată în limba română, conectează Lovable AI Gateway în setări.`,
    whyItMatters: "Subiectul are potențial impact asupra prețurilor activelor și asupra deciziilor investitorilor. Activează AI-ul în setările Lovable Cloud pentru o analiză completă.",
    shortTermImpact: "Reacțiile pe termen scurt vor depinde de cum interpretează piața evenimentul și de poziționarea actuală a investitorilor.",
    mediumTermImpact: "Pe termen mediu, traiectoria depinde de evoluția narrative-ului macro și de deciziile băncilor centrale.",
    affectedMarkets: "Verifică etichetele de teme și piețe din pagina principală pentru contextul exact al acestei știri.",
    watchPoints: [
      "Reacția imediată a indicilor majori",
      "Mișcările pe yield-urile obligațiunilor de stat",
      "Volatilitatea pe FX și mărfuri",
      "Comentariile oficialilor băncilor centrale",
    ],
    bottomLine: [
      `Sursă: ${data.source}`,
      "Eveniment monitorizat de piețe",
      "Activează AI-ul pentru analiză completă în română",
    ],
  };
}

export const analyzeArticle = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => analyzeArticleSchema.parse(data))
  .handler(async ({ data }): Promise<{ analysis: ArticleAnalysis | null; error?: string }> => {
    const cacheKey = data.id;
    const cached = analysisCache.get(cacheKey);
    if (cached) return { analysis: cached };

    if (!process.env.LOVABLE_API_KEY) {
      const fb = fallbackAnalysis(data);
      analysisCache.set(cacheKey, fb);
      return { analysis: fb };
    }

    const sys = `Ești un analist financiar senior care explică știri de piață pentru investitori români. Scrii în limba română, clar, profesionist, fără clickbait, fără pompoși. Folosești paragrafe scurte. Când apar termeni tehnici (yield, basis points, hawkish, dovish, FOMC, EBITDA), îi explici scurt în paranteză. Te concentrezi pe IMPACT REAL asupra piețelor.`;

    const usr = `Analizează această știre și produ o explicație completă pentru un investitor:

TITLU: ${data.title}
SURSĂ: ${data.source}
REZUMAT: ${data.summary}
TEME: ${data.themes?.join(", ") ?? "n/a"}
REGIUNI: ${data.regions?.join(", ") ?? "n/a"}

Generează o analiză completă urmând schema cerută.`;

    try {
      const result = (await callAI(usr, sys, ANALYSIS_SCHEMA)) as ArticleAnalysis | null;
      if (result) {
        analysisCache.set(cacheKey, result);
        return { analysis: result };
      }
      return { analysis: fallbackAnalysis(data) };
    } catch (e) {
      console.error("analyzeArticle", e);
      const msg = e instanceof Error ? e.message : "unknown";
      if (msg.includes("429")) return { analysis: fallbackAnalysis(data), error: "Prea multe cereri AI. Folosim o analiză de bază." };
      if (msg.includes("402")) return { analysis: fallbackAnalysis(data), error: "Credite AI epuizate. Folosim o analiză de bază." };
      return { analysis: fallbackAnalysis(data) };
    }
  });

export const getNewsItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const all = newsCache?.items ?? SEED_NEWS;
    const item = all.find((n) => n.id === data.id);
    if (!item) {
      const seed = SEED_NEWS.find((n) => n.id === data.id);
      return { item: seed ?? null };
    }
    return { item };
  });
