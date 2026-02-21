import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DATA_FILE = path.join(process.cwd(), "data.json");

  app.use(cors());
  app.use(bodyParser.json());

  // API to get site data
  app.get("/api/data", (req, res) => {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  // API to update site data
  app.post("/api/data", (req, res) => {
    try {
      const newData = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
      res.json({ message: "Data updated successfully", data: newData });
    } catch (error) {
      res.status(500).json({ error: "Failed to update data" });
    }
  });

  // Simple Login API
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // For demo purposes, using hardcoded credentials. 
    // In a real app, use environment variables and hashed passwords.
    if (username === "admin" && password === "admin123") {
      res.json({ success: true, token: "demo-token-123" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
