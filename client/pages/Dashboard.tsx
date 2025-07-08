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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

export default function Dashboard() {
  const [credits] = useState(150); // Mock credits

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
                Creator Plan
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{credits} credits</span>
              </div>
              <Button size="sm" variant="outline">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Create amazing content with AI-powered generation tools.
          </p>
        </div>

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
              {/* Generation Interface */}
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
                    <label className="text-sm font-medium mb-2 block">
                      Enter your prompt
                    </label>
                    <textarea
                      className="w-full h-24 p-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="A majestic dragon soaring through clouds at sunset, digital art, highly detailed..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Style
                      </label>
                      <select className="w-full p-2 bg-background border border-border rounded">
                        <option>Digital Art</option>
                        <option>Photography</option>
                        <option>Oil Painting</option>
                        <option>Anime</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Aspect Ratio
                      </label>
                      <select className="w-full p-2 bg-background border border-border rounded">
                        <option>1:1 Square</option>
                        <option>16:9 Landscape</option>
                        <option>9:16 Portrait</option>
                        <option>4:3 Standard</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-ai hover:opacity-90">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image (2 credits)
                  </Button>
                </CardContent>
              </Card>

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
                    <label className="text-sm font-medium mb-2 block">
                      Enter your prompt
                    </label>
                    <textarea
                      className="w-full h-24 p-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="A serene forest with gentle rain, cinematic shot, 4K quality..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Duration
                      </label>
                      <select className="w-full p-2 bg-background border border-border rounded">
                        <option>3 seconds</option>
                        <option>5 seconds</option>
                        <option>10 seconds</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Quality
                      </label>
                      <select className="w-full p-2 bg-background border border-border rounded">
                        <option>HD (720p)</option>
                        <option>Full HD (1080p)</option>
                        <option>4K (2160p)</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-ai hover:opacity-90">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Video (5 credits)
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Templates */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Quick Templates</h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "Instagram Post",
                  "YouTube Thumbnail",
                  "Blog Header",
                  "Social Media Ad",
                  "Product Photo",
                  "Logo Design",
                  "Character Art",
                  "Landscape Scene",
                ].map((template) => (
                  <Button
                    key={template}
                    variant="outline"
                    className="h-auto p-4 flex-col"
                  >
                    <div className="w-8 h-8 bg-gradient-ai rounded mb-2"></div>
                    <span className="text-xs">{template}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>Generation History</CardTitle>
                <CardDescription>
                  View and download your previously generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No history yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your generated content will appear here
                  </p>
                  <Button variant="outline">Start Generating</Button>
                </div>
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
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Save your best creations here
                  </p>
                  <Button variant="outline">Browse Gallery</Button>
                </div>
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
                    <label className="text-sm font-medium mb-2 block">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 bg-background border border-border rounded"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 bg-background border border-border rounded"
                      defaultValue="john@example.com"
                    />
                  </div>
                  <Button>Save Changes</Button>
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
                      <h4 className="font-medium">Creator Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        $9.99/month • 200 credits
                      </p>
                    </div>
                    <Badge className="bg-gradient-ai">Active</Badge>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="w-full">
                      Upgrade to Pro
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
