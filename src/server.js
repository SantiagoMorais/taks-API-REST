import http from "node:http";

const port = 3333;
const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "POST" && url === "/tasks") {
    return res.end("Tasks creation route")
  }

  if (method === "GET" && url === "/tasks") {
    return res.end("Tasks list route")
  }

  return res.end("Hello World");
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
