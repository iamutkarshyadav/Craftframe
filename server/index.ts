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
import {
  handleImageGeneration,
  handleImageStatus,
  handleDirectImageGeneration,
} from "./routes/generate-image";
import {
  handleVideoGeneration,
  handleVideoStatus,
  handleDirectVideoGeneration,
} from "./routes/generate-video";
import {
  handleImageGeneration as handleStudioImageGeneration,
  handleVideoGeneration as handleStudioVideoGeneration,
  handleGetImageStatus as handleStudioImageStatus,
  handleGetVideoStatus as handleStudioVideoStatus,
} from "./routes/studio";
import {
  getUserGenerations,
  getUserStats,
  toggleFavorite,
} from "./routes/dashboard";

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

  // Generation routes (legacy)
  app.post("/api/generate", handleGenerate);
  app.get("/api/generate/:id", handleGenerationStatus);
  app.get("/api/generations", handleGenerationHistory);
  app.post("/api/generations/:id/like", handleToggleLike);
  app.get("/api/models", handleGetModels);
  app.get("/api/queue", handleQueueStatus);

  // Hugging Face specific routes
  app.post("/api/generate/image", handleImageGeneration);
  app.get("/api/generate/image/:id", handleImageStatus);
  app.post("/api/generate/video", handleVideoGeneration);
  app.get("/api/generate/video/:id", handleVideoStatus);

  // Direct generation routes (for testing)
  app.post("/api/direct/image", handleDirectImageGeneration);
  app.post("/api/direct/video", handleDirectVideoGeneration);

  // Studio routes (new clean API)
  app.post("/api/studio/image", handleStudioImageGeneration);
  app.post("/api/studio/video", handleStudioVideoGeneration);
  app.get("/api/studio/image/:id", handleStudioImageStatus);
  app.get("/api/studio/video/:id", handleStudioVideoStatus);

  // Dashboard routes
  app.get("/api/dashboard/generations", getUserGenerations);
  app.get("/api/dashboard/stats", getUserStats);
  app.post("/api/dashboard/generations/:id/favorite", toggleFavorite);

  return app;
}
