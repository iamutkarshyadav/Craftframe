import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleRegister,
  handleLogin,
  handleMe,
  handleLogout,
} from "./routes/auth";
import {
  handleGenerate,
  handleGenerationStatus,
  handleGenerationHistory,
  handleToggleLike,
  handleGetModels,
  handleQueueStatus,
} from "./routes/generate";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "AICreate API is running!" });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/me", handleMe);
  app.post("/api/auth/logout", handleLogout);

  // Generation routes
  app.post("/api/generate", handleGenerate);
  app.get("/api/generate/:id", handleGenerationStatus);
  app.get("/api/generations", handleGenerationHistory);
  app.post("/api/generations/:id/like", handleToggleLike);
  app.get("/api/models", handleGetModels);
  app.get("/api/queue", handleQueueStatus);

  return app;
}
