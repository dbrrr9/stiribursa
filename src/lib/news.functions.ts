import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();
// Auth middleware removed from AI functions — client can't pass auth headers via server fn calls
import { SEED_NEWS } from "./seed-news";
import { supabaseAdmin } from "../integrations/supabase/client.server";
import type {
  ImpactLevel,
  NewsItem,
  NewsSource,
  NewsStatus,
  Sentiment,
  ThemeTag,
  MarketRegion,
  ArticleAnalysis,
  DailyBrief,
} from "./news-types";

import OpenAI from "openai";

const AI_MODEL = "gpt-4o-mini";

// In-memory cache (per worker instance)
let newsCache: { items: NewsItem[]; ts: number } | null = null;
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 min — frequent refreshes for fresher news
const analysisCache = new Map<string, ArticleAnalysis>();
let dailyBriefCache: { brief: DailyBrief; ts: number } | null = null;

// ============================================================================
// SSRF PROTECTION — block private/internal IPs
// ============================================================================
const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^169\.254\.\d+\.\d+$/,       // AWS metadata
  /^0\.0\.0\.0$/,
  /^\[::1?\]$/,                  // IPv6 loopback
  /^metadata\.google\.internal$/i,
  /^metadata\.internal$/i,
];

function isUrlSafe(urlStr: string): { safe: boolean; error?: string } {
  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return { safe: false, error: "URL invalid." };
  }
  if (parsed.protocol !== "https:") {
    return { safe: false, error: "Doar URL-uri HTTPS sunt permise." };
  }
  const hostname = parsed.hostname;
  if (BLOCKED_HOSTNAME_PATTERNS.some((p) => p.test(hostname))) {
    return { safe: false, error: "Acest hostname nu este permis." };
  }
  // Block raw IPs (except public-looking ones might still be private, but we blocked ranges above)
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return { safe: false, error: "URL-urile cu IP direct nu sunt permise." };
  }
  return { safe: true };
}

// ============================================================================
// RATE LIMITER & LOCKS — in-memory, for AI functions
// ============================================================================
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

// Prevent memory leak by periodically cleaning up old keys
if (typeof setInterval !== "undefined") {
  setInterval(() => rateLimitMap.clear(), 60_000 * 60);
}

function checkRateLimit(key: string, limit = 10): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= limit) {
    rateLimitMap.set(key, recent);
    return false;
  }
  recent.push(now);
  rateLimitMap.set(key, recent);
  return true;
}

let isGeneratingBrief = false;
let isGeneratingCalendar = false;
const aiLocks = new Set<string>();


// ============================================================================
// RSS FEEDS — stable direct feeds first; Google News only as fallback
// ============================================================================
type FeedTier = "primary" | "secondary" | "fallback";
type FeedConfig = { source: NewsSource; url: string; tier: FeedTier; sourceOverride?: NewsSource };

const RSS_FEEDS: FeedConfig[] = [
  // Bloomberg direct feeds are fast and consistently fresh.
  { source: "Bloomberg", url: "https://feeds.bloomberg.com/markets/news.rss", tier: "primary" },
  { source: "Bloomberg", url: "https://feeds.bloomberg.com/economics/news.rss", tier: "primary" },
  { source: "Bloomberg", url: "https://feeds.bloomberg.com/technology/news.rss", tier: "primary" },
  { source: "Bloomberg", url: "https://feeds.bloomberg.com/politics/news.rss", tier: "secondary" },

  // Investing.com carries very fresh market wires, including Reuters-authored stories.
  { source: "Investing.com", sourceOverride: "Reuters", url: "https://www.investing.com/rss/news_25.rss", tier: "primary" }, // stock market / Reuters wires
  { source: "Investing.com", sourceOverride: "Reuters", url: "https://www.investing.com/rss/news_14.rss", tier: "primary" }, // economy
  { source: "Investing.com", sourceOverride: "Reuters", url: "https://www.investing.com/rss/news_11.rss", tier: "secondary" }, // commodities
  { source: "Investing.com", sourceOverride: "Reuters", url: "https://www.investing.com/rss/news_1.rss", tier: "secondary" }, // FX

  // Direct publisher feeds.
  { source: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex", tier: "primary" },
  { source: "CNBC", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html", tier: "primary" },
  { source: "CNBC", url: "https://www.cnbc.com/id/10001147/device/rss/rss.html", tier: "primary" },
  { source: "CNBC", url: "https://www.cnbc.com/id/19854910/device/rss/rss.html", tier: "secondary" },
  { source: "CNBC", url: "https://www.cnbc.com/id/20910258/device/rss/rss.html", tier: "secondary" },
  { source: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", tier: "primary" },
  { source: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_marketpulse", tier: "secondary" },

  // Google News search sometimes returns 503/timeouts; keep it as low-priority fallback only.
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+markets+stocks+economy+fed+earnings+when:1d&hl=en-US&gl=US&ceid=US:en", tier: "fallback" },
  { source: "Reuters", url: "https://news.google.com/rss/search?q=site:reuters.com+oil+gold+treasury+inflation+geopolitics+when:1d&hl=en-US&gl=US&ceid=US:en", tier: "fallback" },
  { source: "Bloomberg", url: "https://news.google.com/rss/search?q=site:bloomberg.com+markets+stocks+economy+fed+earnings+when:1d&hl=en-US&gl=US&ceid=US:en", tier: "fallback" },
];

const TARGET_TOTAL = 60; // keep the feed curated, not spammy
const MAX_AGE_MS = 1000 * 60 * 60 * 24; // 24h — never show stale live articles
const IDEAL_FRESH_AGE_MS = 1000 * 60 * 60 * 12; // strongest ranking boost for recent news
const MIN_RELEVANCE = 45; // raised — only relevant news passes
// Yahoo Finance carries a lot of low-signal/clickbait content, so it needs a higher bar
const SOURCE_MIN_RELEVANCE: Partial<Record<NewsSource, number>> = {
  "Yahoo Finance": 62,
};
const MIN_LIVE_ITEMS_BEFORE_SEED = 6;
const NEWS_FETCH_CONCURRENCY = 6;
const EMPTY_RETRY_DELAY_MS = 1000 * 45;


// ============================================================================
// AI helper
// ============================================================================
async function callAI(prompt: string, system: string, jsonSchema?: object) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");

  const openai = new OpenAI({ apiKey: key });

  const messages: any[] = [
    { role: "system", content: system },
    { role: "user", content: prompt }
  ];

  if (jsonSchema) {
    messages[0].content += "\n\nCRITICAL: You MUST reply with ONLY a valid JSON object. Ensure you follow this exact JSON schema:\n" + JSON.stringify(jsonSchema);
  }

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      max_tokens: 10000,
      response_format: jsonSchema ? { type: "json_object" } : undefined,
    });

    const content = response.choices[0].message.content;
    if (jsonSchema) {
      return content ? JSON.parse(content) : null;
    }
    return content ?? "";
  } catch (e: any) {
    throw new Error(`OpenAI API error: ${e.message}`);
  }
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

function parsePublishedTime(value?: string | null): number | null {
  if (!value) return null;
  const normalized = value.trim().replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/, "$1T$2Z");
  const t = new Date(normalized).getTime();
  if (Number.isNaN(t) || t < 946684800000) return null;
  return t;
}

