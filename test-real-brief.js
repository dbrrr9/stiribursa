import "dotenv/config";
import OpenAI from "openai";
import { SEED_NEWS } from "./src/lib/seed-news.ts";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DAILY_BRIEF_SCHEMA = {
  type: "object", additionalProperties: false, properties: {
    headline: { type: "string" },
    snapshot: {
      type: "object", additionalProperties: false, properties: {
        bullets: { type: "array", items: { type: "string" } },
        indices: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } }, required: ["name", "change", "value"] } },
        fx: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } }, required: ["name", "change", "value"] } },
        rates: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, value: { type: "string" } }, required: ["name", "value"] } },
        commodities: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, change: { type: "string" }, value: { type: "string" } }, required: ["name", "change", "value"] } }
      },
      required: ["bullets", "indices", "fx", "rates", "commodities"]
    },
    macroSentiment: {
      type: "object", additionalProperties: false, properties: { markdown: { type: "string", description: "Scrie scurt si la obiect, un singur paragraf esential." } },
      required: ["markdown"]
    },
    equities: {
      type: "object", additionalProperties: false, properties: {
        markdown: { type: "string", description: "O scurta sinteza pe actiuni, maxim 2-3 propozitii." },
        keyStocks: { type: "array", items: { type: "object", additionalProperties: false, properties: { symbol: { type: "string" }, move: { type: "string" }, trigger: { type: "string" }, importance: { type: "string" } }, required: ["symbol", "move", "trigger", "importance"] } }
      },
      required: ["markdown", "keyStocks"]
    },
    ratesFx: {
      type: "object", additionalProperties: false, properties: { markdown: { type: "string", description: "Scurt paragraf despre rate si FX." } },
      required: ["markdown"]
    },
    commoditiesCrypto: {
      type: "object", additionalProperties: false, properties: { markdown: { type: "string", description: "Scurt paragraf despre marfuri si crypto." } },
      required: ["markdown"]
    },
    topNews: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, properties: {
          title: { type: "string" },
          markdown: { type: "string", description: "Explicatie a stirii (maxim 40 cuv)." },
          affectedInstruments: { type: "array", items: { type: "string" } },
          bullishScenario: { type: "string" },
          bearishScenario: { type: "string" }
        },
        required: ["title", "markdown", "affectedInstruments", "bullishScenario", "bearishScenario"]
      }
    },
    retailImpact: { type: "array", items: { type: "string" }, description: "Return as simple string array." },
    riskScenarios: {
      type: "object", additionalProperties: false, properties: { markdown: { type: "string", description: "Descrie extrem de detaliat base, bull, bear cases (200 cuvinte)." } },
      required: ["markdown"]
    },
    sectorHeatmap: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, properties: {
          sector: { type: "string", description: "Numele sectorului (ex: Tech, Energie, Bănci)" },
          sentiment: { type: "string", enum: ["bullish", "bearish", "neutral"] },
          score: { type: "number", description: "Scor de la 0 la 100 indicând intensitatea (ex: 80 pentru puternic bullish, 20 pentru puternic bearish)" }
        },
        required: ["sector", "sentiment", "score"]
      }
    }
  },
  required: ["headline", "snapshot", "macroSentiment", "equities", "ratesFx", "commoditiesCrypto", "topNews", "riskScenarios", "sectorHeatmap"]
};

async function test() {
  const topNews = SEED_NEWS.slice(0, 7);
  const newsSummary = topNews.map((n, i) =>
    `${i + 1}. [${n.source}] ${n.title} — Impact: ${n.impact}, Sentiment: ${n.sentiment}\nRezumat: ${n.summary}`
  ).join("\n\n");

  const sys = `Ești un MARKET & NEWS ANALYST SENIOR...`;
  const usr = `Generează Daily Market Brief pentru ziua de azi. Folosește aceste știri:\n${newsSummary}`;

  console.time("OpenAI");
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: usr + "\n\nCRITICAL: JSON EXACT:\n" + JSON.stringify(DAILY_BRIEF_SCHEMA) }
    ],
    response_format: { type: "json_object" }
  });
  console.timeEnd("OpenAI");
  console.log("Tokens:", completion.usage);
}
test();
