import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Wand2,
  Copy,
  RotateCw,
  Image,
  Video,
  Plus,
  Lightbulb,
  Dice6,
} from "lucide-react";
import {
  promptEnhancers,
  stylePresets,
  aspectRatios,
  generationTemplates,
  getRandomSurprisePrompt,
  enhancePrompt,
  getAllCategories,
  getTemplatesByCategory,
} from "@/lib/generation-data";

interface PromptCanvasProps {
  onGenerate: (params: GenerationParams) => void;
  isGenerating: boolean;
}

export interface GenerationParams {
  prompt: string;
  type: "image" | "video";
  style: string;
  aspectRatio: string;
  creativity: number;
  model: string;
}

export function PromptCanvas({ onGenerate, isGenerating }: PromptCanvasProps) {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [style, setStyle] = useState("photorealistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [creativity, setCreativity] = useState([50]);
  const [selectedEnhancers, setSelectedEnhancers] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Auto-save draft to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("aicreate-draft-prompt");
    if (savedDraft) {
      setPrompt(savedDraft);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aicreate-draft-prompt", prompt);
  }, [prompt]);

  const handleEnhancerToggle = (enhancer: string) => {
    setSelectedEnhancers((prev) =>
      prev.includes(enhancer)
        ? prev.filter((e) => e !== enhancer)
        : [...prev, enhancer],
    );
  };

  const handleSurpriseMe = () => {
    const surprisePrompt = getRandomSurprisePrompt();
    setPrompt(surprisePrompt);

    // Randomly select some enhancers for extra surprise
    const randomEnhancers = promptEnhancers
      .flatMap((category) => category.items)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    setSelectedEnhancers(randomEnhancers);

    // Random style
    const randomStyle =
      stylePresets[Math.floor(Math.random() * stylePresets.length)];
    setStyle(randomStyle.id);
  };

  const handleTemplateSelect = (template: any) => {
    setPrompt(template.prompt);
    setType(template.type);
    if (template.style) setStyle(template.style);
    if (template.aspectRatio) setAspectRatio(template.aspectRatio);
    setShowTemplates(false);
  };

  const handleGenerate = () => {
    const finalPrompt =
      selectedEnhancers.length > 0
        ? enhancePrompt(prompt, selectedEnhancers)
        : prompt;

    const selectedStylePreset = stylePresets.find((s) => s.id === style);
    const promptWithStyle = selectedStylePreset
      ? finalPrompt + selectedStylePreset.prompt_suffix
      : finalPrompt;

    onGenerate({
      prompt: promptWithStyle,
      type,
      style,
      aspectRatio,
      creativity: creativity[0],
      model: type === "image" ? "flux-dev" : "wan21-t2v-14b",
    });
  };

  const filteredTemplates =
    selectedCategory === "All"
      ? generationTemplates
      : getTemplatesByCategory(selectedCategory);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          AI Creation Studio
        </CardTitle>
        <CardDescription>
          Transform your ideas into stunning visuals with our advanced AI models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Prompt Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt" className="text-base font-medium">
              Describe your vision
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSurpriseMe}
                className="text-xs"
              >
                <Dice6 className="w-3 h-3 mr-1" />
                Surprise Me
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-xs"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                Templates
              </Button>
            </div>
          </div>
          <Textarea
            id="prompt"
            placeholder="A majestic dragon soaring through ethereal clouds at golden sunset..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-base resize-none"
            maxLength={500}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{prompt.length}/500 characters</span>
            {prompt && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(prompt)}
                className="h-6 px-2 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            )}
          </div>
        </div>

        {/* Templates Section */}
        {showTemplates && (
          <Card className="border-2 border-dashed border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Quick Templates</CardTitle>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {getAllCategories().map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {filteredTemplates.slice(0, 12).map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:bg-accent transition-colors p-3 border border-border/50"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.type === "image" ? (
                          <Image className="w-3 h-3 mr-1" />
                        ) : (
                          <Video className="w-3 h-3 mr-1" />
                        )}
                        {template.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.prompt.slice(0, 80)}...
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs px-1 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Output Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Output Type</Label>
            <Tabs value={type} onValueChange={(value: any) => setType(value)}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="image" className="flex items-center gap-1">
                  <Image className="w-3 h-3" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Video
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Style Preset */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stylePresets
                  .filter(
                    (preset) => preset.type === "both" || preset.type === type,
                  )
                  .map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border bg-cover bg-center"
                          style={{ backgroundImage: `url(${preset.preview})` }}
                        />
                        {preset.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aspectRatios.map((ratio) => (
                  <SelectItem key={ratio.id} value={ratio.value}>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div
                          className="border bg-muted rounded-sm"
                          style={{
                            width: ratio.width > ratio.height ? "16px" : "12px",
                            height:
                              ratio.width > ratio.height ? "12px" : "16px",
                          }}
                        />
                        {ratio.name}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Creativity Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Creativity: {creativity[0]}%
            </Label>
            <Slider
              value={creativity}
              onValueChange={setCreativity}
              max={100}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>Creative</span>
            </div>
          </div>
        </div>

        {/* Prompt Enhancers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Enhance Your Prompt</Label>
            <Badge variant="secondary" className="text-xs">
              {selectedEnhancers.length} selected
            </Badge>
          </div>

          <Tabs defaultValue={promptEnhancers[0]?.category} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              {promptEnhancers.map((category) => (
                <TabsTrigger
                  key={category.category}
                  value={category.category}
                  className="text-xs"
                >
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>

            {promptEnhancers.map((category) => (
              <TabsContent key={category.category} value={category.category}>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg bg-background/50">
                  {category.items.map((enhancer) => (
                    <Badge
                      key={enhancer}
                      variant={
                        selectedEnhancers.includes(enhancer)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer hover:bg-accent text-xs"
                      onClick={() => handleEnhancerToggle(enhancer)}
                    >
                      {selectedEnhancers.includes(enhancer) && (
                        <Plus className="w-3 h-3 mr-1 rotate-45" />
                      )}
                      {enhancer}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {type === "image" ? "2 credits" : "5 credits"} per generation
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate {type === "image" ? "Image" : "Video"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
