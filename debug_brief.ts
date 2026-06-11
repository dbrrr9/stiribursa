
import { getDailyBrief } from './src/lib/news.functions';

async function run() {
  console.log("Starting brief generation...");
  const res = await getDailyBrief();
  console.log("Result:", res);
}
run();
