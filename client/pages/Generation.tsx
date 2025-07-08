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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  PromptCanvas,
  GenerationParams,
} from "@/components/generation/prompt-canvas";
import { ResultCanvas } from "@/components/generation/result-canvas";
import { SidebarPanel } from "@/components/generation/sidebar-panel";
import {
  downloadWithFormat,
  downloadOriginal,
  DownloadOptions,
  GenerationDownload,
  trackDownload,
} from "@/lib/download-utils";
import {
  Sparkles,
  User,
  Crown,
  Zap,
  LogOut,
  Menu,
  X,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  pinned?: boolean;
  style?: string;
  aspectRatio?: string;
  progress?: number;
}

export default function Generation() {
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [activeGeneration, setActiveGeneration] = useState<Generation | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState(false);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 1024;
      setMobileView(isMobile);
      if (isMobile) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle authentication and data loading
  useEffect(() => {
    if (isAuthenticated) {
      fetchGenerations();
    }
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

  const handleGenerate = async (params: GenerationParams) => {
    setError("");
    setIsGenerating(true);

    try {
      const endpoint =
        params.type === "image" ? "/api/generate/image" : "/api/generate/video";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Generation failed");
      }

      // Start polling for generation status
      pollGenerationStatus(data.id, params.type);
      fetchGenerations();
    } catch (err: any) {
      setError(err.message || "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const pollGenerationStatus = async (
    generationId: string,
    type: "image" | "video",
  ) => {
    const pollInterval = setInterval(async () => {
      try {
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
            type,
          });

          if (
            generation.status === "completed" ||
            generation.status === "failed"
          ) {
            clearInterval(pollInterval);
            fetchGenerations();
            if (generation.status === "completed") {
              setTimeout(() => setActiveGeneration(null), 3000);
            }
          }
        }
      } catch (error) {
        console.error("Failed to poll generation status:", error);
        clearInterval(pollInterval);
      }
    }, 2000);

    setTimeout(() => clearInterval(pollInterval), 300000);
  };

  const handleDownload = async (generation: Generation, format?: string) => {
    try {
      const downloadData: GenerationDownload = {
        id: generation.id,
        type: generation.type,
        url: generation.url,
        prompt: generation.prompt,
        model: generation.model,
        createdAt: generation.createdAt,
      };

      if (format && format !== "original") {
        const options: DownloadOptions = {
          format: format as any,
          quality: 0.9,
        };
        await downloadWithFormat(downloadData, options);
      } else {
        await downloadOriginal(downloadData);
      }

      trackDownload(downloadData, format || "original");
    } catch (error) {
      console.error("Download failed:", error);
      setError("Download failed. Please try again.");
    }
  };

  const handleToggleLike = async (generationId: string) => {
    try {
      const response = await fetch(`/api/generations/${generationId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
      });

      if (response.ok) {
        fetchGenerations();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleTogglePin = async (generationId: string) => {
    // This would be implemented with a backend endpoint
    console.log("Toggle pin:", generationId);
    // For now, just update local state
    setGenerations((prev) =>
      prev.map((gen) =>
        gen.id === generationId ? { ...gen, pinned: !gen.pinned } : gen,
      ),
    );
  };

  const handleRegenerate = (generation: Generation) => {
    const params: GenerationParams = {
      prompt: generation.prompt,
      type: generation.type,
      style: generation.style || "photorealistic",
      aspectRatio: generation.aspectRatio || "1:1",
      creativity: 50,
      model: generation.model === "Flux Dev" ? "flux-dev" : "wan21-t2v-14b",
    };
    handleGenerate(params);
  };

  const handleEnhance = (generation: Generation) => {
    // Enhancement/upscaling would be implemented here
    console.log("Enhance:", generation.id);
    setError("Enhancement feature coming soon!");
  };

  const handlePromptSelect = (prompt: string) => {
    // This would set the prompt in the PromptCanvas
    // For now, we'll just scroll to the top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTemplateSelect = (template: any) => {
    // This would apply the template to the PromptCanvas
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>
              Please sign in to access the AI generation studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setAuthModalOpen(true)}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                <Separator orientation="vertical" className="h-6" />
                <span className="text-sm text-muted-foreground">Studio</span>
              </div>

              {!mobileView && (
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  <Crown className="w-3 h-3 mr-1" />
                  {user?.plan} Plan
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {user?.credits} credits
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </Button>

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
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen && !mobileView ? "mr-80" : ""
          }`}
        >
          {/* Prompt Canvas */}
          <div className="border-b border-border bg-surface/50 p-6">
            <PromptCanvas
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Result Canvas */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Creations</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {generations.length} generations
                  </Badge>
                  {!mobileView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                      {sidebarOpen ? (
                        <>
                          <ChevronRight className="w-4 h-4 mr-1" />
                          Hide Panel
                        </>
                      ) : (
                        <>
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Show Panel
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <ResultCanvas
                generations={generations}
                activeGeneration={activeGeneration}
                onRegenerate={handleRegenerate}
                onDownload={handleDownload}
                onToggleLike={handleToggleLike}
                onTogglePin={handleTogglePin}
                onEnhance={handleEnhance}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div
          className={`fixed right-0 top-[73px] h-[calc(100vh-73px)] w-80 border-l border-border bg-background transition-transform duration-300 z-40 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } ${mobileView ? "w-full" : ""}`}
        >
          <SidebarPanel
            onPromptSelect={handlePromptSelect}
            onTemplateSelect={handleTemplateSelect}
            className="h-full"
          />
        </div>

        {/* Mobile Overlay */}
        {mobileView && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
