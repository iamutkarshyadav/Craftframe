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
import { toast } from "@/hooks/use-toast";
import {
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
  Download,
  Loader2,
  User,
  Zap,
  LogOut,
  Copy,
  Heart,
  Share2,
  Settings,
  Palette,
  Camera,
  Film,
  Wand2,
  Gauge,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Monitor,
  Smartphone,
  Square,
  Maximize,
  Layers,
  Grid3X3,
  Eye,
  EyeOff,
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
}

const imageModels = [
  {
    id: "flux",
    name: "FLUX Pro",
    description: "Highest quality, photorealistic",
    credits: 2,
  },
  {
    id: "sdxl",
    name: "Stable Diffusion XL",
    description: "Balanced quality and speed",
    credits: 1,
  },
  {
    id: "turbo",
    name: "SDXL Turbo",
    description: "Lightning fast generation",
    credits: 1,
  },
];

const videoModels = [
  {
    id: "svd",
    name: "Stable Video Diffusion",
    description: "High-quality video generation",
    credits: 5,
  },
  {
    id: "demo",
    name: "Demo Video",
    description: "Preview mode (free)",
    credits: 0,
  },
];

const imageSizes = [
  { id: "1024x1024", name: "Square", aspect: "1:1", icon: Square },
  { id: "1344x768", name: "Landscape", aspect: "16:9", icon: Monitor },
  { id: "768x1344", name: "Portrait", aspect: "9:16", icon: Smartphone },
  { id: "1536x1024", name: "Wide", aspect: "3:2", icon: Maximize },
];

