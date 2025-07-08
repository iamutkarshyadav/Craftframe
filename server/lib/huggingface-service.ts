import { InferenceClient } from "@huggingface/inference";
import sharp from "sharp";

const HF_TOKEN = process.env.HF_TOKEN || "demo-key";
const client = new InferenceClient(HF_TOKEN);

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
  url?: string;
  base64?: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  error?: string;
}

// Image Generation using Flux model
export async function generateImage(prompt: string): Promise<GenerationResult> {
  const generationId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    if (HF_TOKEN === "demo-key") {
      // Demo mode - return placeholder
      console.log("Demo mode: Using placeholder image for prompt:", prompt);

      const demoImages = [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&h=1024&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1024&h=1024&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1024&h=1024&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1024&h=1024&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1024&h=1024&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1024&h=1024&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1024&h=1024&fit=crop&auto=format",
      ];

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const randomImage =
        demoImages[Math.floor(Math.random() * demoImages.length)];

      return {
        id: generationId,
        url: randomImage,
        status: "completed",
        progress: 100,
      };
    }

    console.log("Generating image with Flux model for prompt:", prompt);

    // Real Hugging Face API call using Flux model
    const response = await fetch(
      "https://router.huggingface.co/fal-ai/fal-ai/flux/dev",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          sync_mode: true,
          prompt: prompt,
          image_size: "landscape_4_3",
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          enable_safety_checker: true,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.images && result.images.length > 0) {
      // Return the first generated image
      return {
        id: generationId,
        url: result.images[0].url,
        status: "completed",
        progress: 100,
      };
    } else {
      throw new Error("No images generated");
    }
  } catch (error) {
    console.error("Image generation error:", error);
    return {
      id: generationId,
      status: "failed",
      error: error instanceof Error ? error.message : "Image generation failed",
    };
  }
}

// Video Generation using Wan2.1-T2V-14B model
export async function generateVideo(prompt: string): Promise<GenerationResult> {
  const generationId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    if (HF_TOKEN === "demo-key") {
      // Demo mode - return placeholder
      console.log("Demo mode: Using placeholder video for prompt:", prompt);

      const demoVideos = [
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        "https://player.vimeo.com/external/474755324.sd.mp4?s=8b2c8d9c7e4f6a5b3c2d1e9f8g7h6i5j&profile_id=164",
      ];

      // Simulate longer processing for video
      await new Promise((resolve) => setTimeout(resolve, 8000));

      const randomVideo =
        demoVideos[Math.floor(Math.random() * demoVideos.length)];

      return {
        id: generationId,
        url: randomVideo,
        status: "completed",
        progress: 100,
      };
    }

    console.log(
      "Generating video with Wan2.1-T2V-14B model for prompt:",
      prompt,
    );

    // Real Hugging Face API call using Wan2.1-T2V-14B model
    const video = await client.textToVideo({
      provider: "novita",
      model: "Wan-AI/Wan2.1-T2V-14B",
      inputs: prompt,
    });

    if (!video || !video.video) {
      throw new Error("Video generation failed");
    }

    return {
      id: generationId,
      url: video.video, // Direct link to .mp4 or stream
      status: "completed",
      progress: 100,
    };
  } catch (error) {
    console.error("Video generation error:", error);
    return {
      id: generationId,
      status: "failed",
      error: error instanceof Error ? error.message : "Video generation failed",
    };
  }
}

// Image optimization using Sharp
export async function optimizeImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(imageBuffer)
      .resize(1024, 1024, {
        fit: "cover",
        position: "center",
      })
      .webp({
        quality: 85,
        effort: 6,
      })
      .toBuffer();
  } catch (error) {
    console.error("Image optimization error:", error);
    return imageBuffer; // Return original if optimization fails
  }
}

// Convert image to base64 for API response
export function imageToBase64(buffer: Buffer, format: string = "webp"): string {
  return `data:image/${format};base64,${buffer.toString("base64")}`;
}

// Queue system for managing generations
class HuggingFaceQueue {
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
          result = await generateImage(item.request.prompt);
        } else {
          result = await generateVideo(item.request.prompt);
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

export const huggingFaceQueue = new HuggingFaceQueue();

// Get available models with real HF model information
export const getHuggingFaceModels = () => {
  return {
    image: [
      {
        id: "flux-dev",
        name: "Flux Dev",
        description: "High-quality image generation with Flux model",
        cost: 2,
        provider: "fal-ai",
      },
      {
        id: "stable-diffusion-xl",
        name: "Stable Diffusion XL",
        description: "Reliable SDXL image generation",
        cost: 1,
        provider: "stabilityai",
      },
    ],
    video: [
      {
        id: "wan21-t2v-14b",
        name: "Wan2.1 T2V 14B",
        description: "Advanced text-to-video generation",
        cost: 8,
        provider: "Wan-AI",
      },
      {
        id: "stable-video-diffusion",
        name: "Stable Video Diffusion",
        description: "Generate short video clips from text",
        cost: 5,
        provider: "stabilityai",
      },
    ],
  };
};
