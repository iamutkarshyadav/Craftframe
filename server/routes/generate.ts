import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import {
  findUserById,
  updateUser,
  createGeneration,
  findGenerationsByUserId,
  findGenerationById,
  updateGeneration,
} from "../lib/database";
import {
  generationQueue,
  getAvailableModels,
  GenerationRequest,
} from "../lib/ai-service";

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

// Generate content (image or video)
export const handleGenerate: RequestHandler = [
  authenticate,
  async (req, res) => {
    try {
      const user = (req as any).user;
      const { type, prompt, model, style, width, height, quality, duration } =
        req.body as GenerationRequest & {
          style?: string;
          quality?: string;
        };

      if (!type || !prompt) {
        return res
          .status(400)
          .json({ message: "Type and prompt are required" });
      }

      if (type !== "image" && type !== "video") {
        return res
          .status(400)
          .json({ message: "Type must be 'image' or 'video'" });
      }

      // Calculate cost based on type and model
      const models = getAvailableModels();
      const availableModels = models[type];
      const selectedModel =
        availableModels.find((m) => m.id === model) || availableModels[0];
      const cost = selectedModel.cost;

      // Check if user has enough credits
      if (user.credits < cost) {
        return res
          .status(400)
          .json({ message: "Insufficient credits", required: cost });
      }

      // Create generation record
      const generation = createGeneration({
        userId: user.id,
        type,
        prompt,
        model: selectedModel.name,
        url: "",
        status: "pending",
        cost,
      });

      // Deduct credits immediately
      updateUser(user.id, { credits: user.credits - cost });

      // Add to generation queue
      const request: GenerationRequest = {
        type,
        prompt,
        model: selectedModel.id,
        width,
        height,
        style,
        quality,
        duration,
      };

      // Process generation asynchronously
      generationQueue
        .addToQueue(request, user.id)
        .then((result) => {
          updateGeneration(generation.id, {
            url: result.url,
            status: result.status,
          });
        })
        .catch((error) => {
          console.error("Generation failed:", error);
          updateGeneration(generation.id, {
            status: "failed",
          });
          // Refund credits on failure
          const currentUser = findUserById(user.id);
          if (currentUser) {
            updateUser(user.id, { credits: currentUser.credits + cost });
          }
        });

      res.status(201).json({
        id: generation.id,
        status: "pending",
        estimatedTime: type === "image" ? "30-60 seconds" : "2-5 minutes",
        cost,
      });
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Get generation status
export const handleGenerationStatus: RequestHandler = [
  authenticate,
  async (req, res) => {
    try {
      const user = (req as any).user;
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
        type: generation.type,
        prompt: generation.prompt,
        model: generation.model,
        status: generation.status,
        url: generation.url,
        createdAt: generation.createdAt,
        cost: generation.cost,
      });
    } catch (error) {
      console.error("Get generation status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Get user's generation history
export const handleGenerationHistory: RequestHandler = [
  authenticate,
  async (req, res) => {
    try {
      const user = (req as any).user;
      const { page = 1, limit = 20 } = req.query;

      const generations = findGenerationsByUserId(user.id);
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedGenerations = generations.slice(startIndex, endIndex);

      res.json({
        generations: paginatedGenerations.map((gen) => ({
          id: gen.id,
          type: gen.type,
          prompt: gen.prompt,
          model: gen.model,
          status: gen.status,
          url: gen.url,
          createdAt: gen.createdAt,
          cost: gen.cost,
          liked: gen.liked,
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: generations.length,
          totalPages: Math.ceil(generations.length / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Get generation history error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Toggle like on generation
export const handleToggleLike: RequestHandler = [
  authenticate,
  async (req, res) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const generation = findGenerationById(id);
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      if (generation.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedGeneration = updateGeneration(id, {
        liked: !generation.liked,
      });

      res.json({
        id: updatedGeneration!.id,
        liked: updatedGeneration!.liked,
      });
    } catch (error) {
      console.error("Toggle like error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Get available models
export const handleGetModels: RequestHandler = (req, res) => {
  try {
    const models = getAvailableModels();
    res.json(models);
  } catch (error) {
    console.error("Get models error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get queue status
export const handleQueueStatus: RequestHandler = (req, res) => {
  try {
    res.json({
      queueLength: generationQueue.getQueueLength(),
      estimatedWaitTime:
        generationQueue.getQueueLength() > 0
          ? `${generationQueue.getQueueLength() * 30} seconds`
          : "No wait",
    });
  } catch (error) {
    console.error("Get queue status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
