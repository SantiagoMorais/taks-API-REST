import http from "node:http";

const tasks = [];

const port = 3333;
const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "POST" && url === "/tasks") {
    return res
      .setHeader("Content-type", "application/json; charset=utf-8")
      .writeHead(200)
      .end(JSON.stringify(tasks));
  }

  if (method === "GET" && url === "/tasks") {
    tasks.push({
      id: 1,
      title: "levar cachorro para passear",
      description: "Às 16h",
    });
    return res.writeHead(201).end(JSON.stringify(tasks));
  }

  return res.end("Hello World");
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
