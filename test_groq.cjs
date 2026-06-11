const Groq = require("groq-sdk");
require("dotenv").config({ path: ".env.local" }); // or .env if present
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

async function test() {
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Test." },
        { role: "user", content: "Test." }
      ],
      max_tokens: 8000,
      response_format: { type: "json_object" },
      tools: [{
        type: "function",
        function: {
          name: "output_json",
          description: "Output JSON",
          parameters: DAILY_BRIEF_SCHEMA
        }
      }],
      tool_choice: { type: "function", function: { name: "output_json" } }
    });
    console.log("Success", res.choices[0].message);
  } catch(e) {
    console.error("ERROR", e);
  }
}
test();
