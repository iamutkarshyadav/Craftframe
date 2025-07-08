import Replicate from "replicate";

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export interface GenerationRequest {
  prompt: string;
  model: string;
  size?: string;
  duration?: number;
}

export interface GenerationResult {
  id: string;
  url?: string;
  status: "generating" | "completed" | "failed";
  error?: string;
}

// Image generation with FLUX models
export async function generateImage(
  request: GenerationRequest,
): Promise<GenerationResult> {
  const generationId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log("Generating image with:", request);

    let modelName = "";
    let input: any = {
      prompt: request.prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio:
        request.size === "1344x768"
          ? "16:9"
          : request.size === "768x1344"
            ? "9:16"
            : "1:1",
      output_format: "png",
      output_quality: 90,
    };

    // Select model based on request
    switch (request.model) {
      case "flux-schnell":
        modelName = "black-forest-labs/flux-schnell";
        break;
      case "flux-dev":
        modelName = "black-forest-labs/flux-dev";
        input.guidance_scale = 3.5;
        input.num_inference_steps = 28;
        break;
      case "sdxl":
        modelName =
          "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
        input = {
          prompt: request.prompt,
          width: request.size?.split("x")[0] || "1024",
          height: request.size?.split("x")[1] || "1024",
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 20,
          guidance_scale: 7.5,
        };
        break;
      default:
        modelName = "black-forest-labs/flux-schnell";
    }

    console.log("Using model:", modelName);
    console.log("Input:", input);

    // Run the model
    const output = await replicate.run(modelName as any, { input });

    console.log("Replicate output:", output);

    // Handle the output
    let imageUrl = "";
    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (typeof output === "string") {
      imageUrl = output;
    }

    if (!imageUrl) {
      throw new Error("No image URL returned from model");
    }

    return {
      id: generationId,
      url: imageUrl,
      status: "completed",
    };
  } catch (error) {
    console.error("Image generation error:", error);
    return {
      id: generationId,
      status: "failed",
      error: error instanceof Error ? error.message : "Generation failed",
    };
  }
}

// Video generation with Stable Video
export async function generateVideo(
  request: GenerationRequest,
): Promise<GenerationResult> {
  const generationId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log("Generating video with:", request);

    let modelName = "";
    let input: any = {
      prompt: request.prompt,
    };

    // Select model based on request
    switch (request.model) {
      case "stable-video":
        modelName =
          "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4919c746077d054f2c4d50b8ee2a8c8dc2b646";
        input = {
          input_image: `https://via.placeholder.com/1024x576/000000/FFFFFF?text=${encodeURIComponent(request.prompt)}`,
          sizing_strategy: "maintain_aspect_ratio",
          frames_per_second: 6,
          motion_bucket_id: 127,
          noise_aug_strength: 0.02,
        };
        break;
      case "animatediff":
        // For now, use a simpler approach for video
        modelName =
          "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f";
        input = {
          prompt: request.prompt,
          num_frames: request.duration ? request.duration * 8 : 24,
          num_inference_steps: 25,
          guidance_scale: 7.5,
        };
        break;
      default:
        // Fallback to a working text-to-video model
        modelName =
          "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351";
        input = {
          prompt: request.prompt,
          width: 1024,
          height: 576,
          num_frames: request.duration ? request.duration * 8 : 24,
          num_inference_steps: 20,
        };
    }

    console.log("Using video model:", modelName);
    console.log("Input:", input);

    // Run the model
    const output = await replicate.run(modelName as any, { input });

    console.log("Video output:", output);

    // Handle the output
    let videoUrl = "";
    if (Array.isArray(output) && output.length > 0) {
      videoUrl = output[0];
    } else if (typeof output === "string") {
      videoUrl = output;
    }

    if (!videoUrl) {
      throw new Error("No video URL returned from model");
    }

    return {
      id: generationId,
      url: videoUrl,
      status: "completed",
    };
  } catch (error) {
    console.error("Video generation error:", error);
    return {
      id: generationId,
      status: "failed",
      error: error instanceof Error ? error.message : "Generation failed",
    };
  }
}

// Check if Replicate is configured
export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN;
}

// Get demo result for when API is not configured
export function getDemoResult(
  type: "image" | "video",
  generationId: string,
): GenerationResult {
  const demoImages = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&h=1024&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1024&h=1024&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop&auto=format",
  ];

  const demoVideos = [
    "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  ];

  if (type === "image") {
    return {
      id: generationId,
      url: demoImages[Math.floor(Math.random() * demoImages.length)],
      status: "completed",
    };
  } else {
    return {
      id: generationId,
      url: demoVideos[Math.floor(Math.random() * demoVideos.length)],
      status: "completed",
    };
  }
}
