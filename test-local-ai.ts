import "dotenv/config";
import { getDailyBrief, analyzeArticle } from "./src/lib/news.functions";

async function run() {
  console.log("Starting analyzeArticle...");
  try {
    const res = await analyzeArticle({ data: {
      id: "test1",
      title: "Test title",
      source: "Test source",
      summary: "Test summary",
      url: "http://test.com",
      timestamp: "2024-01-01",
      themes: [],
      regions: [],
      impact: "high",
      sentiment: "bullish",
      rawHtml: ""
    } } as any);
    console.log("analyzeArticle output:", res);
  } catch (err) {
    console.error("analyzeArticle error:", err);
  }

  console.log("Starting getDailyBrief...");
  try {
    const briefRes = await getDailyBrief({} as any);
    console.log("getDailyBrief output:", briefRes);
  } catch (err) {
    console.error("getDailyBrief error:", err);
  }
}
run();
