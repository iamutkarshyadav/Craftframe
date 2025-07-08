import { useState } from "react";
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
import { AuthModal } from "@/components/auth/auth-modal";
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
} from "lucide-react";

interface Generation {
  id: string;
  type: "image" | "video";
  prompt: string;
  url: string;
  status: "generating" | "completed" | "failed";
  createdAt: string;
}

export default function Studio() {
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [error, setError] = useState("");

  // Image settings
  const [imageModel, setImageModel] = useState("flux");
  const [imageSize, setImageSize] = useState("1024x1024");

  // Video settings
  const [videoModel, setVideoModel] = useState("huggingface");
  const [videoDuration, setVideoDuration] = useState("3");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const endpoint =
        activeTab === "image" ? "/api/studio/image" : "/api/studio/video";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: activeTab === "image" ? imageModel : videoModel,
          size: activeTab === "image" ? imageSize : undefined,
          duration: activeTab === "video" ? parseInt(videoDuration) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Generation failed");
      }

      // Add to generations list
      const newGeneration: Generation = {
        id: data.id,
        type: activeTab,
        prompt: prompt.trim(),
        url: data.url || "",
        status: "generating",
        createdAt: new Date().toISOString(),
      };

      setGenerations((prev) => [newGeneration, ...prev]);

      // Poll for completion
      if (data.id) {
        pollGeneration(data.id, activeTab);
      }

      setPrompt("");
    } catch (err: any) {
      setError(err.message || "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const pollGeneration = async (id: string, type: "image" | "video") => {
    const maxAttempts = 60; // 5 minutes max
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
                ? { ...gen, url: data.url, status: data.status }
                : gen,
            ),
          );

          if (data.status === "completed" || data.status === "failed") {
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    poll();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
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
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDemoLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "demo@aicreate.app",
          password: "demo123",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("aicreate-token", data.token);
        window.location.reload();
      }
    } catch (error) {
      console.error("Demo login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AICreate
              </span>
              <span className="text-sm text-muted-foreground">Studio</span>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>{user?.credits || 0} credits</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.name}</span>
                  </div>
                </>
              ) : (
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button onClick={handleDemoLogin}>Try Demo</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Content Studio
                </CardTitle>
                <CardDescription>
                  Create stunning images and videos with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type Selection */}
                <Tabs
                  value={activeTab}
                  onValueChange={(value: any) => setActiveTab(value)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="image"
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Image
                    </TabsTrigger>
                    <TabsTrigger
                      value="video"
                      className="flex items-center gap-2"
                    >
                      <VideoIcon className="w-4 h-4" />
                      Video
                    </TabsTrigger>
                  </TabsList>

                  {/* Prompt Input */}
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="prompt">
                      Describe what you want to create
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder={
                        activeTab === "image"
                          ? "A beautiful sunset over mountains, photorealistic, 4K quality..."
                          : "A serene forest with gentle wind, cinematic shot..."
                      }
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {prompt.length}/500
                    </div>
                  </div>

                  {/* Image Settings */}
                  <TabsContent value="image" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image-model">Model</Label>
                        <Select
                          value={imageModel}
                          onValueChange={setImageModel}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flux-schnell">
                              FLUX Schnell (Fast)
                            </SelectItem>
                            <SelectItem value="flux-dev">
                              FLUX Dev (Quality)
                            </SelectItem>
                            <SelectItem value="sdxl">SDXL (Stable)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="image-size">Size</Label>
                        <Select value={imageSize} onValueChange={setImageSize}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1024x1024">
                              Square (1024×1024)
                            </SelectItem>
                            <SelectItem value="1344x768">
                              Landscape (1344×768)
                            </SelectItem>
                            <SelectItem value="768x1344">
                              Portrait (768×1344)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Video Settings */}
                  <TabsContent value="video" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="video-model">Model</Label>
                        <Select
                          value={videoModel}
                          onValueChange={setVideoModel}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stable-video">
                              Stable Video
                            </SelectItem>
                            <SelectItem value="animatediff">
                              AnimateDiff
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="video-duration">Duration</Label>
                        <Select
                          value={videoDuration}
                          onValueChange={setVideoDuration}
                        >
                          <SelectTrigger>
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
                  </TabsContent>
                </Tabs>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate {activeTab === "image" ? "Image" : "Video"}
                    </>
                  )}
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  {activeTab === "image"
                    ? "1 credit per image"
                    : "3 credits per video"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Creations</CardTitle>
                <CardDescription>
                  {generations.length} generations created
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No creations yet
                    </h3>
                    <p className="text-muted-foreground">
                      Enter a prompt and generate your first AI creation!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {generations.map((generation) => (
                      <Card key={generation.id} className="overflow-hidden">
                        <div className="relative">
                          {generation.status === "generating" ? (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
                                <p className="text-sm text-muted-foreground">
                                  Generating {generation.type}...
                                </p>
                              </div>
                            </div>
                          ) : generation.status === "completed" &&
                            generation.url ? (
                            generation.type === "image" ? (
                              <img
                                src={generation.url}
                                alt={generation.prompt}
                                className="w-full aspect-video object-cover"
                              />
                            ) : (
                              <video
                                src={generation.url}
                                className="w-full aspect-video object-cover"
                                controls
                                muted
                                autoPlay
                                loop
                              />
                            )
                          ) : (
                            <div className="aspect-video bg-red-500/10 flex items-center justify-center">
                              <p className="text-sm text-red-600">
                                Generation failed
                              </p>
                            </div>
                          )}

                          {/* Overlay Actions */}
                          {generation.status === "completed" &&
                            generation.url && (
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleDownload(generation)}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      handleCopy(generation.prompt)
                                    }
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                        </div>

                        <CardContent className="p-4">
                          <p className="text-sm line-clamp-2 mb-2">
                            {generation.prompt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {generation.type === "image" ? (
                                <ImageIcon className="w-3 h-3" />
                              ) : (
                                <VideoIcon className="w-3 h-3" />
                              )}
                              {generation.type}
                            </span>
                            <span>
                              {new Date(
                                generation.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
