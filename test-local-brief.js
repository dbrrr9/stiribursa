import "dotenv/config";
import { getDailyBrief } from "./src/lib/news.functions.ts";

async function test() {
  console.time("getDailyBrief");
  try {
    const briefRes = await getDailyBrief({} as any);
    console.timeEnd("getDailyBrief");
    console.log("getDailyBrief output:", briefRes);
  } catch (err) {
    console.timeEnd("getDailyBrief");
    console.error("getDailyBrief error:", err);
  }
}
test();
