import { useState, useEffect, useRef } from "react";
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
  Calendar,
  MousePointer,
  Eye,
  Lightbulb,
  Workflow,
  BarChart3,
  TrendingUp,
  Clock,
  Settings,
  CreditCard,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const features = [
  {
    icon: Brain,
    title: "Advanced AI Models",
    description:
      "Powered by the latest FLUX Pro, Stable Diffusion XL, and cutting-edge video generation models with 2K+ output quality",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0,
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate high-quality content in seconds with our optimized infrastructure and global CDN",
    gradient: "from-yellow-500 to-orange-500",
    delay: 100,
  },
  {
    icon: Palette,
    title: "Creative Control",
    description:
      "Fine-tune every aspect with advanced parameters, style presets, and custom canvas tools",
    gradient: "from-purple-500 to-pink-500",
    delay: 200,
  },
  {
    icon: Globe,
    title: "Cloud Native",
    description:
      "Scale infinitely with our enterprise-grade cloud infrastructure and 99.9% uptime",
    gradient: "from-green-500 to-teal-500",
    delay: 300,
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with end-to-end encryption, GDPR compliance, and data protection",
    gradient: "from-red-500 to-rose-500",
    delay: 400,
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share, iterate, and collaborate on AI projects with advanced team management tools",
    gradient: "from-indigo-500 to-purple-500",
    delay: 500,
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Describe Your Vision",
    description:
      "Type a detailed description of what you want to create. Our AI understands natural language and creative concepts.",
    icon: Lightbulb,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop&auto=format",
  },
  {
    step: 2,
    title: "AI Processing Magic",
    description:
      "Our advanced AI models analyze your prompt and generate stunning visuals using state-of-the-art algorithms.",
    icon: Cpu,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop&auto=format",
  },
  {
    step: 3,
    title: "Instant High-Quality Results",
    description:
      "Get professional 2K+ images and HD videos in seconds. Download, share, or iterate with our canvas tools.",
    icon: TrendingUp,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop&auto=format",
  },
];

const interactiveDemo = {
  prompts: [
    "A majestic dragon soaring through clouds at sunset, digital art masterpiece",
    "Futuristic cyberpunk cityscape with neon lights, ultra detailed",
    "Serene mountain landscape with crystal clear lake, photorealistic",
    "Abstract geometric patterns in vibrant colors, modern art style",
  ],
  currentIndex: 0,
};

const testimonials = [
  {
    content:
      "AICreate has completely transformed our content pipeline. We're creating marketing assets 10x faster than before with incredible quality.",
    author: "Sarah Chen",
    role: "Creative Director",
    company: "TechFlow Inc.",
    avatar: "SC",
    rating: 5,
    metric: "10x faster content creation",
  },
  {
    content:
      "The 2K image quality is incredible. Our clients can't believe these are AI-generated. It's a complete game-changer for our agency.",
    author: "Marcus Rodriguez",
    role: "Founder",
    company: "PixelCraft Studio",
    avatar: "MR",
    rating: 5,
    metric: "99% client satisfaction",
  },
  {
    content:
      "Enterprise features and reliability we needed. The API integration was seamless and support has been outstanding.",
    author: "Emily Watson",
    role: "CTO",
    company: "MediaScale",
    avatar: "EW",
    rating: 5,
    metric: "50% cost reduction",
  },
];

const useCases = [
  {
    title: "Marketing & Advertising",
    description:
      "Create stunning marketing assets, social media content, and advertisements",
    icon: Target,
    examples: [
      "Social media posts",
      "Ad banners",
      "Product mockups",
      "Brand visuals",
    ],
    color: "from-blue-600 to-purple-600",
  },
  {
    title: "Content Creation",
    description:
      "Generate visual content for blogs, articles, and digital media",
    icon: Workflow,
    examples: [
      "Blog headers",
      "Article illustrations",
      "Website graphics",
      "Digital art",
    ],
    color: "from-purple-600 to-pink-600",
  },
  {
    title: "Product Design",
    description:
      "Visualize product concepts and create compelling product photography",
    icon: Layers,
    examples: [
      "Product concepts",
      "Prototyping",
      "Commercial photography",
      "3D renders",
    ],
    color: "from-pink-600 to-red-600",
  },
  {
    title: "Entertainment & Media",
    description:
      "Produce creative content for games, films, and digital entertainment",
    icon: Play,
    examples: [
      "Game assets",
      "Character design",
      "Concept art",
      "Video content",
    ],
    color: "from-red-600 to-orange-600",
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
      "Standard resolution (1024x1024)",
      "Basic canvas tools",
      "Community support",
    ],
    buttonText: "Start Free",
    buttonVariant: "outline" as const,
    popular: false,
    credits: 50,
  },
  {
    name: "Pro",
    price: 19,
    period: "/month",
    description: "For serious creators and professionals",
    features: [
      "1,000 credits monthly",
      "2K+ high-resolution output",
      "Video generation included",
      "Advanced canvas tools",
      "Priority processing",
      "Advanced style controls",
      "Email support",
      "Commercial usage rights",
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
    popular: true,
    credits: 1000,
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
      "Custom integrations",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
    credits: "Unlimited",
  },
];

