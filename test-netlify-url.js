import handler from './.netlify/functions-internal/server/server.mjs';

const request = new Request('http://localhost/.netlify/functions/server?_serverFnId=fetchLatestNews', {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'origin': 'http://localhost'
  }
});

handler(request, {}).then(async res => {
  console.log("STATUS:", res.status);
  console.log("HEADERS:", Object.fromEntries(res.headers.entries()));
  console.log("BODY:", await res.text());
}).catch(err => console.error("FATAL:", err));
