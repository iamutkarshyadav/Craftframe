import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import {
  findUserById,
  updateUser,
  createGeneration,
  updateGeneration,
  findGenerationById,
} from "../lib/database";
import {
  generateImage,
  generateVideo,
  isServiceConfigured,
  getDemoResult,
  GenerationRequest,
} from "../lib/ai-service-v3";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

// Middleware to authenticate user
const authenticate: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Generate image
export const handleImageGeneration = [
  authenticate,
  async (req: any, res: any) => {
    try {
      const user = req.user;
      const { prompt, model = "flux-schnell", size = "1024x1024" } = req.body;

      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      if (prompt.length > 500) {
        return res.status(400).json({
          message: "Prompt must be less than 500 characters",
        });
      }

      // Check credits
      const cost = 1;
      if (user.credits < cost) {
        return res.status(400).json({
          message: "Insufficient credits",
          required: cost,
          available: user.credits,
        });
      }

      // Create generation record
      const generation = createGeneration({
        userId: user.id,
        type: "image",
        prompt: prompt.trim(),
        model: model,
        url: "",
        status: "pending",
        cost,
      });

      // Deduct credits
      updateUser(user.id, { credits: user.credits - cost });

      // Start generation
      const request: GenerationRequest = {
        prompt: prompt.trim(),
        model,
        size,
      };

      // Generate image with Pollinations
      console.log("Using Pollinations API for image generation");
      // Simulate small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await generateImage(request);

      // Update generation with result
      updateGeneration(generation.id, {
        url: result.url || "",
        status: result.status === "completed" ? "completed" : "failed",
      });

      if (result.status === "failed") {
        // Refund credits on failure
        const currentUser = findUserById(user.id);
        if (currentUser) {
          updateUser(user.id, { credits: currentUser.credits + cost });
        }
      }

      res.json({
        id: generation.id,
        url: result.url,
        status: result.status,
        message:
          result.status === "completed"
            ? "Image generated successfully"
            : "Image generation failed",
      });
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Generate video
export const handleVideoGeneration = [
  authenticate,
  async (req: any, res: any) => {
    try {
      const user = req.user;
      const { prompt, model = "stable-video", duration = 3 } = req.body;

      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      if (prompt.length > 500) {
        return res.status(400).json({
          message: "Prompt must be less than 500 characters",
        });
      }

      // Check credits
      const cost = 3;
      if (user.credits < cost) {
        return res.status(400).json({
          message: "Insufficient credits",
          required: cost,
          available: user.credits,
        });
      }

      // Create generation record
      const generation = createGeneration({
        userId: user.id,
        type: "video",
        prompt: prompt.trim(),
        model: model,
        url: "",
        status: "pending",
        cost,
      });

      // Deduct credits
      updateUser(user.id, { credits: user.credits - cost });

      // Start generation
      const request: GenerationRequest = {
        prompt: prompt.trim(),
        model,
        duration,
      };

      // Generate video with free API
      console.log("Using free video generation API");
      // Simulate delay for video processing
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = await generateVideo(request);

      // Update generation with result
      updateGeneration(generation.id, {
        url: result.url || "",
        status: result.status === "completed" ? "completed" : "failed",
      });

      if (result.status === "failed") {
        // Refund credits on failure
        const currentUser = findUserById(user.id);
        if (currentUser) {
          updateUser(user.id, { credits: currentUser.credits + cost });
        }
      }

      res.json({
        id: generation.id,
        url: result.url,
        status: result.status,
        message:
          result.status === "completed"
            ? "Video generated successfully"
            : "Video generation failed",
      });
    } catch (error) {
      console.error("Video generation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Get generation status
export const handleGetImageStatus = [
  authenticate,
  async (req: any, res: any) => {
    try {
      const user = req.user;
      const { id } = req.params;

      const generation = findGenerationById(id);
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      if (generation.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({
        id: generation.id,
        status: generation.status,
        url: generation.url,
        prompt: generation.prompt,
        model: generation.model,
        createdAt: generation.createdAt,
      });
    } catch (error) {
      console.error("Get image status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Get video generation status (same as image for now)
export const handleGetVideoStatus = handleGetImageStatus;
