import handler from './.netlify/functions-internal/server/server.mjs';

const request = new Request('http://localhost/?q=&src=%5B%5D&th=%5B%5D&imp=%5B%5D&sort=newest', {
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
