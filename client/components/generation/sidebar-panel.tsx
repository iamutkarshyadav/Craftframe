import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  History,
  Heart,
  FolderOpen,
  Bookmark,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Image,
  Video,
  Copy,
  Download,
  Settings,
  Palette,
  Sliders,
} from "lucide-react";

interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: string;
  type: "image" | "video";
  style?: string;
  used_count: number;
}

interface SavedTemplate {
  id: string;
  name: string;
  prompt: string;
  type: "image" | "video";
  category: string;
  created: string;
}

interface FavoriteGeneration {
  id: string;
  type: "image" | "video";
  url: string;
  prompt: string;
  model: string;
  createdAt: string;
}

interface SidebarPanelProps {
  onPromptSelect: (prompt: string) => void;
  onTemplateSelect: (template: SavedTemplate) => void;
  className?: string;
}

export function SidebarPanel({
  onPromptSelect,
  onTemplateSelect,
  className = "",
}: SidebarPanelProps) {
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [favoriteGenerations, setFavoriteGenerations] = useState<
    FavoriteGeneration[]
  >([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplatePrompt, setNewTemplatePrompt] = useState("");
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const history = localStorage.getItem("aicreate-prompt-history");
        const templates = localStorage.getItem("aicreate-saved-templates");
        const favorites = localStorage.getItem("aicreate-favorites");

        if (history) {
          setPromptHistory(JSON.parse(history));
        }
        if (templates) {
          setSavedTemplates(JSON.parse(templates));
        }
        if (favorites) {
          setFavoriteGenerations(JSON.parse(favorites));
        }
      } catch (error) {
        console.error("Error loading sidebar data:", error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const addToHistory = (prompt: string, type: "image" | "video") => {
    const newEntry: PromptHistory = {
      id: `history_${Date.now()}`,
      prompt,
      timestamp: new Date().toISOString(),
      type,
      used_count: 1,
    };

    const updatedHistory = [
      newEntry,
      ...promptHistory.filter((h) => h.prompt !== prompt),
    ].slice(0, 20); // Keep only last 20

    setPromptHistory(updatedHistory);
    saveToStorage("aicreate-prompt-history", updatedHistory);
  };

  const saveTemplate = () => {
    if (!newTemplateName.trim() || !newTemplatePrompt.trim()) return;

    const newTemplate: SavedTemplate = {
      id: `template_${Date.now()}`,
      name: newTemplateName.trim(),
      prompt: newTemplatePrompt.trim(),
      type: "image", // Default to image
      category: "Custom",
      created: new Date().toISOString(),
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    saveToStorage("aicreate-saved-templates", updatedTemplates);

    setNewTemplateName("");
    setNewTemplatePrompt("");
    setIsAddingTemplate(false);
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = savedTemplates.filter((t) => t.id !== templateId);
    setSavedTemplates(updatedTemplates);
    saveToStorage("aicreate-saved-templates", updatedTemplates);
  };

  const deleteHistoryItem = (historyId: string) => {
    const updatedHistory = promptHistory.filter((h) => h.id !== historyId);
    setPromptHistory(updatedHistory);
    saveToStorage("aicreate-prompt-history", updatedHistory);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Workspace
        </CardTitle>
        <CardDescription>
          Manage your prompts, templates, and favorites
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mx-4 mb-4">
            <TabsTrigger value="history" className="text-xs">
              <History className="w-3 h-3 mr-1" />
              History
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">
              <Bookmark className="w-3 h-3 mr-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs">
              <Heart className="w-3 h-3 mr-1" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs">
              <FolderOpen className="w-3 h-3 mr-1" />
              Gallery
            </TabsTrigger>
          </TabsList>

          {/* Prompt History Tab */}
          <TabsContent value="history" className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Recent Prompts</h4>
                <Badge variant="secondary" className="text-xs">
                  {promptHistory.length}/20
                </Badge>
              </div>

              <ScrollArea className="h-64">
                {promptHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No prompt history yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {promptHistory.map((item) => (
                      <Card
                        key={item.id}
                        className="p-3 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onPromptSelect(item.prompt)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            {item.type === "image" ? (
                              <Image className="w-3 h-3" />
                            ) : (
                              <Video className="w-3 h-3" />
                            )}
                            {item.type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistoryItem(item.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm line-clamp-2 mb-2">
                          {item.prompt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatTimeAgo(item.timestamp)}</span>
                          <div className="flex items-center gap-2">
                            <span>Used {item.used_count}x</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(item.prompt);
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Saved Templates Tab */}
          <TabsContent value="templates" className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Saved Templates</h4>
                <Dialog
                  open={isAddingTemplate}
                  onOpenChange={setIsAddingTemplate}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save New Template</DialogTitle>
                      <DialogDescription>
                        Save your current prompt as a reusable template
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          placeholder="My Custom Template"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-prompt">Prompt</Label>
                        <Textarea
                          id="template-prompt"
                          value={newTemplatePrompt}
                          onChange={(e) => setNewTemplatePrompt(e.target.value)}
                          placeholder="Enter your prompt..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingTemplate(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={saveTemplate}>Save Template</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea className="h-64">
                {savedTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No saved templates yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="p-3 cursor-pointer hover:bg-accent transition-colors group"
                        onClick={() => onTemplateSelect(template)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-sm">
                            {template.name}
                          </h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTemplate(template.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm line-clamp-2 mb-2 text-muted-foreground">
                          {template.prompt}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(template.created)}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Favorite Generations</h4>
                <Badge variant="secondary" className="text-xs">
                  {favoriteGenerations.length}
                </Badge>
              </div>

              <ScrollArea className="h-64">
                {favoriteGenerations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No favorites yet</p>
                    <p className="text-xs mt-1">
                      Heart your best generations to save them here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {favoriteGenerations.map((favorite) => (
                      <Card
                        key={favorite.id}
                        className="p-2 cursor-pointer hover:bg-accent transition-colors"
                      >
                        <div className="aspect-square mb-2 rounded overflow-hidden">
                          {favorite.type === "image" ? (
                            <img
                              src={favorite.url}
                              alt={favorite.prompt}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
                              <Video className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs line-clamp-2 mb-1">
                          {favorite.prompt}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {favorite.model}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="px-4 pb-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">My Gallery</h4>
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Gallery feature coming soon</p>
                <p className="text-xs mt-1">
                  Organize and manage your downloads
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Settings */}
        <Separator className="my-4" />
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Quick Settings</h4>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Settings className="w-3 h-3" />
            </Button>
          </div>
          <div className="mt-2 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
            >
              <Palette className="w-3 h-3 mr-2" />
              Change Theme
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
            >
              <Download className="w-3 h-3 mr-2" />
              Download Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
