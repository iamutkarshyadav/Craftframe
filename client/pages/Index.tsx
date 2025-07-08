import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Heart,
  Download,
  ExternalLink,
} from "lucide-react";
import {
  features,
  pricingTiers,
  testimonials,
  sampleGenerations,
  useCases,
} from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";

export default function Index() {
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sampleGenerations.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const navigateToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sampleGenerations.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + sampleGenerations.length) % sampleGenerations.length,
    );
  };

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
                href="#showcase"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Showcase
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user?.name}
                  </span>
                  <Button
                    size="sm"
                    className="bg-gradient-ai hover:opacity-90"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-ai hover:opacity-90 text-xs sm:text-sm px-3 sm:px-4"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Content Generation
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Create Stunning <span className="text-gradient">AI Content</span> in
            Seconds
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into breathtaking images and videos with our
            advanced AI models. From concept to creation in just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-ai hover:opacity-90 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg"
              onClick={() =>
                isAuthenticated
                  ? (window.location.href = "/dashboard")
                  : setAuthModalOpen(true)
              }
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Creating Free"}{" "}
              <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg"
            >
              <Play className="w-4 md:w-5 h-4 md:h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Interactive Demo */}
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-surface rounded-2xl p-4 md:p-6 border border-border">
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
              <div className="bg-background rounded-lg p-4 text-left mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Enter your prompt:
                </p>
                <div className="bg-input rounded p-3 text-sm">
                  {activeTab === "image"
                    ? "A majestic dragon soaring through clouds at sunset, digital art, highly detailed"
                    : "A serene forest with gentle rain, cinematic shot, 4K quality"}
                </div>
              </div>
              <div className="h-48 md:h-64 bg-gradient-ai rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
                <div className="text-center z-10">
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

      {/* Generated Content Showcase */}
      <section id="showcase" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">AI Creations</span> by Our Community
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing content created by artists and creators using our
            AI models
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {sampleGenerations.map((item, index) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <Card className="bg-surface border-border mx-2">
                    <div className="relative">
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.prompt}
                          className="w-full h-64 md:h-80 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-64 md:h-80 bg-gradient-ai rounded-t-lg flex items-center justify-center">
                          <Play className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant={
                            item.type === "image" ? "default" : "secondary"
                          }
                        >
                          {item.type === "image" ? (
                            <Image className="w-3 h-3 mr-1" />
                          ) : (
                            <Video className="w-3 h-3 mr-1" />
                          )}
                          {item.type}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button size="sm" variant="secondary" className="p-2">
                          <Heart
                            className={`w-4 h-4 ${item.liked ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                        <Button size="sm" variant="secondary" className="p-2">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        "{item.prompt}"
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.model}</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {sampleGenerations.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => navigateToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-surface/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Endless <span className="text-gradient">Possibilities</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            See how creators are using AI to transform their workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="bg-background border-border hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {example}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful <span className="text-gradient">AI Features</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional-quality content with AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const iconMap: Record<string, any> = {
              Image,
              Video,
              Zap,
              Shield,
              Users,
              Sparkles,
            };
            const IconComponent = iconMap[feature.icon];

            return (
              <Card
                key={index}
                className="bg-surface border-border hover:bg-surface-hover transition-colors"
              >
                <CardHeader>
                  <IconComponent className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Start free, scale as you grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`bg-surface border-border relative ${
                tier.popular ? "border-primary" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-ai">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold">
                  ${tier.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {tier.period}
                  </span>
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className={`w-full ${
                    tier.buttonVariant === "default"
                      ? "bg-gradient-ai hover:opacity-90"
                      : ""
                  }`}
                  variant={tier.buttonVariant}
                >
                  {tier.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="text-gradient">Creators</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            See what our users are saying
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-surface border-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-ai rounded-full mr-3 flex items-center justify-center text-white text-xs font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-surface/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Something{" "}
            <span className="text-gradient">Amazing</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Join thousands of creators who are already using AI to transform
            their content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-ai hover:opacity-90 px-8 py-6 text-lg"
              onClick={() =>
                isAuthenticated
                  ? (window.location.href = "/dashboard")
                  : setAuthModalOpen(true)
              }
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Creating Now"}{" "}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              <ExternalLink className="w-5 h-5 mr-2" />
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

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
                  href="#features"
                  className="block hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
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
