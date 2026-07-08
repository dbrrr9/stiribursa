import "dotenv/config";
import OpenAI from "openai";
import { SEED_NEWS } from "./src/lib/seed-news";

const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error("OPENAI_API_KEY not configured");

const openai = new OpenAI({ apiKey: key });

const topNews = SEED_NEWS.slice(0, 40);
const newsSummary = topNews.map((n, i) =>
  `${i + 1}. [${n.source}] ${n.title} — Impact: ${n.impact}, Sentiment: ${n.sentiment}\nRezumat: ${n.summary}`
).join("\n\n");

const sys = `Ești un MARKET & NEWS ANALYST SENIOR pentru un desk de tranzacționare global. Scopul tău este să generezi un Daily Market Brief scurt și foarte concis.
Fiecare câmp 'markdown' din JSON trebuie să fie o analiză esențializată de MAXIM 50-70 de cuvinte.`;

const usr = `Generează Daily Market Brief pentru ziua de azi. Folosește aceste știri (top 40):
${newsSummary}`;

const schema = {
  type: "object",
  properties: {
    headline: { type: "string" },
    snapshot: { type: "string" },
    macroSentiment: { type: "string" },
    equities: { type: "string" },
    ratesFx: { type: "string" },
    commoditiesCrypto: { type: "string" },
    topNews: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          impact: { type: "string" }
        }
      }
    },
    riskScenarios: { type: "string" },
    sectorHeatmap: { type: "string" }
  }
};

async function test() {
  console.time("OpenAI");
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: usr }
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "daily_brief", schema: schema as any, strict: true }
    },
    temperature: 0.3,
  });
  console.timeEnd("OpenAI");
  console.log("Tokens:", completion.usage);
}
test().catch(console.error);
