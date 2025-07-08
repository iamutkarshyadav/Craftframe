import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuthModal } from "@/components/auth/auth-modal";
import { ImageCanvas } from "@/components/ui/image-canvas";
import { toast } from "@/hooks/use-toast";
import {
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
  User,
  Zap,
  LogOut,
  Settings,
  Wand2,
  Gauge,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Monitor,
  Smartphone,
  Square,
  Maximize,
  Camera,
  Palette,
  Brush,
  PenTool,
  Globe,
  Cpu,
  Layers,
  Film,
} from "lucide-react";

interface Generation {
  id: string;
  type: "image" | "video";
  prompt: string;
  url: string;
  status: "generating" | "completed" | "failed";
  createdAt: string;
  settings?: any;
  progress?: number;
  metadata?: any;
}

const imageModels = [
  {
    id: "flux-pro",
    name: "FLUX Pro",
    description: "Highest quality, photorealistic images",
    credits: 3,
    quality: "Ultra HD",
  },
  {
    id: "flux-dev",
    name: "FLUX Dev",
    description: "Balanced quality and speed",
    credits: 2,
    quality: "High Quality",
  },
  {
    id: "flux-schnell",
    name: "FLUX Schnell",
    description: "Lightning fast generation",
    credits: 1,
    quality: "Standard",
  },
];

const videoModels = [
  {
    id: "pika",
    name: "Pika Labs",
    description: "Cinematic quality video generation",
    credits: 8,
    quality: "Cinema Grade",
  },
  {
    id: "luma",
    name: "Luma Dream Machine",
    description: "High-quality realistic videos",
    credits: 6,
    quality: "Professional",
  },
  {
    id: "runway",
    name: "Runway Gen-3",
    description: "Advanced video AI model",
    credits: 10,
    quality: "Premium",
  },
  {
    id: "demo",
    name: "Demo Video",
    description: "Preview mode (free)",
    credits: 0,
    quality: "Preview",
  },
];

const imageCategories = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Ultra-realistic photographs",
    icon: Camera,
    examples: ["Portrait", "Landscape", "Product shots"],
  },
  {
    id: "anime",
    name: "Anime/Manga",
    description: "Japanese animation style",
    icon: Sparkles,
    examples: ["Characters", "Scenes", "Fan art"],
  },
  {
    id: "painting",
    name: "Digital Painting",
    description: "Artistic painted style",
    icon: Brush,
    examples: ["Oil painting", "Watercolor", "Acrylic"],
  },
  {
    id: "sketch",
    name: "Sketch/Drawing",
    description: "Hand-drawn line art",
    icon: PenTool,
    examples: ["Pencil sketch", "Ink drawing", "Line art"],
  },
  {
    id: "realistic",
    name: "Real Life",
    description: "Everyday realistic scenes",
    icon: Globe,
    examples: ["Street scenes", "Interior", "Nature"],
  },
  {
    id: "3d-render",
    name: "3D Render",
    description: "3D modeled artwork",
    icon: Cpu,
    examples: ["CGI", "Architecture", "Product viz"],
  },
  {
    id: "abstract",
    name: "Abstract Art",
    description: "Non-representational art",
    icon: Layers,
    examples: ["Geometric", "Color study", "Modern art"],
  },
  {
    id: "fantasy",
    name: "Fantasy Art",
    description: "Magical and fantastical",
    icon: Wand2,
    examples: ["Dragons", "Magic", "Mythical"],
  },
];

const imageSizes = [
  { id: "1024x1024", name: "Square", aspect: "1:1", icon: Square },
  { id: "1344x768", name: "Landscape", aspect: "16:9", icon: Monitor },
  { id: "768x1344", name: "Portrait", aspect: "9:16", icon: Smartphone },
  { id: "1536x1024", name: "Wide", aspect: "3:2", icon: Maximize },
];

