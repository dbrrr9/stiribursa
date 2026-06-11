const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/lib/news.functions.ts');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `export interface DailyBrief {
  date: string;
  generatedAt: string;
  headline: string;
  snapshot: {
    bullets: string[];
    indices: { name: string; change: string; value: string }[];
    fx: { name: string; change: string; value: string }[];
    rates: { name: string; value: string }[];
    commodities: { name: string; change: string; value: string }[];
    timestamp: string;
  };
  macroSentiment: {
    whatHappened: string;
    sentiment: "risk-on" | "risk-off" | "mixt";
    why: string;
  };
  equities: {
    us: string;
    europeAsia: string;
    keyStocks: { symbol: string; move: string; trigger: string; importance: string }[];
  };
  ratesFx: {
    yieldCurve: string;
    fxDrivers: string;
  };
  commoditiesCrypto: {
    oil: string;
    gold: string;
    other: string;
    crypto: string;
  };
  topNews: {
    title: string;
    whatHappened: string;
    whyItMatters: string;
    affectedInstruments: string[];
    bullishScenario: string;
    bearishScenario: string;
  }[];
  retailImpact: string[];
  riskScenarios: {
    baseCase: string;
    bullishCase: string;
    bearishCase: string;
    volatility: string;
  };
  pitch: string;
}

