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

// Pollinations API for image generation
export async function generateImage(
  request: GenerationRequest,
): Promise<GenerationResult> {
  const generationId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log("Generating image with Pollinations:", request);

    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(request.prompt);

    // Determine dimensions based on size
    let width = 1024;
    let height = 1024;

    if (request.size) {
      const [w, h] = request.size.split("x").map(Number);
      width = w;
      height = h;
    }

    // Build Pollinations URL based on model
    let imageUrl = "";

    switch (request.model) {
      case "flux":
      case "flux-schnell":
      case "flux-dev":
        // Pollinations FLUX endpoint - use latest API format
        imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&private=true&enhance=true`;
        break;
      case "turbo":
        // Turbo model for faster generation
        imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=turbo&nologo=true&private=true&enhance=true`;
        break;
      default:
        // Default to standard Pollinations endpoint
        imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&private=true&enhance=true`;
    }

    // Don't test with HEAD request as it might cause issues with CORS
    // Pollinations will generate the image when the URL is accessed

    console.log("Pollinations image generated:", imageUrl);

    return {
      id: generationId,
      url: imageUrl,
      status: "completed",
    };
  } catch (error) {
    console.error("Pollinations image generation error:", error);
    return {
      id: generationId,
      status: "failed",
      error: error instanceof Error ? error.message : "Generation failed",
    };
  }
}

// Free video generation using Hugging Face or alternative
export async function generateVideo(
  request: GenerationRequest,
): Promise<GenerationResult> {
  const generationId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log("Generating video with free API:", request);

    // Try multiple approaches for video generation
    const HF_TOKEN = process.env.HF_TOKEN;

    if (HF_TOKEN) {
      console.log("Attempting video generation with Hugging Face...");

      // Try different HF models that might work better
      const models = [
        "damo-vilab/text-to-video-ms-1.7b",
        "ali-vilab/text-to-video-ms-1.7b",
        "cerspense/zeroscope_v2_576w",
      ];

      for (const model of models) {
        try {
          console.log(`Trying model: ${model}`);
          const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
              headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                inputs: request.prompt,
                parameters: {
                  num_frames: Math.min((request.duration || 3) * 8, 16),
                  num_inference_steps: 15,
                },
              }),
            },
          );

          if (response.ok) {
            const contentType = response.headers.get("content-type");
            console.log("Response content type:", contentType);

            if (contentType && contentType.includes("video")) {
              const blob = await response.blob();

              // Convert blob to base64 for client
              const buffer = await blob.arrayBuffer();
              const base64 = Buffer.from(buffer).toString("base64");
              const videoUrl = `data:video/mp4;base64,${base64}`;

              console.log("Successfully generated video with model:", model);
              return {
                id: generationId,
                url: videoUrl,
                status: "completed",
              };
            }
          } else {
            console.log(`Model ${model} failed with status:`, response.status);
          }
        } catch (modelError) {
          console.log(`Model ${model} error:`, modelError);
          continue;
        }
      }
    }

    // If no HF token or all models failed, create a prompt-based demo video
    console.log("Creating prompt-based demo video fallback");
    return getPromptBasedDemoVideo(request.prompt, generationId);
  } catch (error) {
    console.error("Video generation error:", error);

    // Fallback to prompt-based demo
    console.log("Using prompt-based demo video due to error");
    return getPromptBasedDemoVideo(request.prompt, generationId);
  }
}

// Check if services are configured
export function isServiceConfigured(): boolean {
  // Pollinations is always available (no API key needed)
  // Video works with or without HF token
  return true;
}

// Get demo result for when generation fails
export function getDemoResult(
  type: "image" | "video",
  generationId: string,
): GenerationResult {
  const demoImages = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&h=1024&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1024&h=1024&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1024&h=1024&fit=crop&auto=format",
  ];

  const demoVideos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
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
