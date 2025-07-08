import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import {
  findUserById,
  updateUser,
  createGeneration,
  updateGeneration,
} from "../lib/database";
import {
  generateImage,
  optimizeImage,
  imageToBase64,
  huggingFaceQueue,
} from "../lib/huggingface-service";

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

// Generate image using Hugging Face Flux model
export const handleImageGeneration = [
  authenticate,
  async (req: any, res: any) => {
    try {
      const user = req.user;
      const { prompt, style, aspectRatio, model = "flux-dev" } = req.body;

      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      if (prompt.length > 500) {
        return res.status(400).json({
          message: "Prompt must be less than 500 characters",
        });
      }

      // Calculate cost based on model
      const cost = model === "flux-dev" ? 2 : 1;

      // Check if user has enough credits
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
        model: model === "flux-dev" ? "Flux Dev" : "Stable Diffusion XL",
        url: "",
        status: "pending",
        cost,
      });

      // Deduct credits immediately
      updateUser(user.id, { credits: user.credits - cost });

      res.status(202).json({
        id: generation.id,
        status: "pending",
        message: "Image generation started",
        estimatedTime: "30-60 seconds",
        cost,
        queuePosition: huggingFaceQueue.getQueueLength() + 1,
      });

      // Process generation asynchronously
      try {
        updateGeneration(generation.id, { status: "processing" });

        const result = await generateImage(prompt.trim());

        if (result.status === "completed" && result.url) {
          updateGeneration(generation.id, {
            url: result.url,
            status: "completed",
          });
        } else {
          throw new Error(result.error || "Image generation failed");
        }
      } catch (error) {
        console.error("Image generation failed:", error);
        updateGeneration(generation.id, {
          status: "failed",
        });

        // Refund credits on failure
        const currentUser = findUserById(user.id);
        if (currentUser) {
          updateUser(user.id, { credits: currentUser.credits + cost });
        }
      }
    } catch (error) {
      console.error("Image generation endpoint error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Get image generation status
export const handleImageStatus = [
  authenticate,
  async (req: any, res: any) => {
    try {
      const user = req.user;
      const { id } = req.params;

      const generation = await import("../lib/database").then((db) =>
        db.findGenerationById(id),
      );

      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      if (generation.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (generation.type !== "image") {
        return res.status(400).json({ message: "Not an image generation" });
      }

      res.json({
        id: generation.id,
        status: generation.status,
        url: generation.url,
        prompt: generation.prompt,
        model: generation.model,
        cost: generation.cost,
        createdAt: generation.createdAt,
        updatedAt: generation.updatedAt,
      });
    } catch (error) {
      console.error("Image status endpoint error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Direct image generation for quick testing (optional)
export const handleDirectImageGeneration: RequestHandler = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    console.log("Direct image generation request:", prompt);

    const result = await generateImage(prompt);

    if (result.status === "completed") {
      res.json({
        success: true,
        url: result.url,
        base64: result.base64,
        generationId: result.id,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Direct image generation error:", error);
    res.status(500).json({
      success: false,
      error: "Image generation failed",
    });
  }
};
