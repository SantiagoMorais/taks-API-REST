import http from "node:http";
import { randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";
import { Database } from "./database.js";

const port = 3333;
const db = new Database();

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
    const tasks = db.select("tasks");
    return res
      .setHeader("Content-type", "application/json; charset=utf-8")
      .writeHead(200)
      .end(JSON.stringify(tasks));
  }

  if (method === "POST" && url === "/tasks") {
    const { title, description } = req.body;
    const now = new Date();

    const formattedDateTime = {
      date: now.toLocaleDateString("pt-BR"),
      hour: now.toLocaleTimeString("pt-BR"),
    };

    const task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: formattedDateTime,
      updated_at: formattedDateTime,
    };

    db.insert("tasks", task);

    return res.writeHead(201).end();
  }

  return res.writeHead(404).end();
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
