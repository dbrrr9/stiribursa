import m from './.vercel/output/functions/__server.func/index.mjs';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';

const socket = new Socket();
const req = new IncomingMessage(socket);
req.method = 'GET';
req.url = '/_server/?_serverFnId=fetchLatestNews&_serverFnName=fetchLatestNews';
req.headers = {
  host: 'localhost',
  accept: 'application/json'
};

const res = new ServerResponse(req);
let body = '';
res.write = (chunk) => { body += chunk; return true; };
res.end = (chunk) => { if (chunk) body += chunk; console.log(res.statusCode, body); };

m.default(req, res);
