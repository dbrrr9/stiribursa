async function test() {
  try {
    const res = await fetch('http://localhost:8082/_serverFn?_serverFnId=getDailyBrief&_serverFnName=getDailyBrief&payload=%7B%7D', {
      method: 'POST',
      headers: {
        'x-tsr-serverFn': 'true',
        'accept': 'application/json'
      }
    });
    console.log("STATUS:", res.status);
    console.log("BODY:", await res.text());
  } catch (e) {
    console.error(e);
  }
}
test();
