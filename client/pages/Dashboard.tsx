import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Heart,
  User,
  Zap,
  LogOut,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Eye,
  Trash2,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Generation {
  id: string;
  type: "image" | "video";
  prompt: string;
  model: string;
  url: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  liked?: boolean;
  cost: number;
}

interface UserStats {
  totalGenerations: number;
  totalImages: number;
  totalVideos: number;
  creditsUsed: number;
  creditsRemaining: number;
  favoriteGenerations: number;
}

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      loadGenerations();
      loadStats();
    }
  }, [isAuthenticated, filter]);

  const loadGenerations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.append("type", filter);
      params.append("limit", "50");

      const response = await fetch(`/api/dashboard/generations?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGenerations(data.generations || []);
      }
    } catch (error) {
      console.error("Failed to load generations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
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

  const filteredGenerations = generations.filter((gen) =>
    gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Dashboard
            </CardTitle>
            <CardDescription>
              Sign in to view your AI creations and stats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Sign In
            </Button>
            <Link to="/studio">
              <Button variant="outline" className="w-full">
                Try Studio Instead
              </Button>
            </Link>
          </CardContent>
        </Card>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AICreate
                </span>
              </Link>
              <span className="text-sm text-muted-foreground">Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/studio">
                <Button variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Studio
                </Button>
              </Link>
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
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">
                  {stats.totalGenerations}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <ImageIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.totalImages}</div>
                <div className="text-xs text-muted-foreground">Images</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <VideoIcon className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.totalVideos}</div>
                <div className="text-xs text-muted-foreground">Videos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">
                  {stats.favoriteGenerations}
                </div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{stats.creditsUsed}</div>
                <div className="text-xs text-muted-foreground">Used</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">
                  {stats.creditsRemaining}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your creations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter as any}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images Only</SelectItem>
              <SelectItem value="video">Videos Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generations Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Your Creations</CardTitle>
            <CardDescription>
              {filteredGenerations.length} of {generations.length} generations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredGenerations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery
                    ? "No matching creations found"
                    : "No creations yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Create your first AI artwork in the Studio"}
                </p>
                <Link to="/studio">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Go to Studio
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGenerations.map((generation) => (
                  <Card key={generation.id} className="overflow-hidden group">
                    <div className="relative">
                      {generation.type === "image" ? (
                        <img
                          src={generation.url}
                          alt={generation.prompt}
                          className="w-full aspect-square object-cover"
                        />
                      ) : (
                        <video
                          src={generation.url}
                          className="w-full aspect-square object-cover"
                          muted
                          loop
                        />
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownload(generation)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Heart
                              className={`w-4 h-4 ${generation.liked ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-2 left-2">
                        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          {generation.type === "image" ? (
                            <ImageIcon className="w-3 h-3" />
                          ) : (
                            <VideoIcon className="w-3 h-3" />
                          )}
                          {generation.type}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <p className="text-sm line-clamp-2 mb-2">
                        {generation.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(generation.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {generation.cost}
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
  );
}
