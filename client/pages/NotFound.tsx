import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Home,
  ArrowLeft,
  Search,
  Wand2,
  BarChart3,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AICreate
          </span>
        </Link>

        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-muted-foreground/20 mb-4">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <Search className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Page Not Found</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a
            different location.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 px-8"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="px-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Link to="/studio">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-200 dark:hover:border-purple-800">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">Studio</CardTitle>
                <CardDescription>Create AI images and videos</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">Dashboard</CardTitle>
                <CardDescription>View your creations</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-200 dark:hover:border-green-800">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">Home</CardTitle>
                <CardDescription>Back to homepage</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-sm text-muted-foreground">
          <p>
            Need help? Contact our{" "}
            <Button variant="link" className="p-0 h-auto text-sm">
              support team
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
