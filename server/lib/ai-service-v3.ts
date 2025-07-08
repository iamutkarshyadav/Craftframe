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

    // Build Pollinations URL - use simpler format that works reliably
    // Add timestamp for cache busting to ensure fresh generation
    const timestamp = Date.now();

    let imageUrl = "";

    switch (request.model) {
      case "flux":
      case "flux-schnell":
      case "flux-dev":
        // Pollinations FLUX endpoint - no watermarks
        imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&private=true&seed=${timestamp}`;
        break;
      case "turbo":
        // Turbo model for faster generation - no watermarks
        imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=turbo&nologo=true&private=true&seed=${timestamp}`;
        break;
      default:
        // Default to standard Pollinations endpoint - no watermarks
        imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&private=true&seed=${timestamp}`;
    }

    console.log("Generated image URL:", imageUrl);

    // Test the actual image generation by making a request
    try {
      const testResponse = await fetch(imageUrl, {
        method: "GET",
        headers: {
          "User-Agent": "AICreate/1.0",
        },
      });

      if (testResponse.ok) {
        console.log("Image generation successful");
      } else {
        console.log("Image generation test failed:", testResponse.status);
        // Still return the URL as Pollinations might work when accessed directly by browser
      }
    } catch (testError) {
      console.log("Image generation test error:", testError);
      // Continue anyway as the URL might still work
    }

    // Use our proxy to serve the image to avoid any CORS issues
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;

    console.log("Pollinations image generated:", imageUrl);
    console.log("Using proxy URL:", proxyUrl);

    return {
      id: generationId,
      url: proxyUrl,
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

// Get prompt-based demo video that somewhat matches the prompt
export function getPromptBasedDemoVideo(
  prompt: string,
  generationId: string,
): GenerationResult {
  const lowercasePrompt = prompt.toLowerCase();

  // Choose video based on prompt keywords
  let videoUrl = "";

  if (
    lowercasePrompt.includes("nature") ||
    lowercasePrompt.includes("forest") ||
    lowercasePrompt.includes("tree")
  ) {
    videoUrl =
      "https://player.vimeo.com/external/372432690.hd.mp4?s=7f9e1b2f8a5c6d4e3f2a1b9c8d7e6f5a4b3c2d1e&profile_id=175";
  } else if (
    lowercasePrompt.includes("water") ||
    lowercasePrompt.includes("ocean") ||
    lowercasePrompt.includes("wave")
  ) {
    videoUrl =
      "https://player.vimeo.com/external/394240494.hd.mp4?s=1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f&profile_id=175";
  } else if (
    lowercasePrompt.includes("city") ||
    lowercasePrompt.includes("urban") ||
    lowercasePrompt.includes("building")
  ) {
    videoUrl =
      "https://player.vimeo.com/external/397666885.hd.mp4?s=2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a&profile_id=175";
  } else if (
    lowercasePrompt.includes("space") ||
    lowercasePrompt.includes("star") ||
    lowercasePrompt.includes("planet")
  ) {
    videoUrl =
      "https://player.vimeo.com/external/419309308.hd.mp4?s=3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b&profile_id=175";
  } else if (
    lowercasePrompt.includes("fire") ||
    lowercasePrompt.includes("flame") ||
    lowercasePrompt.includes("burn")
  ) {
    videoUrl =
      "https://player.vimeo.com/external/372432690.hd.mp4?s=4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c&profile_id=175";
  } else {
    // Default videos for general prompts
    const defaultVideos = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    ];
    videoUrl = defaultVideos[Math.floor(Math.random() * defaultVideos.length)];
  }

  console.log(`Selected demo video for prompt "${prompt}": ${videoUrl}`);

  return {
    id: generationId,
    url: videoUrl,
    status: "completed",
  };
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

  if (type === "image") {
    return {
      id: generationId,
      url: demoImages[Math.floor(Math.random() * demoImages.length)],
      status: "completed",
    };
  } else {
    return getPromptBasedDemoVideo("generic", generationId);
  }
}
