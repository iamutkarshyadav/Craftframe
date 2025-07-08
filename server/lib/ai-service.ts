// AI generation service integrating with Hugging Face and other providers
// For production, add proper API keys and error handling

export interface GenerationRequest {
  type: "image" | "video";
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  style?: string;
  quality?: string;
  duration?: number;
}

export interface GenerationResult {
  id: string;
  url: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  error?: string;
}

// Hugging Face API configuration
const HF_API_URL = "https://api-inference.huggingface.co/models";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || "demo-key";

// Stability AI configuration (if available)
const STABILITY_API_KEY = process.env.STABILITY_API_KEY || "demo-key";

// Mock generation for demo purposes (replace with real API calls)
export const generateImage = async (
  request: GenerationRequest,
): Promise<GenerationResult> => {
  const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // For demo, we'll use placeholder images
    // In production, replace with actual Hugging Face or Stability AI calls

    if (process.env.NODE_ENV === "production" && HF_API_KEY !== "demo-key") {
      // Real Hugging Face API call
      const response = await fetch(
        `${HF_API_URL}/runwayml/stable-diffusion-v1-5`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: request.prompt,
            parameters: {
              width: request.width || 512,
              height: request.height || 512,
              num_inference_steps: 50,
              guidance_scale: 7.5,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      return {
        id: generationId,
        url: imageUrl,
        status: "completed",
        progress: 100,
      };
    } else {
      // Demo mode - return placeholder images based on prompt keywords
      const demoImages = [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=512&h=512&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=512&h=512&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=512&h=512&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=512&h=512&fit=crop",
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=512&h=512&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop",
      ];

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const randomImage =
        demoImages[Math.floor(Math.random() * demoImages.length)];

      return {
        id: generationId,
        url: randomImage,
        status: "completed",
        progress: 100,
      };
    }
  } catch (error) {
    console.error("Image generation error:", error);
    return {
      id: generationId,
      url: "",
      status: "failed",
      error: error instanceof Error ? error.message : "Generation failed",
    };
  }
};

export const generateVideo = async (
  request: GenerationRequest,
): Promise<GenerationResult> => {
  const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // For demo, we'll use placeholder videos
    // In production, integrate with Runway ML, Pika Labs, or other video AI services

    const demoVideos = [
      "https://player.vimeo.com/external/474755324.sd.mp4?s=8b2c8d9c7e4f6a5b3c2d1e9f8g7h6i5j&profile_id=164",
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    ];

    // Simulate longer processing for video
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const randomVideo =
      demoVideos[Math.floor(Math.random() * demoVideos.length)];

    return {
      id: generationId,
      url: randomVideo,
      status: "completed",
      progress: 100,
    };
  } catch (error) {
    console.error("Video generation error:", error);
    return {
      id: generationId,
      url: "",
      status: "failed",
      error: error instanceof Error ? error.message : "Generation failed",
    };
  }
};

// Get available models
export const getAvailableModels = () => {
  return {
    image: [
      {
        id: "stable-diffusion-xl",
        name: "Stable Diffusion XL",
        description: "High-quality image generation with excellent detail",
        cost: 2,
      },
      {
        id: "stable-diffusion-v1-5",
        name: "Stable Diffusion v1.5",
        description: "Fast and reliable image generation",
        cost: 1,
      },
      {
        id: "dall-e-3",
        name: "DALL-E 3",
        description: "Advanced AI image generation by OpenAI",
        cost: 3,
      },
    ],
    video: [
      {
        id: "stable-video-diffusion",
        name: "Stable Video Diffusion",
        description: "Generate short video clips from text prompts",
        cost: 5,
      },
      {
        id: "runway-gen2",
        name: "Runway Gen-2",
        description: "High-quality text-to-video generation",
        cost: 8,
      },
    ],
  };
};

// Queue system for managing generations
class GenerationQueue {
  private queue: Array<{
    id: string;
    request: GenerationRequest;
    userId: string;
    resolve: (result: GenerationResult) => void;
    reject: (error: Error) => void;
  }> = [];
  private processing = false;

  async addToQueue(
    request: GenerationRequest,
    userId: string,
  ): Promise<GenerationResult> {
    return new Promise((resolve, reject) => {
      const id = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.queue.push({ id, request, userId, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;

      try {
        let result: GenerationResult;
        if (item.request.type === "image") {
          result = await generateImage(item.request);
        } else {
          result = await generateVideo(item.request);
        }
        item.resolve(result);
      } catch (error) {
        item.reject(error as Error);
      }
    }

    this.processing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

export const generationQueue = new GenerationQueue();
