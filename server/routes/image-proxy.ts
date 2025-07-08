import { RequestHandler } from "express";

// Proxy images through our server to avoid CORS issues
export const handleImageProxy: RequestHandler = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "URL parameter required" });
    }

    // Only allow pollinations.ai URLs for security
    if (!url.includes("pollinations.ai")) {
      return res
        .status(403)
        .json({ message: "Only pollinations.ai URLs allowed" });
    }

    console.log("Proxying image:", url);

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        message: `Failed to fetch image: ${response.statusText}`,
      });
    }

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=31536000");

    // Pipe the image data
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Image proxy error:", error);
    res.status(500).json({ message: "Failed to proxy image" });
  }
};
