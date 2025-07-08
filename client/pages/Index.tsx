import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthModal } from "@/components/auth/auth-modal";
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
  Brain,
  Palette,
  Wand2,
  Rocket,
  Globe,
  ChevronRight,
  ExternalLink,
  Download,
  Heart,
  Layers,
  Gauge,
  Trophy,
  Target,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const features = [
  {
    icon: Brain,
    title: "Advanced AI Models",
    description:
      "Powered by the latest Stable Diffusion, FLUX, and cutting-edge video generation models",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate high-quality content in seconds with our optimized infrastructure",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Palette,
    title: "Creative Control",
    description:
      "Fine-tune every aspect with advanced parameters and style controls",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Globe,
    title: "Cloud Native",
    description:
      "Scale infinitely with our enterprise-grade cloud infrastructure",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with end-to-end encryption and data protection",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share, iterate, and collaborate on AI projects with your team",
    gradient: "from-indigo-500 to-purple-500",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: 0,
    period: "/month",
    description: "Perfect for exploring AI generation",
    features: [
      "50 free credits monthly",
      "Text-to-image generation",
      "Basic resolution (512x512)",
      "Standard processing speed",
      "Community support",
    ],
    buttonText: "Start Free",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: 19,
    period: "/month",
    description: "For serious creators and professionals",
    features: [
      "1,000 credits monthly",
      "High-resolution output (2K)",
      "Video generation included",
      "Priority processing",
      "Advanced style controls",
      "Email support",
      "Commercial usage rights",
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Unlimited credits",
      "Ultra HD output (4K+)",
      "Custom model training",
      "API access",
      "Team management",
      "Priority support",
      "SLA guarantee",
      "White-label options",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
  },
];

const testimonials = [
  {
    content:
      "AICreate has completely transformed our content pipeline. We're creating marketing assets 10x faster than before.",
    author: "Sarah Chen",
    role: "Creative Director",
    company: "TechFlow Inc.",
    avatar: "SC",
    rating: 5,
  },
  {
    content:
      "The quality is incredible. Our clients can't believe these images are AI-generated. It's a game-changer for our agency.",
    author: "Marcus Rodriguez",
    role: "Founder",
    company: "PixelCraft Studio",
    avatar: "MR",
    rating: 5,
  },
  {
    content:
      "Enterprise features and reliability we needed. The API integration was seamless and support has been outstanding.",
    author: "Emily Watson",
    role: "CTO",
    company: "MediaScale",
    avatar: "EW",
    rating: 5,
  },
];

export default function Index() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/studio";
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AICreate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <Link
                to="/studio"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Studio
              </Link>
              <a
                href="#"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Docs
              </a>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{user?.credits || 0}</span>
                  </div>
                  <Link to="/studio">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                    >
                      Open Studio
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/40 py-4">
              <div className="flex flex-col space-y-3">
                <a
                  href="#features"
                  className="text-sm font-medium text-foreground/80"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-sm font-medium text-foreground/80"
                >
                  Pricing
                </a>
                <Link
                  to="/studio"
                  className="text-sm font-medium text-foreground/80"
                >
                  Studio
                </Link>
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-border/40">
                    <Link to="/dashboard">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/studio">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        Open Studio
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-border/40">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAuthModalOpen(true)}
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleGetStarted}
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20" />
        <div className="container mx-auto px-4 lg:px-6 py-20 lg:py-32 relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Next-Generation AI Platform
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Create Stunning
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI Content
              </span>
              in Seconds
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into breathtaking images and videos with the
              most advanced AI models. Professional quality, lightning fast,
              enterprise ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 px-8 py-6 text-lg font-semibold shadow-lg"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold border-2"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span>4.9/5 from 2,500+ users</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <div>Trusted by 10,000+ creators worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="container mx-auto px-4 lg:px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-2 shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1">
              <div className="bg-background rounded-t-lg">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">
                    Try AI Generation
                  </CardTitle>
                  <CardDescription>
                    Experience the power of our AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image Generation Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Image className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Text to Image</h3>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Prompt:
                        </p>
                        <p className="text-sm font-medium">
                          "A majestic lion in a mystical forest, digital art,
                          highly detailed"
                        </p>
                      </div>
                      <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <Sparkles className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                          <p className="text-sm font-medium">
                            AI Generated Image
                          </p>
                          <p className="text-xs opacity-80">Preview Mode</p>
                        </div>
                      </div>
                    </div>

                    {/* Video Generation Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Video className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold">Text to Video</h3>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Prompt:
                        </p>
                        <p className="text-sm font-medium">
                          "Ocean waves at sunset, cinematic shot, peaceful
                          atmosphere"
                        </p>
                      </div>
                      <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                          <p className="text-sm font-medium">
                            AI Generated Video
                          </p>
                          <p className="text-xs opacity-80">Preview Mode</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <Button
                      size="lg"
                      onClick={handleGetStarted}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                    >
                      Start Creating Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 lg:px-6 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful AI at Your Fingertips
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional-quality content with
            cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800"
            >
              <CardHeader>
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} mb-4`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                2M+
              </div>
              <div className="text-sm text-muted-foreground">
                Images Generated
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                500K+
              </div>
              <div className="text-sm text-muted-foreground">
                Videos Created
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                50K+
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 lg:px-6 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Creative Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-2 border-purple-500 shadow-xl scale-105" : "border-2"} hover:shadow-lg transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Trophy className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="mr-3 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.buttonVariant === "default" ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90" : ""}`}
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={handleGetStarted}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include 24/7 support and 30-day money-back guarantee
          </p>
          <Button variant="outline" size="lg">
            <ExternalLink className="mr-2 h-4 w-4" />
            Compare All Features
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our community is saying about AICreate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-2 hover:shadow-lg transition-all"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <blockquote className="text-sm italic mb-6">
                    "{testimonial.content}"
                  </blockquote>

                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-1">
          <div className="bg-background rounded-3xl p-12 lg:p-16 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Creative Workflow?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators, marketers, and businesses who are
                already using AI to create stunning content.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 px-8 py-6 text-lg font-semibold"
                >
                  Start Creating Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold border-2"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Demo
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • Start with 50 free credits • Cancel
                anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AICreate
                </span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                The future of AI-powered content creation. Transform your ideas
                into stunning visuals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    to="/studio"
                    className="hover:text-foreground transition-colors"
                  >
                    Studio
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 AICreate. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Discord</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
