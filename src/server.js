import http from "node:http";

const port = 3333;
const server = http.createServer((req, res) => {
  return res.end("Hello World");
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
