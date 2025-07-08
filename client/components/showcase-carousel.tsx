import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import { ShowcaseContent } from "@/lib/showcase-data";

interface ShowcaseCarouselProps {
  content: ShowcaseContent[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showPrompts?: boolean;
  className?: string;
}

export function ShowcaseCarousel({
  content,
  autoPlay = true,
  autoPlayInterval = 5000,
  showPrompts = true,
  className = "",
}: ShowcaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
  }, [content.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + content.length) % content.length,
    );
  }, [content.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovered || content.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, isHovered, nextSlide, autoPlayInterval, content.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === " ") {
        event.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isPlaying]);

  // Preload adjacent images
  useEffect(() => {
    const preloadIndexes = [
      (currentIndex - 1 + content.length) % content.length,
      currentIndex,
      (currentIndex + 1) % content.length,
    ];

    preloadIndexes.forEach((index) => {
      const item = content[index];
      if (item && item.type === "image" && !imageLoaded[index]) {
        const img = new Image();
        img.onload = () => {
          setImageLoaded((prev) => ({ ...prev, [index]: true }));
        };
        img.src = item.url;
      }
    });
  }, [currentIndex, content, imageLoaded]);

  if (!content || content.length === 0) {
    return (
      <div className="w-full h-[400px] bg-surface rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground">No content to display</p>
      </div>
    );
  }

  const currentItem = content[currentIndex];

  return (
    <div
      className={`relative w-full group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Background blur for loading */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />

        {/* Content Display */}
        {currentItem.type === "image" ? (
          <img
            src={currentItem.url}
            alt="AI Generated Content"
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              imageLoaded[currentIndex]
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            } group-hover:scale-105`}
            loading={currentIndex === 0 ? "eager" : "lazy"}
            onLoad={() =>
              setImageLoaded((prev) => ({ ...prev, [currentIndex]: true }))
            }
          />
        ) : (
          <div className="relative w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <video
              src={currentItem.url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {/* Content Type Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge
            variant={currentItem.type === "image" ? "default" : "secondary"}
            className="bg-black/70 text-white border-0 backdrop-blur-sm"
          >
            {currentItem.type === "image" ? (
              <ImageIcon className="w-3 h-3 mr-1" />
            ) : (
              <VideoIcon className="w-3 h-3 mr-1" />
            )}
            {currentItem.type}
          </Badge>
        </div>

        {/* Model Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge
            variant="outline"
            className="bg-black/70 text-white border-white/20 backdrop-blur-sm"
          >
            {currentItem.model}
          </Badge>
        </div>

        {/* Navigation Buttons */}
        {content.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={nextSlide}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Auto-play Control */}
        {autoPlay && content.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        )}

        {/* Prompt Overlay */}
        {showPrompts && currentItem.prompt && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
            <p className="text-white text-sm md:text-base font-medium leading-relaxed line-clamp-2">
              "{currentItem.prompt}"
            </p>
            {currentItem.style && (
              <div className="mt-2">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  {currentItem.style}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Loading Indicator */}
        {currentItem.type === "image" && !imageLoaded[currentIndex] && (
          <div className="absolute inset-0 bg-surface/80 flex items-center justify-center z-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dots Indicator */}
      {content.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {content.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isPlaying && !isHovered && content.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{
              width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
