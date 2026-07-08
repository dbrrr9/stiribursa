import yahooFinance from 'yahoo-finance2';

async function test() {
  try {
    const res = await yahooFinance.quote('AAPL');
    console.log(res);
  } catch (err) {
    console.error("ERROR TYPE:", err.name);
    console.error("ERROR MESSAGE:", err.message);
  }
}

test();