async function mapConcurrent<T, R>(items: T[], limit: number, mapper: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
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

function parseRSS(xml: string, source: NewsSource, sourceOverride?: NewsSource): RawArticle[] {
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
    const author = extractTag(block, "author") || extractTag(block, "dc:creator");
    const effectiveSource = sourceOverride && author.toLowerCase().includes(sourceOverride.toLowerCase()) ? sourceOverride : source;
    title = stripSuffix(title);
    if (title) items.push({ title, link, pubDate, description, source: effectiveSource });
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

async function fetchRSSFeed(feed: FeedConfig): Promise<RawArticle[]> {
  try {
    const r = await fetch(feed.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MarketScopeBot/2.0; +https://marketscope.app)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(feed.tier === "fallback" ? 3000 : 4000),
    });
    if (!r.ok) {
      console.error(`RSS ${feed.source} ${feed.url} -> ${r.status}`);
      return [];
    }
    const xml = await r.text();
    return parseRSS(xml, feed.source, feed.sourceOverride);
  } catch (e) {
    console.error(`RSS fetch failed ${feed.source}:`, e instanceof Error ? e.message : e);
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

// ============================================================================
// NOISE FILTER — reject clickbait/listicle/lifestyle junk (esp. Yahoo Finance)
// ============================================================================
const NOISE_PATTERNS: RegExp[] = [
  /\b\d+\s+(stocks?|things?|ways?|reasons?|tips?|moves?|etfs?|funds?|dividend)\b/i, // "3 stocks to buy", "5 things"
  /\bmotley fool\b/i,
  /\b(should you buy|is it too late|here'?s why|here'?s what|what to know|how to|how i|why i)\b/i,
  /\b(my|your) (retirement|portfolio|401k|paycheck|salary|savings)\b/i,
  /\b(billionaire|millionaire|net worth|celebrity|kardashian|influencer)\b/i,
  /\b(best (buy|deal|deals|discount)|prime day|black friday|cyber monday|coupon|gift guide|shopping)\b/i,
  /\b(horoscope|recipe|workout|weight loss|dating|travel guide|vacation)\b/i,
  /\b(zacks|analyst (says|reveals)|top pick|stock to watch|hot stock|penny stock)\b/i,
  /\b(could make you|make you rich|to buy now|to buy and hold|monster stock|no-brainer)\b/i,
  /\bsponsored\b/i,
];

function isNoise(text: string): boolean {
  return NOISE_PATTERNS.some((p) => p.test(text));
}

// "Strong" financial keywords — used to require real market relevance, not a single weak match
const STRONG_FINANCIAL_KEYWORDS = [
  "fed", "fomc", "ecb", "boe", "boj", "powell", "lagarde", "rate hike", "rate cut", "interest rate",
  "inflation", "cpi", "ppi", "gdp", "recession", "jobs report", "nonfarm", "treasury", "yield", "bond",
  "stock", "shares", "equities", "nasdaq", "s&p", "dow", "earnings", "revenue", "guidance",
  "oil", "brent", "wti", "opec", "gold", "dollar", "euro", "yen", "currency",
  "bitcoin", "ethereum", "crypto", "tariff", "sanction", "merger", "acquisition", "ipo",
  "nvidia", "apple", "microsoft", "tesla", "amazon", "meta", "google", "semiconductor",
];


function classifyArticle(raw: RawArticle, idx: number): NewsItem | null {
  const title = raw.title.toLowerCase();
  const text = `${raw.title} ${raw.description}`.toLowerCase();

  // Reject clickbait / listicle / lifestyle junk outright
  if (isNoise(text)) return null;

  // Require real market relevance: at least one STRONG financial keyword,
  // or a geopolitical keyword (geopolitics is high-value even with one hit)
  const strongHits = STRONG_FINANCIAL_KEYWORDS.filter((k) => text.includes(k)).length;
  const isGeo = THEME_KEYWORDS.geopolitica.some((k) => text.includes(k));
  if (strongHits === 0 && !isGeo) return null;

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
  const parsedTime = parsePublishedTime(raw.pubDate);
  const publishedTime = parsedTime ?? Date.now() - idx * 60_000;
  const ageMs = Math.max(0, Date.now() - publishedTime);
  let status: NewsStatus = "confirmed";
  if (ageMs < 1000 * 60 * 30 && impact === "high") status = "breaking";
  else if (ageMs < 1000 * 60 * 120 && impact !== "low") status = "developing";

  // Relevance score — boosted for geopolitical + multi-theme + strong signals
  const impactScore = impact === "high" ? 80 : impact === "medium" ? 55 : 30;
  const themeBonus = Math.min(themes.length * 5, 20);
  const triggerBonus = Math.min(highHits * 4, 15);
  const strongBonus = Math.min(strongHits * 4, 16);
  const geoBonus = isGeopolitical ? 10 : 0;
  const sourceBonus = (raw.source === "Reuters" || raw.source === "Bloomberg" || raw.source === "Investing.com") ? 10 : 0;
  // Penalize thin/weak items that only matched a single keyword and have no real signal
  const thinPenalty = strongHits <= 1 && highHits === 0 && themes.length < 2 ? 18 : 0;
  const relevanceScore = Math.max(
    0,
    Math.min(100, impactScore + themeBonus + triggerBonus + strongBonus + geoBonus + sourceBonus - thinPenalty),
  );


  // Published date
  const publishedAt = new Date(publishedTime).toISOString();

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
  try {
    const { data: latestNews } = await supabaseAdmin
      .from('news_items')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);
      
    const lastUpdateMs = latestNews?.[0]?.created_at ? new Date(latestNews[0].created_at).getTime() : 0;
    
    if (lastUpdateMs > 0 && Date.now() - lastUpdateMs < CACHE_TTL_MS) {
      const { data: dbItems } = await supabaseAdmin
        .from('news_items')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(TARGET_TOTAL);
        
      if (dbItems && dbItems.length > 0) {
        const items: NewsItem[] = dbItems.map(item => ({
          id: item.id,
          title: item.title,
          source: item.source as NewsSource,
          url: item.url,
          publishedAt: item.published_at,
          summary: item.summary,
          themes: item.themes as ThemeTag[],
          impact: item.impact as ImpactLevel,
          sentiment: item.sentiment as Sentiment,
          status: item.status as NewsStatus,
          regions: item.regions as MarketRegion[],
          markets: item.markets,
          relevanceScore: item.relevance_score,
        }));
        return { items, cached: true, source: "database" as const };
      }
    }

    const feedResults = await mapConcurrent(RSS_FEEDS, NEWS_FETCH_CONCURRENCY, fetchRSSFeed);
    const allRaw = feedResults.flat();

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
      .filter((n) => n.relevanceScore >= (SOURCE_MIN_RELEVANCE[n.source] ?? MIN_RELEVANCE));

    if (classified.length >= 1) {
      classified.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );

      const items = classified.slice(0, TARGET_TOTAL);
      
      const itemsToInsert = items.map(n => ({
        id: n.id,
        title: n.title,
        source: n.source,
        url: n.url,
        published_at: n.publishedAt,
        summary: n.summary,
        themes: n.themes,
        impact: n.impact,
        sentiment: n.sentiment,
        status: n.status,
        regions: n.regions,
        markets: n.markets,
        relevance_score: n.relevanceScore,
      }));
      
      await supabaseAdmin.from('news_items').upsert(itemsToInsert, { onConflict: 'id' });
      return { items, cached: false, source: "live" as const };
    }
  } catch (e) {
    console.error("RSS aggregation failed:", e);
  }

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
      description: "4-6 paragrafe în română clară. Explică detaliat CE s-a întâmplat, contextul, actorii implicați și cifrele concrete (prețuri, procente, valori). Începe simplu pentru un investitor începător, apoi adaugă profunzime. Fără jargon nefiltrat — explică termenii tehnici în paranteză.",
    },
    whyItMatters: {
      type: "string",
      description: "2-3 paragrafe: de ce este important pentru piața de capital, ce mecanisme economice se activează (lichiditate, rate, cost al capitalului, flux de capital), și care sunt legăturile cu macro-ul actual.",
    },
    shortTermImpact: {
      type: "string",
      description: "Impact pe termen scurt (zile-săptămâni) cu scenarii concrete: cum pot reacționa indicii, yield-urile, dolarul, mărfurile, sectoarele și acțiunile specifice. Include direcție probabilă și amploarea estimată.",
    },
    mediumTermImpact: {
      type: "string",
      description: "Impact pe termen mediu (1-6 luni): traiectorii posibile, riscuri de contagiune, ce s-ar schimba în teza de investiție, și ce factori ar confirma/infirma scenariul.",
    },
    affectedMarkets: {
      type: "string",
      description: "2-3 paragrafe detaliate despre piețele afectate concret: acțiuni și sectoare (cu tickere/companii), obligațiuni și yield-uri, FX (perechi concrete), mărfuri (Brent/WTI, aur etc.), crypto, regiuni. Explică mecanismul de transmisie pentru fiecare.",
    },
    watchPoints: {
      type: "array",
      items: { type: "string" },
      description: "4-6 puncte concrete și acționabile pe care un investitor ar trebui să le urmărească (niveluri de preț, date economice, declarații oficiali, termene-cheie).",
    },
    bottomLine: {
      type: "array",
      items: { type: "string" },
      description: "4-6 bullets foarte scurte — esențialul și concluzia practică pentru un investitor.",
    },
    tickers: {
      type: "array",
      items: { type: "string" },
      description: "0-5 simboluri financiare principale (tickere) implicate, în format standard (ex: NASDAQ:NVDA, NYSE:TSLA, FX:EURUSD, BINANCE:BTCUSDT). Dacă nu există un ticker clar, lasă gol.",
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
    // Check DB first
    try {
      const { data: dbAnalysis } = await supabaseAdmin
        .from('news_analyses')
        .select('*')
        .eq('news_id', data.id)
        .maybeSingle();
        
      if (dbAnalysis) {
        return { 
          analysis: {
            summarySimple: dbAnalysis.summary_simple,
            whyItMatters: dbAnalysis.why_it_matters,
            shortTermImpact: dbAnalysis.short_term_impact,
            mediumTermImpact: dbAnalysis.medium_term_impact,
            affectedMarkets: dbAnalysis.affected_markets,
            watchPoints: dbAnalysis.watch_points || [],
            bottomLine: dbAnalysis.bottom_line || [],
            tickers: dbAnalysis.tickers || []
          }
        };
      }
    } catch (e) {
      console.error("Failed to fetch from DB", e);
    }

    if (!process.env.GROQ_API_KEY) {
      return { analysis: fallbackAnalysis(data) };
    }

    if (aiLocks.has(data.id)) {
      return { analysis: null, error: "Analiza este în curs de generare. Te rugăm să reîncarci pagina în 10 secunde." };
    }

    const rlKey = `analyze_ai_${data.id}`;
    if (!checkRateLimit(rlKey, 3)) { 
      return { analysis: null, error: "Prea multe cereri globale pentru acest articol. Așteaptă un minut." };
    }

    aiLocks.add(data.id);
    const sys = `Ești un analist financiar senior la o firmă de investment banking care explică știri de piață pentru investitori români. Scrii în limba română, clar, profesionist, fără clickbait. Produci analize COMPLEXE și BOGATE: legi știrea de mecanisme economice reale, menționezi companii/tickere și sectoare. REGULĂ ABSOLUTĂ: ESTE STRICT INTERZIS SĂ INVENTEZI SAU SĂ PRECIZEZI PREȚURI NOMINALE EXACTE (ex: "Aurul a atins 1850$") PENTRU ORICE INSTRUMENT FINANCIAR, DECÂT DACĂ SUNT PREZENTE CLAR ÎN TEXTUL ȘTIRII. AI acces la date vechi, deci discuta doar în procente (%), puncte de bază (bps) sau tendințe direcționale (creștere/scădere). Explică termenii tehnici scurt. Oferă scenarii bull/bear.`;

      const usr = `Analizează în profunzime această știre și produ o explicație COMPLEXĂ pentru un investitor, cu accent pe modul în care poate influența piața de capital:

TITLU: ${data.title}
SURSĂ: ${data.source}
REZUMAT: ${data.summary}
TEME: ${data.themes?.join(", ") ?? "n/a"}
 REGIUNI: ${data.regions?.join(", ") ?? "n/a"}

Cerințe:
- Fii specific și nuanțat; evită generalitățile. Folosește cifre, sectoare și instrumente concrete.
- Explică lanțul de transmisie spre piețele de capital (acțiuni, obligațiuni, FX, mărfuri, crypto).
- Include scenarii pe termen scurt și mediu, plus ce ar confirma/infirma fiecare scenariu.
Generează o analiză completă urmând schema cerută.`;

    try {
      const result = (await callAI(usr, sys, ANALYSIS_SCHEMA)) as ArticleAnalysis | null;
      if (result) {
        // Insert to DB
        try {
          await supabaseAdmin.from('news_analyses').upsert({
            news_id: data.id,
            summary_simple: result.summarySimple,
            why_it_matters: result.whyItMatters,
            short_term_impact: result.shortTermImpact,
            medium_term_impact: result.mediumTermImpact,
            affected_markets: result.affectedMarkets,
            watch_points: result.watchPoints,
            bottom_line: result.bottomLine,
            tickers: result.tickers ?? []
          });
        } catch(dbErr) {
          console.error("Failed to insert analysis", dbErr);
        }
        return { analysis: result };
      }
      return { analysis: fallbackAnalysis(data) };
    } catch (e) {
      console.error("analyzeArticle", e);
      const msg = e instanceof Error ? e.message : "unknown";
      if (msg.includes("429")) return { analysis: fallbackAnalysis(data), error: "Prea multe cereri AI." };
      if (msg.includes("402")) return { analysis: fallbackAnalysis(data), error: "Credite AI epuizate." };
      return { analysis: fallbackAnalysis(data) };
    } finally {
      aiLocks.delete(data.id);
    }
  });