const DAILY_BRIEF_SCHEMA = {
  type: "object",
  properties: {
    headline: { type: "string", description: "Titlu scurt de tip 'Risk-on în US...'" },
    snapshot: {
      type: "object",
      properties: {
        bullets: { type: "array", items: { type: "string" }, description: "Rezumat în 3-5 bullet-uri." },
        indices: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } },
            required: ["name", "change", "value"]
          }
        },
        fx: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } },
            required: ["name", "change", "value"]
          }
        },
        rates: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, value: { type: "string" } },
            required: ["name", "value"]
          }
        },
        commodities: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } },
            required: ["name", "change", "value"]
          }
        },
        timestamp: { type: "string" }
      },
      required: ["bullets", "indices", "fx", "rates", "commodities", "timestamp"]
    },
    macroSentiment: {
      type: "object",
      properties: {
        whatHappened: { type: "string" },
        sentiment: { type: "string", enum: ["risk-on", "risk-off", "mixt"] },
        why: { type: "string" }
      },
      required: ["whatHappened", "sentiment", "why"]
    },
    equities: {
      type: "object",
      properties: {
        us: { type: "string" },
        europeAsia: { type: "string" },
        keyStocks: {
          type: "array",
          items: {
            type: "object",
            properties: { symbol: { type: "string" }, move: { type: "string" }, trigger: { type: "string" }, importance: { type: "string" } },
            required: ["symbol", "move", "trigger", "importance"]
          }
        }
      },
      required: ["us", "europeAsia", "keyStocks"]
    },
    ratesFx: {
      type: "object",
      properties: {
        yieldCurve: { type: "string" },
        fxDrivers: { type: "string" }
      },
      required: ["yieldCurve", "fxDrivers"]
    },
    commoditiesCrypto: {
      type: "object",
      properties: {
        oil: { type: "string" },
        gold: { type: "string" },
        other: { type: "string" },
        crypto: { type: "string" }
      },
      required: ["oil", "gold", "other", "crypto"]
    },
    topNews: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          whatHappened: { type: "string" },
          whyItMatters: { type: "string" },
          affectedInstruments: { type: "array", items: { type: "string" } },
          bullishScenario: { type: "string" },
          bearishScenario: { type: "string" }
        },
        required: ["title", "whatHappened", "whyItMatters", "affectedInstruments", "bullishScenario", "bearishScenario"]
      }
    },
    retailImpact: { type: "array", items: { type: "string" } },
    riskScenarios: {
      type: "object",
      properties: {
        baseCase: { type: "string" },
        bullishCase: { type: "string" },
        bearishCase: { type: "string" },
        volatility: { type: "string" }
      },
      required: ["baseCase", "bullishCase", "bearishCase", "volatility"]
    },
    pitch: { type: "string" }
  },
  required: [
    "headline", "snapshot", "macroSentiment", "equities", 
    "ratesFx", "commoditiesCrypto", "topNews", "retailImpact", 
    "riskScenarios", "pitch"
  ]
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
    const fallback: DailyBrief = {
      date: new Date().toISOString().split("T")[0],
      generatedAt: new Date().toISOString(),
      headline: "Briefing Indisponibil",
      snapshot: {
        bullets: ["Activează AI-ul pentru a obține Market Brief-ul complet."],
        indices: [], fx: [], rates: [], commodities: [], timestamp: "N/A"
      },
      macroSentiment: { whatHappened: "N/A", sentiment: "mixt", why: "N/A" },
      equities: { us: "N/A", europeAsia: "N/A", keyStocks: [] },
      ratesFx: { yieldCurve: "N/A", fxDrivers: "N/A" },
      commoditiesCrypto: { oil: "N/A", gold: "N/A", other: "N/A", crypto: "N/A" },
      topNews: [],
      retailImpact: [],
      riskScenarios: { baseCase: "N/A", bullishCase: "N/A", bearishCase: "N/A", volatility: "N/A" },
      pitch: "Nu există date."
    };
    return { brief: fallback };
  }

  const newsSummary = topNews.map((n, i) =>
    \`\${i + 1}. [\${n.source}] \${n.title} — Impact: \${n.impact}, Sentiment: \${n.sentiment}, Teme: \${n.themes.join(", ")}, Regiuni: \${n.regions.join(", ")}\\nRezumat: \${n.summary}\`
  ).join("\\n\\n");

  const sys = \`Ești un MARKET & NEWS ANALYST pentru piețele de capital globale (US, Europa, Asia) care lucrează pentru un broker/desk de tranzacționare. Rolul tău este să generezi un DAILY MARKET BRIEF foarte bine structurat, cu date REALE și CURENTE, folosind contextul oferit (și cunoștințele tale generale actualizate) pentru a estima PREȚURI și DATE în timp real sau cât mai recente posibil.
Menționează în mod clar TIMESTAMP-ul (data și ora) pentru toate valorile de piață.
Construiește un DAILY MARKET BRIEF utilizabil direct într-un call cu clienți de retail/AF, dar scris ca pentru un desk profesional: concis, clar, cu accent pe context, scenarii și risk management.\`;

  const usr = \`Generează un MARKET BRIEF ZILNIC PREMIUM folosind ACESTE ȘTIRI (cele mai recente \${topNews.length} evenimente) și respectă strict structura cerută. Dacă nu ai cifre exacte din text, poți estima nivelul aproximativ sau notează 'N/A'.

CONȚINUT ACTUAL AL ȘTIRILOR:
\${newsSummary}

Cerințe STRUCTURĂ:
1) HEADLINE & SNAPSHOT (Titlu, bullet-uri cheie, tabel indici, fx, bonds, commodities).
2) MACRO & SENTIMENT (Ce s-a întâmplat, sentiment, de ce).
3) EQUITIES (SUA vs Europa/Asia, key stocks cu focus pe NVDA, AAPL, etc).
4) RATES & FX (Curbă de randamente, driveri valutari).
5) COMMODITIES & CRYPTO (Oil, Gold, BTC, etc).
6) TOP 3 NEWS WITH IMPACT (Cele mai mari 3 știri, implicații, the bulls vs the bears).
7) RETAIL INVESTOR IMPACT (Întrebări pentru client, sectoare vulnerabile/defensive).
8) RISK MANAGEMENT (Base case, bull case, bear case, volatilitate).
9) PITCH 1-2 MIN (6-10 fraze pentru a fi spuse la telefon de un broker).

Păstrează totul în ROMÂNĂ, ton neutru, analitic, profesionist. Indică mereu ORA și DATA curentă în snapshot timestamp.\`;

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

const startIndex = content.indexOf('export interface DailyBrief {');
const endIndex = content.indexOf('});', content.indexOf('export const getDailyBrief')) + 3;

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully replaced getDailyBrief section.");
} else {
    console.error("Could not find start or end index.");
}
