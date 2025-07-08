import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  Sparkles,
  Image,
  Video,
  History,
  Heart,
  Settings,
  User,
  Crown,
  Zap,
  Loader2,
  Download,
  ExternalLink,
  Clock,
  Check,
  X,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { templates } from "@/lib/data";

interface Generation {
  id: string;
  type: "image" | "video";
  prompt: string;
  model: string;
  status: "pending" | "processing" | "completed" | "failed";
  url: string;
  createdAt: string;
  cost: number;
  liked?: boolean;
}

interface QueueStatus {
  queueLength: number;
  estimatedWaitTime: string;
}

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeGeneration, setActiveGeneration] = useState<Generation | null>(
    null,
  );
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus>({
    queueLength: 0,
    estimatedWaitTime: "No wait",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [imageForm, setImageForm] = useState({
    prompt: "",
    style: "digital-art",
    aspectRatio: "1:1",
    model: "stable-diffusion-xl",
  });

  const [videoForm, setVideoForm] = useState({
    prompt: "",
    duration: "3",
    quality: "hd",
    model: "stable-video-diffusion",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    fetchGenerations();
    fetchQueueStatus();

    // Poll queue status every 5 seconds
    const interval = setInterval(fetchQueueStatus, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchGenerations = async () => {
    try {
      const response = await fetch("/api/generations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGenerations(data.generations || []);
      }
    } catch (error) {
      console.error("Failed to fetch generations:", error);
    }
  };

  const fetchQueueStatus = async () => {
    try {
      const response = await fetch("/api/queue");
      if (response.ok) {
        const data = await response.json();
        setQueueStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch queue status:", error);
    }
  };

  const generateContent = async (type: "image" | "video") => {
    setError("");
    setLoading(true);

    try {
      const formData = type === "image" ? imageForm : videoForm;

      // Use new Hugging Face specific endpoints
      const endpoint =
        type === "image" ? "/api/generate/image" : "/api/generate/video";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          model: formData.model,
          ...(type === "image" && {
            style: imageForm.style,
            aspectRatio: imageForm.aspectRatio,
          }),
          ...(type === "video" && {
            duration: parseInt(videoForm.duration),
            quality: videoForm.quality,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Generation failed");
      }

      // Start polling for generation status using new endpoints
      pollGenerationStatus(data.id, type);
      fetchGenerations(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pollGenerationStatus = async (
    generationId: string,
    type: "image" | "video",
  ) => {
    const pollInterval = setInterval(async () => {
      try {
        // Use new Hugging Face specific endpoints
        const endpoint =
          type === "image"
            ? `/api/generate/image/${generationId}`
            : `/api/generate/video/${generationId}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
          },
        });

        if (response.ok) {
          const generation = await response.json();
          setActiveGeneration({
            ...generation,
            type, // Ensure type is included
          });

          if (
            generation.status === "completed" ||
            generation.status === "failed"
          ) {
            clearInterval(pollInterval);
            fetchGenerations(); // Refresh the list
            if (generation.status === "completed") {
              // Show success message briefly, then clear
              setTimeout(() => setActiveGeneration(null), 3000);
            }
          }
        }
      } catch (error) {
        console.error("Failed to poll generation status:", error);
        clearInterval(pollInterval);
      }
    }, 2000);

    // Clear interval after 5 minutes to prevent infinite polling
    setTimeout(() => clearInterval(pollInterval), 300000);
  };

  const toggleLike = async (generationId: string) => {
    try {
      const response = await fetch(`/api/generations/${generationId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
      });

      if (response.ok) {
        fetchGenerations(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const applyTemplate = (template: any, type: "image" | "video") => {
    if (type === "image") {
      setImageForm({
        ...imageForm,
        prompt: template.prompt.replace(/\[.*?\]/g, ""),
      });
    } else {
      setVideoForm({
        ...videoForm,
        prompt: template.prompt.replace(/\[.*?\]/g, ""),
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>
              Please sign in to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setAuthModalOpen(true)}>
              Sign In
            </Button>
          </CardContent>
        </Card>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-ai rounded">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">
                  AICreate
                </span>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Crown className="w-3 h-3 mr-1" />
                {user?.plan} Plan
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {user?.credits} credits
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={logout}
                className="hidden sm:inline-flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button size="sm" variant="outline">
                <User className="w-4 h-4 mr-2" />
                {user?.name}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Generation Status */}
      {activeGeneration && (
        <div className="border-b border-border bg-primary/5">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {activeGeneration.status === "pending" && (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  {activeGeneration.status === "processing" && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  {activeGeneration.status === "completed" && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {activeGeneration.status === "failed" && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {activeGeneration.type === "image" ? "Image" : "Video"}{" "}
                    Generation
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activeGeneration.prompt.slice(0, 50)}...
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm capitalize">
                  {activeGeneration.status}
                </span>
                {activeGeneration.status === "processing" && (
                  <Progress value={75} className="w-24" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Status */}
      {queueStatus.queueLength > 0 && (
        <div className="border-b border-border bg-yellow-500/10">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {queueStatus.queueLength} generation(s) in queue • Estimated
                wait: {queueStatus.estimatedWaitTime}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Create amazing content with AI-powered generation tools.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Generate</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Text to Image */}
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    Text to Image
                  </CardTitle>
                  <CardDescription>
                    Generate stunning images from text descriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="image-prompt">Prompt</Label>
                    <Textarea
                      id="image-prompt"
                      placeholder="A majestic dragon soaring through clouds at sunset, digital art, highly detailed..."
                      value={imageForm.prompt}
                      onChange={(e) =>
                        setImageForm({ ...imageForm, prompt: e.target.value })
                      }
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image-style">Style</Label>
                      <select
                        id="image-style"
                        className="w-full p-2 bg-background border border-border rounded"
                        value={imageForm.style}
                        onChange={(e) =>
                          setImageForm({ ...imageForm, style: e.target.value })
                        }
                      >
                        <option value="digital-art">Digital Art</option>
                        <option value="photography">Photography</option>
                        <option value="oil-painting">Oil Painting</option>
                        <option value="anime">Anime</option>
                        <option value="concept-art">Concept Art</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="image-aspect">Aspect Ratio</Label>
                      <select
                        id="image-aspect"
                        className="w-full p-2 bg-background border border-border rounded"
                        value={imageForm.aspectRatio}
                        onChange={(e) =>
                          setImageForm({
                            ...imageForm,
                            aspectRatio: e.target.value,
                          })
                        }
                      >
                        <option value="1:1">1:1 Square</option>
                        <option value="16:9">16:9 Landscape</option>
                        <option value="9:16">9:16 Portrait</option>
                        <option value="4:3">4:3 Standard</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-ai hover:opacity-90"
                    onClick={() => generateContent("image")}
                    disabled={loading || !imageForm.prompt.trim()}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate Image (2 credits)
                  </Button>
                </CardContent>
              </Card>

              {/* Text to Video */}
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    Text to Video
                  </CardTitle>
                  <CardDescription>
                    Create dynamic videos from text descriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="video-prompt">Prompt</Label>
                    <Textarea
                      id="video-prompt"
                      placeholder="A serene forest with gentle rain, cinematic shot, 4K quality..."
                      value={videoForm.prompt}
                      onChange={(e) =>
                        setVideoForm({ ...videoForm, prompt: e.target.value })
                      }
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="video-duration">Duration</Label>
                      <select
                        id="video-duration"
                        className="w-full p-2 bg-background border border-border rounded"
                        value={videoForm.duration}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            duration: e.target.value,
                          })
                        }
                      >
                        <option value="3">3 seconds</option>
                        <option value="5">5 seconds</option>
                        <option value="10">10 seconds</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="video-quality">Quality</Label>
                      <select
                        id="video-quality"
                        className="w-full p-2 bg-background border border-border rounded"
                        value={videoForm.quality}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            quality: e.target.value,
                          })
                        }
                      >
                        <option value="hd">HD (720p)</option>
                        <option value="full-hd">Full HD (1080p)</option>
                        <option value="4k">4K (2160p)</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-ai hover:opacity-90"
                    onClick={() => generateContent("video")}
                    disabled={loading || !videoForm.prompt.trim()}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate Video (5 credits)
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Templates */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Quick Templates</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.slice(0, 8).map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="h-auto p-4 flex-col text-left"
                    onClick={() => applyTemplate(template, template.type)}
                  >
                    <div className="w-8 h-8 bg-gradient-ai rounded mb-2 mx-auto flex items-center justify-center">
                      {template.type === "image" ? (
                        <Image className="w-4 h-4 text-white" />
                      ) : (
                        <Video className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-xs font-medium">{template.name}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {template.category}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-surface border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Generation History</CardTitle>
                  <CardDescription>
                    View and download your previously generated content
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchGenerations}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {generations.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No history yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Your generated content will appear here
                    </p>
                    <Button variant="outline">Start Generating</Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generations.map((generation) => (
                      <Card key={generation.id} className="bg-background">
                        <div className="relative">
                          {generation.type === "image" ? (
                            <img
                              src={generation.url}
                              alt={generation.prompt}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gradient-ai rounded-t-lg flex items-center justify-center">
                              <Video className="w-12 h-12 text-white" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant={
                                generation.status === "completed"
                                  ? "default"
                                  : generation.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {generation.status}
                            </Badge>
                          </div>
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="p-2"
                              onClick={() => toggleLike(generation.id)}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  generation.liked
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                            </Button>
                            {generation.status === "completed" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="p-2"
                                onClick={() =>
                                  window.open(generation.url, "_blank")
                                }
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            "{generation.prompt}"
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{generation.model}</span>
                            <span>{generation.cost} credits</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(
                              generation.createdAt,
                            ).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Favorite Creations</CardTitle>
                <CardDescription>
                  Your saved and favorited AI generations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generations.filter((g) => g.liked).length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Heart your best creations to save them here
                    </p>
                    <Button variant="outline">Browse Gallery</Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generations
                      .filter((g) => g.liked)
                      .map((generation) => (
                        <Card key={generation.id} className="bg-background">
                          <div className="relative">
                            {generation.type === "image" ? (
                              <img
                                src={generation.url}
                                alt={generation.prompt}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gradient-ai rounded-t-lg flex items-center justify-center">
                                <Video className="w-12 h-12 text-white" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="p-2"
                                onClick={() =>
                                  window.open(generation.url, "_blank")
                                }
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              "{generation.prompt}"
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{generation.model}</span>
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
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      defaultValue={user?.name}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email}
                      placeholder="Enter your email"
                    />
                  </div>
                  <Separator />
                  <Button>Save Changes</Button>
                  <Button variant="outline" onClick={logout} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>
                    Manage your plan and billing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">
                        {user?.plan} Plan
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.plan === "free" && "$0/month • 10 credits"}
                        {user?.plan === "creator" &&
                          "$9.99/month • 200 credits"}
                        {user?.plan === "pro" && "$29.99/month • 1000 credits"}
                      </p>
                    </div>
                    <Badge className="bg-gradient-ai">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Credits remaining</span>
                      <span>{user?.credits}</span>
                    </div>
                    <Progress
                      value={
                        user?.plan === "free"
                          ? (user?.credits / 10) * 100
                          : user?.plan === "creator"
                            ? (user?.credits / 200) * 100
                            : (user?.credits / 1000) * 100
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="pt-4 border-t border-border space-y-2">
                    {user?.plan !== "pro" && (
                      <Button variant="outline" className="w-full">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <Zap className="w-4 h-4 mr-2" />
                      Buy Credits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
