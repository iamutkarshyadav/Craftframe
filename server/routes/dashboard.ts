import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { findUserById, findGenerationsByUserId } from "../lib/database";

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

// Get user's generations
export const getUserGenerations = [
  authenticate,
  async (req: any, res: any) => {
    try {
      const user = req.user;
      const { type, limit = 50, offset = 0 } = req.query;

      let generations = findGenerationsByUserId(user.id);

      // Filter by type if specified
      if (type && (type === "image" || type === "video")) {
        generations = generations.filter((gen) => gen.type === type);
      }

      // Apply pagination
      const total = generations.length;
      const paginatedGenerations = generations.slice(
        parseInt(offset),
        parseInt(offset) + parseInt(limit),
      );

      res.json({
        generations: paginatedGenerations,
        total,
        hasMore: parseInt(offset) + parseInt(limit) < total,
      });
    } catch (error) {
      console.error("Get user generations error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Get user stats
export const getUserStats = [
  authenticate,
  async (req: any, res: any) => {
    try {
      const user = req.user;
      const generations = findGenerationsByUserId(user.id);

      const stats = {
        totalGenerations: generations.length,
        totalImages: generations.filter((g) => g.type === "image").length,
        totalVideos: generations.filter((g) => g.type === "video").length,
        creditsUsed: generations.reduce((sum, g) => sum + g.cost, 0),
        creditsRemaining: user.credits,
        favoriteGenerations: generations.filter((g) => g.liked).length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Toggle favorite status
export const toggleFavorite = [
  authenticate,
  async (req: any, res: any) => {
    try {
      const user = req.user;
      const { id } = req.params;

      const generations = findGenerationsByUserId(user.id);
      const generation = generations.find((g) => g.id === id);

      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      // Toggle liked status (this would need to be implemented in the database)
      // For now, we'll return success
      res.json({ success: true, liked: !generation.liked });
    } catch (error) {
      console.error("Toggle favorite error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
