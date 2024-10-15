import { randomUUID } from "node:crypto";
import { Database } from "./database.js";

const db = new Database();

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      const tasks = db.select("tasks");
      return res
        .setHeader("Content-type", "application/json; charset=utf-8")
        .writeHead(200)
        .end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: "/tasks",
    handler: (req, res) => {
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
    },
  },
];