export const getNewsItem = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1).max(128) }).parse(data))
  .handler(async ({ data }) => {
    try {
      const { data: dbItem } = await supabaseAdmin
        .from('news_items')
        .select('*')
        .eq('id', data.id)
        .maybeSingle();
        
      if (dbItem) {
        const item: NewsItem = {
          id: dbItem.id,
          title: dbItem.title,
          source: dbItem.source as NewsSource,
          url: dbItem.url,
          publishedAt: dbItem.published_at,
          summary: dbItem.summary,
          themes: dbItem.themes as ThemeTag[],
          impact: dbItem.impact as ImpactLevel,
          sentiment: dbItem.sentiment as Sentiment,
          status: dbItem.status as NewsStatus,
          regions: dbItem.regions as MarketRegion[],
          markets: dbItem.markets,
          relevanceScore: dbItem.relevance_score,
        };
        return { item };
      }
    } catch(e) {
      console.error("Failed to get news item from DB", e);
    }
    
    const seed = SEED_NEWS.find((n) => n.id === data.id);
    return { item: seed ?? null };
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
      const rlKey = `custom_news_global`;
      if (!checkRateLimit(rlKey, 15)) {
        return { analysis: null, title: "", sourceLabel: "", error: "Prea multe cereri globale. Așteaptă un minut." };
      }

      const raw = data.input.trim();
      const isUrl = /^https?:\/\/\S+$/i.test(raw);

      // SSRF protection for URL inputs
      if (isUrl) {
        const urlCheck = isUrlSafe(raw);
        if (!urlCheck.safe) {
          return { analysis: null, title: "", sourceLabel: "", error: urlCheck.error ?? "URL nepermis." };
        }
      }

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
              redirect: "manual",
            });
            if (!r.ok) return null;
            const cl = r.headers.get("content-length");
            if (cl && parseInt(cl, 10) > 1024 * 1024 * 2) {
              return null; // Ignore if too large
            }
            const text = await r.text();
            return text.slice(0, 1024 * 1024 * 2); // Max 2MB
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
            const cl = r.headers.get("content-length");
            if (cl && parseInt(cl, 10) > 1024 * 1024 * 2) {
              return null; // Ignore if too large
            }
            const md = await r.text();
            if (md && md.length > 100) {
              return md.slice(0, 1024 * 1024 * 2);
            }
            return null;
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

      if (!process.env.OPENAI_API_KEY) {
        return {
          analysis: fallbackAnalysis({ title, source: sourceLabel, summary: "Rezumat generic." }),
          title,
          sourceLabel,
          error: "Cheia OpenAI lipsește.",
        };
      }

      const sys = `Ești un analist financiar senior la o firmă de investment banking care explică știri de piață pentru investitori români. Scrii în limba română, clar și profesionist. Produci analize COMPLEXE: legi știrea de mecanisme economice, menționezi sectoare/companii, niveluri și procente concrete, oferi scenarii pe termen scurt și mediu, și explici lanțul de transmisie spre piața de capital. Explici termenii tehnici în paranteză.`;
      const usr = `Analizează în profunzime următoarea știre, cu accent pe impactul complex asupra pieței de capital:\n\nSURSĂ: ${sourceLabel}\nTITLU: ${title}\n\nCONȚINUT:\n${bodyText}\n\nFii specific (cifre, sectoare, instrumente), explică lanțul de transmisie spre acțiuni/obligațiuni/FX/mărfuri și include scenarii. Generează o analiză completă urmând schema cerută.`;

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
  generatedAt: string;
  headline: string;
  snapshot: {
    bullets: string[];
    indices: { name: string; change: string; value: string }[];
    fx: { name: string; change: string; value: string }[];
    rates: { name: string; value: string }[];
    commodities: { name: string; change: string; value: string }[];
  };
  macroSentiment: { markdown: string };
  equities: {
    markdown: string;
    keyStocks: { symbol: string; move: string; trigger: string; importance: string }[];
  };
  ratesFx: { markdown: string };
  commoditiesCrypto: { markdown: string };
  topNews: {
    title: string;
    markdown: string;
    affectedInstruments: string[];
    bullishScenario: string;
    bearishScenario: string;
  }[];
  retailImpact: string[];
  riskScenarios: { markdown: string };
  sectorHeatmap: { sector: string; sentiment: "bullish" | "bearish" | "neutral"; score: number }[];
}