const promptTemplates = {
  image: [
    "A majestic [subject] in [environment], [style], highly detailed, professional photography",
    "Beautiful [subject] with [lighting], [camera angle], [style], award-winning composition",
    "Stunning [subject] in [setting], [mood], [art style], masterpiece quality",
  ],
  video: [
    "Smooth camera movement showing [subject] in [environment], [mood], cinematic quality",
    "Time-lapse of [subject] [action] in [setting], [lighting], professional cinematography",
    "Dynamic scene of [subject] with [movement], [atmosphere], film-like quality",
  ],
};

export default function Studio() {
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [currentCanvasIndex, setCurrentCanvasIndex] = useState(0);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Image settings
  const [imageModel, setImageModel] = useState("flux-dev");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [imageCategory, setImageCategory] = useState("photorealistic");
  const [imageSteps, setImageSteps] = useState([20]);
  const [imageCfgScale, setImageCfgScale] = useState([7]);

  // Video settings
  const [videoModel, setVideoModel] = useState("pika");
  const [videoDuration, setVideoDuration] = useState("3");
  const [videoFps, setVideoFps] = useState([24]);

  useEffect(() => {
    if (isAuthenticated) {
      loadRecentGenerations();
    }
  }, [isAuthenticated]);

  const loadRecentGenerations = async () => {
    try {
      const response = await fetch("/api/studio/recent", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGenerations(data.generations || []);
      }
    } catch (error) {
      console.error("Failed to load recent generations:", error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    const selectedModel =
      activeTab === "image"
        ? imageModels.find((m) => m.id === imageModel)
        : videoModels.find((m) => m.id === videoModel);

    const requiredCredits = selectedModel?.credits || 1;

    if ((user?.credits || 0) < requiredCredits) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${requiredCredits} credits for this generation.`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const endpoint =
        activeTab === "image" ? "/api/studio/image" : "/api/studio/video";

      const requestBody = {
        prompt: prompt.trim(),
        model: activeTab === "image" ? imageModel : videoModel,
        ...(activeTab === "image"
          ? {
              size: imageSize,
              category: imageCategory,
              steps: imageSteps[0],
              cfg_scale: imageCfgScale[0],
            }
          : {
              duration: parseInt(videoDuration),
              fps: videoFps[0],
            }),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Generation failed");
      }

      // Add to generations list
      const newGeneration: Generation = {
        id: data.id || Date.now().toString(),
        type: activeTab,
        prompt: prompt.trim(),
        url: data.url || "",
        status: "generating",
        createdAt: new Date().toISOString(),
        settings: requestBody,
        progress: 0,
        metadata: data.metadata,
      };

      setGenerations((prev) => [newGeneration, ...prev]);
      setCurrentCanvasIndex(0); // Show the new generation

      // Poll for completion if we have an ID
      if (data.id) {
        pollGeneration(data.id, activeTab);
      } else if (data.url) {
        // Direct response with URL
        setGenerations((prev) =>
          prev.map((gen) =>
            gen.id === newGeneration.id
              ? { ...gen, url: data.url, status: "completed", progress: 100 }
              : gen,
          ),
        );
      }

      toast({
        title: "Generation Started",
        description: `Your ${activeTab} is being generated...`,
      });

      setPrompt("");
    } catch (err: any) {
      setError(err.message || "Generation failed. Please try again.");
      toast({
        title: "Generation Failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pollGeneration = async (id: string, type: "image" | "video") => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/studio/${type}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          setGenerations((prev) =>
            prev.map((gen) =>
              gen.id === id
                ? {
                    ...gen,
                    url: data.url,
                    status: data.status,
                    progress:
                      data.progress ||
                      (data.status === "completed" ? 100 : gen.progress),
                    metadata: { ...gen.metadata, ...data.metadata },
                  }
                : gen,
            ),
          );

          if (data.status === "completed" || data.status === "failed") {
            if (data.status === "completed") {
              toast({
                title: "Generation Complete",
                description: `Your ${type} has been generated successfully!`,
              });
            }
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    poll();
  };

  const handleDownload = async (generation: Generation) => {
    try {
      const response = await fetch(generation.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `aicreate-${generation.type}-${Date.now()}.${generation.type === "image" ? "png" : "mp4"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your file is downloading...",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (generation: Generation, platform: string) => {
    toast({
      title: "Shared Successfully",
      description: `Image shared to ${platform}`,
    });
  };

  const handleLike = (generation: Generation) => {
    toast({
      title: "Liked",
      description: "Added to your favorites",
    });
  };

  const insertTemplate = (template: string) => {
    setPrompt(template);
  };

  const selectedModel =
    activeTab === "image"
      ? imageModels.find((m) => m.id === imageModel)
      : videoModels.find((m) => m.id === videoModel);

  const selectedCategory = imageCategories.find((c) => c.id === imageCategory);

  // Filter generations for canvas
  const imageGenerations = generations.filter(
    (g) => g.type === "image" && g.status === "completed" && g.url,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AICreate
                </span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4 text-purple-600" />
                <span className="font-semibold">Studio</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      <Monitor className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{user?.credits || 0}</span>
                    <span className="text-sm text-muted-foreground">
                      credits
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Canvas Section */}
          <section>
            <ImageCanvas
              generations={imageGenerations}
              currentIndex={currentCanvasIndex}
              isLoading={isGenerating && activeTab === "image"}
              onIndexChange={setCurrentCanvasIndex}
              onDownload={handleDownload}
              onShare={handleShare}
              onLike={handleLike}
            />
          </section>

          {/* Generation Controls */}
          <section>
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        AI Content Generator
                      </CardTitle>
                      <CardDescription>
                        Create stunning visuals with advanced AI models
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="hidden sm:flex">
                    <Target className="mr-1 h-3 w-3" />
                    {selectedModel?.credits || 0} credits
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Type Selection */}
                <Tabs
                  value={activeTab}
                  onValueChange={(value: any) => setActiveTab(value)}
                >
                  <TabsList className="grid w-full grid-cols-2 h-12">
                    <TabsTrigger
                      value="image"
                      className="flex items-center gap-2 text-base"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Text to Image
                    </TabsTrigger>
                    <TabsTrigger
                      value="video"
                      className="flex items-center gap-2 text-base"
                    >
                      <VideoIcon className="h-4 w-4" />
                      Text to Video
                    </TabsTrigger>
                  </TabsList>

                  {/* Image Generation */}
                  <TabsContent value="image" className="space-y-6 mt-6">
                    {/* Category Selection */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">
                        Choose Art Style
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {imageCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant={
                              imageCategory === category.id
                                ? "default"
                                : "outline"
                            }
                            className={`h-auto p-3 flex flex-col items-center gap-2 ${
                              imageCategory === category.id
                                ? "bg-gradient-to-r from-purple-600 to-blue-600"
                                : ""
                            }`}
                            onClick={() => setImageCategory(category.id)}
                          >
                            <category.icon className="h-5 w-5" />
                            <span className="text-xs font-medium">
                              {category.name}
                            </span>
                          </Button>
                        ))}
                      </div>
                      {selectedCategory && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            {selectedCategory.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Examples: {selectedCategory.examples.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Prompt Input */}
                    <div className="space-y-4">
                      <Label
                        htmlFor="prompt"
                        className="text-base font-semibold"
                      >
                        Describe what you want to create
                      </Label>

                      <Textarea
                        id="prompt"
                        placeholder={`Create a ${selectedCategory?.name.toLowerCase()} image of...`}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px] text-base resize-none"
                        maxLength={1000}
                      />
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{prompt.length}/1000 characters</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrompt("")}
                          disabled={!prompt}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    {/* Model and Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">AI Model</Label>
                        <Select
                          value={imageModel}
                          onValueChange={setImageModel}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {imageModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div className="flex items-center justify-between w-full">
                                  <div>
                                    <div className="font-medium">
                                      {model.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {model.description}
                                    </div>
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {model.credits} credits
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {model.quality}
                                    </Badge>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Size & Aspect Ratio
                        </Label>
                        <Select value={imageSize} onValueChange={setImageSize}>
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {imageSizes.map((size) => (
                              <SelectItem key={size.id} value={size.id}>
                                <div className="flex items-center gap-2">
                                  <size.icon className="h-4 w-4" />
                                  <span>
                                    {size.name} ({size.aspect})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    {showAdvanced && (
                      <div className="space-y-6 p-4 border rounded-lg bg-muted/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Steps: {imageSteps[0]}
                            </Label>
                            <Slider
                              value={imageSteps}
                              onValueChange={setImageSteps}
                              max={50}
                              min={10}
                              step={5}
                              className="w-full"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              More steps = higher quality, slower generation
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              CFG Scale: {imageCfgScale[0]}
                            </Label>
                            <Slider
                              value={imageCfgScale}
                              onValueChange={setImageCfgScale}
                              max={20}
                              min={1}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              How closely to follow the prompt
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Video Generation */}
                  <TabsContent value="video" className="space-y-6 mt-6">
                    {/* Prompt Input */}
                    <div className="space-y-4">
                      <Label
                        htmlFor="video-prompt"
                        className="text-base font-semibold"
                      >
                        Describe your video concept
                      </Label>

                      <Textarea
                        id="video-prompt"
                        placeholder="A cinematic shot of..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px] text-base resize-none"
                        maxLength={1000}
                      />
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{prompt.length}/1000 characters</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrompt("")}
                          disabled={!prompt}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    {/* Video Model and Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">AI Model</Label>
                        <Select
                          value={videoModel}
                          onValueChange={setVideoModel}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {videoModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div className="flex items-center justify-between w-full">
                                  <div>
                                    <div className="font-medium">
                                      {model.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {model.description}
                                    </div>
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {model.credits} credits
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {model.quality}
                                    </Badge>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Duration</Label>
                        <Select
                          value={videoDuration}
                          onValueChange={setVideoDuration}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 seconds</SelectItem>
                            <SelectItem value="5">5 seconds</SelectItem>
                            <SelectItem value="10">10 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Video Advanced Settings */}
                    {showAdvanced && (
                      <div className="space-y-6 p-4 border rounded-lg bg-muted/30">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Frame Rate: {videoFps[0]} FPS
                          </Label>
                          <Slider
                            value={videoFps}
                            onValueChange={setVideoFps}
                            max={60}
                            min={12}
                            step={12}
                            className="w-full"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            Higher FPS = smoother motion, more credits
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Advanced Settings Toggle */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="p-0 h-auto font-medium"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {showAdvanced ? "Hide" : "Show"} Advanced Settings
                    </Button>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={
                      !prompt.trim() || isGenerating || !isAuthenticated
                    }
                    size="lg"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate {activeTab === "image" ? "Image" : "Video"}
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    {!isAuthenticated ? (
                      <span>Sign in to start generating</span>
                    ) : (
                      <span>
                        Cost: {selectedModel?.credits || 0} credit
                        {(selectedModel?.credits || 0) !== 1 ? "s" : ""} • You
                        have {user?.credits || 0} credits remaining
                      </span>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Recent Generations */}
          {isAuthenticated && generations.length > 0 && (
            <section>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Recent Generations
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadRecentGenerations}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Your latest AI creations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {generations.slice(0, 16).map((generation, index) => (
                      <div
                        key={generation.id}
                        className={`aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer transition-all ${
                          generation.type === "image" &&
                          index === currentCanvasIndex
                            ? "ring-2 ring-purple-500"
                            : "hover:ring-2 hover:ring-purple-300"
                        }`}
                        onClick={() => {
                          if (generation.type === "image" && generation.url) {
                            const imageIndex = imageGenerations.findIndex(
                              (g) => g.id === generation.id,
                            );
                            if (imageIndex !== -1) {
                              setCurrentCanvasIndex(imageIndex);
                            }
                          }
                        }}
                      >
                        {generation.status === "completed" && generation.url ? (
                          generation.type === "image" ? (
                            <img
                              src={generation.url}
                              alt={generation.prompt}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Film className="w-6 h-6 text-white" />
                            </div>
                          )
                        ) : generation.status === "generating" ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-red-100 dark:bg-red-900/20">
                            <XCircle className="w-6 h-6 text-red-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View All in Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
