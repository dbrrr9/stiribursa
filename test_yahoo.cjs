const yahooFinance = require("yahoo-finance2").default;

async function test() {
  try {
    const symbols = ["^GSPC", "^DJI", "^IXIC", "GC=F", "SI=F", "CL=F", "EURUSD=X", "BTC-USD"];
    const quotes = await yahooFinance.quote(symbols);
    console.log("Success:", quotes.map(q => `${q.symbol}: ${q.regularMarketPrice}`));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