const stylePresets = [
  "Photorealistic",
  "Digital Art",
  "Oil Painting",
  "Watercolor",
  "Sketch",
  "3D Render",
  "Anime",
  "Cartoon",
  "Cinematic",
  "Fantasy",
  "Sci-Fi",
  "Minimalist",
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
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Image settings
  const [imageModel, setImageModel] = useState("flux");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [imageStyle, setImageStyle] = useState("");
  const [imageSteps, setImageSteps] = useState([20]);
  const [imageCfgScale, setImageCfgScale] = useState([7]);

  // Video settings
  const [videoModel, setVideoModel] = useState("svd");
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
              style: imageStyle,
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
      };

      setGenerations((prev) => [newGeneration, ...prev]);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard",
    });
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

  const insertTemplate = (template: string) => {
    setPrompt(template);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generating":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const selectedModel =
    activeTab === "image"
      ? imageModels.find((m) => m.id === imageModel)
      : videoModels.find((m) => m.id === videoModel);

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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Generation Panel */}
          <div className="xl:col-span-2 space-y-6">
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

                  {/* Prompt Input */}
                  <div className="space-y-4 mt-6">
                    <Label htmlFor="prompt" className="text-base font-semibold">
                      Describe what you want to create
                    </Label>

                    {/* Template Suggestions */}
                    <div className="flex flex-wrap gap-2">
                      {promptTemplates[activeTab].map((template, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => insertTemplate(template)}
                          className="text-xs h-8"
                        >
                          Template {index + 1}
                        </Button>
                      ))}
                    </div>

                    <Textarea
                      id="prompt"
                      placeholder={
                        activeTab === "image"
                          ? "A beautiful sunset over a mountain range, dramatic clouds, golden hour lighting, photorealistic, highly detailed..."
                          : "Smooth camera movement through a serene forest, gentle wind in the trees, cinematic lighting, peaceful atmosphere..."
                      }
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

                  {/* Model and Basic Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">AI Model</Label>
                      <Select
                        value={activeTab === "image" ? imageModel : videoModel}
                        onValueChange={
                          activeTab === "image" ? setImageModel : setVideoModel
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(activeTab === "image"
                            ? imageModels
                            : videoModels
                          ).map((model) => (
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
                                <Badge variant="secondary" className="ml-2">
                                  {model.credits}{" "}
                                  {model.credits === 1 ? "credit" : "credits"}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {activeTab === "image" && (
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
                    )}

                    {activeTab === "video" && (
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
                    )}
                  </div>

                  {/* Advanced Settings Toggle */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="p-0 h-auto font-medium"
                    >
                      {showAdvanced ? (
                        <EyeOff className="mr-2 h-4 w-4" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      {showAdvanced ? "Hide" : "Show"} Advanced Settings
                    </Button>
                  </div>

                  {/* Advanced Settings */}
                  {showAdvanced && (
                    <div className="space-y-6 p-4 border rounded-lg bg-muted/30">
                      {activeTab === "image" && (
                        <>
                          <div>
                            <Label className="text-sm font-medium">
                              Style Preset
                            </Label>
                            <Select
                              value={imageStyle}
                              onValueChange={setImageStyle}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a style (optional)" />
                              </SelectTrigger>
                              <SelectContent>
                                {stylePresets.map((style) => (
                                  <SelectItem
                                    key={style}
                                    value={style.toLowerCase()}
                                  >
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

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
                        </>
                      )}

                      {activeTab === "video" && (
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
                      )}
                    </div>
                  )}

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
                        {(selectedModel?.credits || 0) !== 1 ? "s" : ""}• You
                        have {user?.credits || 0} credits remaining
                      </span>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-1">
            <Card className="border-2 sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Creations</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadRecentGenerations}
                    disabled={!isAuthenticated}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  {generations.length} generation
                  {generations.length !== 1 ? "s" : ""} in this session
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {!isAuthenticated ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">
                        Sign in to see your creations
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create an account to save and track your AI generations
                      </p>
                      <Button
                        onClick={() => setAuthModalOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        Sign In
                      </Button>
                    </div>
                  ) : generations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">No creations yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter a prompt above and generate your first AI
                        creation!
                      </p>
                    </div>
                  ) : (
                    generations.map((generation) => (
                      <Card
                        key={generation.id}
                        className="overflow-hidden group hover:shadow-md transition-all"
                      >
                        <div className="relative">
                          {generation.status === "generating" ? (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
                                <p className="text-sm font-medium">
                                  Generating {generation.type}...
                                </p>
                                {generation.progress && (
                                  <div className="w-24 h-1 bg-muted-foreground/20 rounded-full mx-auto mt-2">
                                    <div
                                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${generation.progress}%`,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : generation.status === "completed" &&
                            generation.url ? (
                            generation.type === "image" ? (
                              <img
                                src={generation.url}
                                alt={generation.prompt}
                                className="w-full aspect-video object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.parentElement?.insertAdjacentHTML(
                                    "beforeend",
                                    `<div class="w-full aspect-video bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                      <p class="text-red-600 text-sm">Failed to load image</p>
                                    </div>`,
                                  );
                                }}
                              />
                            ) : (
                              <video
                                src={generation.url}
                                className="w-full aspect-video object-cover"
                                controls
                                muted
                                loop
                                preload="metadata"
                              />
                            )
                          ) : (
                            <div className="aspect-video bg-red-500/10 flex items-center justify-center">
                              <div className="text-center">
                                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                <p className="text-sm text-red-600">
                                  Generation failed
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Overlay Actions */}
                          {generation.status === "completed" &&
                            generation.url && (
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleDownload(generation)}
                                    className="bg-white/90 hover:bg-white"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      handleCopy(generation.prompt)
                                    }
                                    className="bg-white/90 hover:bg-white"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="bg-white/90 hover:bg-white"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}

                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge
                              variant="secondary"
                              className="bg-black/80 text-white border-0"
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(generation.status)}
                                <span className="capitalize text-xs">
                                  {generation.status}
                                </span>
                              </div>
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-3">
                          <p className="text-sm line-clamp-2 mb-2 font-medium">
                            {generation.prompt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {generation.type === "image" ? (
                                <ImageIcon className="w-3 h-3" />
                              ) : (
                                <VideoIcon className="w-3 h-3" />
                              )}
                              <span className="capitalize">
                                {generation.type}
                              </span>
                            </div>
                            <span>
                              {new Date(
                                generation.createdAt,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {isAuthenticated && generations.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View All in Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