const DAILY_BRIEF_SCHEMA = {
  type: "object",
  properties: {
    headline: { type: "string" },
    snapshot: {
      type: "object",
      properties: {
        bullets: { type: "array", items: { type: "string" } },
        indices: { type: "array", items: { type: "object", properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } }, required: ["name", "change", "value"] } },
        fx: { type: "array", items: { type: "object", properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } }, required: ["name", "change", "value"] } },
        rates: { type: "array", items: { type: "object", properties: { name: { type: "string" }, value: { type: "string" } }, required: ["name", "value"] } },
        commodities: { type: "array", items: { type: "object", properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } }, required: ["name", "change", "value"] } }
      },
      required: ["bullets", "indices", "fx", "rates", "commodities"]
    },
    macroSentiment: {
      type: "object",
      properties: { markdown: { type: "string", description: "Scrie scurt si la obiect, un singur paragraf esential." } },
      required: ["markdown"]
    },
    equities: {
      type: "object",
      properties: {
        markdown: { type: "string", description: "O scurta sinteza pe actiuni, maxim 2-3 propozitii." },
        keyStocks: { type: "array", items: { type: "object", properties: { symbol: { type: "string" }, move: { type: "string" }, trigger: { type: "string" }, importance: { type: "string" } }, required: ["symbol", "move", "trigger", "importance"] } }
      },
      required: ["markdown", "keyStocks"]
    },
    ratesFx: {
      type: "object",
      properties: { markdown: { type: "string", description: "Scurt paragraf despre rate si FX." } },
      required: ["markdown"]
    },
    commoditiesCrypto: {
      type: "object",
      properties: { markdown: { type: "string", description: "Scurt paragraf despre marfuri si crypto." } },
      required: ["markdown"]
    },
    topNews: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          markdown: { type: "string", description: "Explicatie lunga si elaborata a stirii (minim 100 cuv)." },
          affectedInstruments: { type: "array", items: { type: "string" } },
          bullishScenario: { type: "string" },
          bearishScenario: { type: "string" }
        },
        required: ["title", "markdown", "affectedInstruments", "bullishScenario", "bearishScenario"]
      }
    },
    retailImpact: { type: "array", items: { type: "string" }, description: "Return as simple string array." },
    riskScenarios: {
      type: "object",
      properties: { markdown: { type: "string", description: "Descrie extrem de detaliat base, bull, bear cases (200 cuvinte)." } },
      required: ["markdown"]
    },
    sectorHeatmap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sector: { type: "string", description: "Numele sectorului (ex: Tech, Energie, Bănci)" },
          sentiment: { type: "string", enum: ["bullish", "bearish", "neutral"] },
          score: { type: "number", description: "Scor de la 0 la 100 indicând intensitatea (ex: 80 pentru puternic bullish, 20 pentru puternic bearish)" }
        },
        required: ["sector", "sentiment", "score"]
      },
      description: "Generează o hartă a sentimentului pentru 4-6 sectoare principale bazată pe știrile zilei."
    }
  },
  required: ["headline", "snapshot", "macroSentiment", "equities", "ratesFx", "commoditiesCrypto", "topNews", "riskScenarios", "sectorHeatmap"]
};

