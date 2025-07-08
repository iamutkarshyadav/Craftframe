import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuthModal } from "@/components/auth/auth-modal";
import { toast } from "@/hooks/use-toast";
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
  TrendingUp,
  Clock,
  Target,
  Award,
  Activity,
  CreditCard,
  Settings,
  Plus,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Star,
  MoreHorizontal,
  Edit,
  Copy,
  Folder,
  Tag,
} from "lucide-react";

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
  settings?: any;
}

interface UserStats {
  totalGenerations: number;
  totalImages: number;
  totalVideos: number;
  creditsUsed: number;
  creditsRemaining: number;
  favoriteGenerations: number;
  thisMonthGenerations: number;
  avgGenerationTime: number;
}

interface UsageData {
  date: string;
  images: number;
  videos: number;
  credits: number;
}

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "failed"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "type" | "cost">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, filter, statusFilter, sortBy, sortOrder]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load generations
      const params = new URLSearchParams();
      if (filter !== "all") params.append("type", filter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("sort", sortBy);
      params.append("order", sortOrder);
      params.append("limit", "100");

      const [generationsRes, statsRes] = await Promise.all([
        fetch(`/api/dashboard/generations?${params}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
          },
        }),
        fetch("/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
          },
        }),
      ]);

      if (generationsRes.ok) {
        const data = await generationsRes.json();
        setGenerations(data.generations || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
        setUsageData(data.usage || []);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

      toast({
        title: "Download Started",
        description: "Your file is downloading...",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (generationId: string) => {
    try {
      const response = await fetch(
        `/api/dashboard/generations/${generationId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
          },
        },
      );

      if (response.ok) {
        setGenerations((prev) =>
          prev.map((gen) =>
            gen.id === generationId ? { ...gen, liked: !gen.liked } : gen,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to like generation:", error);
    }
  };

  const handleDelete = async (generationId: string) => {
    try {
      const response = await fetch(
        `/api/dashboard/generations/${generationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aicreate-token")}`,
          },
        },
      );

      if (response.ok) {
        setGenerations((prev) => prev.filter((gen) => gen.id !== generationId));
        toast({
          title: "Deleted",
          description: "Generation deleted successfully",
        });
      }
    } catch (error) {
      console.error("Failed to delete generation:", error);
      toast({
        title: "Error",
        description: "Failed to delete generation",
        variant: "destructive",
      });
    }
  };

  const filteredGenerations = generations.filter((gen) =>
    gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome to AICreate</CardTitle>
            <CardDescription>
              Sign in to view your AI creations and analytics dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
              size="lg"
            >
              Sign In to Dashboard
            </Button>
            <Link to="/studio">
              <Button variant="outline" className="w-full" size="lg">
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
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AICreate
                </span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="font-semibold">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/studio">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Studio
                </Button>
              </Link>
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{user?.credits || 0}</span>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  credits
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hidden sm:flex"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your AI creations
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <Card className="col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Generations
                    </p>
                    <p className="text-3xl font-bold">
                      {stats.totalGenerations}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.thisMonthGenerations} this month
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{stats.totalImages}</div>
                <div className="text-xs text-muted-foreground">Images</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <VideoIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{stats.totalVideos}</div>
                <div className="text-xs text-muted-foreground">Videos</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
                <div className="text-2xl font-bold">
                  {stats.favoriteGenerations}
                </div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold">{stats.creditsUsed}</div>
                <div className="text-xs text-muted-foreground">Used</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold">
                  {stats.creditsRemaining}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold">
                  {stats.avgGenerationTime}s
                </div>
                <div className="text-xs text-muted-foreground">Avg Time</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/studio">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-200 dark:hover:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create New</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate images or videos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Buy Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Get more generation credits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-200 dark:hover:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Account preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
            <TabsTrigger
              value="generations"
              className="flex items-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              Generations
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generations" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search your creations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={filter}
                      onValueChange={(value: any) => setFilter(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={statusFilter}
                      onValueChange={(value: any) => setStatusFilter(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={sortBy}
                      onValueChange={(value: any) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="type">Type</SelectItem>
                        <SelectItem value="cost">Cost</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setViewMode(viewMode === "grid" ? "list" : "grid")
                      }
                    >
                      {viewMode === "grid" ? (
                        <List className="h-4 w-4" />
                      ) : (
                        <Grid3X3 className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadDashboardData}
                      disabled={loading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generations Grid/List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Creations</CardTitle>
                  <Badge variant="secondary">
                    {filteredGenerations.length} of {generations.length}{" "}
                    generations
                  </Badge>
                </div>
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
                        ? "Try adjusting your search query or filters"
                        : "Create your first AI artwork in the Studio"}
                    </p>
                    <Link to="/studio">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Go to Studio
                      </Button>
                    </Link>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredGenerations.map((generation) => (
                      <Card
                        key={generation.id}
                        className="overflow-hidden group hover:shadow-lg transition-all"
                      >
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
                                className="bg-white/90 hover:bg-white"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleLike(generation.id)}
                                className="bg-white/90 hover:bg-white"
                              >
                                <Heart
                                  className={`h-4 w-4 ${generation.liked ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/90 hover:bg-white"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Status and Type Badges */}
                          <div className="absolute top-2 left-2 flex gap-1">
                            <Badge
                              variant="secondary"
                              className="bg-black/80 text-white border-0"
                            >
                              <div className="flex items-center gap-1">
                                {generation.type === "image" ? (
                                  <ImageIcon className="w-3 h-3" />
                                ) : (
                                  <VideoIcon className="w-3 h-3" />
                                )}
                                {generation.type}
                              </div>
                            </Badge>
                          </div>

                          <div className="absolute top-2 right-2">
                            <Badge
                              variant="secondary"
                              className="bg-black/80 text-white border-0"
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(generation.status)}
                                <span className="capitalize text-xs">
                                  {generation.status}
                                </span>
                              </div>
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <p className="text-sm line-clamp-2 mb-2 font-medium">
                            {generation.prompt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(
                                generation.createdAt,
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {generation.cost} credits
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredGenerations.map((generation) => (
                      <Card
                        key={generation.id}
                        className="p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {generation.type === "image" ? (
                              <img
                                src={generation.url}
                                alt={generation.prompt}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={generation.url}
                                className="w-full h-full object-cover"
                                muted
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                {generation.type === "image" ? (
                                  <ImageIcon className="w-3 h-3" />
                                ) : (
                                  <VideoIcon className="w-3 h-3" />
                                )}
                                {generation.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                {getStatusIcon(generation.status)}
                                {generation.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium line-clamp-1 mb-1">
                              {generation.prompt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {new Date(
                                  generation.createdAt,
                                ).toLocaleDateString()}
                              </span>
                              <span>{generation.cost} credits</span>
                              <span>{generation.model}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLike(generation.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${generation.liked ? "fill-red-500 text-red-500" : ""}`}
                              />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(generation)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Overview</CardTitle>
                  <CardDescription>
                    Your generation activity over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Analytics coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Success rates and generation times
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Performance metrics coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Creations</CardTitle>
                <CardDescription>
                  Your liked and starred generations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No favorites yet</p>
                  <p className="text-sm text-muted-foreground">
                    Heart your favorite generations to see them here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
