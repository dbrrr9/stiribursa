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
const CACHE_TTL_MS = 1000 * 60 * 8; // 8 min — more frequent refreshes
const analysisCache = new Map<string, ArticleAnalysis>();
let dailyBriefCache: { brief: DailyBrief; ts: number } | null = null;

// ============================================================================
// RSS FEEDS — expanded for better geopolitical + market coverage
// ============================================================================
type FeedTier = "primary" | "secondary";
const RSS_FEEDS: { source: NewsSource; url: string; tier: FeedTier }[] = [
  // === REUTERS — broad coverage ===
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+(markets+OR+stocks+OR+economy+OR+fed+OR+earnings)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+(iran+OR+sanctions+OR+war+OR+geopolitics+OR+tariff+OR+trade+war+OR+middle+east)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+(oil+OR+gold+OR+treasury+OR+inflation+OR+recession+OR+china+OR+russia)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+(nuclear+OR+deal+OR+sanctions+OR+drone+OR+attack+OR+military+OR+defense)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+(tech+OR+AI+OR+semiconductor+OR+Intel+OR+AMD+OR+Nvidia+OR+Micron+OR+Apple+OR+Microsoft)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+(OPEC+OR+energy+OR+natural+gas+OR+crude+OR+brent+OR+petroleum)&hl=en-US&gl=US&ceid=US:en", tier: "secondary" },
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+(Trump+OR+Biden+OR+congress+OR+tariff+OR+trade+OR+policy)&hl=en-US&gl=US&ceid=US:en", tier: "secondary" },

  // === BLOOMBERG — broad coverage ===
  { source: "Bloomberg", url: "https://news.google.com/rss/search?q=site:bloomberg.com+(markets+OR+stocks+OR+economy+OR+fed+OR+earnings+OR+oil+OR+gold)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Bloomberg", url: "https://news.google.com/rss/search?q=site:bloomberg.com+(iran+OR+sanctions+OR+war+OR+geopolitics+OR+tariff+OR+trade+OR+defense)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Bloomberg", url: "https://news.google.com/rss/search?q=site:bloomberg.com+(crypto+OR+bitcoin+OR+inflation+OR+recession+OR+china+OR+treasury)&hl=en-US&gl=US&ceid=US:en", tier: "secondary" },
  { source: "Bloomberg", url: "https://news.google.com/rss/search?q=site:bloomberg.com+(tech+OR+semiconductor+OR+Intel+OR+AMD+OR+Nvidia+OR+Micron+OR+AI+OR+Apple)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Bloomberg", url: "https://news.google.com/rss/search?q=site:bloomberg.com+(OPEC+OR+energy+OR+oil+OR+gold+OR+commodities+OR+copper+OR+silver)&hl=en-US&gl=US&ceid=US:en", tier: "secondary" },
  { source: "Bloomberg", url: "https://news.google.com/rss/search?q=site:bloomberg.com+(Trump+OR+Biden+OR+election+OR+congress+OR+policy+OR+regulation)&hl=en-US&gl=US&ceid=US:en", tier: "secondary" },

  // === Yahoo Finance ===
  { source: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex", tier: "primary" },
  { source: "Yahoo Finance", url: "https://news.google.com/rss/search?q=site:finance.yahoo.com+(markets+OR+stocks+OR+earnings+OR+economy)&hl=en-US&gl=US&ceid=US:en", tier: "primary" },
  { source: "Yahoo Finance", url: "https://news.google.com/rss/search?q=site:finance.yahoo.com+(oil+OR+gold+OR+tech+OR+Iran+OR+war+OR+tariff)&hl=en-US&gl=US&ceid=US:en", tier: "secondary" },

  // === CNBC ===
  { source: "CNBC", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html", tier: "primary" },
  { source: "CNBC", url: "https://www.cnbc.com/id/10001147/device/rss/rss.html", tier: "primary" },
  { source: "CNBC", url: "https://www.cnbc.com/id/19854910/device/rss/rss.html", tier: "secondary" }, // Technology
  { source: "CNBC", url: "https://www.cnbc.com/id/20910258/device/rss/rss.html", tier: "secondary" }, // Energy
  { source: "CNBC", url: "https://news.google.com/rss/search?q=site:cnbc.com+(Iran+OR+oil+OR+war+OR+tariff+OR+semiconductor)&hl=en-US&gl=US&ceid=US:en", tier: "secondary" },

  // === MarketWatch ===
  { source: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", tier: "primary" },
  { source: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_marketpulse", tier: "secondary" },
  { source: "MarketWatch", url: "https://news.google.com/rss/search?q=site:marketwatch.com+(markets+OR+stocks+OR+oil+OR+gold+OR+tech+OR+fed)&hl=en-US&gl=US&ceid=US:en", tier: "secondary" },
];

const TARGET_TOTAL = 120;
const MAX_AGE_MS = 1000 * 60 * 60 * 48; // 48h
const MIN_RELEVANCE = 35;

// ============================================================================
// AI helper
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
// RSS PARSER
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

/** Strip residual HTML attributes like href="...", class="...", style="...", and bare URLs in text */
function cleanText(s: string): string {
  return s
    // Remove href="...", src="...", class="..." etc
    .replace(/(href|src|class|style|id|rel|target|data-\w+)\s*=\s*["'][^"']*["']/gi, "")
    // Remove leftover angle-bracket fragments like <a ... > without closing
    .replace(/<\/?[a-z][a-z0-9]*[^>]*>/gi, " ")
    // Remove bare URLs that look like artifacts (not standalone links)
    .replace(/https?:\/\/[^\s"')]+/g, "")
    // Clean up punctuation artifacts
    .replace(/\(\s*\)/g, "")
    .replace(/\[\s*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m ? decodeEntities(m[1]) : "";
}

function parseRSS(xml: string, source: NewsSource): RawArticle[] {
  const items: RawArticle[] = [];
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
        "User-Agent":
          "Mozilla/5.0 (compatible; MarketScopeBot/2.0; +https://marketscope.app)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(10000),
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
// CLASSIFICATION — expanded keywords for geopolitics
// ============================================================================
const THEME_KEYWORDS: Record<ThemeTag, string[]> = {
  actiuni: ["stock", "shares", "equity", "equities", "nasdaq", "s&p", "dow", "ipo", "listing", "rally", "selloff", "sell-off",
    "intel", "amd", "nvidia", "micron", "apple", "microsoft", "google", "amazon", "meta", "tesla", "tsmc", "qualcomm",
    "broadcom", "semiconductor", "chip", "ai stock"],
  obligatiuni: ["bond", "yield", "treasury", "treasuries", "credit", "debt", "coupon", "spread"],
  indici: ["index", "indices", "s&p 500", "nasdaq", "dow jones", "ftse", "dax", "nikkei", "hang seng", "stoxx", "russell"],
  forex: ["dollar", "euro", "yen", "currency", "forex", "fx", "exchange rate", "yuan", "sterling", "usd", "eur", "dxy"],
  marfuri: ["oil", "gold", "silver", "copper", "wheat", "gas", "commodit", "brent", "wti", "opec", "natural gas", "lng", "uranium", "platinum", "palladium", "lithium"],
  crypto: ["bitcoin", "btc", "ethereum", "eth", "crypto", "blockchain", "stablecoin", "binance", "coinbase", "defi", "solana", "xrp"],
  macro: ["inflation", "gdp", "cpi", "ppi", "unemployment", "jobs", "recession", "growth", "pmi", "consumer", "retail sales", "housing", "nonfarm", "jobless claims"],
  earnings: ["earnings", "revenue", "profit", "guidance", "quarter", "results", "beats", "misses", "forecast", "outlook", "eps", "ebitda"],
  "banci-centrale": ["fed", "ecb", "boe", "boj", "powell", "lagarde", "rate", "hike", "cut", "fomc", "interest rate", "monetary policy", "tightening", "easing", "hawkish", "dovish"],
  geopolitica: [
    "war", "ukraine", "russia", "china", "tariff", "sanction", "iran", "trade war", "election",
    "nuclear", "missile", "drone", "attack", "military", "defense", "conflict", "tension",
    "middle east", "israel", "hamas", "hezbollah", "gaza", "red sea", "houthi",
    "nato", "pentagon", "troops", "ceasefire", "negotiation", "diplomacy",
    "trump", "biden", "xi jinping", "putin", "khamenei", "netanyahu",
    "strait of hormuz", "persian gulf", "south china sea", "taiwan",
    "coup", "regime", "embargo", "blockade", "proxy war",
    "iran nuclear", "iran deal", "iaea", "enrichment", "centrifuge",
    "us iran", "iran sanctions", "iran oil", "tehran", "washington",
    "strike", "retaliation", "escalation", "de-escalation",
  ],
};

const REGION_KEYWORDS: Record<MarketRegion, string[]> = {
  SUA: ["us ", "u.s.", "wall street", "fed", "nasdaq", "dow", "s&p", "biden", "trump", "treasury", "pentagon", "white house", "congress", "american"],
  Europa: ["europe", "ecb", "euro", "germany", "france", "uk ", "britain", "ftse", "dax", "nato", "eu "],
  Asia: ["china", "japan", "india", "korea", "asia", "boj", "yen", "yuan", "nikkei", "hang seng", "taiwan", "xi jinping"],
  Emergente: ["emerging", "brazil", "mexico", "turkey", "india", "south africa", "iran", "saudi", "opec"],
  Global: [],
};

const HIGH_IMPACT_TRIGGERS = [
  "fed", "fomc", "rate hike", "rate cut", "inflation", "cpi",
  "war", "crash", "surge", "plunge", "recession", "default",
  "earnings beat", "earnings miss", "ipo", "merger", "acquisition",
  "sanctions", "tariff", "iran", "nuclear", "missile", "attack",
  "ceasefire", "invasion", "embargo", "blockade",
  "breaking", "just in", "alert", "urgent",
  "oil spike", "gold surge", "dollar plunge",
  "trump", "biden", "powell",
];

const NEGATIVE_WORDS = ["fall", "drop", "plunge", "crash", "loss", "miss", "weak", "decline", "fear", "concern", "warn", "cut", "recession", "slump", "threat", "escalat", "strike", "bomb", "kill", "casualties", "collapse"];
const POSITIVE_WORDS = ["rise", "surge", "gain", "jump", "rally", "beat", "strong", "growth", "record", "high", "boost", "upgrade", "ceasefire", "peace", "deal", "agree", "recover"];

function classifyArticle(raw: RawArticle, idx: number): NewsItem | null {
  const text = `${raw.title} ${raw.description}`.toLowerCase();

  // Check for financial or geopolitical relevance
  const financialHit = Object.values(THEME_KEYWORDS).flat().some((k) => text.includes(k));
  if (!financialHit) return null;

  // Themes
  const themes: ThemeTag[] = [];
  for (const [theme, kws] of Object.entries(THEME_KEYWORDS) as [ThemeTag, string[]][]) {
    if (kws.some((k) => text.includes(k))) themes.push(theme);
  }
  if (themes.length === 0) return null;

  // Geopolitical news with market implications should always get a market theme too
  if (themes.includes("geopolitica") && !themes.some(t => ["actiuni", "marfuri", "forex", "obligatiuni", "indici"].includes(t))) {
    // Auto-add marfuri for Middle East/oil-related geopolitics
    if (["iran", "saudi", "opec", "oil", "hormuz", "gulf", "middle east"].some(k => text.includes(k))) {
      themes.push("marfuri");
    }
    // Military conflicts affect equities
    if (["war", "attack", "missile", "invasion", "bomb"].some(k => text.includes(k))) {
      themes.push("actiuni");
    }
  }

  // Regions
  const regions: MarketRegion[] = [];
  for (const [region, kws] of Object.entries(REGION_KEYWORDS) as [MarketRegion, string[]][]) {
    if (region === "Global") continue;
    if (kws.some((k) => text.includes(k))) regions.push(region);
  }
  if (regions.length === 0) regions.push("Global");

  // Impact — boosted for geopolitics
  let impact: ImpactLevel = "low";
  const highHits = HIGH_IMPACT_TRIGGERS.filter((k) => text.includes(k)).length;
  const isGeopolitical = themes.includes("geopolitica");
  
  if (highHits >= 2 || (isGeopolitical && highHits >= 1)) impact = "high";
  else if (highHits === 1 || themes.length >= 3 || isGeopolitical) impact = "medium";

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
  if (markets.length === 0 && isGeopolitical) markets.push("Macro");

  // Status
  const ageMs = Date.now() - new Date(raw.pubDate || Date.now()).getTime();
  let status: NewsStatus = "confirmed";
  if (ageMs < 1000 * 60 * 30 && impact === "high") status = "breaking";
  else if (ageMs < 1000 * 60 * 120 && impact !== "low") status = "developing";

  // Relevance score — boosted for geopolitical + multi-theme
  const impactScore = impact === "high" ? 80 : impact === "medium" ? 55 : 30;
  const themeBonus = Math.min(themes.length * 5, 20);
  const triggerBonus = Math.min(highHits * 4, 15);
  const geoBonus = isGeopolitical ? 10 : 0;
  const sourceBonus = (raw.source === "Reuters" || raw.source === "Bloomberg") ? 5 : 0;
  const relevanceScore = Math.min(100, impactScore + themeBonus + triggerBonus + geoBonus + sourceBonus);

  // Published date
  let publishedAt: string;
  try {
    const d = raw.pubDate ? new Date(raw.pubDate) : new Date();
    publishedAt = isNaN(d.getTime())
      ? new Date(Date.now() - idx * 60_000).toISOString()
      : d.toISOString();
  } catch {
    publishedAt = new Date(Date.now() - idx * 60_000).toISOString();
  }

    const cleanDesc = cleanText(raw.description.slice(0, 400)).slice(0, 280).trim();
    const summary = cleanDesc.length > 30 ? cleanDesc : cleanText(raw.title);

  const id = `${raw.source.toLowerCase().replace(/[^a-z]/g, "")}-${hashString(raw.link || raw.title)}`;

  return {
    id,
    title: cleanText(raw.title),
    source: raw.source,
    url: raw.link,
    publishedAt,
    summary,
    themes,
    impact,
    sentiment,
    status,
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

    // Dedupe by title similarity
    const seen = new Set<string>();
    const deduped: RawArticle[] = [];
    for (const a of allRaw) {
      const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(a);
      }
    }

    const now = Date.now();
    const classified = deduped
      .map((a, i) => classifyArticle(a, i))
      .filter((x): x is NewsItem => x !== null)
      .filter((n) => now - new Date(n.publishedAt).getTime() <= MAX_AGE_MS)
      .filter((n) => n.relevanceScore >= MIN_RELEVANCE);

    if (classified.length >= 5) {
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
    summarySimple: `${data.summary}\n\nAceastă știre vine de la ${data.source} și se referă la un eveniment relevant pentru piețele financiare.`,
    whyItMatters: "Subiectul are potențial impact asupra prețurilor activelor și asupra deciziilor investitorilor.",
    shortTermImpact: "Reacțiile pe termen scurt vor depinde de cum interpretează piața evenimentul.",
    mediumTermImpact: "Pe termen mediu, traiectoria depinde de evoluția narrative-ului macro și de deciziile băncilor centrale.",
    affectedMarkets: "Verifică etichetele de teme și piețe din pagina principală pentru contextul exact.",
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
      if (msg.includes("429")) return { analysis: fallbackAnalysis(data), error: "Prea multe cereri AI." };
      if (msg.includes("402")) return { analysis: fallbackAnalysis(data), error: "Credite AI epuizate." };
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
// CUSTOM NEWS ANALYSIS
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

      if (isUrl) {
        try {
          const urlObj = new URL(raw);
          sourceLabel = urlObj.hostname.replace(/^www\./, "");
        } catch {
          return { analysis: null, title, sourceLabel, error: "URL invalid." };
        }

        const tryDirect = async (): Promise<string | null> => {
          try {
            const r = await fetch(raw, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Accept: "text/html,application/xhtml+xml,*/*",
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
          try {
            const proxied = `https://r.jina.ai/${raw}`;
            const r = await fetch(proxied, {
              headers: { "User-Agent": "Mozilla/5.0 MarketScope/2.0", Accept: "text/plain, */*" },
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

        if (!html || bodyText.length < 200) {
          const md = await tryReaderProxy();
          if (md) {
            const lines = md.split("\n").map((l) => l.replace(/^#+\s*/, "").trim()).filter(Boolean);
            if (lines[0] && lines[0].length > 8 && lines[0].length < 220) title = lines[0];
            bodyText = md.slice(0, 7000);
          } else if (!html) {
            return { analysis: null, title, sourceLabel, error: "Nu pot accesa URL-ul. Lipește direct textul știrii." };
          }
        }
      } else {
        const firstLine = raw.split("\n")[0].trim();
        if (firstLine.length > 8 && firstLine.length < 200) title = firstLine;
      }

      if (!process.env.LOVABLE_API_KEY) {
        return {
          analysis: fallbackAnalysis({ title, source: sourceLabel, summary: bodyText.slice(0, 300) }),
          title, sourceLabel, error: "AI-ul nu este configurat.",
        };
      }

      const sys = `Ești un analist financiar senior care explică știri de piață pentru investitori români. Scrii în limba română, clar, profesionist.`;
      const usr = `Analizează următoarea știre:\n\nSURSĂ: ${sourceLabel}\nTITLU: ${title}\n\nCONȚINUT:\n${bodyText}\n\nGenerează o analiză completă urmând schema cerută.`;

      try {
        const result = (await callAI(usr, sys, ANALYSIS_SCHEMA)) as ArticleAnalysis | null;
        if (result) return { analysis: result, title, sourceLabel };
        return { analysis: fallbackAnalysis({ title, source: sourceLabel, summary: bodyText.slice(0, 300) }), title, sourceLabel };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "unknown";
        const fb = fallbackAnalysis({ title, source: sourceLabel, summary: bodyText.slice(0, 300) });
        if (msg.includes("429")) return { analysis: fb, title, sourceLabel, error: "Prea multe cereri AI." };
        if (msg.includes("402")) return { analysis: fb, title, sourceLabel, error: "Credite AI epuizate." };
        return { analysis: fb, title, sourceLabel, error: "Eroare AI." };
      }
    },
  );

// ============================================================================
// PHASE 3: Daily Brief
// ============================================================================
export interface DailyBrief {
  date: string;
  marketOverview: string;
  topThemes: { theme: string; summary: string; sentiment: Sentiment }[];
  keyEvents: { time: string; event: string; impact: ImpactLevel }[];
  sectorPerformance: { sector: string; direction: "up" | "down" | "flat"; detail: string }[];
  commodities: { name: string; direction: "up" | "down" | "flat"; detail: string }[];
  techHighlights: { company: string; detail: string; sentiment: Sentiment }[];
  geopoliticalUpdate: string;
  outlook: string;
  generatedAt: string;
}

const DAILY_BRIEF_SCHEMA = {
  type: "object",
  properties: {
    marketOverview: { type: "string", description: "3-4 paragrafe cu un rezumat detaliat al piețelor azi, în română. Include mișcări concrete ale S&P 500, Nasdaq, Dow Jones, FTSE, DAX cu procente." },
    topThemes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          theme: { type: "string" },
          summary: { type: "string", description: "Rezumat detaliat cu date concrete — prețuri, procente, comparații." },
          sentiment: { type: "string", enum: ["positive", "negative", "mixed", "uncertain"] },
        },
        required: ["theme", "summary", "sentiment"],
      },
      description: "5-7 teme dominante ale zilei cu rezumat detaliat.",
    },
    sectorPerformance: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sector: { type: "string", description: "ex: Tehnologie, Energie, Financiar, Healthcare, Industrial" },
          direction: { type: "string", enum: ["up", "down", "flat"] },
          detail: { type: "string", description: "1-2 propoziții cu companii specifice, procente, cauze." },
        },
        required: ["sector", "direction", "detail"],
      },
      description: "Performanța pe 5-8 sectoare principale.",
    },
    commodities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "ex: Petrol Brent, Petrol WTI, Aur, Argint, Cupru, Gaz Natural" },
          direction: { type: "string", enum: ["up", "down", "flat"] },
          detail: { type: "string", description: "Preț curent estimat, variație %, ce a influențat mișcarea." },
        },
        required: ["name", "direction", "detail"],
      },
      description: "Mărfuri principale (4-6 intrări).",
    },
    techHighlights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string", description: "ex: Intel, AMD, Nvidia, Micron, Apple, Microsoft, Tesla, TSMC" },
          detail: { type: "string", description: "Ce s-a întâmplat, mișcare de preț, context." },
          sentiment: { type: "string", enum: ["positive", "negative", "mixed", "uncertain"] },
        },
        required: ["company", "detail", "sentiment"],
      },
      description: "4-8 companii tech/semiconductor relevante.",
    },
    geopoliticalUpdate: { type: "string", description: "2-3 paragrafe detaliate: Iran/SUA, Orientul Mijlociu, Ucraina/Rusia, tensiuni China/Taiwan. Impact pe piețe, petrol, dolar." },
    keyEvents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          time: { type: "string", description: "Ora sau perioadă (ex: '14:30 ET', 'dimineață')" },
          event: { type: "string" },
          impact: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["time", "event", "impact"],
      },
      description: "5-10 evenimente cheie de urmărit.",
    },
    outlook: { type: "string", description: "2-3 paragrafe — perspectivă pe termen scurt cu scenarii concrete." },
  },
  required: ["marketOverview", "topThemes", "sectorPerformance", "commodities", "techHighlights", "geopoliticalUpdate", "keyEvents", "outlook"],
};

export const getDailyBrief = createServerFn({ method: "GET" }).handler(async (): Promise<{ brief: DailyBrief | null; error?: string }> => {
  // Cache 2h
  if (dailyBriefCache && Date.now() - dailyBriefCache.ts < 1000 * 60 * 120) {
    return { brief: dailyBriefCache.brief };
  }

  // Need current news for context
  const newsData = newsCache?.items ?? SEED_NEWS;
  const topNews = newsData.slice(0, 20);

  if (!process.env.LOVABLE_API_KEY) {
    const fallback: DailyBrief = {
      date: new Date().toISOString().split("T")[0],
      marketOverview: "Briefing-ul zilnic necesită AI activat. Verifică setările Lovable Cloud.",
      topThemes: topNews.slice(0, 3).map(n => ({
        theme: n.themes[0] ?? "general",
        summary: n.title,
        sentiment: n.sentiment,
      })),
      keyEvents: [],
      outlook: "Activează AI pentru un rezumat complet al piețelor.",
      generatedAt: new Date().toISOString(),
    };
    return { brief: fallback };
  }

  const newsSummary = topNews.map((n, i) =>
    `${i + 1}. [${n.source}] ${n.title} — Impact: ${n.impact}, Sentiment: ${n.sentiment}, Teme: ${n.themes.join(", ")}`
  ).join("\n");

  const sys = `Ești un analist financiar senior care scrie briefing-uri zilnice de piață în limba română. Scrii clar, profesionist, condensat. Focus pe ce contează pentru un investitor activ.`;
  const usr = `Pe baza acestor știri recente, generează un briefing zilnic complet:\n\n${newsSummary}\n\nData: ${new Date().toLocaleDateString("ro-RO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

  try {
    const result = await callAI(usr, sys, DAILY_BRIEF_SCHEMA);
    if (result) {
      const brief: DailyBrief = {
        date: new Date().toISOString().split("T")[0],
        ...result,
        generatedAt: new Date().toISOString(),
      };
      dailyBriefCache = { brief, ts: Date.now() };
      return { brief };
    }
    return { brief: null, error: "Nu s-a putut genera briefing-ul." };
  } catch (e) {
    console.error("getDailyBrief", e);
    return { brief: null, error: "Eroare la generarea briefing-ului zilnic." };
  }
});

// ============================================================================
// PHASE 3: Catalyst Calendar
// ============================================================================
export interface CatalystEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  impact: ImpactLevel;
  category: "earnings" | "economic" | "central-bank" | "geopolitical" | "ipo" | "other";
  regions: MarketRegion[];
  affectedMarkets: string[];
}

const CATALYST_SCHEMA = {
  type: "object",
  properties: {
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string", description: "YYYY-MM-DD" },
          time: { type: "string", description: "HH:MM ET sau 'TBD'" },
          title: { type: "string" },
          description: { type: "string", description: "1-2 propoziții despre ce înseamnă evenimentul." },
          impact: { type: "string", enum: ["high", "medium", "low"] },
          category: { type: "string", enum: ["earnings", "economic", "central-bank", "geopolitical", "ipo", "other"] },
          regions: { type: "array", items: { type: "string" } },
          affectedMarkets: { type: "array", items: { type: "string" } },
        },
        required: ["date", "title", "description", "impact", "category", "regions", "affectedMarkets"],
      },
    },
  },
  required: ["events"],
};

let catalystCache: { events: CatalystEvent[]; ts: number } | null = null;

export const getCatalystCalendar = createServerFn({ method: "GET" }).handler(async (): Promise<{ events: CatalystEvent[]; error?: string }> => {
  if (catalystCache && Date.now() - catalystCache.ts < 1000 * 60 * 60 * 4) {
    return { events: catalystCache.events };
  }

  if (!process.env.LOVABLE_API_KEY) {
    return { events: getStaticCatalysts(), error: undefined };
  }

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const sys = `Ești un analist financiar care cunoaște calendarul economic și de earnings. Generează evenimente reale programate.`;
  const usr = `Generează un calendar de catalizatori de piață pentru perioada ${today.toISOString().split("T")[0]} — ${nextWeek.toISOString().split("T")[0]}. Include: earnings majore (big tech, bănci), date economice (CPI, PPI, NFP, GDP, PMI, FOMC), evenimente geopolitice programate, IPO-uri. Doar evenimente reale și plauzibile. Descrierile în română.`;

  try {
    const result = await callAI(usr, sys, CATALYST_SCHEMA);
    if (result?.events) {
      const events: CatalystEvent[] = result.events.map((e: CatalystEvent, i: number) => ({
        ...e,
        id: `cat-${hashString(e.title)}-${i}`,
      }));
      catalystCache = { events, ts: Date.now() };
      return { events };
    }
    return { events: getStaticCatalysts() };
  } catch (e) {
    console.error("getCatalystCalendar", e);
    return { events: getStaticCatalysts(), error: "Eroare la generarea calendarului." };
  }
});

function getStaticCatalysts(): CatalystEvent[] {
  const today = new Date();
  const fmt = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().split("T")[0];
  return [
    { id: "cat-1", date: fmt(1), time: "14:30 ET", title: "CPI SUA (lunar)", description: "Indicele prețurilor de consum — indicator cheie pentru deciziile Fed.", impact: "high", category: "economic", regions: ["SUA"], affectedMarkets: ["Bonds", "Equities", "FX"] },
    { id: "cat-2", date: fmt(2), time: "16:00 ET", title: "Decizia FOMC", description: "Reuniunea Fed cu potențial impact asupra ratelor dobânzii.", impact: "high", category: "central-bank", regions: ["SUA", "Global"], affectedMarkets: ["Bonds", "Equities", "FX", "Commodities"] },
    { id: "cat-3", date: fmt(3), title: "Earnings: Apple, Microsoft", description: "Raportări trimestriale de la cele mai mari companii tech.", impact: "high", category: "earnings", regions: ["SUA"], affectedMarkets: ["Equities"] },
    { id: "cat-4", date: fmt(4), time: "10:00 ET", title: "PMI Manufacturier Europa", description: "Indicator de activitate economică zona euro.", impact: "medium", category: "economic", regions: ["Europa"], affectedMarkets: ["Equities", "FX"] },
    { id: "cat-5", date: fmt(5), time: "08:30 ET", title: "Jobless Claims SUA", description: "Cereri săptămânale de șomaj — puls pe piața muncii.", impact: "medium", category: "economic", regions: ["SUA"], affectedMarkets: ["Equities", "Bonds"] },
  ];
}

// ============================================================================
// PHASE 3: Advanced Scoring — get score breakdown for an article
// ============================================================================
export const getAdvancedScore = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{
    scores: {
      relevance: number;
      urgency: number;
      marketImpact: number;
      confidence: number;
      overall: number;
    } | null;
  }> => {
    const all = newsCache?.items ?? SEED_NEWS;
    const item = all.find((n) => n.id === data.id);
    if (!item) return { scores: null };

    // Heuristic scoring
    const impW = item.impact === "high" ? 90 : item.impact === "medium" ? 60 : 30;
    const ageMs = Date.now() - new Date(item.publishedAt).getTime();
    const urgency = Math.max(10, 100 - Math.floor(ageMs / (1000 * 60 * 60) * 8));
    const marketImpact = Math.min(100, item.themes.length * 15 + item.markets.length * 10 + (item.regions.length > 1 ? 15 : 0));
    const confidence = item.status === "confirmed" ? 85 : item.status === "developing" ? 65 : 50;
    const overall = Math.round(impW * 0.3 + urgency * 0.2 + marketImpact * 0.25 + confidence * 0.25);

    return {
      scores: {
        relevance: item.relevanceScore,
        urgency: Math.min(100, urgency),
        marketImpact: Math.min(100, marketImpact),
        confidence,
        overall: Math.min(100, overall),
      },
    };
  });