export default function Index() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isAuthenticated, user } = useAuth();

  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Demo prompt rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemoIndex(
        (prev) => (prev + 1) % interactiveDemo.prompts.length,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/studio";
    } else {
      setAuthModalOpen(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Interactive Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 sticky top-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Pricing
              </button>
              <Link
                to="/studio"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Studio
              </Link>
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
            <div className="md:hidden border-t border-border/40 py-4 animate-in">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    scrollToSection("features");
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToSection("how-it-works");
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 text-left"
                >
                  How it Works
                </button>
                <button
                  onClick={() => {
                    scrollToSection("pricing");
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 text-left"
                >
                  Pricing
                </button>
                <Link
                  to="/studio"
                  className="text-sm font-medium text-foreground/80"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Studio
                </Link>
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-border/40">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/studio" onClick={() => setMobileMenuOpen(false)}>
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
                      onClick={() => {
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleGetStarted();
                        setMobileMenuOpen(false);
                      }}
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
      <section
        ref={heroRef}
        className="relative overflow-hidden py-20 lg:py-32"
        data-animate
        id="hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20" />
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className={`mb-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 transition-all duration-1000 ${
                isVisible.hero ? "animate-in" : "opacity-0 translate-y-4"
              }`}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Next-Generation AI Platform with 2K+ Quality
            </Badge>

            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-200 ${
                isVisible.hero ? "animate-in" : "opacity-0 translate-y-8"
              }`}
            >
              Create Stunning
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI Content
              </span>
              in Seconds
            </h1>

            <p
              className={`text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
                isVisible.hero ? "animate-in" : "opacity-0 translate-y-4"
              }`}
            >
              Transform your ideas into breathtaking 2K+ images and HD videos
              with the most advanced AI models. Professional quality, lightning
              fast, enterprise ready.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-600 ${
                isVisible.hero ? "animate-in" : "opacity-0 translate-y-4"
              }`}
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-muted/50 transition-all"
                onClick={() => scrollToSection("demo")}
              >
                <Play className="mr-2 h-5 w-5" />
                See Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground transition-all duration-1000 delay-800 ${
                isVisible.hero ? "animate-in" : "opacity-0"
              }`}
            >
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
      <section
        id="demo"
        className="container mx-auto px-4 lg:px-6 py-20"
        data-animate
      >
        <div
          className={`mx-auto max-w-4xl transition-all duration-1000 ${
            isVisible.demo ? "animate-in" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Interactive Demo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience AI Magic
            </h2>
            <p className="text-lg text-muted-foreground">
              See how our AI transforms text into stunning visuals
            </p>
          </div>

          <Card className="overflow-hidden border-2 shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1">
              <div className="bg-background rounded-t-lg">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">
                    AI Content Generator
                  </CardTitle>
                  <CardDescription>
                    Watch the prompt change and imagine the results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Live Prompt Display */}
                    <div className="bg-muted/50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <MousePointer className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold">Current Prompt:</h3>
                      </div>
                      <p
                        key={currentDemoIndex}
                        className="text-lg font-medium animate-in"
                      >
                        "{interactiveDemo.prompts[currentDemoIndex]}"
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="h-2 bg-muted rounded-full flex-1">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-3000"
                            style={{
                              width: `${((currentDemoIndex + 1) / interactiveDemo.prompts.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {currentDemoIndex + 1} /{" "}
                          {interactiveDemo.prompts.length}
                        </span>
                      </div>
                    </div>

                    {/* Demo Canvas */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Image className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">Text to Image (2K+)</h3>
                          <Badge variant="secondary">Enhanced Quality</Badge>
                        </div>
                        <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
                          <div className="text-center text-white z-10">
                            <Sparkles className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                            <p className="text-sm font-medium">
                              2048×2048 Resolution
                            </p>
                            <p className="text-xs opacity-80">
                              Professional Quality
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold">Text to Video (HD)</h3>
                          <Badge variant="secondary">Coming Soon</Badge>
                        </div>
                        <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse" />
                          <div className="text-center text-white z-10">
                            <Play className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                            <p className="text-sm font-medium">
                              HD Video Output
                            </p>
                            <p className="text-xs opacity-80">Cinema Quality</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        size="lg"
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                      >
                        Try This Now
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="bg-muted/30 py-20"
        data-animate
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["how-it-works"]
                ? "animate-in"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Badge variant="outline" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From Idea to Reality in 3 Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes AI content creation accessible to
              everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div
                key={step.step}
                className={`text-center transition-all duration-1000 ${
                  isVisible["how-it-works"]
                    ? "animate-in"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>

                <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>

                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-8 h-px bg-gradient-to-r from-purple-600 to-blue-600 transform translate-x-4" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
            >
              Start Your Journey
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="container mx-auto px-4 lg:px-6 py-20"
        data-animate
      >
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.features ? "animate-in" : "opacity-0 translate-y-8"
          }`}
        >
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
              className={`group hover:shadow-lg transition-all duration-500 border-2 hover:border-purple-200 dark:hover:border-purple-800 hover:-translate-y-1 ${
                isVisible.features ? "animate-in" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              <CardHeader>
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform`}
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

      {/* Use Cases Section */}
      <section className="bg-muted/30 py-20" data-animate id="use-cases">
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["use-cases"] ? "animate-in" : "opacity-0 translate-y-8"
            }`}
          >
            <Badge variant="outline" className="mb-4">
              Use Cases
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Endless Creative Possibilities
            </h2>
            <p className="text-lg text-muted-foreground">
              See how professionals across industries use AICreate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-all duration-500 cursor-pointer group hover:-translate-y-1 ${
                  isVisible["use-cases"]
                    ? "animate-in"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`h-12 w-12 bg-gradient-to-br ${useCase.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
                    {useCase.title}
                  </CardTitle>
                  <CardDescription className="mb-4">
                    {useCase.description}
                  </CardDescription>
                  <ul className="space-y-1">
                    {useCase.examples.map((example, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20" data-animate id="stats">
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${
              isVisible.stats ? "animate-in" : "opacity-0 translate-y-8"
            }`}
          >
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
      <section id="pricing" className="bg-muted/30 py-20" data-animate>
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.pricing ? "animate-in" : "opacity-0 translate-y-8"
            }`}
          >
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
                className={`relative hover:shadow-xl transition-all duration-500 ${
                  plan.popular
                    ? "border-2 border-purple-500 shadow-xl scale-105"
                    : "border-2 hover:border-purple-200 dark:hover:border-purple-800"
                } ${
                  isVisible.pricing ? "animate-in" : "opacity-0 translate-y-8"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
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
                  <div className="mt-4">
                    <Badge variant="secondary" className="text-xs">
                      {typeof plan.credits === "string"
                        ? plan.credits
                        : `${plan.credits} credits`}
                    </Badge>
                  </div>
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
                    className={`w-full transition-all ${
                      plan.buttonVariant === "default"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                        : "hover:bg-muted"
                    }`}
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
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                SOC 2 Compliant
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Global CDN
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                99.9% Uptime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" data-animate id="testimonials">
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.testimonials ? "animate-in" : "opacity-0 translate-y-8"
            }`}
          >
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
                className={`border-2 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${
                  isVisible.testimonials
                    ? "animate-in"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
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

                  <blockquote className="text-sm italic mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  <div className="flex items-center justify-between">
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
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.metric}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" data-animate id="cta">
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-1 transition-all duration-1000 ${
              isVisible.cta ? "animate-in" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-background rounded-3xl p-12 lg:p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-3xl" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Creative Workflow?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of creators, marketers, and businesses who are
                  already using AI to create stunning 2K+ content in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 px-8 py-6 text-lg font-semibold shadow-lg"
                  >
                    Start Creating Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg font-semibold border-2"
                    onClick={() => scrollToSection("demo")}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    See Demo
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-600" />
                    No credit card required
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-600" />
                    50 free credits
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-600" />
                    Cancel anytime
                  </span>
                </div>
              </div>
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
                into stunning 2K+ visuals with professional quality.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </button>
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

// Add grid pattern for background
const gridPatternStyle = `
  .bg-grid-pattern {
    background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  .dark .bg-grid-pattern {
    background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
  }
`;

// Inject the CSS
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = gridPatternStyle;
  document.head.appendChild(style);
}
