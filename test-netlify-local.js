import handler from './.netlify/functions-internal/server/server.mjs';

const request = new Request('http://localhost/', {
  method: 'GET',
  headers: {
    'accept': 'text/html',
    'origin': 'http://localhost'
  }
});

handler(request, {}).then(async res => {
  console.log("STATUS:", res.status);
  console.log("HEADERS:", Object.fromEntries(res.headers.entries()));
  console.log("BODY:", await res.text());
}).catch(err => console.error("FATAL:", err));
