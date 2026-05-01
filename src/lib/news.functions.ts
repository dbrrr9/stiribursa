import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SEED_NEWS } from "./seed-news";
import type {
  ImpactLevel,
  NewsItem,
  NewsSource,
  NewsStatus,
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
// RSS FEEDS — surse permise: Reuters, CNBC, MarketWatch, Yahoo Finance.
// Bloomberg păstrat ca extra premium (high-impact only).
// ============================================================================
type FeedTier = "primary" | "secondary";
const RSS_FEEDS: { source: NewsSource; url: string; tier: FeedTier }[] = [
  // === PRIMARY ===
  // Reuters via Google News (RSS oficial Reuters închis)
  {
    source: "Reuters",
    url: "https://news.google.com/rss/search?q=site:reuters.com+(markets+OR+stocks+OR+economy+OR+fed+OR+earnings)&hl=en-US&gl=US&ceid=US:en",
    tier: "primary",
  },
  // Yahoo Finance — feed direct
  {
    source: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    tier: "primary",
  },
  {
    source: "Yahoo Finance",
    url: "https://news.google.com/rss/search?q=site:finance.yahoo.com+(markets+OR+stocks+OR+earnings)&hl=en-US&gl=US&ceid=US:en",
    tier: "primary",
  },
  // CNBC — markets
  { source: "CNBC", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html", tier: "primary" },
  // MarketWatch — top stories
  { source: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", tier: "primary" },

  // === SECONDARY (Bloomberg — doar high-impact) ===
  {
    source: "Bloomberg",
    url: "https://news.google.com/rss/search?q=site:bloomberg.com+(markets+OR+stocks+OR+economy+OR+fed+OR+earnings)&hl=en-US&gl=US&ceid=US:en",
    tier: "secondary",
  },
];

const TARGET_TOTAL = 50;
// Vârstă maximă acceptată (24h) — feedul e despre "ce se întâmplă acum"
const MAX_AGE_MS = 1000 * 60 * 60 * 24;
// Scor minim de relevanță pentru a apărea în feed
const MIN_RELEVANCE = 50;

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

  const stripSuffix = (t: string) =>
    t.replace(/\s+-\s+(Reuters|Bloomberg|Yahoo!? Finance|CNBC|MarketWatch|Financial Times|FT|Investing\.com)\s*$/i, "").trim();

  for (const block of itemBlocks) {
    let title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "dc:date");
    const description =
      extractTag(block, "description") ||
      extractTag(block, "content:encoded") ||
      extractTag(block, "summary");
    title = stripSuffix(title);
    if (title) items.push({ title, link, pubDate, description, source });
  }

  for (const block of entryBlocks) {
    let title = extractTag(block, "title");
    const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["']/i);
    const link = linkMatch ? linkMatch[1] : extractTag(block, "link");
    const pubDate = extractTag(block, "updated") || extractTag(block, "published");
    const description = extractTag(block, "summary") || extractTag(block, "content");
    title = stripSuffix(title);
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
    const now = Date.now();
    const classified = deduped
      .map((a, i) => classifyArticle(a, i))
      .filter((x): x is NewsItem => x !== null)
      // Vârstă maximă 24h
      .filter((n) => now - new Date(n.publishedAt).getTime() <= MAX_AGE_MS)
      // Doar high/medium impact + scor relevanță decent
      .filter((n) => n.impact !== "low" && n.relevanceScore >= MIN_RELEVANCE)
      // Bloomberg = secondary, doar high impact
      .filter((n) => n.source !== "Bloomberg" || n.impact === "high");

    if (classified.length >= 5) {
      // Sortare DEFAULT: cele mai noi sus
      classified.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );

      const items = classified.slice(0, TARGET_TOTAL);
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

// ============================================================================
// CUSTOM NEWS ANALYSIS — utilizatorul lipește un URL sau text și AI explică
// ============================================================================
const customAnalyzeSchema = z.object({
  input: z.string().min(10).max(8000),
});

export const analyzeCustomNews = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => customAnalyzeSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{
      analysis: ArticleAnalysis | null;
      title: string;
      sourceLabel: string;
      error?: string;
    }> => {
      const raw = data.input.trim();
      const isUrl = /^https?:\/\/\S+$/i.test(raw);

      let title = "Știre furnizată de utilizator";
      let bodyText = raw;
      let sourceLabel = "Sursă utilizator";

      // Dacă e URL, încercăm: 1) fetch direct, 2) fallback prin r.jina.ai (text reader proxy)
      if (isUrl) {
        try {
          const urlObj = new URL(raw);
          sourceLabel = urlObj.hostname.replace(/^www\./, "");
        } catch {
          return {
            analysis: null,
            title,
            sourceLabel,
            error: "URL invalid. Verifică linkul sau lipește textul știrii direct.",
          };
        }

        const tryDirect = async (): Promise<string | null> => {
          try {
            const r = await fetch(raw, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9,ro;q=0.8",
              },
              signal: AbortSignal.timeout(9000),
              redirect: "follow",
            });
            if (!r.ok) return null;
            return await r.text();
          } catch {
            return null;
          }
        };

        const tryReaderProxy = async (): Promise<string | null> => {
          // r.jina.ai întoarce conținutul ca markdown curat — bypass paywall/blocaje user-agent
          try {
            const proxied = `https://r.jina.ai/${raw}`;
            const r = await fetch(proxied, {
              headers: {
                "User-Agent": "Mozilla/5.0 CapitalTerm/1.0",
                Accept: "text/plain, text/markdown, */*",
              },
              signal: AbortSignal.timeout(12000),
            });
            if (!r.ok) return null;
            const md = await r.text();
            return md && md.length > 100 ? md : null;
          } catch {
            return null;
          }
        };

        const html = await tryDirect();
        if (html) {
          const titleMatch =
            html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch) title = decodeEntities(titleMatch[1]).slice(0, 200);

          const descMatch =
            html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
          const desc = descMatch ? decodeEntities(descMatch[1]) : "";

          const paragraphs = (html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) ?? [])
            .map((p) => decodeEntities(p))
            .filter((t) => t.length > 60)
            .slice(0, 12)
            .join("\n\n");

          bodyText = [title, desc, paragraphs].filter(Boolean).join("\n\n").slice(0, 7000);
        }

        // Dacă fetch direct a eșuat sau a întors prea puțin text, încercăm proxy
        if (!html || bodyText.length < 200) {
          const md = await tryReaderProxy();
          if (md) {
            // Primul rând non-gol = titlu probabil
            const lines = md
              .split("\n")
              .map((l) => l.replace(/^#+\s*/, "").trim())
              .filter(Boolean);
            if (lines[0] && lines[0].length > 8 && lines[0].length < 220) {
              title = lines[0];
            }
            bodyText = md.slice(0, 7000);
          } else if (!html) {
            return {
              analysis: null,
              title,
              sourceLabel,
              error:
                "Nu pot accesa URL-ul (probabil are paywall sau blochează scraperele). Lipește direct textul știrii în câmpul de mai sus.",
            };
          }
        }
      } else {
        // E text liber — primul rând devine titlu
        const firstLine = raw.split("\n")[0].trim();
        if (firstLine.length > 8 && firstLine.length < 200) title = firstLine;
      }

      if (!process.env.LOVABLE_API_KEY) {
        return {
          analysis: fallbackAnalysis({ title, source: sourceLabel, summary: bodyText.slice(0, 300) }),
          title,
          sourceLabel,
          error: "AI-ul nu este configurat. Afișăm o analiză de bază.",
        };
      }

      const sys = `Ești un analist financiar senior care explică știri de piață pentru investitori români. Scrii în limba română, clar, profesionist, fără clickbait. Folosești paragrafe scurte. Când apar termeni tehnici (yield, basis points, hawkish, dovish, FOMC, EBITDA), îi explici scurt în paranteză. Te concentrezi pe IMPACT REAL asupra piețelor: acțiuni, obligațiuni, FX, mărfuri, crypto.`;

      const usr = `Analizează următoarea știre furnizată de utilizator și produ o explicație completă pentru un investitor român. Identifică singur tema, regiunea și piețele afectate.

SURSĂ: ${sourceLabel}
TITLU: ${title}

CONȚINUT:
${bodyText}

Generează o analiză completă urmând schema cerută. Dacă textul nu este o știre financiară clară, oferă oricum cel mai bun context posibil despre eventualul impact pe piețe.`;

      try {
        const result = (await callAI(usr, sys, ANALYSIS_SCHEMA)) as ArticleAnalysis | null;
        if (result) {
          return { analysis: result, title, sourceLabel };
        }
        return {
          analysis: fallbackAnalysis({ title, source: sourceLabel, summary: bodyText.slice(0, 300) }),
          title,
          sourceLabel,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "unknown";
        const fb = fallbackAnalysis({ title, source: sourceLabel, summary: bodyText.slice(0, 300) });
        if (msg.includes("429"))
          return { analysis: fb, title, sourceLabel, error: "Prea multe cereri AI. Încearcă din nou în câteva secunde." };
        if (msg.includes("402"))
          return { analysis: fb, title, sourceLabel, error: "Credite AI epuizate. Adaugă credite în Settings → Workspace → Usage." };
        return { analysis: fb, title, sourceLabel, error: "Eroare AI. Afișăm o analiză de bază." };
      }
    },
  );
