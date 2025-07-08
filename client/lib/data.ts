export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline";
}

export interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

export interface GeneratedContent {
  id: string;
  type: "image" | "video";
  url: string;
  prompt: string;
  model: string;
  createdAt: string;
  liked?: boolean;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  prompt: string;
  type: "image" | "video";
  preview?: string;
}

export const features: Feature[] = [
  {
    icon: "Image",
    title: "Text to Image",
    description:
      "Generate stunning images from text prompts using state-of-the-art Stable Diffusion models",
  },
  {
    icon: "Video",
    title: "Text to Video",
    description:
      "Create dynamic videos from descriptions with our advanced video generation AI",
  },
  {
    icon: "Zap",
    title: "Lightning Fast",
    description:
      "Generate content in seconds with our optimized AI infrastructure and queue system",
  },
  {
    icon: "Shield",
    title: "Enterprise Ready",
    description:
      "Secure, scalable, and reliable platform built for teams and businesses",
  },
  {
    icon: "Users",
    title: "Team Collaboration",
    description:
      "Share, organize, and collaborate on AI-generated content with your team",
  },
  {
    icon: "Sparkles",
    title: "Smart Templates",
    description:
      "Pre-built prompts and templates for social media, marketing, and creative projects",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: 0,
    period: "/month",
    description: "Perfect for trying out AI generation",
    features: [
      "10 credits per month",
      "Text to Image generation",
      "Basic templates",
      "Standard quality",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    name: "Creator",
    price: 9.99,
    period: "/month",
    description: "For content creators and freelancers",
    features: [
      "200 credits per month",
      "Text to Image & Video",
      "Premium templates",
      "Priority generation",
      "HD quality output",
    ],
    popular: true,
    buttonText: "Choose Creator",
    buttonVariant: "default",
  },
  {
    name: "Pro",
    price: 29.99,
    period: "/month",
    description: "For teams and businesses",
    features: [
      "1000 credits per month",
      "All generation features",
      "Team collaboration",
      "Advanced editing tools",
      "Priority support",
      "API access",
    ],
    buttonText: "Choose Pro",
    buttonVariant: "outline",
  },
];

export const testimonials: Testimonial[] = [
  {
    content:
      "CraftFrame has revolutionized my content creation workflow. The quality is incredible and it's so fast!",
    author: "Sarah Johnson",
    role: "Content Creator",
    avatar: "SJ",
    rating: 5,
  },
  {
    content:
      "The video generation feature is mind-blowing. We've saved hours on our marketing campaigns.",
    author: "Mike Chen",
    role: "Marketing Director",
    avatar: "MC",
    rating: 5,
  },
  {
    content:
      "Perfect for our agency. The team features and templates have streamlined our entire process.",
    author: "Emily Rodriguez",
    role: "Agency Owner",
    avatar: "ER",
    rating: 5,
  },
];

export const sampleGenerations: GeneratedContent[] = [
  {
    id: "1",
    type: "image",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop",
    prompt: "A majestic dragon soaring through clouds at sunset, digital art",
    model: "Stable Diffusion XL",
    createdAt: "2024-01-15T10:30:00Z",
    liked: true,
  },
  {
    id: "2",
    type: "image",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=512&h=512&fit=crop",
    prompt: "Futuristic cyberpunk cityscape with neon lights, concept art",
    model: "Stable Diffusion XL",
    createdAt: "2024-01-15T11:15:00Z",
  },
  {
    id: "3",
    type: "image",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop",
    prompt:
      "Serene mountain landscape with crystal clear lake, photography style",
    model: "Stable Diffusion XL",
    createdAt: "2024-01-15T12:00:00Z",
    liked: true,
  },
  {
    id: "4",
    type: "video",
    url: "https://player.vimeo.com/external/474755324.sd.mp4?s=8b2c8d9c7e4f6a5b3c2d1e9f8g7h6i5j&profile_id=164",
    prompt: "Ocean waves gently crashing on a pristine beach, cinematic",
    model: "Stable Video Diffusion",
    createdAt: "2024-01-15T13:30:00Z",
  },
  {
    id: "5",
    type: "image",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=512&h=512&fit=crop",
    prompt: "Abstract geometric patterns in vibrant colors, modern art",
    model: "Stable Diffusion XL",
    createdAt: "2024-01-15T14:45:00Z",
  },
  {
    id: "6",
    type: "image",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=512&h=512&fit=crop",
    prompt: "Enchanted forest with magical glowing mushrooms, fantasy art",
    model: "Stable Diffusion XL",
    createdAt: "2024-01-15T15:20:00Z",
    liked: true,
  },
];

export const templates: Template[] = [
  {
    id: "1",
    name: "Instagram Post",
    category: "Social Media",
    prompt:
      "A stunning [subject] in [style] style, perfect for social media, high quality, vibrant colors",
    type: "image",
  },
  {
    id: "2",
    name: "YouTube Thumbnail",
    category: "Social Media",
    prompt:
      "Eye-catching thumbnail featuring [subject], bold text overlay, bright colors, click-worthy design",
    type: "image",
  },
  {
    id: "3",
    name: "Blog Header",
    category: "Web Content",
    prompt:
      "Professional blog header about [topic], clean design, modern typography, web-friendly",
    type: "image",
  },
  {
    id: "4",
    name: "Product Photo",
    category: "E-commerce",
    prompt:
      "Product photography of [product], white background, professional lighting, commercial quality",
    type: "image",
  },
  {
    id: "5",
    name: "Logo Design",
    category: "Branding",
    prompt:
      "Modern logo for [company], minimalist design, vector style, professional branding",
    type: "image",
  },
  {
    id: "6",
    name: "Character Art",
    category: "Creative",
    prompt:
      "Fantasy character design of [character], detailed illustration, digital art, concept art style",
    type: "image",
  },
  {
    id: "7",
    name: "Landscape Scene",
    category: "Nature",
    prompt:
      "Beautiful landscape of [location], golden hour lighting, cinematic composition, high detail",
    type: "image",
  },
  {
    id: "8",
    name: "Social Media Video",
    category: "Video",
    prompt:
      "Engaging video about [topic], smooth transitions, modern editing style, perfect for social media",
    type: "video",
  },
];

export const useCases = [
  {
    title: "Content Creation",
    description:
      "Generate stunning visuals for blogs, social media, and marketing campaigns",
    examples: ["Blog headers", "Social media posts", "Marketing materials"],
  },
  {
    title: "Product Design",
    description:
      "Visualize product concepts and create compelling product photography",
    examples: [
      "Product mockups",
      "Concept visualization",
      "Commercial photography",
    ],
  },
  {
    title: "Creative Projects",
    description:
      "Bring your artistic visions to life with AI-powered creativity",
    examples: ["Digital art", "Character design", "Fantasy illustrations"],
  },
  {
    title: "Business Graphics",
    description:
      "Professional graphics for presentations, websites, and brand materials",
    examples: ["Logo concepts", "Presentation graphics", "Brand assets"],
  },
];
