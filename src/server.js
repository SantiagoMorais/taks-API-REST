import http from "node:http";
import { randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";

const port = 3333;
const tasks = [];

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  if (method === "GET" && url === "/tasks") {
    return res
      .setHeader("Content-type", "application/json; charset=utf-8")
      .writeHead(200)
      .end(JSON.stringify(tasks));
  }

  if (method === "POST" && url === "/tasks") {
    const { title, description } = req.body;

    tasks.push({
      id: randomUUID(),
      title,
      description,
    });
    return res.writeHead(201).end();
  }

  return res.end("Hello World");
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
