import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const port = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = url.match(route.path);
    const { query, ...params } = routeParams.groups || {};

    req.params = params;
    req.query = query ? extractQueryParams(routeParams.groups.query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});