export const getDailyBrief = createServerFn({ method: "POST" })
  .handler(async (): Promise<{ brief: DailyBrief | null; error?: string }> => {
  // Calculăm ID-ul ciclului (se resetează la 8:00 AM ora României)
  function getBriefCycleId() {
    const roTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Bucharest" }));
    roTime.setHours(roTime.getHours() - 8);
    const yyyy = roTime.getFullYear();
    const mm = String(roTime.getMonth() + 1).padStart(2, '0');
    const dd = String(roTime.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  const today = getBriefCycleId();

  // 1. Verificăm stocarea persistentă (Supabase)
  try {
    const { data: existingBrief, error: dbErr } = await supabaseAdmin
      .from("daily_briefs")
      .select("content")
      .eq("id", today)
      .maybeSingle();

    if (existingBrief && existingBrief.content) {
      console.log("Servim Market Brief din baza de date persistentă!");
      return { brief: existingBrief.content as DailyBrief };
    }
  } catch (e) {
    console.warn("Eroare la verificarea bazei de date. Continuăm generarea...", e);
  }

  // 2. Fallback la Cache în Memorie (in-memory dev fallback)
  if (dailyBriefCache && dailyBriefCache.brief.date === today) {
    return { brief: dailyBriefCache.brief };
  }

  if (isGeneratingBrief) {
    return { brief: null, error: "Brief-ul zilnic este în curs de generare. Te rugăm să reîncarci pagina în 15 secunde." };
  }

  const rlKey = `global_daily_brief`;
  if (!checkRateLimit(rlKey, 5)) {
    return { brief: null, error: "Prea multe cereri. Așteaptă un minut." };
  }

  isGeneratingBrief = true;
  const newsData = newsCache?.items ?? SEED_NEWS;
  const topNews = newsData.slice(0, 40);

  if (!process.env.OPENAI_API_KEY) {
    return { brief: null, error: "Nu este configurat API Key-ul OpenAI." };
  }

  const newsSummary = topNews.map((n, i) =>
    `${i + 1}. [${n.source}] ${n.title} — Impact: ${n.impact}, Sentiment: ${n.sentiment}, Teme: ${n.themes.join(", ")}, Regiuni: ${n.regions.join(", ")}\nRezumat: ${n.summary}`
  ).join("\n\n");

  // Fetch live market data to inject into prompt to prevent hallucinated prices (like Gold at 1900)
  let liveMarketData = "Nu am putut prelua date live de piață, te rog estimează-le tu curent pentru anul 2026.";
  try {
    const symbols = ["^GSPC", "^DJI", "^IXIC", "GC=F", "SI=F", "CL=F", "EURUSD=X", "BTC-USD"];
    const quotes = await Promise.race([
      yahooFinance.quote(symbols),
      new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("Yahoo Finance timeout")), 2500))
    ]);
    liveMarketData = "DATE REALE DE PIAȚĂ ÎN ACEST MOMENT (FOLOSEȘTE-LE OBLIGATORIU ÎN SECȚIUNEA 'SNAPSHOT'):\n" +
      quotes.map(q => `${q.shortName || q.symbol}: Preț Curent: ${q.regularMarketPrice}, Modificare: ${q.regularMarketChangePercent?.toFixed(2)}%`).join("\n");
  } catch (e) {
    console.error("Eroare yahoo finance", e);
  }

  const sys = `Ești un MARKET & NEWS ANALYST SENIOR pentru un desk de tranzacționare global. Scopul tău este să generezi un Daily Market Brief scurt și foarte concis.
Fiecare câmp 'markdown' din JSON trebuie să fie o analiză esențializată de MAXIM 50-70 de cuvinte.
Gândește ca un analist de top, dar rezumă totul extrem de concentrat pentru a economisi timp.`;

  const usr = `DATA CURENTĂ ESTE: ${new Date().toLocaleDateString("ro-RO", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 
Generează un MARKET BRIEF ZILNIC PREMIUM (în ROMÂNĂ) pentru data de astăzi folosind ACESTE ȘTIRI RECENTE:

${newsSummary}

${liveMarketData}

Fii EXTREM de concis și analitic în câmpurile "markdown" (scrie doar un paragraf foarte scurt, esența pură).
FOLOSEȘTE PREȚURILE REALE DE MAI SUS PENTRU SNAPSHOT. Completează restul din cunoștințele tale generale și știrile curente.`;

  try {
    const result = await callAI(usr, sys, DAILY_BRIEF_SCHEMA);
    if (result) {
      const brief: DailyBrief = {
        date: new Date().toLocaleString("ro-RO", { timeZone: "Europe/Bucharest" }),
        generatedAt: new Date().toISOString(),
        ...result,
      };
      
      // Salvăm în in-memory cache
      dailyBriefCache = { brief, ts: Date.now() };

      // Salvăm PERSISTENT în Supabase Database
      try {
        await supabaseAdmin.from("daily_briefs").upsert({
          id: today,
          content: brief
        });
        console.log("Market Brief salvat cu succes în baza de date persistentă!");
      } catch (e) {
        console.error("Eroare la salvarea în baza de date Supabase", e);
      }

      return { brief };
    }
    return { brief: null, error: "Nu s-a putut genera briefing-ul." };
  } catch (e) {
    console.error("getDailyBrief", e);
    return { brief: null, error: "Eroare la generarea briefing-ului zilnic." };
  } finally {
    isGeneratingBrief = false;
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
  whyItMatters?: string; // explicație mai detaliată a impactului potențial
  expectation?: string; // consens / estimare / valoare anterioară
  tickers?: string[]; // simboluri relevante
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
          description: { type: "string", description: "2-3 propoziții clare despre ce este evenimentul și contextul lui." },
          whyItMatters: { type: "string", description: "1-2 propoziții despre de ce contează pentru piețe și ce scenarii pot apărea (bull/bear)." },
          expectation: { type: "string", description: "Consensul analiștilor, estimarea sau valoarea anterioară, dacă e relevant (ex: 'Consens: +0.3% MoM, anterior +0.2%'). Lasă gol dacă nu se aplică." },
          tickers: { type: "array", items: { type: "string" }, description: "Simboluri/indici relevanți (ex: AAPL, SPX, EURUSD)." },
          impact: { type: "string", enum: ["high", "medium", "low"] },
          category: { type: "string", enum: ["earnings", "economic", "central-bank", "geopolitical", "ipo", "other"] },
          regions: { type: "array", items: { type: "string" } },
          affectedMarkets: { type: "array", items: { type: "string" } },
        },
        required: ["date", "title", "description", "whyItMatters", "impact", "category", "regions", "affectedMarkets"],
      },
    },
  },
  required: ["events"],
};

