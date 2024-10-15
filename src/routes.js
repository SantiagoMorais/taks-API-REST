import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-paths.js";

const db = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = db.select(
        "tasks",
        search ? { title: search, description: search } : null
      );

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) return res.writeHead(400).end("Title is required");
      if (title.length < 2)
        return res
          .writeHead(400)
          .end("The title requires a minimum of 2 characters");
      if (!description)
        return res.writeHead(400).end("Description is required");
      if (description.length < 2)
        return res
          .writeHead(400)
          .end("The description requires a minimum of 2 characters");

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
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const checkId = db.findUnique("tasks", id);

      if (!checkId) {
        return res.writeHead(404).end("Task not found");
      }

      db.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const now = new Date();
      const checkId = db.findUnique("tasks", id);

      if (!checkId) {
        return res.writeHead(404).end("Task not found");
      }

      const updatedData = {};

      if (title) {
        updatedData.title = title;
      }

      if (description) {
        updatedData.description = description;
      }

      if (Object.keys(updatedData).length > 0) {
        updatedData.updated_at = {
          date: now.toLocaleDateString("pt-BR"),
          hour: now.toLocaleTimeString("pt-BR"),
        };

        db.update("tasks", id, updatedData);
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const now = new Date();
      const checkId = db.findUnique("tasks", id);

      if (!checkId) {
        return res.writeHead(404).end("Task not found");
      }

      if (checkId.completed_at !== null) {
        return res.writeHead(400).end("Task already completed");
      }

      db.complete("tasks", id, {
        completed_at: {
          date: now.toLocaleDateString("pt-BR"),
          hour: now.toLocaleTimeString("pt-BR"),
        },
      });

      res.writeHead(204).end();
    },
  },
];
