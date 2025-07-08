import { GenerationRequest, GenerationResult } from "./ai-service-production";

// Enhanced Hugging Face video generation with multiple models
export async function generateVideoWithHuggingFace(
  request: GenerationRequest,
): Promise<GenerationResult> {
  const generationId = `hf_vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const HF_TOKEN = process.env.HUGGING_FACE_API_KEY;

  if (!HF_TOKEN) {
    throw new Error("Hugging Face API key not configured");
  }

  // Advanced video models with better quality
  const videoModels = [
    {
      id: "stabilityai/stable-video-diffusion-img2vid-xt",
      name: "Stable Video Diffusion",
      maxFrames: 25,
      quality: "high",
    },
    {
      id: "ali-vilab/text-to-video-ms-1.7b",
      name: "Text-to-Video MS",
      maxFrames: 16,
      quality: "medium",
    },
    {
      id: "damo-vilab/text-to-video-ms-1.7b",
      name: "DAMO Text-to-Video",
      maxFrames: 16,
      quality: "medium",
    },
    {
      id: "cerspense/zeroscope_v2_576w",
      name: "Zeroscope V2",
      maxFrames: 24,
      quality: "good",
    },
  ];

  console.log("Starting Hugging Face video generation:", request);

  for (const model of videoModels) {
    try {
      console.log(`Trying model: ${model.name}`);

      const frames = Math.min(
        (request.duration || 3) * (request.fps || 8),
        model.maxFrames,
      );

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: request.prompt,
            parameters: {
              num_frames: frames,
              num_inference_steps: 25,
              guidance_scale: 15,
              fps: request.fps || 8,
              width: 576,
              height: 320,
            },
            options: {
              wait_for_model: true,
              use_cache: false,
            },
          }),
        },
      );

      console.log(`Response status for ${model.name}:`, response.status);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        console.log("Content type:", contentType);

        if (
          contentType &&
          (contentType.includes("video") ||
            contentType.includes("octet-stream") ||
            contentType.includes("application/octet-stream"))
        ) {
          const blob = await response.blob();

          if (blob.size > 1000) {
            // Check if we got actual video data
            const buffer = await blob.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            const videoUrl = `data:video/mp4;base64,${base64}`;

            console.log(`Successfully generated video with ${model.name}`);
            console.log(`Video size: ${blob.size} bytes`);

            return {
              id: generationId,
              url: videoUrl,
              status: "completed",
              metadata: {
                source: "huggingface",
                model: model.name,
                model_id: model.id,
                duration: request.duration,
                fps: request.fps,
                frames: frames,
                quality: model.quality,
                size: blob.size,
              },
            };
          } else {
            console.log(`${model.name} returned empty or invalid video data`);
          }
        } else {
          console.log(
            `${model.name} returned non-video content type: ${contentType}`,
          );

          // Try to parse error message
          try {
            const errorText = await response.text();
            console.log(`${model.name} response:`, errorText);
          } catch (e) {
            console.log(`Could not parse ${model.name} response`);
          }
        }
      } else {
        const errorText = await response.text();
        console.log(
          `${model.name} failed with status ${response.status}:`,
          errorText,
        );
      }
    } catch (error) {
      console.log(`Error with model ${model.name}:`, error);
      continue;
    }
  }

  throw new Error("All Hugging Face video models failed to generate content");
}

// Check if Hugging Face is properly configured
export function isHuggingFaceConfigured(): boolean {
  return !!process.env.HUGGING_FACE_API_KEY;
}

// Get available video models
export function getAvailableVideoModels() {
  return [
    {
      id: "huggingface",
      name: "Hugging Face Models",
      description: "Multiple AI video generation models",
      credits: 4,
      quality: "Professional",
      available: isHuggingFaceConfigured(),
    },
  ];
}
