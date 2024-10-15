import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";

const port = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = url.match(route.path);
    req.params = { ...routeParams.groups };

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
