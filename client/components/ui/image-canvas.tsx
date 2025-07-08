import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  Download,
  Share2,
  Heart,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Maximize2,
  Minimize2,
  Copy,
  Eye,
  Palette,
  Grid3X3,
  Info,
  Loader2,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Link,
  Camera,
  Monitor,
  Smartphone,
  Square,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Sparkles,
} from "lucide-react";

interface Generation {
  id: string;
  type: "image" | "video";
  prompt: string;
  url: string;
  status: "generating" | "completed" | "failed";
  createdAt: string;
  settings?: any;
  metadata?: any;
}

interface ImageCanvasProps {
  generations?: Generation[];
  currentIndex?: number;
  isLoading?: boolean;
  onIndexChange?: (index: number) => void;
  onDownload?: (generation: Generation) => void;
  onShare?: (generation: Generation, platform: string) => void;
  onLike?: (generation: Generation) => void;
}

export function ImageCanvas({
  generations = [],
  currentIndex = 0,
  isLoading = false,
  onIndexChange,
  onDownload,
  onShare,
  onLike,
}: ImageCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [fitMode, setFitMode] = useState<"contain" | "cover" | "fill">(
    "contain",
  );

  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentGeneration = generations[currentIndex];
  const hasMultiple = generations.length > 1;

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    resetView();
  }, [currentIndex, currentGeneration?.url]);

  const resetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.25, 8));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.25, 0.1));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFitToScreen = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const container = canvasRef.current.getBoundingClientRect();
    const image = imageRef.current;

    const containerRatio = container.width / container.height;
    const imageRatio = image.naturalWidth / image.naturalHeight;

    let newZoom = 1;
    if (fitMode === "contain") {
      newZoom =
        containerRatio > imageRatio
          ? container.height / image.naturalHeight
          : container.width / image.naturalWidth;
    } else if (fitMode === "cover") {
      newZoom =
        containerRatio < imageRatio
          ? container.height / image.naturalHeight
          : container.width / image.naturalWidth;
    }

    setZoom(Math.min(newZoom * 0.9, 3));
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1 && e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.min(Math.max(prev * delta, 0.1), 8));
    }
  };

  const handleCopyPrompt = () => {
    if (currentGeneration?.prompt) {
      navigator.clipboard.writeText(currentGeneration.prompt);
      toast({
        title: "Prompt Copied",
        description: "Prompt copied to clipboard",
      });
    }
  };

  const handleCopyImageUrl = () => {
    if (currentGeneration?.url) {
      const fullUrl = currentGeneration.url.startsWith("http")
        ? currentGeneration.url
        : `${window.location.origin}${currentGeneration.url}`;
      navigator.clipboard.writeText(fullUrl);
      toast({
        title: "URL Copied",
        description: "Image URL copied to clipboard",
      });
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePrevious = () => {
    if (hasMultiple && onIndexChange) {
      const newIndex =
        currentIndex > 0 ? currentIndex - 1 : generations.length - 1;
      onIndexChange(newIndex);
    }
  };

  const handleNext = () => {
    if (hasMultiple && onIndexChange) {
      const newIndex =
        currentIndex < generations.length - 1 ? currentIndex + 1 : 0;
      onIndexChange(newIndex);
    }
  };

  const handleSocialShare = (platform: string) => {
    if (!currentGeneration) return;

    const fullUrl = currentGeneration.url.startsWith("http")
      ? currentGeneration.url
      : `${window.location.origin}${currentGeneration.url}`;

    const text = `🎨 Check out this AI-generated masterpiece: "${currentGeneration.prompt}"`;
    const hashtags = "AIArt,AIGenerated,DigitalArt,CreativeAI";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}&hashtags=${hashtags}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&summary=${encodeURIComponent(text)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${fullUrl}`)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`;
        break;
      default:
        handleCopyImageUrl();
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");

    if (onShare) {
      onShare(currentGeneration, platform);
    }
  };

  const getSizeInfo = () => {
    if (!currentGeneration?.metadata) return null;
    const { width, height } = currentGeneration.metadata;
    if (width && height) {
      const megapixels = ((width * height) / 1000000).toFixed(1);
      return `${width}×${height} (${megapixels}MP)`;
    }
    return null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "r":
          e.preventDefault();
          handleRotate();
          break;
        case "f":
          e.preventDefault();
          handleFitToScreen();
          break;
        case "g":
          e.preventDefault();
          setShowGrid(!showGrid);
          break;
        case "i":
          e.preventDefault();
          setShowInfo(!showInfo);
          break;
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasMultiple, showGrid, showInfo, isFullscreen]);

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 shadow-2xl ${
        isFullscreen
          ? "fixed inset-4 z-50 max-w-none max-h-none"
          : "max-w-7xl mx-auto"
      }`}
    >
      <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Canvas Studio
              </CardTitle>
              {hasMultiple && (
                <CardDescription className="text-sm font-medium">
                  Image {currentIndex + 1} of {generations.length}
                </CardDescription>
              )}
            </div>
            {currentGeneration?.metadata?.category && (
              <Badge variant="secondary" className="capitalize font-semibold">
                {currentGeneration.metadata.category.replace("-", " ")}
              </Badge>
            )}
            {getSizeInfo() && (
              <Badge variant="outline" className="font-mono text-xs">
                {getSizeInfo()}
              </Badge>
            )}
            {currentGeneration?.metadata?.source === "huggingface" && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                HF Premium
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Canvas Navigation */}
            {hasMultiple && (
              <div className="flex items-center space-x-1 bg-background/60 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={!hasMultiple}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-bold min-w-[50px] text-center px-2">
                  {currentIndex + 1}/{generations.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={!hasMultiple}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className={showInfo ? "bg-purple-100 dark:bg-purple-900/20" : ""}
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {showInfo && currentGeneration?.prompt && (
          <div className="mt-4 p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border backdrop-blur-sm">
            <CardDescription className="text-sm mb-2 font-semibold">
              Generation Prompt:
            </CardDescription>
            <p className="text-sm font-medium mb-3 text-foreground">
              {currentGeneration.prompt}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                <Copy className="mr-2 h-3 w-3" />
                Copy Prompt
              </Button>
              {currentGeneration.metadata?.model && (
                <Badge variant="outline" className="text-xs">
                  Model: {currentGeneration.metadata.model}
                </Badge>
              )}
              {currentGeneration.metadata?.quality && (
                <Badge variant="outline" className="text-xs">
                  Quality: {currentGeneration.metadata.quality}
                </Badge>
              )}
              {currentGeneration.metadata?.enhancedPrompt && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
                  Enhanced
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {/* Advanced Canvas Controls */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-y">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-bold min-w-[60px] text-center px-2">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleFitToScreen}>
              <Eye className="h-4 w-4 mr-1" />
              Fit
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="h-4 w-4 mr-1" />
              Rotate
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />

            {/* Enhanced Social Share */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!currentGeneration}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => handleSocialShare("twitter")}>
                  <Twitter className="mr-2 h-4 w-4 text-blue-500" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialShare("facebook")}>
                  <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialShare("linkedin")}>
                  <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                  Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialShare("whatsapp")}>
                  <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                  Share on WhatsApp
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyImageUrl}>
                  <Link className="mr-2 h-4 w-4" />
                  Copy Image URL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => currentGeneration && onLike?.(currentGeneration)}
              disabled={!currentGeneration}
            >
              <Heart className="h-4 w-4 mr-1" />
              Like
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                currentGeneration && onDownload?.(currentGeneration)
              }
              disabled={!currentGeneration}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>

        {/* Enhanced Main Canvas */}
        <div
          ref={canvasRef}
          className={`relative bg-checkered overflow-hidden select-none ${
            isFullscreen
              ? "h-[calc(100vh-240px)]"
              : "h-[500px] md:h-[600px] lg:h-[700px]"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "default",
          }}
        >
          {/* Enhanced Grid Overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
          )}

          {/* Enhanced Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm">
              <div className="text-center">
                <div className="relative">
                  <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-purple-600" />
                  <div className="absolute inset-0 h-16 w-16 border-4 border-purple-200 rounded-full mx-auto animate-pulse"></div>
                </div>
                <p className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Generating Masterpiece...
                </p>
                <p className="text-sm text-muted-foreground">
                  Creating your artwork with premium AI models
                </p>
                <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Error State */}
          {imageError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-red-500" />
                </div>
                <p className="text-xl font-bold mb-2 text-red-600">
                  Failed to Load Image
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  The image could not be loaded or generated
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Image Display */}
          {currentGeneration?.url && !isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <img
                ref={imageRef}
                src={currentGeneration.url}
                alt={currentGeneration.prompt || "Generated image"}
                className="max-w-none transition-all duration-200 shadow-2xl rounded-lg"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  maxHeight: "none",
                  maxWidth: "none",
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                draggable={false}
              />
            </div>
          )}

          {/* Enhanced Navigation Arrows */}
          {hasMultiple && !isLoading && imageLoaded && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0 h-12 w-12 rounded-full shadow-xl"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0 h-12 w-12 rounded-full shadow-xl"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Enhanced Placeholder */}
          {!currentGeneration && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg m-4">
              <div className="text-center">
                <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                  <Palette className="h-12 w-12 text-purple-600" />
                </div>
                <p className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Canvas Ready
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate an image to see it displayed here
                </p>
                <Badge variant="secondary" className="text-xs">
                  Pro tip: Use arrow keys to navigate between images
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Status Bar */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-xs">
          <div className="flex items-center space-x-4 text-muted-foreground">
            {imageLoaded && currentGeneration?.metadata && (
              <>
                {getSizeInfo() && <span>📐 {getSizeInfo()}</span>}
                {currentGeneration.metadata.model && (
                  <span>🤖 {currentGeneration.metadata.model}</span>
                )}
                {currentGeneration.metadata.source === "huggingface" && (
                  <span className="text-yellow-600 font-semibold">
                    ⭐ HuggingFace Premium
                  </span>
                )}
                <span>✨ Ultra Quality</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4 text-muted-foreground">
            {zoom > 1 && (
              <span>🖱️ Click & drag to pan • Ctrl+Scroll to zoom</span>
            )}
            {imageLoaded && <span>✅ Image loaded successfully</span>}
            {hasMultiple && <span>⌨️ Use ← → arrow keys to navigate</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced checkered background pattern
const checkeredStyle = `
  .bg-checkered {
    background-color: #fafafa;
    background-image: 
      linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
    background-size: 30px 30px;
    background-position: 0 0, 0 15px, 15px -15px, -15px 0px;
  }
  
  .dark .bg-checkered {
    background-color: #1a1a1a;
    background-image: 
      linear-gradient(45deg, #2d2d2d 25%, transparent 25%), 
      linear-gradient(-45deg, #2d2d2d 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #2d2d2d 75%), 
      linear-gradient(-45deg, transparent 75%, #2d2d2d 75%);
  }
`;

// Inject enhanced CSS
if (typeof document !== "undefined") {
  const existingStyle = document.querySelector("style[data-canvas-styles]");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.setAttribute("data-canvas-styles", "true");
    style.textContent = checkeredStyle;
    document.head.appendChild(style);
  }
}
