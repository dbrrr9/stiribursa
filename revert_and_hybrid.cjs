const fs = require('fs');
const path = require('path');

const typesFile = path.join(__dirname, 'src/lib/news-types.ts');
const functionsFile = path.join(__dirname, 'src/lib/news.functions.ts');
const routesFile = path.join(__dirname, 'src/routes/brief.tsx');

// 1. Update news-types.ts
let typesContent = fs.readFileSync(typesFile, 'utf8');
const interfaceToInject = `
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
  pitch: string;
}
`;
if (!typesContent.includes('export interface DailyBrief')) {
    typesContent += interfaceToInject;
    fs.writeFileSync(typesFile, typesContent);
}

// 2. Update news.functions.ts
let funcsContent = fs.readFileSync(functionsFile, 'utf8');
const replacementFuncs = `export interface DailyBrief {
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
  pitch: string;
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
      properties: { markdown: { type: "string", description: "Scrie minim 150-200 cuvinte analiza detaliata." } },
      required: ["markdown"]
    },
    equities: {
      type: "object",
      properties: {
        markdown: { type: "string", description: "Scrie o analiza masiva de minim 150 cuvinte pe actiuni." },
        keyStocks: { type: "array", items: { type: "object", properties: { symbol: { type: "string" }, move: { type: "string" }, trigger: { type: "string" }, importance: { type: "string" } }, required: ["symbol", "move", "trigger", "importance"] } }
      },
      required: ["markdown", "keyStocks"]
    },
    ratesFx: {
      type: "object",
      properties: { markdown: { type: "string", description: "Analiza detaliata de minim 100 cuvinte." } },
      required: ["markdown"]
    },
    commoditiesCrypto: {
      type: "object",
      properties: { markdown: { type: "string", description: "Analiza exhaustiva de minim 100 cuvinte pe marfuri." } },
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
    pitch: { type: "string", description: "Pitch de 1 minut, stufos si persuasiv." }
  },
  required: ["headline", "snapshot", "macroSentiment", "equities", "ratesFx", "commoditiesCrypto", "topNews", "riskScenarios", "pitch"]
};

export const getDailyBrief = createServerFn({ method: "POST" })
  .handler(async (): Promise<{ brief: DailyBrief | null; error?: string }> => {
    const rlKey = \`brief-\${Date.now()}\`;
    if (!checkRateLimit(rlKey)) {
      return { brief: null, error: "Prea multe cereri. Așteaptă un minut." };
    }
  if (dailyBriefCache && Date.now() - dailyBriefCache.ts < 1000 * 60 * 60) {
    return { brief: dailyBriefCache.brief };
  }

  const newsData = newsCache?.items ?? SEED_NEWS;
  const topNews = newsData.slice(0, 40);

  if (!process.env.GROQ_API_KEY) {
    return { brief: null, error: "Set GROQ_API_KEY" };
  }

  const newsSummary = topNews.map((n, i) =>
    \`\${i + 1}. [\${n.source}] \${n.title} — Impact: \${n.impact}, Sentiment: \${n.sentiment}, Teme: \${n.themes.join(", ")}, Regiuni: \${n.regions.join(", ")}\\nRezumat: \${n.summary}\`
  ).join("\\n\\n");

  const sys = \`Ești un MARKET & NEWS ANALYST SENIOR pentru un desk de tranzacționare global. Scopul tău este să generezi cel mai COMPLEX și EXHAUSTIV Daily Market Brief.
Nu te zgârci la cuvinte! Fiecare câmp 'markdown' din JSON trebuie să conțină analize de minim 150-200 de cuvinte, cu argumente profunde, context istoric și previziuni detaliate. 
Gândește ca un analist de top de la Goldman Sachs.\`;

  const usr = \`Generează un MARKET BRIEF ZILNIC PREMIUM (în ROMÂNĂ) folosind ACESTE ȘTIRI RECENTE:

\${newsSummary}

Fii EXTREM de detaliat și analitic în câmpurile "markdown" (scrie eseuri scurte pentru fiecare secțiune, folosind formatare Markdown bogată cu bullet-uri și bold).
Estimează prețurile indicilor în 'snapshot' bazat pe cunoștințele tale generale și știrile curente.\`;

  try {
    const result = await callAI(usr, sys, DAILY_BRIEF_SCHEMA);
    if (result) {
      const brief: DailyBrief = {
        date: new Date().toISOString().split("T")[0],
        generatedAt: new Date().toISOString(),
        ...result,
      };
      dailyBriefCache = { brief, ts: Date.now() };
      return { brief };
    }
    return { brief: null, error: "Nu s-a putut genera briefing-ul." };
  } catch (e) {
    console.error("getDailyBrief", e);
    return { brief: null, error: "Eroare la generarea briefing-ului zilnic." };
  }
});`;

