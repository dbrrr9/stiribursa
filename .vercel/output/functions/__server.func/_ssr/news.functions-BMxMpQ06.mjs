import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import { Y as YahooFinance } from "../_libs/yahoo-finance2.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { O as OpenAI } from "../_libs/openai.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, a as arrayType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:module";
import "node:url";
import "node:path";
import "../_libs/@deno/shim-deno.mjs";
import "node:fs";
import "fs";
import "node:fs/promises";
import "node:os";
import "events";
import "os";
import "path";
import "url";
import "node:tty";
import "tty";
import "process";
import "fs/promises";
import "net";
import "tls";
import "dns";
import "child_process";
import "../_libs/which.mjs";
import "../_libs/isexe.mjs";
import "../_libs/deno__shim-deno-test.mjs";
import "../_libs/tough-cookie.mjs";
import "../_libs/tldts.mjs";
import "../_libs/tldts-core.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const SEED_NEWS = [
  {
    id: "fed-pause-2026-01",
    title: "Fed semnalează o pauză prelungită în reducerile de dobândă pe fondul inflației persistente",
    source: "Reuters",
    url: "https://www.reuters.com/markets/us/fed-rates-2026/",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 18).toISOString(),
    summary: "Procesul-verbal FOMC arată că majoritatea membrilor preferă menținerea dobânzii la nivelul actual până când inflația de bază scade sub 2.5% pentru cel puțin trei luni consecutive.",
    themes: ["banci-centrale", "macro", "obligatiuni"],
    impact: "high",
    sentiment: "negative",
    status: "confirmed",
    regions: ["SUA", "Global"],
    markets: ["equities", "bonds", "FX"],
    sectors: ["bănci", "real estate", "tech"],
    relevanceScore: 94
  },
  {
    id: "nvda-earnings-q4",
    title: "Nvidia depășește estimările cu 12% pe segmentul data center; ghidaj forward conservator",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/news/nvda-q4-earnings",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 47).toISOString(),
    summary: "Veniturile data center au atins 38.5 mld. USD în trimestru, dar conducerea a moderat așteptările pentru trimestrul următor citând constrângeri de aprovizionare HBM.",
    themes: ["earnings", "actiuni"],
    impact: "high",
    sentiment: "mixed",
    status: "confirmed",
    regions: ["SUA", "Global"],
    markets: ["equities"],
    sectors: ["tech", "semiconductoare"],
    relevanceScore: 91
  },
  {
    id: "ecb-cut-2026",
    title: "BCE reduce dobânda cu 25 bp; Lagarde lasă deschisă opțiunea unei noi tăieri în martie",
    source: "Reuters",
    url: "https://www.reuters.com/markets/europe/ecb-rate-cut/",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 95).toISOString(),
    summary: "Banca Centrală Europeană a redus rata depozitelor la 2.25%. Lagarde a subliniat dezinflația progresivă din zona euro, dar a evitat să se angajeze ferm pentru martie.",
    themes: ["banci-centrale", "macro", "forex"],
    impact: "high",
    sentiment: "positive",
    status: "confirmed",
    regions: ["Europa"],
    markets: ["bonds", "FX", "equities"],
    sectors: ["bănci", "industrie"],
    relevanceScore: 89
  },
  {
    id: "oil-opec-cut",
    title: "OPEC+ extinde reducerile voluntare de producție până în Q3, petrolul urcă peste 84$",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/news/opec-extension",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 130).toISOString(),
    summary: "Arabia Saudită și Rusia conduc extinderea reducerilor voluntare de 2.2 mil. barili/zi. Brent a depășit 84 USD pentru prima dată în șase luni.",
    themes: ["marfuri", "geopolitica", "macro"],
    impact: "high",
    sentiment: "mixed",
    status: "developing",
    regions: ["Global"],
    markets: ["commodities", "equities", "FX"],
    sectors: ["energie", "transport"],
    relevanceScore: 86
  },
  {
    id: "china-stimulus",
    title: "China anunță un nou pachet fiscal de 1 trilion yuani pentru infrastructură și consum",
    source: "Reuters",
    url: "https://www.reuters.com/world/china/stimulus-package",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 180).toISOString(),
    summary: "Pachetul vizează stimularea cererii interne și sprijinirea sectorului imobiliar. Indicii din Hong Kong și Shanghai au reacționat pozitiv în deschidere.",
    themes: ["macro", "geopolitica", "actiuni"],
    impact: "high",
    sentiment: "positive",
    status: "breaking",
    regions: ["Asia", "Emergente"],
    markets: ["equities", "commodities", "FX"],
    sectors: ["materiale", "industrie", "consum"],
    relevanceScore: 84
  },
  {
    id: "yields-10y",
    title: "Randamentul Treasury 10Y revine sub 4.2% după date slabe ale comenzilor de bunuri durabile",
    source: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/treasury-yields",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 220).toISOString(),
    summary: "Comenzile de bunuri durabile au scăzut cu 1.8% în luna precedentă, peste estimările de -0.5%. Investitorii reduc așteptările privind creșterea pe T1.",
    themes: ["macro", "obligatiuni"],
    impact: "medium",
    sentiment: "mixed",
    status: "confirmed",
    regions: ["SUA"],
    markets: ["bonds", "equities"],
    relevanceScore: 76
  },
  {
    id: "btc-etf-flows",
    title: "Intrările record în ETF-urile Bitcoin spot duc BTC peste 105.000$",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/news/btc-etf-flows",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 280).toISOString(),
    summary: "Cele 11 ETF-uri spot au atras 2.3 mld. USD în ultima săptămână. BlackRock IBIT conduce intrările cu o cotă de 47%.",
    themes: ["crypto"],
    impact: "medium",
    sentiment: "positive",
    status: "confirmed",
    regions: ["Global"],
    markets: ["crypto", "equities"],
    relevanceScore: 68
  },
  {
    id: "boj-pivot",
    title: "BoJ semnalează o posibilă creștere a dobânzii în iulie; yenul se apreciază 1.2%",
    source: "Reuters",
    url: "https://www.reuters.com/markets/asia/boj-pivot",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 340).toISOString(),
    summary: "Guvernatorul Ueda a indicat că normalizarea politicii monetare poate continua dacă inflația rămâne aproape de țintă. USD/JPY a scăzut la 149.40.",
    themes: ["banci-centrale", "forex", "macro"],
    impact: "high",
    sentiment: "mixed",
    status: "developing",
    regions: ["Asia", "Global"],
    markets: ["FX", "bonds", "equities"],
    sectors: ["bănci", "export"],
    relevanceScore: 82
  },
  {
    id: "tsla-delivery",
    title: "Tesla raportează livrări trimestriale sub estimări; presiune pe marja brută auto",
    source: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/tsla-deliveries",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 410).toISOString(),
    summary: "Livrările au atins 462.000 vehicule, sub estimările de 478.000. Acțiunea a scăzut 4.8% în pre-market.",
    themes: ["earnings", "actiuni"],
    impact: "medium",
    sentiment: "negative",
    status: "confirmed",
    regions: ["SUA", "Global"],
    markets: ["equities"],
    sectors: ["auto", "tech"],
    relevanceScore: 64
  },
  {
    id: "geopolitics-mideast",
    title: "Tensiunile din Marea Roșie afectează rutele comerciale; primele de risc pentru petrol cresc",
    source: "Reuters",
    url: "https://www.reuters.com/world/middle-east/red-sea",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 480).toISOString(),
    summary: "Companiile de transport maritim major rerutează prin Capul Bunei Speranțe, adăugând 10-14 zile la timpul de tranzit Asia-Europa.",
    themes: ["geopolitica", "marfuri", "macro"],
    impact: "medium",
    sentiment: "negative",
    status: "developing",
    regions: ["Global", "Europa", "Asia"],
    markets: ["commodities", "equities", "FX"],
    sectors: ["transport", "energie", "retail"],
    relevanceScore: 71
  },
  {
    id: "eur-usd-parity",
    title: "EUR/USD testează 1.05 pe divergența politicilor monetare Fed-BCE",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/news/eurusd-parity",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 540).toISOString(),
    summary: "Diferențialul de randament între Treasury și Bund 10Y se lărgește la 200 bp, presând euro în jos.",
    themes: ["forex", "banci-centrale"],
    impact: "medium",
    sentiment: "mixed",
    status: "confirmed",
    regions: ["Europa", "SUA"],
    markets: ["FX", "bonds"],
    relevanceScore: 67
  },
  {
    id: "jpm-earnings",
    title: "JPMorgan depășește estimările pe trading; dobânda netă rămâne stabilă",
    source: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/jpm-earnings",
    publishedAt: new Date(Date.now() - 1e3 * 60 * 620).toISOString(),
    summary: "Veniturile din trading FICC au crescut 21% YoY. Dimon avertizează asupra incertitudinilor geopolitice persistente.",
    themes: ["earnings", "actiuni"],
    impact: "medium",
    sentiment: "positive",
    status: "confirmed",
    regions: ["SUA", "Global"],
    markets: ["equities"],
    sectors: ["bănci"],
    relevanceScore: 72
  }
];
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing Supabase server environment variables. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
const yahooFinance = new YahooFinance();
const AI_MODEL = "gpt-4o-mini";
const CACHE_TTL_MS = 1e3 * 60 * 5;
let dailyBriefCache = null;
const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^169\.254\.\d+\.\d+$/,
  // AWS metadata
  /^0\.0\.0\.0$/,
  /^\[::1?\]$/,
  // IPv6 loopback
  /^metadata\.google\.internal$/i,
  /^metadata\.internal$/i
];
function isUrlSafe(urlStr) {
  let parsed;
  try {
    parsed = new URL(urlStr);
  } catch {
    return {
      safe: false,
      error: "URL invalid."
    };
  }
  if (parsed.protocol !== "https:") {
    return {
      safe: false,
      error: "Doar URL-uri HTTPS sunt permise."
    };
  }
  const hostname = parsed.hostname;
  if (BLOCKED_HOSTNAME_PATTERNS.some((p) => p.test(hostname))) {
    return {
      safe: false,
      error: "Acest hostname nu este permis."
    };
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return {
      safe: false,
      error: "URL-urile cu IP direct nu sunt permise."
    };
  }
  return {
    safe: true
  };
}
const rateLimitMap = /* @__PURE__ */ new Map();
const RATE_LIMIT_WINDOW_MS = 6e4;
if (typeof setInterval !== "undefined") {
  setInterval(() => rateLimitMap.clear(), 6e4 * 60);
}
function checkRateLimit(key, limit = 10) {
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
const aiLocks = /* @__PURE__ */ new Set();
const RSS_FEEDS = [
  // Bloomberg direct feeds are fast and consistently fresh.
  {
    source: "Bloomberg",
    url: "https://feeds.bloomberg.com/markets/news.rss",
    tier: "primary"
  },
  {
    source: "Bloomberg",
    url: "https://feeds.bloomberg.com/economics/news.rss",
    tier: "primary"
  },
  {
    source: "Bloomberg",
    url: "https://feeds.bloomberg.com/technology/news.rss",
    tier: "primary"
  },
  {
    source: "Bloomberg",
    url: "https://feeds.bloomberg.com/politics/news.rss",
    tier: "secondary"
  },
  // Investing.com carries very fresh market wires, including Reuters-authored stories.
  {
    source: "Investing.com",
    sourceOverride: "Reuters",
    url: "https://www.investing.com/rss/news_25.rss",
    tier: "primary"
  },
  // stock market / Reuters wires
  {
    source: "Investing.com",
    sourceOverride: "Reuters",
    url: "https://www.investing.com/rss/news_14.rss",
    tier: "primary"
  },
  // economy
  {
    source: "Investing.com",
    sourceOverride: "Reuters",
    url: "https://www.investing.com/rss/news_11.rss",
    tier: "secondary"
  },
  // commodities
  {
    source: "Investing.com",
    sourceOverride: "Reuters",
    url: "https://www.investing.com/rss/news_1.rss",
    tier: "secondary"
  },
  // FX
  // Direct publisher feeds.
  {
    source: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    tier: "primary"
  },
  {
    source: "CNBC",
    url: "https://www.cnbc.com/id/10000664/device/rss/rss.html",
    tier: "primary"
  },
  {
    source: "CNBC",
    url: "https://www.cnbc.com/id/10001147/device/rss/rss.html",
    tier: "primary"
  },
  {
    source: "CNBC",
    url: "https://www.cnbc.com/id/19854910/device/rss/rss.html",
    tier: "secondary"
  },
  {
    source: "CNBC",
    url: "https://www.cnbc.com/id/20910258/device/rss/rss.html",
    tier: "secondary"
  },
  {
    source: "MarketWatch",
    url: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
    tier: "primary"
  },
  {
    source: "MarketWatch",
    url: "https://feeds.content.dowjones.io/public/rss/mw_marketpulse",
    tier: "secondary"
  },
  // Google News search sometimes returns 503/timeouts; keep it as low-priority fallback only.
  {
    source: "Reuters",
    url: "https://news.google.com/rss/search?q=site:reuters.com+markets+stocks+economy+fed+earnings+when:1d&hl=en-US&gl=US&ceid=US:en",
    tier: "fallback"
  },
  {
    source: "Reuters",
    url: "https://news.google.com/rss/search?q=site:reuters.com+oil+gold+treasury+inflation+geopolitics+when:1d&hl=en-US&gl=US&ceid=US:en",
    tier: "fallback"
  },
  {
    source: "Bloomberg",
    url: "https://news.google.com/rss/search?q=site:bloomberg.com+markets+stocks+economy+fed+earnings+when:1d&hl=en-US&gl=US&ceid=US:en",
    tier: "fallback"
  }
];
const TARGET_TOTAL = 60;
const MAX_AGE_MS = 1e3 * 60 * 60 * 24;
const MIN_RELEVANCE = 45;
const SOURCE_MIN_RELEVANCE = {
  "Yahoo Finance": 62
};
const NEWS_FETCH_CONCURRENCY = 6;
async function callAI(prompt, system, jsonSchema) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");
  const openai = new OpenAI({
    apiKey: key
  });
  const messages = [{
    role: "system",
    content: system
  }, {
    role: "user",
    content: prompt
  }];
  if (jsonSchema) {
    messages[0].content += "\n\nCRITICAL: You MUST reply with ONLY a valid JSON object. Ensure you follow this exact JSON schema:\n" + JSON.stringify(jsonSchema);
  }
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      max_tokens: 1e4,
      response_format: jsonSchema ? {
        type: "json_object"
      } : void 0
    });
    const content = response.choices[0].message.content;
    if (jsonSchema) {
      return content ? JSON.parse(content) : null;
    }
    return content ?? "";
  } catch (e) {
    throw new Error(`OpenAI API error: ${e.message}`);
  }
}
function parsePublishedTime(value) {
  if (!value) return null;
  const normalized = value.trim().replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/, "$1T$2Z");
  const t = new Date(normalized).getTime();
  if (Number.isNaN(t) || t < 9466848e5) return null;
  return t;
}
async function mapConcurrent(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({
    length: Math.min(limit, items.length)
  }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}
function decodeEntities(s) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/\s+/g, " ").trim();
}
function cleanText(s) {
  return s.replace(/(href|src|class|style|id|rel|target|data-\w+)\s*=\s*["'][^"']*["']/gi, "").replace(/<\/?[a-z][a-z0-9]*[^>]*>/gi, " ").replace(/https?:\/\/[^\s"')]+/g, "").replace(/\(\s*\)/g, "").replace(/\[\s*\]/g, "").replace(/\s{2,}/g, " ").trim();
}
function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m ? decodeEntities(m[1]) : "";
}
function parseRSS(xml, source, sourceOverride) {
  const items = [];
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const entryBlocks = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  const stripSuffix = (t) => t.replace(/\s+-\s+(Reuters|Bloomberg|Yahoo!? Finance|CNBC|MarketWatch|Financial Times|FT|Investing\.com)\s*$/i, "").trim();
  for (const block of itemBlocks) {
    let title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "dc:date");
    const description = extractTag(block, "description") || extractTag(block, "content:encoded") || extractTag(block, "summary");
    const author = extractTag(block, "author") || extractTag(block, "dc:creator");
    const effectiveSource = sourceOverride && author.toLowerCase().includes(sourceOverride.toLowerCase()) ? sourceOverride : source;
    title = stripSuffix(title);
    if (title) items.push({
      title,
      link,
      pubDate,
      description,
      source: effectiveSource
    });
  }
  for (const block of entryBlocks) {
    let title = extractTag(block, "title");
    const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["']/i);
    const link = linkMatch ? linkMatch[1] : extractTag(block, "link");
    const pubDate = extractTag(block, "updated") || extractTag(block, "published");
    const description = extractTag(block, "summary") || extractTag(block, "content");
    title = stripSuffix(title);
    if (title) items.push({
      title,
      link,
      pubDate,
      description,
      source
    });
  }
  return items;
}
async function fetchRSSFeed(feed) {
  try {
    const r = await fetch(feed.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MarketScopeBot/2.0; +https://marketscope.app)",
        Accept: "application/rss+xml, application/xml, text/xml, */*"
      },
      signal: AbortSignal.timeout(feed.tier === "fallback" ? 3e3 : 4e3)
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
const THEME_KEYWORDS = {
  actiuni: ["stock", "shares", "equity", "equities", "nasdaq", "s&p", "dow", "ipo", "listing", "rally", "selloff", "sell-off", "intel", "amd", "nvidia", "micron", "apple", "microsoft", "google", "amazon", "meta", "tesla", "tsmc", "qualcomm", "broadcom", "semiconductor", "chip", "ai stock"],
  obligatiuni: ["bond", "yield", "treasury", "treasuries", "credit", "debt", "coupon", "spread"],
  indici: ["index", "indices", "s&p 500", "nasdaq", "dow jones", "ftse", "dax", "nikkei", "hang seng", "stoxx", "russell"],
  forex: ["dollar", "euro", "yen", "currency", "forex", "fx", "exchange rate", "yuan", "sterling", "usd", "eur", "dxy"],
  marfuri: ["oil", "gold", "silver", "copper", "wheat", "gas", "commodit", "brent", "wti", "opec", "natural gas", "lng", "uranium", "platinum", "palladium", "lithium"],
  crypto: ["bitcoin", "btc", "ethereum", "eth", "crypto", "blockchain", "stablecoin", "binance", "coinbase", "defi", "solana", "xrp"],
  macro: ["inflation", "gdp", "cpi", "ppi", "unemployment", "jobs", "recession", "growth", "pmi", "consumer", "retail sales", "housing", "nonfarm", "jobless claims"],
  earnings: ["earnings", "revenue", "profit", "guidance", "quarter", "results", "beats", "misses", "forecast", "outlook", "eps", "ebitda"],
  "banci-centrale": ["fed", "ecb", "boe", "boj", "powell", "lagarde", "rate", "hike", "cut", "fomc", "interest rate", "monetary policy", "tightening", "easing", "hawkish", "dovish"],
  geopolitica: ["war", "ukraine", "russia", "china", "tariff", "sanction", "iran", "trade war", "election", "nuclear", "missile", "drone", "attack", "military", "defense", "conflict", "tension", "middle east", "israel", "hamas", "hezbollah", "gaza", "red sea", "houthi", "nato", "pentagon", "troops", "ceasefire", "negotiation", "diplomacy", "trump", "biden", "xi jinping", "putin", "khamenei", "netanyahu", "strait of hormuz", "persian gulf", "south china sea", "taiwan", "coup", "regime", "embargo", "blockade", "proxy war", "iran nuclear", "iran deal", "iaea", "enrichment", "centrifuge", "us iran", "iran sanctions", "iran oil", "tehran", "washington", "strike", "retaliation", "escalation", "de-escalation"]
};
const REGION_KEYWORDS = {
  SUA: ["us ", "u.s.", "wall street", "fed", "nasdaq", "dow", "s&p", "biden", "trump", "treasury", "pentagon", "white house", "congress", "american"],
  Europa: ["europe", "ecb", "euro", "germany", "france", "uk ", "britain", "ftse", "dax", "nato", "eu "],
  Asia: ["china", "japan", "india", "korea", "asia", "boj", "yen", "yuan", "nikkei", "hang seng", "taiwan", "xi jinping"],
  Emergente: ["emerging", "brazil", "mexico", "turkey", "india", "south africa", "iran", "saudi", "opec"],
  Global: []
};
const HIGH_IMPACT_TRIGGERS = ["fed", "fomc", "rate hike", "rate cut", "inflation", "cpi", "war", "crash", "surge", "plunge", "recession", "default", "earnings beat", "earnings miss", "ipo", "merger", "acquisition", "sanctions", "tariff", "iran", "nuclear", "missile", "attack", "ceasefire", "invasion", "embargo", "blockade", "breaking", "just in", "alert", "urgent", "oil spike", "gold surge", "dollar plunge", "trump", "biden", "powell"];
const NEGATIVE_WORDS = ["fall", "drop", "plunge", "crash", "loss", "miss", "weak", "decline", "fear", "concern", "warn", "cut", "recession", "slump", "threat", "escalat", "strike", "bomb", "kill", "casualties", "collapse"];
const POSITIVE_WORDS = ["rise", "surge", "gain", "jump", "rally", "beat", "strong", "growth", "record", "high", "boost", "upgrade", "ceasefire", "peace", "deal", "agree", "recover"];
const NOISE_PATTERNS = [
  /\b\d+\s+(stocks?|things?|ways?|reasons?|tips?|moves?|etfs?|funds?|dividend)\b/i,
  // "3 stocks to buy", "5 things"
  /\bmotley fool\b/i,
  /\b(should you buy|is it too late|here'?s why|here'?s what|what to know|how to|how i|why i)\b/i,
  /\b(my|your) (retirement|portfolio|401k|paycheck|salary|savings)\b/i,
  /\b(billionaire|millionaire|net worth|celebrity|kardashian|influencer)\b/i,
  /\b(best (buy|deal|deals|discount)|prime day|black friday|cyber monday|coupon|gift guide|shopping)\b/i,
  /\b(horoscope|recipe|workout|weight loss|dating|travel guide|vacation)\b/i,
  /\b(zacks|analyst (says|reveals)|top pick|stock to watch|hot stock|penny stock)\b/i,
  /\b(could make you|make you rich|to buy now|to buy and hold|monster stock|no-brainer)\b/i,
  /\bsponsored\b/i
];
function isNoise(text) {
  return NOISE_PATTERNS.some((p) => p.test(text));
}
const STRONG_FINANCIAL_KEYWORDS = ["fed", "fomc", "ecb", "boe", "boj", "powell", "lagarde", "rate hike", "rate cut", "interest rate", "inflation", "cpi", "ppi", "gdp", "recession", "jobs report", "nonfarm", "treasury", "yield", "bond", "stock", "shares", "equities", "nasdaq", "s&p", "dow", "earnings", "revenue", "guidance", "oil", "brent", "wti", "opec", "gold", "dollar", "euro", "yen", "currency", "bitcoin", "ethereum", "crypto", "tariff", "sanction", "merger", "acquisition", "ipo", "nvidia", "apple", "microsoft", "tesla", "amazon", "meta", "google", "semiconductor"];
function classifyArticle(raw, idx) {
  raw.title.toLowerCase();
  const text = `${raw.title} ${raw.description}`.toLowerCase();
  if (isNoise(text)) return null;
  const strongHits = STRONG_FINANCIAL_KEYWORDS.filter((k) => text.includes(k)).length;
  const isGeo = THEME_KEYWORDS.geopolitica.some((k) => text.includes(k));
  if (strongHits === 0 && !isGeo) return null;
  const themes = [];
  for (const [theme, kws] of Object.entries(THEME_KEYWORDS)) {
    if (kws.some((k) => text.includes(k))) themes.push(theme);
  }
  if (themes.length === 0) return null;
  if (themes.includes("geopolitica") && !themes.some((t) => ["actiuni", "marfuri", "forex", "obligatiuni", "indici"].includes(t))) {
    if (["iran", "saudi", "opec", "oil", "hormuz", "gulf", "middle east"].some((k) => text.includes(k))) {
      themes.push("marfuri");
    }
    if (["war", "attack", "missile", "invasion", "bomb"].some((k) => text.includes(k))) {
      themes.push("actiuni");
    }
  }
  const regions = [];
  for (const [region, kws] of Object.entries(REGION_KEYWORDS)) {
    if (region === "Global") continue;
    if (kws.some((k) => text.includes(k))) regions.push(region);
  }
  if (regions.length === 0) regions.push("Global");
  let impact = "low";
  const highHits = HIGH_IMPACT_TRIGGERS.filter((k) => text.includes(k)).length;
  const isGeopolitical = themes.includes("geopolitica");
  if (highHits >= 2 || isGeopolitical && highHits >= 1) impact = "high";
  else if (highHits === 1 || themes.length >= 3 || isGeopolitical) impact = "medium";
  const negHits = NEGATIVE_WORDS.filter((w) => text.includes(w)).length;
  const posHits = POSITIVE_WORDS.filter((w) => text.includes(w)).length;
  let sentiment = "mixed";
  if (negHits > posHits + 1) sentiment = "negative";
  else if (posHits > negHits + 1) sentiment = "positive";
  else if (negHits === 0 && posHits === 0) sentiment = "uncertain";
  const markets = [];
  if (themes.includes("actiuni") || themes.includes("indici")) markets.push("Equities");
  if (themes.includes("obligatiuni")) markets.push("Bonds");
  if (themes.includes("forex")) markets.push("FX");
  if (themes.includes("marfuri")) markets.push("Commodities");
  if (themes.includes("crypto")) markets.push("Crypto");
  if (markets.length === 0 && isGeopolitical) markets.push("Macro");
  const parsedTime = parsePublishedTime(raw.pubDate);
  const publishedTime = parsedTime ?? Date.now() - idx * 6e4;
  const ageMs = Math.max(0, Date.now() - publishedTime);
  let status = "confirmed";
  if (ageMs < 1e3 * 60 * 30 && impact === "high") status = "breaking";
  else if (ageMs < 1e3 * 60 * 120 && impact !== "low") status = "developing";
  const impactScore = impact === "high" ? 80 : impact === "medium" ? 55 : 30;
  const themeBonus = Math.min(themes.length * 5, 20);
  const triggerBonus = Math.min(highHits * 4, 15);
  const strongBonus = Math.min(strongHits * 4, 16);
  const geoBonus = isGeopolitical ? 10 : 0;
  const sourceBonus = raw.source === "Reuters" || raw.source === "Bloomberg" || raw.source === "Investing.com" ? 10 : 0;
  const thinPenalty = strongHits <= 1 && highHits === 0 && themes.length < 2 ? 18 : 0;
  const relevanceScore = Math.max(0, Math.min(100, impactScore + themeBonus + triggerBonus + strongBonus + geoBonus + sourceBonus - thinPenalty));
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
    relevanceScore
  };
}
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}
const fetchLatestNews_createServerFn_handler = createServerRpc({
  id: "aa90e7a9f934fbc983e2f594d62596dd17bbaba6dfe3da37b0bc248845a60fd1",
  name: "fetchLatestNews",
  filename: "src/lib/news.functions.ts"
}, (opts) => fetchLatestNews.__executeServer(opts));
const fetchLatestNews = createServerFn({
  method: "GET"
}).handler(fetchLatestNews_createServerFn_handler, async () => {
  try {
    const {
      data: latestNews
    } = await supabaseAdmin.from("news_items").select("created_at").order("created_at", {
      ascending: false
    }).limit(1);
    const lastUpdateMs = latestNews?.[0]?.created_at ? new Date(latestNews[0].created_at).getTime() : 0;
    if (lastUpdateMs > 0 && Date.now() - lastUpdateMs < CACHE_TTL_MS) {
      const {
        data: dbItems
      } = await supabaseAdmin.from("news_items").select("*").order("published_at", {
        ascending: false
      }).limit(TARGET_TOTAL);
      if (dbItems && dbItems.length > 0) {
        const items = dbItems.map((item) => ({
          id: item.id,
          title: item.title,
          source: item.source,
          url: item.url,
          publishedAt: item.published_at,
          summary: item.summary,
          themes: item.themes,
          impact: item.impact,
          sentiment: item.sentiment,
          status: item.status,
          regions: item.regions,
          markets: item.markets,
          relevanceScore: item.relevance_score
        }));
        return {
          items,
          cached: true,
          source: "database"
        };
      }
    }
    const feedResults = await mapConcurrent(RSS_FEEDS, NEWS_FETCH_CONCURRENCY, fetchRSSFeed);
    const allRaw = feedResults.flat();
    const seen = /* @__PURE__ */ new Set();
    const deduped = [];
    for (const a of allRaw) {
      const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(a);
      }
    }
    const now = Date.now();
    const classified = deduped.map((a, i) => classifyArticle(a, i)).filter((x) => x !== null).filter((n) => now - new Date(n.publishedAt).getTime() <= MAX_AGE_MS).filter((n) => n.relevanceScore >= (SOURCE_MIN_RELEVANCE[n.source] ?? MIN_RELEVANCE));
    if (classified.length >= 1) {
      classified.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      const items = classified.slice(0, TARGET_TOTAL);
      const itemsToInsert = items.map((n) => ({
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
        relevance_score: n.relevanceScore
      }));
      await supabaseAdmin.from("news_items").upsert(itemsToInsert, {
        onConflict: "id"
      });
      return {
        items,
        cached: false,
        source: "live"
      };
    }
  } catch (e) {
    console.error("RSS aggregation failed:", e);
  }
  return {
    items: SEED_NEWS,
    cached: false,
    source: "seed"
  };
});
const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    summarySimple: {
      type: "string",
      description: "4-6 paragrafe în română clară. Explică detaliat CE s-a întâmplat, contextul, actorii implicați și cifrele concrete (prețuri, procente, valori). Începe simplu pentru un investitor începător, apoi adaugă profunzime. Fără jargon nefiltrat — explică termenii tehnici în paranteză."
    },
    whyItMatters: {
      type: "string",
      description: "2-3 paragrafe: de ce este important pentru piața de capital, ce mecanisme economice se activează (lichiditate, rate, cost al capitalului, flux de capital), și care sunt legăturile cu macro-ul actual."
    },
    shortTermImpact: {
      type: "string",
      description: "Impact pe termen scurt (zile-săptămâni) cu scenarii concrete: cum pot reacționa indicii, yield-urile, dolarul, mărfurile, sectoarele și acțiunile specifice. Include direcție probabilă și amploarea estimată."
    },
    mediumTermImpact: {
      type: "string",
      description: "Impact pe termen mediu (1-6 luni): traiectorii posibile, riscuri de contagiune, ce s-ar schimba în teza de investiție, și ce factori ar confirma/infirma scenariul."
    },
    affectedMarkets: {
      type: "string",
      description: "2-3 paragrafe detaliate despre piețele afectate concret: acțiuni și sectoare (cu tickere/companii), obligațiuni și yield-uri, FX (perechi concrete), mărfuri (Brent/WTI, aur etc.), crypto, regiuni. Explică mecanismul de transmisie pentru fiecare."
    },
    watchPoints: {
      type: "array",
      items: {
        type: "string"
      },
      description: "4-6 puncte concrete și acționabile pe care un investitor ar trebui să le urmărească (niveluri de preț, date economice, declarații oficiali, termene-cheie)."
    },
    bottomLine: {
      type: "array",
      items: {
        type: "string"
      },
      description: "4-6 bullets foarte scurte — esențialul și concluzia practică pentru un investitor."
    },
    tickers: {
      type: "array",
      items: {
        type: "string"
      },
      description: "0-5 simboluri financiare principale (tickere) implicate, în format standard (ex: NASDAQ:NVDA, NYSE:TSLA, FX:EURUSD, BINANCE:BTCUSDT). Dacă nu există un ticker clar, lasă gol."
    }
  },
  required: ["summarySimple", "whyItMatters", "shortTermImpact", "mediumTermImpact", "affectedMarkets", "watchPoints", "bottomLine"]
};
const analyzeArticleSchema = objectType({
  id: stringType(),
  title: stringType(),
  source: stringType(),
  summary: stringType(),
  themes: arrayType(stringType()).optional(),
  regions: arrayType(stringType()).optional()
});
function fallbackAnalysis(data) {
  return {
    summarySimple: `${data.summary}

Această știre vine de la ${data.source} și se referă la un eveniment relevant pentru piețele financiare.`,
    whyItMatters: "Subiectul are potențial impact asupra prețurilor activelor și asupra deciziilor investitorilor.",
    shortTermImpact: "Reacțiile pe termen scurt vor depinde de cum interpretează piața evenimentul.",
    mediumTermImpact: "Pe termen mediu, traiectoria depinde de evoluția narrative-ului macro și de deciziile băncilor centrale.",
    affectedMarkets: "Verifică etichetele de teme și piețe din pagina principală pentru contextul exact.",
    watchPoints: ["Reacția imediată a indicilor majori", "Mișcările pe yield-urile obligațiunilor de stat", "Volatilitatea pe FX și mărfuri", "Comentariile oficialilor băncilor centrale"],
    bottomLine: [`Sursă: ${data.source}`, "Eveniment monitorizat de piețe", "Activează AI-ul pentru analiză completă în română"]
  };
}
const analyzeArticle_createServerFn_handler = createServerRpc({
  id: "b945fb25e25c44bb57d678ccd31cae7201bb86a5cc527889fab92c56d6f2f0cf",
  name: "analyzeArticle",
  filename: "src/lib/news.functions.ts"
}, (opts) => analyzeArticle.__executeServer(opts));
const analyzeArticle = createServerFn({
  method: "POST"
}).inputValidator((data) => analyzeArticleSchema.parse(data)).handler(analyzeArticle_createServerFn_handler, async ({
  data
}) => {
  try {
    const {
      data: dbAnalysis
    } = await supabaseAdmin.from("news_analyses").select("*").eq("news_id", data.id).maybeSingle();
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
    return {
      analysis: fallbackAnalysis(data)
    };
  }
  if (aiLocks.has(data.id)) {
    return {
      analysis: null,
      error: "Analiza este în curs de generare. Te rugăm să reîncarci pagina în 10 secunde."
    };
  }
  const rlKey = `analyze_ai_${data.id}`;
  if (!checkRateLimit(rlKey, 3)) {
    return {
      analysis: null,
      error: "Prea multe cereri globale pentru acest articol. Așteaptă un minut."
    };
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
    const result = await callAI(usr, sys, ANALYSIS_SCHEMA);
    if (result) {
      try {
        await supabaseAdmin.from("news_analyses").upsert({
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
      } catch (dbErr) {
        console.error("Failed to insert analysis", dbErr);
      }
      return {
        analysis: result
      };
    }
    return {
      analysis: fallbackAnalysis(data)
    };
  } catch (e) {
    console.error("analyzeArticle", e);
    const msg = e instanceof Error ? e.message : "unknown";
    if (msg.includes("429")) return {
      analysis: fallbackAnalysis(data),
      error: "Prea multe cereri AI."
    };
    if (msg.includes("402")) return {
      analysis: fallbackAnalysis(data),
      error: "Credite AI epuizate."
    };
    return {
      analysis: fallbackAnalysis(data)
    };
  } finally {
    aiLocks.delete(data.id);
  }
});
const getNewsItem_createServerFn_handler = createServerRpc({
  id: "4651190ab9113166fb4da1cfc1f9319a90370f6cc92f418c955c434c780911d1",
  name: "getNewsItem",
  filename: "src/lib/news.functions.ts"
}, (opts) => getNewsItem.__executeServer(opts));
const getNewsItem = createServerFn({
  method: "POST"
}).inputValidator((data) => objectType({
  id: stringType().min(1).max(128)
}).parse(data)).handler(getNewsItem_createServerFn_handler, async ({
  data
}) => {
  try {
    const {
      data: dbItem
    } = await supabaseAdmin.from("news_items").select("*").eq("id", data.id).maybeSingle();
    if (dbItem) {
      const item = {
        id: dbItem.id,
        title: dbItem.title,
        source: dbItem.source,
        url: dbItem.url,
        publishedAt: dbItem.published_at,
        summary: dbItem.summary,
        themes: dbItem.themes,
        impact: dbItem.impact,
        sentiment: dbItem.sentiment,
        status: dbItem.status,
        regions: dbItem.regions,
        markets: dbItem.markets,
        relevanceScore: dbItem.relevance_score
      };
      return {
        item
      };
    }
  } catch (e) {
    console.error("Failed to get news item from DB", e);
  }
  const seed = SEED_NEWS.find((n) => n.id === data.id);
  return {
    item: seed ?? null
  };
});
const customAnalyzeSchema = objectType({
  input: stringType().min(10).max(8e3)
});
const analyzeCustomNews_createServerFn_handler = createServerRpc({
  id: "db7b1357bdebe0f3f40a9f13257398f169921f8571986ddba81aa0fead24a527",
  name: "analyzeCustomNews",
  filename: "src/lib/news.functions.ts"
}, (opts) => analyzeCustomNews.__executeServer(opts));
const analyzeCustomNews = createServerFn({
  method: "POST"
}).inputValidator((data) => customAnalyzeSchema.parse(data)).handler(analyzeCustomNews_createServerFn_handler, async ({
  data
}) => {
  const rlKey = `custom_news_global`;
  if (!checkRateLimit(rlKey, 15)) {
    return {
      analysis: null,
      title: "",
      sourceLabel: "",
      error: "Prea multe cereri globale. Așteaptă un minut."
    };
  }
  const raw = data.input.trim();
  const isUrl = /^https?:\/\/\S+$/i.test(raw);
  if (isUrl) {
    const urlCheck = isUrlSafe(raw);
    if (!urlCheck.safe) {
      return {
        analysis: null,
        title: "",
        sourceLabel: "",
        error: urlCheck.error ?? "URL nepermis."
      };
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
      return {
        analysis: null,
        title,
        sourceLabel,
        error: "URL invalid."
      };
    }
    const tryDirect = async () => {
      try {
        const r = await fetch(raw, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "text/html,application/xhtml+xml,*/*"
          },
          signal: AbortSignal.timeout(9e3),
          redirect: "manual"
        });
        if (!r.ok) return null;
        const cl = r.headers.get("content-length");
        if (cl && parseInt(cl, 10) > 1024 * 1024 * 2) {
          return null;
        }
        const text = await r.text();
        return text.slice(0, 1024 * 1024 * 2);
      } catch {
        return null;
      }
    };
    const tryReaderProxy = async () => {
      try {
        const proxied = `https://r.jina.ai/${raw}`;
        const r = await fetch(proxied, {
          headers: {
            "User-Agent": "Mozilla/5.0 MarketScope/2.0",
            Accept: "text/plain, */*"
          },
          signal: AbortSignal.timeout(12e3)
        });
        if (!r.ok) return null;
        const cl = r.headers.get("content-length");
        if (cl && parseInt(cl, 10) > 1024 * 1024 * 2) {
          return null;
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
      const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) title = decodeEntities(titleMatch[1]).slice(0, 200);
      const descMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      const desc = descMatch ? decodeEntities(descMatch[1]) : "";
      const paragraphs = (html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) ?? []).map((p) => decodeEntities(p)).filter((t) => t.length > 60).slice(0, 12).join("\n\n");
      bodyText = [title, desc, paragraphs].filter(Boolean).join("\n\n").slice(0, 7e3);
    }
    if (!html || bodyText.length < 200) {
      const md = await tryReaderProxy();
      if (md) {
        const lines = md.split("\n").map((l) => l.replace(/^#+\s*/, "").trim()).filter(Boolean);
        if (lines[0] && lines[0].length > 8 && lines[0].length < 220) title = lines[0];
        bodyText = md.slice(0, 7e3);
      } else if (!html) {
        return {
          analysis: null,
          title,
          sourceLabel,
          error: "Nu pot accesa URL-ul. Lipește direct textul știrii."
        };
      }
    }
  } else {
    const firstLine = raw.split("\n")[0].trim();
    if (firstLine.length > 8 && firstLine.length < 200) title = firstLine;
  }
  if (!process.env.OPENAI_API_KEY) {
    return {
      analysis: fallbackAnalysis({
        source: sourceLabel,
        summary: "Rezumat generic."
      }),
      title,
      sourceLabel,
      error: "Cheia OpenAI lipsește."
    };
  }
  const sys = `Ești un analist financiar senior la o firmă de investment banking care explică știri de piață pentru investitori români. Scrii în limba română, clar și profesionist. Produci analize COMPLEXE: legi știrea de mecanisme economice, menționezi sectoare/companii, niveluri și procente concrete, oferi scenarii pe termen scurt și mediu, și explici lanțul de transmisie spre piața de capital. Explici termenii tehnici în paranteză.`;
  const usr = `Analizează în profunzime următoarea știre, cu accent pe impactul complex asupra pieței de capital:

SURSĂ: ${sourceLabel}
TITLU: ${title}

CONȚINUT:
${bodyText}

Fii specific (cifre, sectoare, instrumente), explică lanțul de transmisie spre acțiuni/obligațiuni/FX/mărfuri și include scenarii. Generează o analiză completă urmând schema cerută.`;
  try {
    const result = await callAI(usr, sys, ANALYSIS_SCHEMA);
    if (result) return {
      analysis: result,
      title,
      sourceLabel
    };
    return {
      analysis: fallbackAnalysis({
        title,
        source: sourceLabel,
        summary: bodyText.slice(0, 300)
      }),
      title,
      sourceLabel
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    const fb = fallbackAnalysis({
      source: sourceLabel,
      summary: bodyText.slice(0, 300)
    });
    if (msg.includes("429")) return {
      analysis: fb,
      title,
      sourceLabel,
      error: "Prea multe cereri AI."
    };
    if (msg.includes("402")) return {
      analysis: fb,
      title,
      sourceLabel,
      error: "Credite AI epuizate."
    };
    return {
      analysis: fb,
      title,
      sourceLabel,
      error: "Eroare AI."
    };
  }
});
const DAILY_BRIEF_SCHEMA = {
  type: "object",
  properties: {
    headline: {
      type: "string"
    },
    snapshot: {
      type: "object",
      properties: {
        bullets: {
          type: "array",
          items: {
            type: "string"
          }
        },
        indices: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              },
              change: {
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["name", "change", "value"]
          }
        },
        fx: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              },
              change: {
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["name", "change", "value"]
          }
        },
        rates: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["name", "value"]
          }
        },
        commodities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              },
              change: {
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["name", "change", "value"]
          }
        }
      },
      required: ["bullets", "indices", "fx", "rates", "commodities"]
    },
    macroSentiment: {
      type: "object",
      properties: {
        markdown: {
          type: "string",
          description: "Scrie scurt si la obiect, un singur paragraf esential."
        }
      },
      required: ["markdown"]
    },
    equities: {
      type: "object",
      properties: {
        markdown: {
          type: "string",
          description: "O scurta sinteza pe actiuni, maxim 2-3 propozitii."
        },
        keyStocks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              symbol: {
                type: "string"
              },
              move: {
                type: "string"
              },
              trigger: {
                type: "string"
              },
              importance: {
                type: "string"
              }
            },
            required: ["symbol", "move", "trigger", "importance"]
          }
        }
      },
      required: ["markdown", "keyStocks"]
    },
    ratesFx: {
      type: "object",
      properties: {
        markdown: {
          type: "string",
          description: "Scurt paragraf despre rate si FX."
        }
      },
      required: ["markdown"]
    },
    commoditiesCrypto: {
      type: "object",
      properties: {
        markdown: {
          type: "string",
          description: "Scurt paragraf despre marfuri si crypto."
        }
      },
      required: ["markdown"]
    },
    topNews: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string"
          },
          markdown: {
            type: "string",
            description: "Explicatie lunga si elaborata a stirii (minim 100 cuv)."
          },
          affectedInstruments: {
            type: "array",
            items: {
              type: "string"
            }
          },
          bullishScenario: {
            type: "string"
          },
          bearishScenario: {
            type: "string"
          }
        },
        required: ["title", "markdown", "affectedInstruments", "bullishScenario", "bearishScenario"]
      }
    },
    retailImpact: {
      type: "array",
      items: {
        type: "string"
      },
      description: "Return as simple string array."
    },
    riskScenarios: {
      type: "object",
      properties: {
        markdown: {
          type: "string",
          description: "Descrie extrem de detaliat base, bull, bear cases (200 cuvinte)."
        }
      },
      required: ["markdown"]
    },
    sectorHeatmap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sector: {
            type: "string",
            description: "Numele sectorului (ex: Tech, Energie, Bănci)"
          },
          sentiment: {
            type: "string",
            enum: ["bullish", "bearish", "neutral"]
          },
          score: {
            type: "number",
            description: "Scor de la 0 la 100 indicând intensitatea (ex: 80 pentru puternic bullish, 20 pentru puternic bearish)"
          }
        },
        required: ["sector", "sentiment", "score"]
      },
      description: "Generează o hartă a sentimentului pentru 4-6 sectoare principale bazată pe știrile zilei."
    }
  },
  required: ["headline", "snapshot", "macroSentiment", "equities", "ratesFx", "commoditiesCrypto", "topNews", "riskScenarios", "sectorHeatmap"]
};
const getDailyBrief_createServerFn_handler = createServerRpc({
  id: "c8e1a309006ba4eb9d84e028c8972894bb2cc14d7dd91dfe03b2ef830937ac32",
  name: "getDailyBrief",
  filename: "src/lib/news.functions.ts"
}, (opts) => getDailyBrief.__executeServer(opts));
const getDailyBrief = createServerFn({
  method: "POST"
}).handler(getDailyBrief_createServerFn_handler, async () => {
  function getBriefCycleId() {
    const roTime = new Date((/* @__PURE__ */ new Date()).toLocaleString("en-US", {
      timeZone: "Europe/Bucharest"
    }));
    roTime.setHours(roTime.getHours() - 8);
    const yyyy = roTime.getFullYear();
    const mm = String(roTime.getMonth() + 1).padStart(2, "0");
    const dd = String(roTime.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const today = getBriefCycleId();
  try {
    const {
      data: existingBrief,
      error: dbErr
    } = await supabaseAdmin.from("daily_briefs").select("content").eq("id", today).maybeSingle();
    if (existingBrief && existingBrief.content) {
      console.log("Servim Market Brief din baza de date persistentă!");
      return {
        brief: existingBrief.content
      };
    }
  } catch (e) {
    console.warn("Eroare la verificarea bazei de date. Continuăm generarea...", e);
  }
  if (dailyBriefCache && dailyBriefCache.brief.date === today) {
    return {
      brief: dailyBriefCache.brief
    };
  }
  if (isGeneratingBrief) {
    return {
      brief: null,
      error: "Brief-ul zilnic este în curs de generare. Te rugăm să reîncarci pagina în 15 secunde."
    };
  }
  const rlKey = `global_daily_brief`;
  if (!checkRateLimit(rlKey, 5)) {
    return {
      brief: null,
      error: "Prea multe cereri. Așteaptă un minut."
    };
  }
  isGeneratingBrief = true;
  const newsData = SEED_NEWS;
  const topNews = newsData.slice(0, 40);
  if (!process.env.OPENAI_API_KEY) {
    return {
      brief: null,
      error: "Nu este configurat API Key-ul OpenAI."
    };
  }
  const newsSummary = topNews.map((n, i) => `${i + 1}. [${n.source}] ${n.title} — Impact: ${n.impact}, Sentiment: ${n.sentiment}, Teme: ${n.themes.join(", ")}, Regiuni: ${n.regions.join(", ")}
Rezumat: ${n.summary}`).join("\n\n");
  let liveMarketData = "Nu am putut prelua date live de piață, te rog estimează-le tu curent pentru anul 2026.";
  try {
    const symbols = ["^GSPC", "^DJI", "^IXIC", "GC=F", "SI=F", "CL=F", "EURUSD=X", "BTC-USD"];
    const quotes = await Promise.race([yahooFinance.quote(symbols), new Promise((_, reject) => setTimeout(() => reject(new Error("Yahoo Finance timeout")), 2500))]);
    liveMarketData = "DATE REALE DE PIAȚĂ ÎN ACEST MOMENT (FOLOSEȘTE-LE OBLIGATORIU ÎN SECȚIUNEA 'SNAPSHOT'):\n" + quotes.map((q) => `${q.shortName || q.symbol}: Preț Curent: ${q.regularMarketPrice}, Modificare: ${q.regularMarketChangePercent?.toFixed(2)}%`).join("\n");
  } catch (e) {
    console.error("Eroare yahoo finance", e);
  }
  const sys = `Ești un MARKET & NEWS ANALYST SENIOR pentru un desk de tranzacționare global. Scopul tău este să generezi un Daily Market Brief scurt și foarte concis.
Fiecare câmp 'markdown' din JSON trebuie să fie o analiză esențializată de MAXIM 50-70 de cuvinte.
Gândește ca un analist de top, dar rezumă totul extrem de concentrat pentru a economisi timp.`;
  const usr = `DATA CURENTĂ ESTE: ${(/* @__PURE__ */ new Date()).toLocaleDateString("ro-RO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })}. 
Generează un MARKET BRIEF ZILNIC PREMIUM (în ROMÂNĂ) pentru data de astăzi folosind ACESTE ȘTIRI RECENTE:

${newsSummary}

${liveMarketData}

Fii EXTREM de concis și analitic în câmpurile "markdown" (scrie doar un paragraf foarte scurt, esența pură).
FOLOSEȘTE PREȚURILE REALE DE MAI SUS PENTRU SNAPSHOT. Completează restul din cunoștințele tale generale și știrile curente.`;
  try {
    const result = await callAI(usr, sys, DAILY_BRIEF_SCHEMA);
    if (result) {
      const brief = {
        date: (/* @__PURE__ */ new Date()).toLocaleString("ro-RO", {
          timeZone: "Europe/Bucharest"
        }),
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        ...result
      };
      dailyBriefCache = {
        brief,
        ts: Date.now()
      };
      try {
        await supabaseAdmin.from("daily_briefs").upsert({
          id: today,
          content: brief
        });
        console.log("Market Brief salvat cu succes în baza de date persistentă!");
      } catch (e) {
        console.error("Eroare la salvarea în baza de date Supabase", e);
      }
      return {
        brief
      };
    }
    return {
      brief: null,
      error: "Nu s-a putut genera briefing-ul."
    };
  } catch (e) {
    console.error("getDailyBrief", e);
    return {
      brief: null,
      error: "Eroare la generarea briefing-ului zilnic."
    };
  } finally {
    isGeneratingBrief = false;
  }
});
const CATALYST_SCHEMA = {
  type: "object",
  properties: {
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "YYYY-MM-DD"
          },
          time: {
            type: "string",
            description: "HH:MM ET sau 'TBD'"
          },
          title: {
            type: "string"
          },
          description: {
            type: "string",
            description: "2-3 propoziții clare despre ce este evenimentul și contextul lui."
          },
          whyItMatters: {
            type: "string",
            description: "1-2 propoziții despre de ce contează pentru piețe și ce scenarii pot apărea (bull/bear)."
          },
          expectation: {
            type: "string",
            description: "Consensul analiștilor, estimarea sau valoarea anterioară, dacă e relevant (ex: 'Consens: +0.3% MoM, anterior +0.2%'). Lasă gol dacă nu se aplică."
          },
          tickers: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Simboluri/indici relevanți (ex: AAPL, SPX, EURUSD)."
          },
          impact: {
            type: "string",
            enum: ["high", "medium", "low"]
          },
          category: {
            type: "string",
            enum: ["earnings", "economic", "central-bank", "geopolitical", "ipo", "other"]
          },
          regions: {
            type: "array",
            items: {
              type: "string"
            }
          },
          affectedMarkets: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        required: ["date", "title", "description", "whyItMatters", "impact", "category", "regions", "affectedMarkets"]
      }
    }
  },
  required: ["events"]
};
let catalystCache = null;
const getCatalystCalendar_createServerFn_handler = createServerRpc({
  id: "81b5009926f42f55a7fbc2b451cff21bf7b58fa119f8bed28319e7c6bc05f9b6",
  name: "getCatalystCalendar",
  filename: "src/lib/news.functions.ts"
}, (opts) => getCatalystCalendar.__executeServer(opts));
const getCatalystCalendar = createServerFn({
  method: "POST"
}).handler(getCatalystCalendar_createServerFn_handler, async () => {
  try {
    const {
      data: cacheRow,
      error: dbErr
    } = await supabaseAdmin.from("app_cache").select("data, updated_at").eq("id", "calendar-main").maybeSingle();
    if (cacheRow && cacheRow.data) {
      const updatedAt = new Date(cacheRow.updated_at).getTime();
      const ageDays = (Date.now() - updatedAt) / (1e3 * 60 * 60 * 24);
      if (ageDays < 7) {
        console.log("Servim Calendarul din baza de date persistentă!");
        return {
          events: cacheRow.data
        };
      }
    }
  } catch (e) {
    console.warn("Eroare la verificarea bazei de date (Calendar). Continuăm generarea...", e);
  }
  if (catalystCache && Date.now() - catalystCache.ts < 1e3 * 60 * 60 * 4) {
    return {
      events: catalystCache.events
    };
  }
  if (isGeneratingCalendar) {
    return {
      events: getStaticCatalysts(),
      error: "Calendarul se actualizează chiar acum. Afișăm varianta statică temporar."
    };
  }
  const rlKey = `global_catalyst_calendar`;
  if (!checkRateLimit(rlKey, 5)) {
    return {
      events: getStaticCatalysts(),
      error: "Prea multe cereri de actualizare. Așteaptă un minut."
    };
  }
  isGeneratingCalendar = true;
  if (!process.env.GROQ_API_KEY) {
    return {
      events: getStaticCatalysts(),
      error: void 0
    };
  }
  const today = /* @__PURE__ */ new Date();
  const horizon = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1e3);
  const newsData = SEED_NEWS;
  const recentNewsContext = newsData.slice(0, 50).map((n) => `- ${n.title} (Sursa: ${n.source})`).join("\n");
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
      const events = result.events.map((e, i) => ({
        ...e,
        id: `cat-${hashString(e.title + e.date)}-${i}`
      })).sort((a, b) => a.date.localeCompare(b.date));
      catalystCache = {
        events,
        ts: Date.now()
      };
      try {
        await supabaseAdmin.from("app_cache").upsert({
          id: "calendar-main",
          data: events,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        console.log("Calendar salvat cu succes în baza de date persistentă!");
      } catch (e) {
        console.error("Eroare la salvarea calendarului în Supabase", e);
      }
      return {
        events
      };
    }
    return {
      events: getStaticCatalysts()
    };
  } catch (e) {
    console.error("getCatalystCalendar", e);
    return {
      events: getStaticCatalysts(),
      error: "Eroare la generarea calendarului."
    };
  } finally {
    isGeneratingCalendar = false;
  }
});
function getStaticCatalysts() {
  const today = /* @__PURE__ */ new Date();
  const fmt = (d) => new Date(today.getTime() + d * 864e5).toISOString().split("T")[0];
  const raw = [{
    date: fmt(1),
    time: "08:30 ET",
    title: "CPI SUA (lunar)",
    description: "Indicele prețurilor de consum măsoară inflația la nivelul consumatorilor. Este unul dintre cei mai urmăriți indicatori macro din SUA.",
    whyItMatters: "Determină direct așteptările privind politica monetară a Fed. O cifră peste consens crește randamentele și presează acțiunile; o cifră sub consens susține rallyul.",
    expectation: "Consens: +0.3% MoM / ~3.2% YoY",
    tickers: ["SPX", "US10Y", "DXY"],
    impact: "high",
    category: "economic",
    regions: ["SUA"],
    affectedMarkets: ["Bonds", "Equities", "FX"]
  }, {
    date: fmt(2),
    time: "08:30 ET",
    title: "Jobless Claims (săptămânal)",
    description: "Cererile inițiale de ajutor de șomaj oferă un puls săptămânal asupra pieței muncii din SUA.",
    whyItMatters: "O creștere bruscă semnalează slăbiciune economică și poate accelera așteptările de tăieri de dobândă.",
    expectation: "Consens: ~220k",
    tickers: ["SPX", "US2Y"],
    impact: "medium",
    category: "economic",
    regions: ["SUA"],
    affectedMarkets: ["Equities", "Bonds"]
  }, {
    date: fmt(3),
    title: "Earnings: Apple & Microsoft",
    description: "Raportările trimestriale de la cele mai mari companii din lume după capitalizare. Investitorii urmăresc creșterea veniturilor din servicii, cloud și ghidajul AI.",
    whyItMatters: "Cu pondere mare în S&P 500 și Nasdaq, mișcările lor pot dicta direcția întregii piețe. Ghidajul slab poate declanșa rotație din tech.",
    tickers: ["AAPL", "MSFT", "NDX"],
    impact: "high",
    category: "earnings",
    regions: ["SUA"],
    affectedMarkets: ["Equities"]
  }, {
    date: fmt(5),
    time: "14:00 ET",
    title: "Decizia FOMC + conferință de presă",
    description: "Reuniunea Comitetului de politică monetară al Fed, urmată de conferința de presă a președintelui. Se anunță decizia privind rata dobânzii și se actualizează proiecțiile.",
    whyItMatters: "Cel mai important catalizator macro. Tonul (hawkish/dovish) și dot-plot-ul mișcă toate clasele de active simultan.",
    expectation: "Piața așteaptă menținerea ratei; focus pe tonul comunicării",
    tickers: ["SPX", "US10Y", "DXY", "GC"],
    impact: "high",
    category: "central-bank",
    regions: ["SUA", "Global"],
    affectedMarkets: ["Bonds", "Equities", "FX", "Commodities"]
  }, {
    date: fmt(7),
    time: "08:30 ET",
    title: "Non-Farm Payrolls (NFP)",
    description: "Raportul oficial privind locurile de muncă din SUA (exclusiv agricultură), inclusiv rata șomajului și creșterea salariilor.",
    whyItMatters: "Indicator cheie al sănătății economice. Salariile peste așteptări pot readuce temerile inflaționiste și volatilitate pe randamente.",
    expectation: "Consens: ~180k locuri noi, șomaj ~4.1%",
    tickers: ["SPX", "DXY", "US10Y"],
    impact: "high",
    category: "economic",
    regions: ["SUA"],
    affectedMarkets: ["Equities", "Bonds", "FX"]
  }, {
    date: fmt(9),
    time: "TBD",
    title: "IPO notabil: listare tech majoră",
    description: "O companie de profil înalt din sectorul tehnologic urmează să se listeze. Listările mari testează apetitul pentru risc al pieței.",
    whyItMatters: "Un debut puternic semnalează deschiderea ferestrei IPO și apetit pentru creștere; un debut slab poate îngheța pipeline-ul de listări.",
    impact: "medium",
    category: "ipo",
    regions: ["SUA"],
    affectedMarkets: ["Equities"]
  }, {
    date: fmt(11),
    time: "07:45 ET",
    title: "Decizia de dobândă BCE",
    description: "Banca Centrală Europeană anunță decizia de politică monetară pentru zona euro, urmată de conferința de presă.",
    whyItMatters: "Influențează EUR și obligațiunile europene. Divergența față de Fed mișcă perechea EUR/USD.",
    tickers: ["EURUSD", "DAX", "DE10Y"],
    impact: "high",
    category: "central-bank",
    regions: ["Europa"],
    affectedMarkets: ["FX", "Bonds", "Equities"]
  }, {
    date: fmt(12),
    title: "Earnings: Bănci mari SUA",
    description: "JPMorgan, Bank of America și alte bănci majore deschid sezonul de raportări cu rezultate care reflectă starea economiei și a creditului.",
    whyItMatters: "Provizioanele pentru pierderi și venitul net din dobânzi oferă semnale despre sănătatea consumatorului și ciclul de credit.",
    tickers: ["JPM", "BAC", "XLF"],
    impact: "medium",
    category: "earnings",
    regions: ["SUA"],
    affectedMarkets: ["Equities"]
  }, {
    date: fmt(14),
    time: "04:30 ET",
    title: "PMI Manufacturier & Servicii Europa",
    description: "Indicii PMI flash măsoară activitatea economică în industrie și servicii în zona euro și Marea Britanie.",
    whyItMatters: "Un prim semnal lunar despre direcția economiei europene; sub 50 indică contracție.",
    expectation: "Prag critic: 50",
    tickers: ["EURUSD", "STOXX50"],
    impact: "medium",
    category: "economic",
    regions: ["Europa"],
    affectedMarkets: ["Equities", "FX"]
  }, {
    date: fmt(16),
    title: "Earnings: Nvidia",
    description: "Raportarea trimestrială a liderului în cipuri AI. Cel mai urmărit eveniment din sezonul de earnings tech.",
    whyItMatters: "Ghidajul privind cererea de cipuri AI poate mișca întreg sectorul de semiconductoare și sentimentul față de tema AI.",
    tickers: ["NVDA", "SOX", "NDX"],
    impact: "high",
    category: "earnings",
    regions: ["SUA"],
    affectedMarkets: ["Equities"]
  }, {
    date: fmt(18),
    time: "TBD",
    title: "Reuniune OPEC+",
    description: "Țările OPEC+ decid asupra nivelurilor de producție de petrol pentru perioada următoare.",
    whyItMatters: "Decizia privind cotele influențează direct prețul țițeiului și acțiunile din energie.",
    tickers: ["CL", "BRENT", "XLE"],
    impact: "medium",
    category: "geopolitical",
    regions: ["Global"],
    affectedMarkets: ["Commodities", "Equities"]
  }, {
    date: fmt(21),
    time: "TBD",
    title: "Decizia de dobândă BoJ",
    description: "Banca Japoniei anunță politica monetară. Atenție specială pe normalizarea politicii ultra-relaxate.",
    whyItMatters: "Modificările pot declanșa volatilitate pe yen și pe carry trade-uri globale.",
    tickers: ["USDJPY", "NKY"],
    impact: "medium",
    category: "central-bank",
    regions: ["Asia"],
    affectedMarkets: ["FX", "Equities"]
  }, {
    date: fmt(23),
    time: "08:30 ET",
    title: "GDP SUA (estimare)",
    description: "Prima estimare a produsului intern brut pentru trimestrul curent — măsura cuprinzătoare a activității economice.",
    whyItMatters: "Confirmă sau infirmă scenariul de soft landing. Surprizele mari mișcă randamentele și dolarul.",
    expectation: "Consens: ~2.0% anualizat",
    tickers: ["SPX", "DXY"],
    impact: "high",
    category: "economic",
    regions: ["SUA"],
    affectedMarkets: ["Equities", "Bonds", "FX"]
  }, {
    date: fmt(26),
    time: "TBD",
    title: "IPO notabil: listare în energie/industrial",
    description: "O companie importantă din sectorul industrial sau energetic urmează să se listeze pe bursă.",
    whyItMatters: "Evaluarea de listare oferă un reper pentru apetitul investitorilor față de active ciclice.",
    impact: "low",
    category: "ipo",
    regions: ["Global"],
    affectedMarkets: ["Equities"]
  }, {
    date: fmt(28),
    time: "08:30 ET",
    title: "PCE Core (inflația preferată de Fed)",
    description: "Indicele cheltuielilor de consum personal, exclusiv alimente și energie — măsura de inflație preferată de Fed.",
    whyItMatters: "Mai relevant decât CPI pentru deciziile Fed. O cifră fierbinte poate amâna așteptările de relaxare monetară.",
    expectation: "Consens: +0.2% MoM",
    tickers: ["SPX", "US10Y", "DXY"],
    impact: "high",
    category: "economic",
    regions: ["SUA"],
    affectedMarkets: ["Bonds", "Equities", "FX"]
  }];
  return raw.map((e, i) => ({
    ...e,
    id: `cat-static-${i}`
  }));
}
const getAdvancedScore_createServerFn_handler = createServerRpc({
  id: "719386e45a3b398eb0cd70b3e87a30b2bf2e9665daadf3215d88aadd90030ae7",
  name: "getAdvancedScore",
  filename: "src/lib/news.functions.ts"
}, (opts) => getAdvancedScore.__executeServer(opts));
const getAdvancedScore = createServerFn({
  method: "POST"
}).inputValidator((data) => objectType({
  id: stringType().min(1).max(128)
}).parse(data)).handler(getAdvancedScore_createServerFn_handler, async ({
  data
}) => {
  const all = SEED_NEWS;
  const item = all.find((n) => n.id === data.id);
  if (!item) return {
    scores: null
  };
  const impW = item.impact === "high" ? 90 : item.impact === "medium" ? 60 : 30;
  const ageMs = Date.now() - new Date(item.publishedAt).getTime();
  const urgency = Math.max(10, 100 - Math.floor(ageMs / (1e3 * 60 * 60) * 8));
  const marketImpact = Math.min(100, item.themes.length * 15 + item.markets.length * 10 + (item.regions.length > 1 ? 15 : 0));
  const confidence = item.status === "confirmed" ? 85 : item.status === "developing" ? 65 : 50;
  const overall = Math.round(impW * 0.3 + urgency * 0.2 + marketImpact * 0.25 + confidence * 0.25);
  return {
    scores: {
      relevance: item.relevanceScore,
      urgency: Math.min(100, urgency),
      marketImpact: Math.min(100, marketImpact),
      confidence,
      overall: Math.min(100, overall)
    }
  };
});
export {
  analyzeArticle_createServerFn_handler,
  analyzeCustomNews_createServerFn_handler,
  fetchLatestNews_createServerFn_handler,
  getAdvancedScore_createServerFn_handler,
  getCatalystCalendar_createServerFn_handler,
  getDailyBrief_createServerFn_handler,
  getNewsItem_createServerFn_handler
};
