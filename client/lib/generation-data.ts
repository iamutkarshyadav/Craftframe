export interface GenerationTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  type: "image" | "video";
  style?: string;
  aspectRatio?: string;
  tags: string[];
  featured?: boolean;
  thumbnail?: string;
}

export interface PromptEnhancer {
  category: string;
  items: string[];
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  prompt_suffix: string;
  preview: string;
  type: "image" | "video" | "both";
}

export interface AspectRatio {
  id: string;
  name: string;
  value: string;
  width: number;
  height: number;
  description: string;
}

// Prompt enhancers for better generation
export const promptEnhancers: PromptEnhancer[] = [
  {
    category: "Lighting",
    items: [
      "golden hour lighting",
      "dramatic shadows",
      "soft diffused light",
      "cinematic lighting",
      "volumetric lighting",
      "neon lighting",
      "backlit",
      "rim lighting",
      "studio lighting",
      "natural sunlight",
    ],
  },
  {
    category: "Style",
    items: [
      "hyperrealistic",
      "photorealistic",
      "digital art",
      "concept art",
      "oil painting",
      "watercolor",
      "pencil sketch",
      "vector art",
      "minimalist",
      "abstract",
    ],
  },
  {
    category: "Mood",
    items: [
      "dramatic",
      "serene",
      "mysterious",
      "vibrant",
      "melancholic",
      "energetic",
      "peaceful",
      "intense",
      "dreamy",
      "futuristic",
    ],
  },
  {
    category: "Quality",
    items: [
      "8K resolution",
      "highly detailed",
      "sharp focus",
      "professional photography",
      "award winning",
      "masterpiece",
      "ultra realistic",
      "intricate details",
      "perfect composition",
      "stunning visual",
    ],
  },
  {
    category: "Camera",
    items: [
      "wide angle shot",
      "close-up portrait",
      "aerial view",
      "macro photography",
      "shallow depth of field",
      "long exposure",
      "fisheye lens",
      "telephoto lens",
      "bird's eye view",
      "low angle shot",
    ],
  },
];

// Style presets for quick application
export const stylePresets: StylePreset[] = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Ultra-realistic photography style",
    prompt_suffix:
      ", photorealistic, highly detailed, 8K resolution, professional photography",
    preview:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop",
    type: "both",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Movie-like dramatic lighting and composition",
    prompt_suffix:
      ", cinematic lighting, dramatic shadows, film grain, movie still, epic composition",
    preview:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=150&fit=crop",
    type: "both",
  },
  {
    id: "anime",
    name: "Anime Style",
    description: "Japanese animation art style",
    prompt_suffix:
      ", anime art style, vibrant colors, cel shading, manga style, detailed anime",
    preview:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop",
    type: "image",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic neon-lit aesthetic",
    prompt_suffix:
      ", cyberpunk style, neon lights, dark atmosphere, futuristic, sci-fi, blade runner aesthetic",
    preview:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=150&fit=crop",
    type: "both",
  },
  {
    id: "fantasy",
    name: "Fantasy Art",
    description: "Magical and mystical artwork",
    prompt_suffix:
      ", fantasy art, magical atmosphere, ethereal lighting, mystical, enchanted",
    preview:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&h=150&fit=crop",
    type: "image",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean and simple design",
    prompt_suffix:
      ", minimalist design, clean composition, simple, elegant, white background",
    preview:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=150&h=150&fit=crop",
    type: "image",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Retro and nostalgic style",
    prompt_suffix:
      ", vintage style, retro aesthetic, film grain, faded colors, nostalgic",
    preview:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop",
    type: "both",
  },
  {
    id: "abstract",
    name: "Abstract Art",
    description: "Non-representational artistic style",
    prompt_suffix:
      ", abstract art, geometric shapes, vibrant colors, modern art, artistic composition",
    preview:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=150&h=150&fit=crop",
    type: "image",
  },
];