const startIndexFuncs = funcsContent.indexOf('export interface DailyBrief {');
const endIndexFuncs = funcsContent.indexOf('});', funcsContent.indexOf('export const getDailyBrief')) + 3;

if (startIndexFuncs !== -1 && endIndexFuncs !== -1) {
    funcsContent = funcsContent.substring(0, startIndexFuncs) + replacementFuncs + funcsContent.substring(endIndexFuncs);
    fs.writeFileSync(functionsFile, funcsContent, 'utf8');
}


// 3. Rewrite brief.tsx
const newRoutesContent = `import { createFileRoute } from "@tanstack/react-router";
import { getDailyBrief } from "../lib/news.functions";
import { useQuery } from "@tanstack/react-query";
import { Loader2, TrendingUp, AlertTriangle, Globe2, BarChart3, LineChart, Cpu } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Route = createFileRoute("/brief")({
  component: BriefPage,
});

function MetricGroup({ title, items, isYield = false }: { title: string; items?: any[]; isYield?: boolean }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-3">{title}</h3>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground/90">{item.name}</span>
            <div className="text-right">
              <div className="text-xs font-bold font-mono text-foreground">{item.value}</div>
              {!isYield && item.change && (
                <div className={\`text-[10px] font-medium font-mono \${item.change.includes('-') ? 'text-sentiment-negative' : 'text-sentiment-positive'}\`}>
                  {item.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BriefPage() {
  const { data: brief, isLoading, isError, error } = useQuery({
    queryKey: ["dailyBrief"],
    queryFn: async () => {
      const res = await getDailyBrief();
      if (res?.error) throw new Error(res.error);
      if (!res?.brief) throw new Error("No data returned");
      return res.brief;
    },
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  if (isLoading) {
    return (
      <div className="ms-card p-12 text-center fade-up mt-8">
        <Loader2 className="h-8 w-8 animate-spin text-teal mx-auto mb-4" />
        <p className="text-foreground font-medium">Redactez analiza Premium (Hybrid)...</p>
        <p className="text-sm text-muted-foreground mt-2">Durează ~20 secunde pentru detalii exhaustive Llama 70B.</p>
      </div>
    );
  }

  if (isError || !brief) {
    return (
      <div className="ms-card p-12 text-center mt-8">
        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
        <p className="text-destructive font-medium">{error instanceof Error ? error.message : "Eroare."}</p>
      </div>
    );
  }

  return (
    <div className="fade-up space-y-8">
      {/* PITCH BANNER */}
      <div className="ms-card border-teal/20 bg-teal/5 overflow-hidden">
        <div className="bg-teal/10 px-4 py-2 border-b border-teal/20 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-teal animate-pulse" />
          <span className="text-xs font-bold text-teal tracking-widest uppercase">The 1-Minute Pitch</span>
        </div>
        <div className="p-5 sm:p-8">
          <p className="text-sm sm:text-base font-medium text-foreground/90 leading-relaxed italic">
            "{brief.pitch}"
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">{brief.headline}</h1>
        <p className="text-xs text-muted-foreground tabular-nums">Generat: {new Date(brief.generatedAt).toLocaleString("ro-RO")}</p>
      </div>

      {/* SNAPSHOT */}
      <div className="space-y-4">
        <div className="ms-card p-5">
          <ul className="space-y-2 mb-6 text-sm text-foreground/80">
            {brief.snapshot?.bullets?.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                 <span className="text-teal font-bold mt-0.5">•</span>
                 <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-4 bg-muted/20 rounded-xl border border-border/50">
            <MetricGroup title="Indici" items={brief.snapshot?.indices} />
            <MetricGroup title="FX" items={brief.snapshot?.fx} />
            <MetricGroup title="Commodities" items={brief.snapshot?.commodities} />
            <MetricGroup title="Rates (Yields)" items={brief.snapshot?.rates} isYield />
          </div>
        </div>
      </div>

      {/* DETAILED MARKDOWN SECTIONS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="ms-card p-6 space-y-4">
           <div className="flex items-center gap-2 border-b border-border/50 pb-3">
             <Globe2 className="h-5 w-5 text-teal" />
             <h2 className="text-lg font-bold">Macro & Sentiment</h2>
           </div>
           <div className="prose dark:prose-invert prose-sm prose-teal max-w-none text-foreground/90 leading-relaxed">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.macroSentiment?.markdown}</ReactMarkdown>
           </div>
        </div>
        
        <div className="ms-card p-6 space-y-4">
           <div className="flex items-center gap-2 border-b border-border/50 pb-3">
             <LineChart className="h-5 w-5 text-teal" />
             <h2 className="text-lg font-bold">Rates, FX & Commodities</h2>
           </div>
           <div className="prose dark:prose-invert prose-sm prose-teal max-w-none text-foreground/90 leading-relaxed space-y-4">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.ratesFx?.markdown}</ReactMarkdown>
             <hr className="border-border/30 my-4"/>
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.commoditiesCrypto?.markdown}</ReactMarkdown>
           </div>
        </div>
      </div>

      {/* EQUITIES & KEY STOCKS */}
      <div className="ms-card p-6 space-y-6">
         <div className="flex items-center gap-2 border-b border-border/50 pb-3">
           <BarChart3 className="h-5 w-5 text-teal" />
           <h2 className="text-lg font-bold">Equity Markets</h2>
         </div>
         <div className="prose dark:prose-invert prose-sm prose-teal max-w-none text-foreground/90 leading-relaxed">
           <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.equities?.markdown}</ReactMarkdown>
         </div>
         
         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {brief.equities?.keyStocks?.map((stock, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{stock.symbol}</span>
                  <span className={\`text-xs font-bold font-mono \${stock.move.includes('-') ? 'text-sentiment-negative' : 'text-sentiment-positive'}\`}>{stock.move}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{stock.trigger}</p>
              </div>
            ))}
         </div>
      </div>

      {/* TOP NEWS */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="ms-section-label text-teal">Catalizatori & Impact</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="space-y-6">
          {brief.topNews?.map((news, i) => (
            <div key={i} className="border border-border/60 rounded-xl overflow-hidden bg-background">
              <div className="p-4 bg-muted/30 border-b border-border/60">
                <h3 className="font-bold text-foreground text-base sm:text-lg">{news.title}</h3>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="prose dark:prose-invert prose-sm prose-teal max-w-none text-foreground/90">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{news.markdown}</ReactMarkdown>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-sentiment-positive/5 border border-sentiment-positive/20">
                    <span className="text-xs font-bold text-sentiment-positive uppercase tracking-wider block mb-1">Bull Case</span>
                    <p className="text-sm text-foreground/90">{news.bullishScenario}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-sentiment-negative/5 border border-sentiment-negative/20">
                    <span className="text-xs font-bold text-sentiment-negative uppercase tracking-wider block mb-1">Bear Case</span>
                    <p className="text-sm text-foreground/90">{news.bearishScenario}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-medium text-muted-foreground py-1">Instrumente Afectate:</span>
                  {news.affectedInstruments?.map((inst, j) => (
                    <span key={j} className="px-2 py-1 bg-border/40 text-foreground text-[10px] uppercase font-bold rounded-md tracking-wider">
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RETAIL IMPACT & SCENARIOS */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="ms-card p-6 lg:col-span-1">
          <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-widest mb-4">Retail Impact</h2>
          <ul className="space-y-3">
            {brief.retailImpact?.map((item, i) => (
              <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="text-teal mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ms-card p-6 lg:col-span-2">
          <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-widest mb-4">Risk Scenarios</h2>
          <div className="prose dark:prose-invert prose-sm prose-teal max-w-none text-foreground/90 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.riskScenarios?.markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(routesFile, newRoutesContent, 'utf8');

console.log("Reverted to structured UI but integrated Markdown for extreme textual complexity.");
