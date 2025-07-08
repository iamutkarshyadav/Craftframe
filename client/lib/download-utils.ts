// Download utilities for generated content with multiple format support

export interface DownloadOptions {
  format: "original" | "jpg" | "png" | "webp" | "mp4" | "gif" | "webm";
  quality?: number;
  width?: number;
  height?: number;
  filename?: string;
}

export interface GenerationDownload {
  id: string;
  type: "image" | "video";
  url: string;
  prompt: string;
  model: string;
  createdAt: string;
}

// Convert blob URL to downloadable file
export const downloadFromUrl = async (
  url: string,
  filename: string,
): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download file");
  }
};

// Generate filename with timestamp and metadata
export const generateFilename = (
  generation: GenerationDownload,
  format: string,
): string => {
  const date = new Date(generation.createdAt);
  const timestamp = date.toISOString().slice(0, 19).replace(/[:]/g, "-");
  const promptWords = generation.prompt
    .split(" ")
    .slice(0, 3)
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();

  return `aicreate-${generation.type}-${promptWords}-${timestamp}.${format}`;
};

// Download with format conversion (client-side for images)
export const downloadWithFormat = async (
  generation: GenerationDownload,
  options: DownloadOptions,
): Promise<void> => {
  try {
    if (generation.type === "video") {
      // For videos, we need server-side conversion or use original format
      const filename = generateFilename(generation, "mp4");
      await downloadFromUrl(generation.url, filename);
      return;
    }

    // For images, we can do client-side conversion
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          // Set canvas dimensions
          canvas.width = options.width || img.naturalWidth;
          canvas.height = options.height || img.naturalHeight;

          // Draw image to canvas
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Determine output format and quality
          let mimeType = "image/png";
          let extension = "png";

          switch (options.format) {
            case "jpg":
              mimeType = "image/jpeg";
              extension = "jpg";
              break;
            case "webp":
              mimeType = "image/webp";
              extension = "webp";
              break;
            case "png":
            default:
              mimeType = "image/png";
              extension = "png";
              break;
          }

          // Convert to blob and download
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const filename = generateFilename(generation, extension);

                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                resolve();
              } else {
                reject(new Error("Failed to convert image"));
              }
            },
            mimeType,
            options.quality || 0.9,
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = generation.url;
    });
  } catch (error) {
    console.error("Download with format failed:", error);
    throw error;
  }
};

// Download original file
export const downloadOriginal = async (
  generation: GenerationDownload,
): Promise<void> => {
  const extension = generation.type === "image" ? "png" : "mp4";
  const filename = generateFilename(generation, extension);
  await downloadFromUrl(generation.url, filename);
};

// Batch download multiple generations
export const downloadBatch = async (
  generations: GenerationDownload[],
  options?: DownloadOptions,
): Promise<void> => {
  const downloadPromises = generations.map((generation, index) => {
    return new Promise<void>((resolve, reject) => {
      // Add delay between downloads to avoid overwhelming the browser
      setTimeout(async () => {
        try {
          if (options) {
            await downloadWithFormat(generation, options);
          } else {
            await downloadOriginal(generation);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      }, index * 500); // 500ms delay between downloads
    });
  });

  await Promise.all(downloadPromises);
};

// Create ZIP file for batch download (requires JSZip library)
export const downloadAsZip = async (
  generations: GenerationDownload[],
  zipName: string = "aicreate-generations",
): Promise<void> => {
  try {
    // Note: JSZip would need to be installed separately
    // For now, we'll use individual downloads
    console.log("ZIP download requested for:", generations.length, "files");
    await downloadBatch(generations);
    const zip = new JSZip();

    const downloadPromises = generations.map(async (generation) => {
      try {
        const response = await fetch(generation.url);
        const blob = await response.blob();
        const extension = generation.type === "image" ? "png" : "mp4";
        const filename = generateFilename(generation, extension);
        zip.file(filename, blob);
      } catch (error) {
        console.error(`Failed to add ${generation.id} to zip:`, error);
      }
    });

    await Promise.all(downloadPromises);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${zipName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("ZIP download failed:", error);
    throw new Error("Failed to create ZIP file");
  }
};

// Get available download formats based on content type
export const getAvailableFormats = (type: "image" | "video"): string[] => {
  if (type === "image") {
    return ["original", "png", "jpg", "webp"];
  } else {
    return ["original", "mp4", "gif", "webm"];
  }
};

// Estimate file size for different formats
export const estimateFileSize = (
  generation: GenerationDownload,
  format: string,
): string => {
  // These are rough estimates based on typical compression ratios
  const baseSize = generation.type === "image" ? 2 : 10; // MB

  const sizeMultipliers: Record<string, number> = {
    original: 1.0,
    png: 1.0,
    jpg: 0.3,
    webp: 0.25,
    mp4: 1.0,
    gif: 2.0,
    webm: 0.8,
  };

  const multiplier = sizeMultipliers[format] || 1.0;
  const estimatedSize = baseSize * multiplier;

  if (estimatedSize < 1) {
    return `${Math.round(estimatedSize * 1024)} KB`;
  } else {
    return `${estimatedSize.toFixed(1)} MB`;
  }
};

// Track download analytics
export const trackDownload = (
  generation: GenerationDownload,
  format: string,
): void => {
  try {
    const downloadEvent = {
      timestamp: new Date().toISOString(),
      generationId: generation.id,
      type: generation.type,
      format,
      model: generation.model,
    };

    // Save to localStorage for analytics
    const downloads = JSON.parse(
      localStorage.getItem("aicreate-downloads") || "[]",
    );
    downloads.push(downloadEvent);

    // Keep only last 100 downloads
    if (downloads.length > 100) {
      downloads.splice(0, downloads.length - 100);
    }

    localStorage.setItem("aicreate-downloads", JSON.stringify(downloads));
  } catch (error) {
    console.error("Failed to track download:", error);
  }
};

// Get download statistics
export const getDownloadStats = (): {
  totalDownloads: number;
  byType: Record<string, number>;
  byFormat: Record<string, number>;
} => {
  try {
    const downloads = JSON.parse(
      localStorage.getItem("aicreate-downloads") || "[]",
    );

    const stats = {
      totalDownloads: downloads.length,
      byType: {} as Record<string, number>,
      byFormat: {} as Record<string, number>,
    };

    downloads.forEach((download: any) => {
      stats.byType[download.type] = (stats.byType[download.type] || 0) + 1;
      stats.byFormat[download.format] =
        (stats.byFormat[download.format] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("Failed to get download stats:", error);
    return {
      totalDownloads: 0,
      byType: {},
      byFormat: {},
    };
  }
};
