import yahooFinance from 'yahoo-finance2';
async function test() {
  try {
    const quotes = await yahooFinance.quote(['AAPL']);
    console.log(quotes);
  } catch(e) {
    console.log(e);
  }
}
test();
