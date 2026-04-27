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

const FIRECRAWL_BASE = "https://api.firecrawl.dev/v2";
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const AI_MODEL = "google/gemini-3-flash-preview";

// In-memory cache (per worker instance)
let newsCache: { items: NewsItem[]; ts: number } | null = null;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 min
const analysisCache = new Map<string, ArticleAnalysis>();

const SOURCE_FEEDS: { source: NewsSource; url: string }[] = [
  { source: "Reuters", url: "https://www.reuters.com/markets/" },
  { source: "Bloomberg", url: "https://www.bloomberg.com/markets" },
  { source: "Yahoo Finance", url: "https://finance.yahoo.com/topic/stock-market-news/" },
];

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

async function firecrawlScrape(url: string): Promise<{ markdown?: string; links?: string[] } | null> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch(`${FIRECRAWL_BASE}/scrape`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "links"],
        onlyMainContent: true,
        waitFor: 1500,
      }),
    });
    if (!r.ok) {
      console.error(`Firecrawl ${url} -> ${r.status}`);
      return null;
    }
    const data = await r.json();
    // SDK v2 returns either {markdown} top-level or under {data}
    return {
      markdown: data.markdown ?? data.data?.markdown,
      links: data.links ?? data.data?.links,
    };
  } catch (e) {
    console.error("firecrawlScrape failed", e);
    return null;
  }
}

const NEWS_EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string", description: "1-2 propoziții în română" },
          impact: { type: "string", enum: ["high", "medium", "low"] },
          sentiment: { type: "string", enum: ["positive", "negative", "mixed", "uncertain"] },
          themes: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "actiuni",
                "obligatiuni",
                "indici",
                "forex",
                "marfuri",
                "crypto",
                "macro",
                "earnings",
                "banci-centrale",
                "geopolitica",
              ],
            },
          },
          regions: {
            type: "array",
            items: { type: "string", enum: ["SUA", "Europa", "Asia", "Global", "Emergente"] },
          },
          markets: { type: "array", items: { type: "string" } },
          sectors: { type: "array", items: { type: "string" } },
          relevanceScore: { type: "number", description: "0-100, relevanță pentru piața de capital" },
        },
        required: ["title", "summary", "impact", "sentiment", "themes", "regions", "markets", "relevanceScore"],
      },
    },
  },
  required: ["items"],
};

async function extractNewsFromMarkdown(
  source: NewsSource,
  markdown: string,
): Promise<NewsItem[]> {
  if (!markdown) return [];
  const truncated = markdown.slice(0, 18000);

  const sys = `Ești un analist financiar senior. Extragi cele mai relevante știri pentru piața de capital dintr-un homepage scrapat. Returnezi DOAR titluri reale care apar în conținut, nu inventezi. Toate textele tale (titluri, summary) sunt în limba română. Dacă titlul original e în engleză, îl traduci natural în română. Returnezi maxim 8 știri, alegând doar pe cele clar legate de piețele financiare (acțiuni, obligațiuni, dobânzi, mărfuri, FX, crypto, macro, earnings).`;

  const usr = `Sursă: ${source}\n\nConținut scrapat:\n${truncated}\n\nExtrage maxim 8 știri financiare relevante. Pentru fiecare scor de relevanță 0-100 (cât de mult contează pentru un investitor în piața de capital).`;

  try {
    const result = await callAI(usr, sys, NEWS_EXTRACTION_SCHEMA);
    if (!result?.items) return [];

    const now = Date.now();
    return (result.items as Array<Record<string, unknown>>).map((it, idx) => ({
      id: `${source.toLowerCase().replace(/\s/g, "-")}-${now}-${idx}`,
      title: String(it.title),
      source,
      url: SOURCE_FEEDS.find((f) => f.source === source)?.url ?? "",
      publishedAt: new Date(now - idx * 1000 * 60 * 7).toISOString(),
      summary: String(it.summary),
      themes: (it.themes as ThemeTag[]) ?? [],
      impact: (it.impact as ImpactLevel) ?? "medium",
      sentiment: (it.sentiment as Sentiment) ?? "mixed",
      regions: (it.regions as MarketRegion[]) ?? ["Global"],
      markets: (it.markets as string[]) ?? [],
      sectors: (it.sectors as string[]) ?? undefined,
      relevanceScore: Math.max(0, Math.min(100, Number(it.relevanceScore) || 50)),
    }));
  } catch (e) {
    console.error(`extractNewsFromMarkdown ${source}`, e);
    return [];
  }
}

export const fetchLatestNews = createServerFn({ method: "GET" }).handler(async () => {
  // Cache hit
  if (newsCache && Date.now() - newsCache.ts < CACHE_TTL_MS) {
    return { items: newsCache.items, cached: true, source: "cache" as const };
  }

  // Try live scrape
  if (process.env.FIRECRAWL_API_KEY && process.env.LOVABLE_API_KEY) {
    try {
      const scrapes = await Promise.all(
        SOURCE_FEEDS.map(async (f) => {
          const r = await firecrawlScrape(f.url);
          return { source: f.source, markdown: r?.markdown ?? "" };
        }),
      );

      const extracted = await Promise.all(
        scrapes.map((s) => extractNewsFromMarkdown(s.source, s.markdown)),
      );

      const items = extracted.flat();
      if (items.length >= 3) {
        // Sort by impact + relevance + recency
        items.sort((a, b) => {
          const impactWeight = { high: 3, medium: 2, low: 1 };
          const score = (n: NewsItem) =>
            impactWeight[n.impact] * 30 +
            n.relevanceScore -
            (Date.now() - new Date(n.publishedAt).getTime()) / (1000 * 60 * 60);
          return score(b) - score(a);
        });
        newsCache = { items, ts: Date.now() };
        return { items, cached: false, source: "live" as const };
      }
    } catch (e) {
      console.error("Live fetch failed, using seed", e);
    }
  }

  // Fallback to seed
  newsCache = { items: SEED_NEWS, ts: Date.now() };
  return { items: SEED_NEWS, cached: false, source: "seed" as const };
});

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

export const analyzeArticle = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => analyzeArticleSchema.parse(data))
  .handler(async ({ data }): Promise<{ analysis: ArticleAnalysis | null; error?: string }> => {
    const cacheKey = data.id;
    const cached = analysisCache.get(cacheKey);
    if (cached) return { analysis: cached };

    if (!process.env.LOVABLE_API_KEY) {
      return { analysis: null, error: "AI nu este configurat." };
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
      }
      return { analysis: result };
    } catch (e) {
      console.error("analyzeArticle", e);
      const msg = e instanceof Error ? e.message : "unknown";
      if (msg.includes("429")) return { analysis: null, error: "Prea multe cereri. Încearcă în câteva secunde." };
      if (msg.includes("402")) return { analysis: null, error: "Credite AI epuizate. Adaugă fonduri în Workspace." };
      return { analysis: null, error: "Analiza nu a putut fi generată momentan." };
    }
  });

export const getNewsItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const all = newsCache?.items ?? SEED_NEWS;
    const item = all.find((n) => n.id === data.id);
    if (!item) {
      // Try seed fallback
      const seed = SEED_NEWS.find((n) => n.id === data.id);
      return { item: seed ?? null };
    }
    return { item };
  });
