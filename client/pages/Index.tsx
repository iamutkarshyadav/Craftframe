import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Image,
  Video,
  Zap,
  Shield,
  Users,
  Star,
  Play,
  Check,
} from "lucide-react";

export default function Index() {
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-ai rounded">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">AICreate</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-gradient-ai hover:opacity-90"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Content Generation
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Create Stunning <span className="text-gradient">AI Content</span> in
            Seconds
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into breathtaking images and videos with our
            advanced AI models. From concept to creation in just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-ai hover:opacity-90 px-8 py-6 text-lg"
            >
              Start Creating Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Demo */}
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  size="sm"
                  variant={activeTab === "image" ? "default" : "ghost"}
                  onClick={() => setActiveTab("image")}
                  className={activeTab === "image" ? "bg-gradient-ai" : ""}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Text to Image
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "video" ? "default" : "ghost"}
                  onClick={() => setActiveTab("video")}
                  className={activeTab === "video" ? "bg-gradient-ai" : ""}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Text to Video
                </Button>
              </div>
              <div className="bg-background rounded-lg p-4 text-left">
                <p className="text-sm text-muted-foreground mb-2">
                  Enter your prompt:
                </p>
                <div className="bg-input rounded p-3 text-sm">
                  {activeTab === "image"
                    ? "A majestic dragon soaring through clouds at sunset, digital art, highly detailed"
                    : "A serene forest with gentle rain, cinematic shot, 4K quality"}
                </div>
              </div>
              <div className="mt-4 h-48 bg-gradient-ai rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-white mx-auto mb-2 animate-pulse" />
                  <p className="text-white text-sm">
                    AI {activeTab === "image" ? "Image" : "Video"} Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powerful <span className="text-gradient">AI Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional-quality content with AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors">
            <CardHeader>
              <Image className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Text to Image</CardTitle>
              <CardDescription>
                Generate stunning images from text prompts using
                state-of-the-art Stable Diffusion models
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors">
            <CardHeader>
              <Video className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Text to Video</CardTitle>
              <CardDescription>
                Create dynamic videos from descriptions with our advanced video
                generation AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors">
            <CardHeader>
              <Zap className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Generate content in seconds with our optimized AI infrastructure
                and queue system
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Enterprise Ready</CardTitle>
              <CardDescription>
                Secure, scalable, and reliable platform built for teams and
                businesses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Share, organize, and collaborate on AI-generated content with
                your team
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors">
            <CardHeader>
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Smart Templates</CardTitle>
              <CardDescription>
                Pre-built prompts and templates for social media, marketing, and
                creative projects
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Simple <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free, scale as you grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-surface border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-3xl font-bold">
                $0
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <CardDescription>
                Perfect for trying out AI generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">10 credits per month</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">Text to Image generation</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">Basic templates</span>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-surface border-primary relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-ai">Most Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Creator</CardTitle>
              <div className="text-3xl font-bold">
                $9.99
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <CardDescription>
                For content creators and freelancers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">200 credits per month</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">Text to Image & Video</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">Premium templates</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">Priority generation</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-ai hover:opacity-90">
                Choose Creator
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="text-3xl font-bold">
                $29.99
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <CardDescription>For teams and businesses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">1000 credits per month</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">All generation features</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">Team collaboration</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">Advanced editing tools</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                Choose Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Loved by <span className="text-gradient">Creators</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what our users are saying
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-surface border-border">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4">
                "AICreate has revolutionized my content creation workflow. The
                quality is incredible and it's so fast!"
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-ai rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-semibold">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">
                    Content Creator
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4">
                "The video generation feature is mind-blowing. We've saved hours
                on our marketing campaigns."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-ai rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-semibold">Mike Chen</p>
                  <p className="text-xs text-muted-foreground">
                    Marketing Director
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4">
                "Perfect for our agency. The team features and templates have
                streamlined our entire process."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-ai rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-semibold">Emily Rodriguez</p>
                  <p className="text-xs text-muted-foreground">Agency Owner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-ai rounded">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">
                  AICreate
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                The future of AI-powered content generation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  API
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  Careers
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="block hover:text-foreground transition-colors"
                >
                  Status
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2024 AICreate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