let catalystCache: { events: CatalystEvent[]; ts: number } | null = null;

export const getCatalystCalendar = createServerFn({ method: "POST" })
  .handler(async (): Promise<{ events: CatalystEvent[]; error?: string }> => {
  // 1. Verificăm stocarea persistentă (app_cache)
  try {
    const { data: cacheRow, error: dbErr } = await supabaseAdmin
      .from("app_cache")
      .select("data, updated_at")
      .eq("id", "calendar-main")
      .maybeSingle();

    if (cacheRow && cacheRow.data) {
      const updatedAt = new Date(cacheRow.updated_at).getTime();
      const ageDays = (Date.now() - updatedAt) / (1000 * 60 * 60 * 24);
      
      // Dacă calendarul are mai puțin de 7 zile, îl servim din baza de date
      if (ageDays < 7) {
        console.log("Servim Calendarul din baza de date persistentă!");
        return { events: cacheRow.data as CatalystEvent[] };
      }
    }
  } catch (e) {
    console.warn("Eroare la verificarea bazei de date (Calendar). Continuăm generarea...", e);
  }

  // 2. Fallback la in-memory cache (ca strat secundar)
  if (catalystCache && Date.now() - catalystCache.ts < 1000 * 60 * 60 * 4) {
    return { events: catalystCache.events };
  }

  if (isGeneratingCalendar) {
    return { events: getStaticCatalysts(), error: "Calendarul se actualizează chiar acum. Afișăm varianta statică temporar." };
  }

  const rlKey = `global_catalyst_calendar`;
  if (!checkRateLimit(rlKey, 5)) {
    return { events: getStaticCatalysts(), error: "Prea multe cereri de actualizare. Așteaptă un minut." };
  }

  isGeneratingCalendar = true;
  if (!process.env.GROQ_API_KEY) {
    return { events: getStaticCatalysts(), error: undefined };
  }

  const today = new Date();
  const horizon = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const newsData = newsCache?.items ?? SEED_NEWS;
  const recentNewsContext = newsData.slice(0, 50).map(n => `- ${n.title} (Sursa: ${n.source})`).join("\n");

  const sys = `Ești un analist financiar senior care cunoaște în detaliu calendarul economic global. Generezi DOAR evenimente reale și plauzibile, programate. Scrii în română, clar și concis. Acorzi o importanță URIASĂ știrilor de ultimă oră pentru a descoperi evenimente dinamice (lansări spațiale, evenimente corporate).`;
  const usr = `Generează un calendar bogat de catalizatori de piață pentru perioada ${today.toISOString().split("T")[0]} — ${horizon.toISOString().split("T")[0]}.

CITEȘTE CU ATENȚIE ACESTE ȘTIRI RECENTE PENTRU A DESCOPERI EVENIMENTE DINAMICE (ex: Lansări SpaceX, Evenimente Apple/Tesla, Vizite de Stat):
${recentNewsContext}

Cerințe:
- Generează între 25 și 40 de evenimente. Pune pe primul loc evenimentele pe care le-ai descoperit din știrile de mai sus!
- Include categoriile clasice: earnings majore, date economice (CPI, NFP), decizii băncilor centrale, dar și IPO-uri sau evenimente geopolitice/tech.
- Pentru fiecare eveniment: descriere de 2-3 propoziții, un câmp 'whyItMatters' cu impactul potențial, iar unde se aplică un câmp 'expectation'.
- Adaugă 'tickers' cu simbolurile sau indicii relevanți.
- Sortează implicit cronologic. Doar evenimente reale și credibile.`;

  try {
    const result = await callAI(usr, sys, CATALYST_SCHEMA);
    if (result?.events?.length) {
      const events: CatalystEvent[] = result.events
        .map((e: CatalystEvent, i: number) => ({
          ...e,
          id: `cat-${hashString(e.title + e.date)}-${i}`,
        }))
        .sort((a: CatalystEvent, b: CatalystEvent) => a.date.localeCompare(b.date));
      
      catalystCache = { events, ts: Date.now() };

      // Salvăm PERSISTENT în Supabase app_cache
      try {
        await supabaseAdmin.from("app_cache").upsert({
          id: "calendar-main",
          data: events,
          updated_at: new Date().toISOString()
        });
        console.log("Calendar salvat cu succes în baza de date persistentă!");
      } catch (e) {
        console.error("Eroare la salvarea calendarului în Supabase", e);
      }

      return { events };
    }
    return { events: getStaticCatalysts() };
  } catch (e) {
    console.error("getCatalystCalendar", e);
    return { events: getStaticCatalysts(), error: "Eroare la generarea calendarului." };
  } finally {
    isGeneratingCalendar = false;
  }
});

