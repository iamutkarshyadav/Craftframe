export interface ShowcaseContent {
  id: string;
  type: "image" | "video";
  url: string;
  prompt: string;
  model: string;
  style?: string;
  aspectRatio: string;
  featured?: boolean;
}

export const showcaseContent: ShowcaseContent[] = [
  {
    id: "showcase-1",
    type: "image",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "A majestic dragon soaring through ethereal clouds at golden sunset, digital art masterpiece",
    model: "Flux Dev",
    style: "Digital Art",
    aspectRatio: "16:9",
    featured: true,
  },
  {
    id: "showcase-2",
    type: "image",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "Futuristic cyberpunk metropolis with neon-lit skyscrapers and flying vehicles, concept art",
    model: "Flux Dev",
    style: "Concept Art",
    aspectRatio: "16:9",
    featured: true,
  },
  {
    id: "showcase-3",
    type: "image",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "Serene mountain landscape reflected in crystal-clear alpine lake, photography style",
    model: "Stable Diffusion XL",
    style: "Photography",
    aspectRatio: "16:9",
  },
  {
    id: "showcase-4",
    type: "image",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "Abstract geometric patterns in vibrant electric blues and purples, modern art",
    model: "Flux Dev",
    style: "Abstract Art",
    aspectRatio: "16:9",
  },
  {
    id: "showcase-5",
    type: "image",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "Enchanted forest with luminescent mushrooms and magical floating particles, fantasy art",
    model: "Flux Dev",
    style: "Fantasy Art",
    aspectRatio: "16:9",
    featured: true,
  },
  {
    id: "showcase-6",
    type: "image",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "Astronaut floating in space with Earth and stars in background, cinematic lighting",
    model: "Stable Diffusion XL",
    style: "Cinematic",
    aspectRatio: "16:9",
  },
  {
    id: "showcase-7",
    type: "image",
    url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "Ancient temple ruins overgrown with tropical vegetation, atmospheric lighting",
    model: "Flux Dev",
    style: "Atmospheric",
    aspectRatio: "16:9",
  },
  {
    id: "showcase-8",
    type: "image",
    url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "Mechanical steampunk robot with intricate brass gears and copper pipes, detailed illustration",
    model: "Flux Dev",
    style: "Steampunk",
    aspectRatio: "16:9",
  },
  {
    id: "showcase-9",
    type: "video",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    prompt:
      "Ocean waves gently crashing on pristine beach at sunset, cinematic slow motion",
    model: "Wan2.1 T2V 14B",
    aspectRatio: "16:9",
    featured: true,
  },
  {
    id: "showcase-10",
    type: "image",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format&q=85",
    prompt:
      "Northern lights dancing over snow-covered mountains, long exposure photography",
    model: "Stable Diffusion XL",
    style: "Photography",
    aspectRatio: "16:9",
    featured: true,
  },
];

// Get featured content for carousel
export const getFeaturedContent = () => {
  return showcaseContent.filter((item) => item.featured);
};

// Get all content sorted by type
export const getContentByType = (type: "image" | "video") => {
  return showcaseContent.filter((item) => item.type === type);
};

// Get random showcase content
export const getRandomContent = (count: number = 6) => {
  const shuffled = [...showcaseContent].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
