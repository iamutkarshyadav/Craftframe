import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  RotateCw,
  Copy,
  Heart,
  Pin,
  Maximize2,
  Share2,
  MoreVertical,
  Image as ImageIcon,
  Video as VideoIcon,
  Clock,
  Check,
  X,
  Loader2,
  Sparkles,
  ArrowUpCircle,
  FileImage,
  FileVideo,
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

interface ResultCanvasProps {
  generations: Generation[];
  activeGeneration?: Generation | null;
  onRegenerate: (generation: Generation) => void;
  onDownload: (generation: Generation, format?: string) => void;
  onToggleLike: (generationId: string) => void;
  onTogglePin: (generationId: string) => void;
  onEnhance: (generation: Generation) => void;
  className?: string;
}

export function ResultCanvas({
  generations,
  activeGeneration,
  onRegenerate,
  onDownload,
  onToggleLike,
  onTogglePin,
  onEnhance,
  className = "",
}: ResultCanvasProps) {
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const handleCardClick = (generation: Generation) => {
    if (generation.status === "completed") {
      setSelectedGeneration(generation);
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />;
      case "failed":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "processing":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Generation Banner */}
      {activeGeneration && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(activeGeneration.status)}
                <div>
                  <div className="font-medium">
                    {activeGeneration.type === "image" ? "Image" : "Video"}{" "}
                    Generation
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activeGeneration.prompt.slice(0, 60)}...
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(activeGeneration.status)}>
                  {activeGeneration.status}
                </Badge>
                {activeGeneration.status === "processing" && (
                  <Progress
                    value={activeGeneration.progress || 50}
                    className="w-24"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Grid */}
      {generations.length === 0 ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No generations yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Start creating amazing AI content by entering a prompt above. Your
              generated images and videos will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {generations.map((generation) => (
            <Card
              key={generation.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                generation.pinned ? "ring-2 ring-primary/50" : ""
              } ${
                generation.status === "completed"
                  ? "hover:shadow-primary/20"
                  : ""
              }`}
              onClick={() => handleCardClick(generation)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                {/* Content Display */}
                {generation.type === "image" ? (
                  generation.status === "completed" && generation.url ? (
                    <div className="relative">
                      <img
                        src={generation.url}
                        alt={generation.prompt}
                        className={`w-full h-48 object-cover transition-all duration-500 ${
                          imageLoaded[generation.id]
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105"
                        } group-hover:scale-110`}
                        loading="lazy"
                        onLoad={() =>
                          setImageLoaded((prev) => ({
                            ...prev,
                            [generation.id]: true,
                          }))
                        }
                      />
                      {!imageLoaded[generation.id] && (
                        <div className="absolute inset-0 bg-muted animate-pulse" />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      {generation.status === "processing" ? (
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Generating...
                          </p>
                        </div>
                      ) : generation.status === "failed" ? (
                        <div className="text-center">
                          <X className="w-8 h-8 text-destructive mx-auto mb-2" />
                          <p className="text-sm text-destructive">Failed</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Pending...
                          </p>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    {generation.status === "completed" && generation.url ? (
                      <video
                        src={generation.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <VideoIcon className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {generation.status === "completed" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(generation);
                        }}
                      >
                        <Maximize2 className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-black"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownload(generation, "original");
                            }}
                          >
                            <FileImage className="w-4 h-4 mr-2" />
                            Original Quality
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownload(generation, "compressed");
                            }}
                          >
                            <FileImage className="w-4 h-4 mr-2" />
                            Compressed
                          </DropdownMenuItem>
                          {generation.type === "video" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDownload(generation, "gif");
                                }}
                              >
                                <FileVideo className="w-4 h-4 mr-2" />
                                As GIF
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <Badge
                    variant={
                      generation.type === "image" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {generation.type === "image" ? (
                      <ImageIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <VideoIcon className="w-3 h-3 mr-1" />
                    )}
                    {generation.type}
                  </Badge>
                  {generation.pinned && (
                    <Badge variant="outline" className="text-xs bg-white/90">
                      <Pin className="w-3 h-3" />
                    </Badge>
                  )}
                </div>

                {/* Top Right Actions */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(generation.id);
                    }}
                  >
                    <Heart
                      className={`w-3 h-3 ${
                        generation.liked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-black"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onRegenerate(generation);
                        }}
                      >
                        <RotateCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEnhance(generation);
                        }}
                      >
                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                        Enhance/Upscale
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(generation.prompt);
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(generation.id);
                        }}
                      >
                        <Pin className="w-4 h-4 mr-2" />
                        {generation.pinned ? "Unpin" : "Pin"} to Gallery
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {generation.model}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {generation.cost} credits
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {generation.prompt}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(generation.createdAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(generation.status)}
                      <span className="text-xs capitalize">
                        {generation.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Full Screen Modal */}
      <Dialog
        open={!!selectedGeneration}
        onOpenChange={() => setSelectedGeneration(null)}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedGeneration?.type === "image" ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <VideoIcon className="w-5 h-5" />
              )}
              Generated {selectedGeneration?.type}
            </DialogTitle>
            <DialogDescription>
              Created with {selectedGeneration?.model} •{" "}
              {selectedGeneration?.cost} credits
            </DialogDescription>
          </DialogHeader>

          {selectedGeneration && (
            <div className="space-y-6">
              {/* Full Resolution Display */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                {selectedGeneration.type === "image" ? (
                  <img
                    src={selectedGeneration.url}
                    alt={selectedGeneration.prompt}
                    className="w-full max-h-96 object-contain"
                  />
                ) : (
                  <video
                    src={selectedGeneration.url}
                    className="w-full max-h-96 object-contain"
                    controls
                    autoPlay
                    muted
                    loop
                  />
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Prompt</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {selectedGeneration.prompt}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium">Model</h5>
                      <p className="text-muted-foreground">
                        {selectedGeneration.model}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Style</h5>
                      <p className="text-muted-foreground">
                        {selectedGeneration.style || "Default"}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Aspect Ratio</h5>
                      <p className="text-muted-foreground">
                        {selectedGeneration.aspectRatio || "1:1"}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Created</h5>
                      <p className="text-muted-foreground">
                        {formatDate(selectedGeneration.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onDownload(selectedGeneration)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onRegenerate(selectedGeneration)}
                      className="flex items-center gap-2"
                    >
                      <RotateCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onEnhance(selectedGeneration)}
                      className="flex items-center gap-2"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      Enhance
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleCopyPrompt(selectedGeneration.prompt)
                      }
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Button
                      variant={selectedGeneration.liked ? "default" : "outline"}
                      size="sm"
                      onClick={() => onToggleLike(selectedGeneration.id)}
                      className="flex items-center gap-2"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          selectedGeneration.liked ? "fill-current" : ""
                        }`}
                      />
                      {selectedGeneration.liked ? "Liked" : "Like"}
                    </Button>
                    <Button
                      variant={
                        selectedGeneration.pinned ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => onTogglePin(selectedGeneration.id)}
                      className="flex items-center gap-2"
                    >
                      <Pin className="w-4 h-4" />
                      {selectedGeneration.pinned ? "Pinned" : "Pin"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
