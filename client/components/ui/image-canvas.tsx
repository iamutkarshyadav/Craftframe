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

  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentGeneration = generations[currentIndex];
  const hasMultiple = generations.length > 1;

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, currentGeneration?.url]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.1));
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
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

  const handleCopyPrompt = () => {
    if (currentGeneration?.prompt) {
      navigator.clipboard.writeText(currentGeneration.prompt);
      toast({
        title: "Copied",
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
        title: "Copied",
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

    const text = `Check out this AI-generated image: "${currentGeneration.prompt}"`;
    const hashtags = "AIArt,AIGenerated,DigitalArt";

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

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-4 z-50 max-w-none max-h-none"
          : "max-w-6xl mx-auto"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Image Canvas</CardTitle>
              {hasMultiple && (
                <CardDescription className="text-sm">
                  {currentIndex + 1} of {generations.length} images
                </CardDescription>
              )}
            </div>
            {currentGeneration?.metadata?.category && (
              <Badge variant="secondary" className="capitalize">
                {currentGeneration.metadata.category.replace("-", " ")}
              </Badge>
            )}
            {getSizeInfo() && <Badge variant="outline">{getSizeInfo()}</Badge>}
          </div>

          <div className="flex items-center space-x-2">
            {/* Canvas Switching Controls */}
            {hasMultiple && (
              <div className="flex items-center space-x-1 mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={!hasMultiple}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[40px] text-center">
                  {currentIndex + 1}/{generations.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={!hasMultiple}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
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
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <CardDescription className="text-sm mb-2">Prompt:</CardDescription>
            <p className="text-sm font-medium mb-2">
              {currentGeneration.prompt}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                <Copy className="mr-2 h-3 w-3" />
                Copy Prompt
              </Button>
              {currentGeneration.metadata?.model && (
                <Badge variant="outline" className="text-xs">
                  {currentGeneration.metadata.model}
                </Badge>
              )}
              {currentGeneration.metadata?.enhancedPrompt && (
                <Badge variant="outline" className="text-xs">
                  Enhanced
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {/* Canvas Controls */}
        <div className="flex items-center justify-between p-4 bg-muted/50 border-y">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomReset}>
              <Eye className="h-4 w-4" />
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

            {/* Social Share Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!currentGeneration}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleSocialShare("twitter")}>
                  <Twitter className="mr-2 h-4 w-4" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialShare("facebook")}>
                  <Facebook className="mr-2 h-4 w-4" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialShare("linkedin")}>
                  <Linkedin className="mr-2 h-4 w-4" />
                  Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialShare("whatsapp")}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Share on WhatsApp
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyImageUrl}>
                  <Link className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => currentGeneration && onLike?.(currentGeneration)}
              disabled={!currentGeneration}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                currentGeneration && onDownload?.(currentGeneration)
              }
              disabled={!currentGeneration}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Canvas */}
        <div
          ref={canvasRef}
          className={`relative bg-checkered overflow-hidden ${
            isFullscreen ? "h-[calc(100vh-200px)]" : "h-96 md:h-[500px]"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "default",
          }}
        >
          {/* Grid Overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-lg font-semibold mb-2">
                  Generating Image...
                </p>
                <p className="text-sm text-muted-foreground">
                  Creating your masterpiece in high resolution
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {imageError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">
                  Failed to Load Image
                </p>
                <p className="text-sm text-muted-foreground">
                  The image could not be loaded or generated
                </p>
              </div>
            </div>
          )}

          {/* Image */}
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
                className="max-w-none transition-transform duration-200"
                style={{
                  transform: `scale(${zoom})`,
                  maxHeight: "none",
                  maxWidth: "none",
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                draggable={false}
              />
            </div>
          )}

          {/* Navigation Arrows for Multiple Images */}
          {hasMultiple && !isLoading && imageLoaded && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Placeholder */}
          {!currentGeneration && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
              <div className="text-center">
                <Palette className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Canvas Ready</p>
                <p className="text-sm text-muted-foreground">
                  Generate an image to see it here
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between p-3 bg-muted/50 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            {imageLoaded && currentGeneration?.metadata && (
              <>
                {getSizeInfo() && <span>Resolution: {getSizeInfo()}</span>}
                {currentGeneration.metadata.model && (
                  <span>Model: {currentGeneration.metadata.model}</span>
                )}
                <span>Quality: 2K+</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {zoom > 1 && <span>Click and drag to pan • Scroll to zoom</span>}
            {imageLoaded && <span>Image loaded successfully</span>}
            {hasMultiple && <span>Use arrow keys or buttons to navigate</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Add checkered background pattern for transparency
const checkeredStyle = `
  .bg-checkered {
    background-color: #fff;
    background-image: 
      linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }
  
  .dark .bg-checkered {
    background-color: #1a1a1a;
    background-image: 
      linear-gradient(45deg, #2a2a2a 25%, transparent 25%), 
      linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #2a2a2a 75%), 
      linear-gradient(-45deg, transparent 75%, #2a2a2a 75%);
  }
`;

// Inject the CSS
if (typeof document !== "undefined") {
  const existingStyle = document.querySelector("style[data-canvas-styles]");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.setAttribute("data-canvas-styles", "true");
    style.textContent = checkeredStyle;
    document.head.appendChild(style);
  }
}
