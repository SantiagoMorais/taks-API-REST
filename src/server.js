import http from "node:http";
import { Buffer } from "node:buffer";
import { routes } from "./routes.js";

const port = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  
  const buffers = [];
  
  const route = routes.find((route) => {
    return route.method === method && route.path === url;
  });
  
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  if (route) {
    return route.handler(req, res);
  }
  
  return res.writeHead(404).end();
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