function getStaticCatalysts(): CatalystEvent[] {
  const today = new Date();
  const fmt = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().split("T")[0];
  const raw: Omit<CatalystEvent, "id">[] = [
    { date: fmt(1), time: "08:30 ET", title: "CPI SUA (lunar)", description: "Indicele prețurilor de consum măsoară inflația la nivelul consumatorilor. Este unul dintre cei mai urmăriți indicatori macro din SUA.", whyItMatters: "Determină direct așteptările privind politica monetară a Fed. O cifră peste consens crește randamentele și presează acțiunile; o cifră sub consens susține rallyul.", expectation: "Consens: +0.3% MoM / ~3.2% YoY", tickers: ["SPX", "US10Y", "DXY"], impact: "high", category: "economic", regions: ["SUA"], affectedMarkets: ["Bonds", "Equities", "FX"] },
    { date: fmt(2), time: "08:30 ET", title: "Jobless Claims (săptămânal)", description: "Cererile inițiale de ajutor de șomaj oferă un puls săptămânal asupra pieței muncii din SUA.", whyItMatters: "O creștere bruscă semnalează slăbiciune economică și poate accelera așteptările de tăieri de dobândă.", expectation: "Consens: ~220k", tickers: ["SPX", "US2Y"], impact: "medium", category: "economic", regions: ["SUA"], affectedMarkets: ["Equities", "Bonds"] },
    { date: fmt(3), title: "Earnings: Apple & Microsoft", description: "Raportările trimestriale de la cele mai mari companii din lume după capitalizare. Investitorii urmăresc creșterea veniturilor din servicii, cloud și ghidajul AI.", whyItMatters: "Cu pondere mare în S&P 500 și Nasdaq, mișcările lor pot dicta direcția întregii piețe. Ghidajul slab poate declanșa rotație din tech.", tickers: ["AAPL", "MSFT", "NDX"], impact: "high", category: "earnings", regions: ["SUA"], affectedMarkets: ["Equities"] },
    { date: fmt(5), time: "14:00 ET", title: "Decizia FOMC + conferință de presă", description: "Reuniunea Comitetului de politică monetară al Fed, urmată de conferința de presă a președintelui. Se anunță decizia privind rata dobânzii și se actualizează proiecțiile.", whyItMatters: "Cel mai important catalizator macro. Tonul (hawkish/dovish) și dot-plot-ul mișcă toate clasele de active simultan.", expectation: "Piața așteaptă menținerea ratei; focus pe tonul comunicării", tickers: ["SPX", "US10Y", "DXY", "GC"], impact: "high", category: "central-bank", regions: ["SUA", "Global"], affectedMarkets: ["Bonds", "Equities", "FX", "Commodities"] },
    { date: fmt(7), time: "08:30 ET", title: "Non-Farm Payrolls (NFP)", description: "Raportul oficial privind locurile de muncă din SUA (exclusiv agricultură), inclusiv rata șomajului și creșterea salariilor.", whyItMatters: "Indicator cheie al sănătății economice. Salariile peste așteptări pot readuce temerile inflaționiste și volatilitate pe randamente.", expectation: "Consens: ~180k locuri noi, șomaj ~4.1%", tickers: ["SPX", "DXY", "US10Y"], impact: "high", category: "economic", regions: ["SUA"], affectedMarkets: ["Equities", "Bonds", "FX"] },
    { date: fmt(9), time: "TBD", title: "IPO notabil: listare tech majoră", description: "O companie de profil înalt din sectorul tehnologic urmează să se listeze. Listările mari testează apetitul pentru risc al pieței.", whyItMatters: "Un debut puternic semnalează deschiderea ferestrei IPO și apetit pentru creștere; un debut slab poate îngheța pipeline-ul de listări.", impact: "medium", category: "ipo", regions: ["SUA"], affectedMarkets: ["Equities"] },
    { date: fmt(11), time: "07:45 ET", title: "Decizia de dobândă BCE", description: "Banca Centrală Europeană anunță decizia de politică monetară pentru zona euro, urmată de conferința de presă.", whyItMatters: "Influențează EUR și obligațiunile europene. Divergența față de Fed mișcă perechea EUR/USD.", tickers: ["EURUSD", "DAX", "DE10Y"], impact: "high", category: "central-bank", regions: ["Europa"], affectedMarkets: ["FX", "Bonds", "Equities"] },
    { date: fmt(12), title: "Earnings: Bănci mari SUA", description: "JPMorgan, Bank of America și alte bănci majore deschid sezonul de raportări cu rezultate care reflectă starea economiei și a creditului.", whyItMatters: "Provizioanele pentru pierderi și venitul net din dobânzi oferă semnale despre sănătatea consumatorului și ciclul de credit.", tickers: ["JPM", "BAC", "XLF"], impact: "medium", category: "earnings", regions: ["SUA"], affectedMarkets: ["Equities"] },
    { date: fmt(14), time: "04:30 ET", title: "PMI Manufacturier & Servicii Europa", description: "Indicii PMI flash măsoară activitatea economică în industrie și servicii în zona euro și Marea Britanie.", whyItMatters: "Un prim semnal lunar despre direcția economiei europene; sub 50 indică contracție.", expectation: "Prag critic: 50", tickers: ["EURUSD", "STOXX50"], impact: "medium", category: "economic", regions: ["Europa"], affectedMarkets: ["Equities", "FX"] },
    { date: fmt(16), title: "Earnings: Nvidia", description: "Raportarea trimestrială a liderului în cipuri AI. Cel mai urmărit eveniment din sezonul de earnings tech.", whyItMatters: "Ghidajul privind cererea de cipuri AI poate mișca întreg sectorul de semiconductoare și sentimentul față de tema AI.", tickers: ["NVDA", "SOX", "NDX"], impact: "high", category: "earnings", regions: ["SUA"], affectedMarkets: ["Equities"] },
    { date: fmt(18), time: "TBD", title: "Reuniune OPEC+", description: "Țările OPEC+ decid asupra nivelurilor de producție de petrol pentru perioada următoare.", whyItMatters: "Decizia privind cotele influențează direct prețul țițeiului și acțiunile din energie.", tickers: ["CL", "BRENT", "XLE"], impact: "medium", category: "geopolitical", regions: ["Global"], affectedMarkets: ["Commodities", "Equities"] },
    { date: fmt(21), time: "TBD", title: "Decizia de dobândă BoJ", description: "Banca Japoniei anunță politica monetară. Atenție specială pe normalizarea politicii ultra-relaxate.", whyItMatters: "Modificările pot declanșa volatilitate pe yen și pe carry trade-uri globale.", tickers: ["USDJPY", "NKY"], impact: "medium", category: "central-bank", regions: ["Asia"], affectedMarkets: ["FX", "Equities"] },
    { date: fmt(23), time: "08:30 ET", title: "GDP SUA (estimare)", description: "Prima estimare a produsului intern brut pentru trimestrul curent — măsura cuprinzătoare a activității economice.", whyItMatters: "Confirmă sau infirmă scenariul de soft landing. Surprizele mari mișcă randamentele și dolarul.", expectation: "Consens: ~2.0% anualizat", tickers: ["SPX", "DXY"], impact: "high", category: "economic", regions: ["SUA"], affectedMarkets: ["Equities", "Bonds", "FX"] },
    { date: fmt(26), time: "TBD", title: "IPO notabil: listare în energie/industrial", description: "O companie importantă din sectorul industrial sau energetic urmează să se listeze pe bursă.", whyItMatters: "Evaluarea de listare oferă un reper pentru apetitul investitorilor față de active ciclice.", impact: "low", category: "ipo", regions: ["Global"], affectedMarkets: ["Equities"] },
    { date: fmt(28), time: "08:30 ET", title: "PCE Core (inflația preferată de Fed)", description: "Indicele cheltuielilor de consum personal, exclusiv alimente și energie — măsura de inflație preferată de Fed.", whyItMatters: "Mai relevant decât CPI pentru deciziile Fed. O cifră fierbinte poate amâna așteptările de relaxare monetară.", expectation: "Consens: +0.2% MoM", tickers: ["SPX", "US10Y", "DXY"], impact: "high", category: "economic", regions: ["SUA"], affectedMarkets: ["Bonds", "Equities", "FX"] },
  ];
  return raw.map((e, i) => ({ ...e, id: `cat-static-${i}` }));
}

// ============================================================================
// PHASE 3: Advanced Scoring — get score breakdown for an article
// ============================================================================
export const getAdvancedScore = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1).max(128) }).parse(data))
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