// Aspect ratios with detailed information
export const aspectRatios: AspectRatio[] = [
  {
    id: "1:1",
    name: "Square",
    value: "1:1",
    width: 1024,
    height: 1024,
    description: "Perfect for social media posts and profile pictures",
  },
  {
    id: "16:9",
    name: "Landscape",
    value: "16:9",
    width: 1920,
    height: 1080,
    description: "Standard widescreen format for videos and monitors",
  },
  {
    id: "9:16",
    name: "Portrait",
    value: "9:16",
    width: 1080,
    height: 1920,
    description: "Mobile-first format for stories and vertical videos",
  },
  {
    id: "4:3",
    name: "Standard",
    value: "4:3",
    width: 1600,
    height: 1200,
    description: "Classic photo format, great for prints",
  },
  {
    id: "3:2",
    name: "Photo",
    value: "3:2",
    width: 1800,
    height: 1200,
    description: "Standard camera sensor ratio",
  },
  {
    id: "21:9",
    name: "Ultra Wide",
    value: "21:9",
    width: 2560,
    height: 1080,
    description: "Cinematic ultra-wide format",
  },
];

// Comprehensive template library
export const generationTemplates: GenerationTemplate[] = [
  // Social Media Templates
  {
    id: "instagram-post",
    name: "Instagram Post",
    category: "Social Media",
    prompt:
      "Create a stunning [subject] for Instagram, vibrant colors, trendy aesthetic, high engagement potential",
    type: "image",
    style: "photorealistic",
    aspectRatio: "1:1",
    tags: ["social", "instagram", "trendy"],
    featured: true,
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&h=150&fit=crop",
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    category: "Social Media",
    prompt:
      "Eye-catching YouTube thumbnail featuring [subject], bold text overlay, bright colors, click-worthy design, dramatic lighting",
    type: "image",
    style: "cinematic",
    aspectRatio: "16:9",
    tags: ["youtube", "thumbnail", "clickable"],
    featured: true,
    thumbnail:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=150&h=150&fit=crop",
  },
  {
    id: "tiktok-video",
    name: "TikTok Video Style",
    category: "Social Media",
    prompt:
      "Trendy TikTok-style video featuring [subject], dynamic movement, modern aesthetic, mobile-optimized",
    type: "video",
    style: "cinematic",
    aspectRatio: "9:16",
    tags: ["tiktok", "vertical", "trendy"],
    thumbnail:
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=150&h=150&fit=crop",
  },

  // Marketing & Ads
  {
    id: "product-showcase",
    name: "Product Showcase",
    category: "Marketing",
    prompt:
      "Professional product photography of [product], clean white background, studio lighting, commercial quality, high detail",
    type: "image",
    style: "photorealistic",
    aspectRatio: "1:1",
    tags: ["product", "commercial", "professional"],
    featured: true,
    thumbnail:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
  },
  {
    id: "brand-banner",
    name: "Brand Banner",
    category: "Marketing",
    prompt:
      "Modern brand banner featuring [brand/product], premium design, professional typography, corporate aesthetic",
    type: "image",
    style: "minimalist",
    aspectRatio: "21:9",
    tags: ["banner", "brand", "corporate"],
    thumbnail:
      "https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=150&fit=crop",
  },
  {
    id: "promotional-video",
    name: "Promotional Video",
    category: "Marketing",
    prompt:
      "Engaging promotional video showcasing [product/service], smooth transitions, professional quality, marketing-focused",
    type: "video",
    style: "cinematic",
    aspectRatio: "16:9",
    tags: ["promo", "marketing", "commercial"],
    thumbnail:
      "https://images.unsplash.com/photo-1560472354-a8b7b3e0e6e7?w=150&h=150&fit=crop",
  },

  // Art & Creative
  {
    id: "fantasy-character",
    name: "Fantasy Character",
    category: "Art & Creative",
    prompt:
      "Epic fantasy character portrait, [character description], magical atmosphere, detailed armor/clothing, dramatic lighting",
    type: "image",
    style: "fantasy",
    aspectRatio: "3:2",
    tags: ["fantasy", "character", "portrait"],
    featured: true,
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop",
  },
  {
    id: "digital-artwork",
    name: "Digital Artwork",
    category: "Art & Creative",
    prompt:
      "Stunning digital artwork of [subject], vibrant colors, artistic composition, contemporary art style, gallery worthy",
    type: "image",
    style: "abstract",
    aspectRatio: "4:3",
    tags: ["digital", "art", "creative"],
    thumbnail:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=150&h=150&fit=crop",
  },
  {
    id: "concept-art",
    name: "Concept Art",
    category: "Art & Creative",
    prompt:
      "Professional concept art of [subject], detailed illustration, game/movie quality, dramatic composition",
    type: "image",
    style: "cinematic",
    aspectRatio: "16:9",
    tags: ["concept", "illustration", "professional"],
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop",
  },

  // Wallpapers & Backgrounds
  {
    id: "desktop-wallpaper",
    name: "Desktop Wallpaper",
    category: "Wallpapers",
    prompt:
      "Stunning desktop wallpaper featuring [theme], high resolution, beautiful composition, desktop optimized",
    type: "image",
    style: "photorealistic",
    aspectRatio: "16:9",
    tags: ["wallpaper", "desktop", "background"],
    featured: true,
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop",
  },
  {
    id: "mobile-wallpaper",
    name: "Mobile Wallpaper",
    category: "Wallpapers",
    prompt:
      "Beautiful mobile wallpaper of [subject], portrait orientation, vibrant colors, mobile optimized",
    type: "image",
    style: "minimalist",
    aspectRatio: "9:16",
    tags: ["mobile", "wallpaper", "portrait"],
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop",
  },

  // Logo & Branding
  {
    id: "logo-design",
    name: "Logo Design",
    category: "Branding",
    prompt:
      "Modern logo design for [company/brand], minimalist style, professional, scalable vector design, brand identity",
    type: "image",
    style: "minimalist",
    aspectRatio: "1:1",
    tags: ["logo", "brand", "identity"],
    thumbnail:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop",
  },
  {
    id: "brand-identity",
    name: "Brand Identity",
    category: "Branding",
    prompt:
      "Complete brand identity package for [business], cohesive design system, professional appearance",
    type: "image",
    style: "minimalist",
    aspectRatio: "4:3",
    tags: ["brand", "identity", "package"],
    thumbnail:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop",
  },
];

// Random prompt generators
export const surprisePrompts = [
  "A cyberpunk samurai in a neon-lit Tokyo alley during a thunderstorm",
  "Magical floating islands connected by rainbow bridges in a cotton candy sky",
  "Steampunk mechanical dragon breathing golden fire in a Victorian workshop",
  "Underwater city with bioluminescent coral buildings and merpeople swimming",
  "Post-apocalyptic librarian reading in a greenhouse filled with books and plants",
  "Crystal cave with glowing gems and a mystical portal to another dimension",
  "Space station bar where aliens and humans share drinks under starlight",
  "Enchanted forest where trees have glowing eyes and mushrooms sing melodies",
  "Retro-futuristic diner on Mars with Earth visible through the window",
  "Time traveler's workshop with clocks from different eras floating in zero gravity",
];

// Helper functions
export const getTemplatesByCategory = (category: string) => {
  return generationTemplates.filter(
    (template) => template.category === category,
  );
};

export const getFeaturedTemplates = () => {
  return generationTemplates.filter((template) => template.featured);
};

export const getTemplatesByType = (type: "image" | "video") => {
  return generationTemplates.filter((template) => template.type === type);
};

export const getRandomSurprisePrompt = () => {
  return surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
};

export const enhancePrompt = (basePrompt: string, enhancers: string[]) => {
  return `${basePrompt}, ${enhancers.join(", ")}`;
};

export const getAllCategories = () => {
  return [...new Set(generationTemplates.map((template) => template.category))];
};
