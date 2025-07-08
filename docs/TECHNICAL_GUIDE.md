# 🔧 CraftFrame Technical Documentation

**Comprehensive technical guide for developers, system administrators, and contributors.**

---

## 📋 **Table of Contents**

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [API Documentation](#api-documentation)
4. [Database Schema](#database-schema)
5. [AI Model Integration](#ai-model-integration)
6. [Authentication System](#authentication-system)
7. [File Upload & Storage](#file-upload--storage)
8. [Error Handling](#error-handling)
9. [Performance Optimization](#performance-optimization)
10. [Security Implementation](#security-implementation)
11. [Testing Strategy](#testing-strategy)
12. [Monitoring & Logging](#monitoring--logging)

---

## 🏗️ **Architecture Overview**

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (HuggingFace) │
│                 │    │                 │    │   (Pollinations)│
│   • Studio      │    │   • Auth API    │    │   • FLUX.1      │
│   • Canvas      │    │   • Gen API     │    │   • SDXL        │
│   • Dashboard   │    │   • User API    │    │   • CogVideoX   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌──────────��──────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Middleware    │    │   Model Router  │
│   • Button      │    │   • Auth Check  │    │   • Quality     │
│   • Canvas      │    │   • Rate Limit  │    │   • Fallback    │
│   • Forms       │    │   • CORS        │    │   • Load Balance│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Request Flow

```
User Request → Frontend → Auth Check → Rate Limit → AI Service → Model Selection → Generation → Response → Canvas Display
```

---

## 🛠️ **Technology Stack**

### Frontend Stack

```typescript
// Core Framework
React 18.2.0           // Modern React with Hooks and Suspense
TypeScript 5.0+        // Type safety and developer experience
Vite 4.0+             // Fast build tool and dev server

// Styling & UI
TailwindCSS 3.3+      // Utility-first CSS framework
Radix UI              // Accessible component primitives
Lucide Icons          // Beautiful icon library
Framer Motion         // Smooth animations (optional)

// State Management
React Query           // Server state management
Context API           // Global state (auth, theme)
Local Storage         // Persistent client storage

// Routing & Navigation
React Router 6        // Client-side routing
History API           // Browser navigation

// Development Tools
ESLint + Prettier     // Code quality and formatting
Husky                 // Git hooks
TypeScript ESLint     // TS-specific linting
```

### Backend Stack

```typescript
// Core Framework
Node.js 18+           // JavaScript runtime
Express 4.18+         // Web application framework
TypeScript 5.0+       // Type safety for backend

// Authentication & Security
JSON Web Token        // Stateless authentication
bcryptjs             // Password hashing
cors                 // Cross-origin resource sharing
helmet               // Security headers
express-rate-limit   // Rate limiting

// AI Integration
@huggingface/inference // HuggingFace API client
axios                // HTTP client for API calls
form-data            // Multipart form handling

// Utilities
dotenv               // Environment configuration
uuid                 // Unique identifier generation
multer               // File upload handling
```

---

## 🌐 **API Documentation**

### Authentication Endpoints

#### POST `/api/auth/login`

Authenticate user and return JWT token.

**Request:**

```typescript
{
  email: string;
  password: string;
}
```

**Response:**

```typescript
{
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    credits: number;
  }
}
```

#### POST `/api/auth/register`

Create new user account.

**Request:**

```typescript
{
  email: string;
  password: string;
  name: string;
}
```

#### POST `/api/auth/demo`

Get demo account access.

**Response:**

```typescript
{
  token: string;
  user: DemoUser;
}
```

### Generation Endpoints

#### POST `/api/studio/generate-image`

Generate AI image with specified parameters.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request:**

```typescript
{
  prompt: string;
  model: "flux-pro" | "flux-dev" | "sdxl" | "huggingface";
  category: "photorealistic" | "anime" | "painting" | "sketch" | "realistic" | "3d-render" | "abstract" | "fantasy";
  size?: "1024x1024" | "2048x2048" | "1920x1080";
  steps?: number; // 10-50
  cfg_scale?: number; // 1-20
  style?: string;
}
```

**Response:**

```typescript
{
  id: string;
  url?: string;
  status: "generating" | "completed" | "failed";
  metadata: {
    width: number;
    height: number;
    model: string;
    category: string;
    enhancedPrompt?: string;
    source: string;
  }
}
```

#### POST `/api/studio/generate-video`

Generate AI video content.

**Request:**

```typescript
{
  prompt: string;
  model: "huggingface" | "pika" | "luma" | "runway";
  duration?: number; // 3-10 seconds
  fps?: number; // 8-30 fps
  style?: string;
}
```

#### GET `/api/studio/generation/:id`

Check generation status and retrieve result.

**Response:**

```typescript
{
  id: string;
  status: "generating" | "completed" | "failed";
  url?: string;
  progress?: number; // 0-100
  error?: string;
  metadata?: object;
}
```

### User Management

#### GET `/api/users/profile`

Get current user profile information.

#### PUT `/api/users/profile`

Update user profile.

#### GET `/api/users/generations`

Get user's generation history.

**Query Parameters:**

- `page?: number` - Page number (default: 1)
- `limit?: number` - Items per page (default: 20)
- `type?: "image" | "video"` - Filter by type

---

## 🗄️ **Database Schema**

### In-Memory Data Structures

```typescript
// User Interface
interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  credits: number;
  createdAt: Date;
  lastLogin?: Date;
}

// Generation Record
interface Generation {
  id: string;
  userId: string;
  type: "image" | "video";
  prompt: string;
  model: string;
  category?: string;
  settings: {
    steps?: number;
    cfg_scale?: number;
    size?: string;
    duration?: number;
    fps?: number;
    style?: string;
  };
  status: "generating" | "completed" | "failed";
  url?: string;
  metadata?: {
    width?: number;
    height?: number;
    source?: string;
    quality?: string;
    enhancedPrompt?: string;
  };
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

// Session Data
interface Session {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
```

### Data Storage Strategy

**Current Implementation:**

- In-memory storage for development/demo
- Data persists during server runtime
- Resets on server restart

**Production Recommendations:**

```typescript
// Database Options
- PostgreSQL: Relational data with JSONB for metadata
- MongoDB: Document-based for flexible schemas
- Redis: Session storage and caching
- AWS S3/Cloudinary: File storage for generated content
```

---

## 🤖 **AI Model Integration**

### Model Architecture

#### Image Generation Pipeline

```typescript
class ImageGenerationService {
  async generateImage(request: GenerationRequest): Promise<GenerationResult> {
    // 1. Validate request parameters
    // 2. Select optimal model based on category
    // 3. Enhance prompt with category-specific suffixes
    // 4. Apply advanced settings (steps, CFG scale)
    // 5. Try primary model
    // 6. Fallback to secondary models if needed
    // 7. Post-process and validate output
    // 8. Return generation result
  }
}
```

#### Video Generation Pipeline

```typescript
class VideoGenerationService {
  async generateVideo(request: GenerationRequest): Promise<GenerationResult> {
    // 1. Validate video parameters
    // 2. Select model by quality preference
    // 3. Configure duration and FPS
    // 4. Try HuggingFace models first
    // 5. Fallback to alternative providers
    // 6. Validate video output
    // 7. Return video URL or base64
  }
}
```

### Model Configuration

#### HuggingFace Models

```typescript
const HUGGINGFACE_MODELS = {
  image: [
    {
      id: "black-forest-labs/FLUX.1-dev",
      name: "FLUX.1 Dev",
      quality: "premium",
      credits: 4,
      maxResolution: "2048x2048",
    },
    {
      id: "stabilityai/stable-diffusion-xl-base-1.0",
      name: "SDXL",
      quality: "professional",
      credits: 3,
      maxResolution: "1024x1024",
    },
  ],
  video: [
    {
      id: "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
      name: "Stable Video Diffusion XL",
      quality: "premium",
      credits: 5,
      maxDuration: 25,
    },
    {
      id: "THUDM/CogVideoX-5b",
      name: "CogVideoX-5B",
      quality: "professional",
      credits: 4,
      maxFrames: 49,
    },
  ],
};
```

#### Fallback Strategy

```typescript
const FALLBACK_HIERARCHY = {
  image: [
    "huggingface", // Try HF models first
    "pollinations", // Reliable fallback
    "demo", // Demo images as last resort
  ],
  video: [
    "huggingface", // Premium HF models
    "pika", // Professional quality
    "luma", // Good quality
    "runway", // Alternative
    "demo", // Demo videos
  ],
};
```

---

## 🔐 **Authentication System**

### JWT Implementation

```typescript
// Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  iat: number; // Issued at
  exp: number; // Expires at
}

// Token Generation
function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
}

// Token Validation
function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}
```

### Authentication Middleware

```typescript
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = findUserById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
```

### Demo Account System

```typescript
const DEMO_USER = {
  id: "demo-user-id",
  email: "demo@craftframe.app",
  name: "Demo User",
  credits: 1000,
  password: "hashed_demo123",
};

// Auto-refresh demo credits
setInterval(() => {
  if (DEMO_USER.credits < 100) {
    DEMO_USER.credits = 1000;
    console.log("Demo credits refreshed");
  }
}, 60000); // Every minute
```

---

## 📁 **File Upload & Storage**

### File Handling Strategy

```typescript
// Current: Base64 encoding for small files
// Recommended: Cloud storage for production

interface FileHandler {
  upload(file: Buffer): Promise<string>;
  download(url: string): Promise<Buffer>;
  delete(url: string): Promise<void>;
}

// Cloud Storage Implementation (Recommended)
class CloudinaryStorage implements FileHandler {
  async upload(file: Buffer): Promise<string> {
    // Upload to Cloudinary
    // Return public URL
  }
}

class S3Storage implements FileHandler {
  async upload(file: Buffer): Promise<string> {
    // Upload to AWS S3
    // Return signed URL
  }
}
```

### Image Processing Pipeline

```typescript
class ImageProcessor {
  async processGeneration(imageData: Buffer): Promise<ProcessedImage> {
    // 1. Validate image format
    // 2. Optimize file size
    // 3. Generate thumbnails
    // 4. Extract metadata
    // 5. Apply watermark (optional)
    // 6. Store in multiple formats
  }
}
```

---

## ⚠️ **Error Handling**

### Error Types & Responses

```typescript
// Custom Error Classes
class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

class RateLimitError extends Error {
  constructor(public retryAfter: number) {
    super("Rate limit exceeded");
  }
}

// Error Response Format
interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
  requestId?: string;
}

// Global Error Handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const response: ErrorResponse = {
    error: error.message,
    timestamp: new Date().toISOString(),
    requestId: req.headers["x-request-id"] as string,
  };

  if (error instanceof AIServiceError) {
    return res.status(error.statusCode).json({
      ...response,
      code: error.code,
    });
  }

  if (error instanceof RateLimitError) {
    return res.status(429).json({
      ...response,
      retryAfter: error.retryAfter,
    });
  }

  // Default server error
  res.status(500).json(response);
});
```

### AI Service Error Handling

```typescript
class AIServiceManager {
  async generateWithFallback(
    request: GenerationRequest,
  ): Promise<GenerationResult> {
    const models = this.getModelHierarchy(request.type);

    for (const model of models) {
      try {
        const result = await this.tryModel(model, request);
        if (result.status === "completed") {
          return result;
        }
      } catch (error) {
        console.log(`Model ${model} failed:`, error.message);
        // Continue to next model
      }
    }

    // All models failed
    throw new AIServiceError(
      "All AI models failed to generate content",
      "GENERATION_FAILED",
      503,
    );
  }
}
```

---

## ⚡ **Performance Optimization**

### Frontend Optimization

```typescript
// Code Splitting
const Studio = lazy(() => import('./pages/Studio'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Image Optimization
const OptimizedImage = ({ src, alt }: ImageProps) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    onLoad={handleImageLoad}
    onError={handleImageError}
  />
);

// Memoization
const GenerationCard = memo(({ generation }: Props) => {
  // Expensive rendering logic
});

// Debounced Search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### Backend Optimization

```typescript
// Request Caching
const cache = new Map<string, CacheEntry>();

const getCachedResult = (key: string): GenerationResult | null => {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

// Connection Pooling
const aiServicePool = {
  huggingface: new ConnectionPool(5),
  pollinations: new ConnectionPool(10),
  runway: new ConnectionPool(3),
};

// Async Queue Management
class GenerationQueue {
  private queue: QueueItem[] = [];
  private processing = new Set<string>();

  async enqueue(request: GenerationRequest): Promise<void> {
    // Add to queue with priority
    // Process concurrently with limits
  }
}
```

### Caching Strategy

```typescript
// Cache Layers
const CACHE_CONFIG = {
  // Browser cache (client-side)
  browser: {
    images: "1h",
    static: "24h",
    api: "5m",
  },

  // Server cache (memory/Redis)
  server: {
    generations: "1h",
    userProfiles: "15m",
    aiResponses: "30m",
  },

  // CDN cache (edge)
  cdn: {
    images: "7d",
    static: "30d",
    api: "1m",
  },
};
```

---

## 🛡️ **Security Implementation**

### Security Headers

```typescript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "https://api-inference.huggingface.co"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);
```

### Rate Limiting

```typescript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});

const generationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 generations per minute
  keyGenerator: (req) => req.user?.id || req.ip,
});
```

### Input Validation

```typescript
const generateImageSchema = {
  prompt: {
    type: "string",
    minLength: 3,
    maxLength: 500,
    pattern: /^[a-zA-Z0-9\s\-.,!?]+$/,
  },
  model: {
    type: "string",
    enum: ["flux-pro", "flux-dev", "sdxl", "huggingface"],
  },
  steps: {
    type: "number",
    min: 10,
    max: 50,
  },
};

const validateRequest =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = validate(req.body, schema);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  };
```

### API Key Protection

```typescript
// Environment variable validation
const requiredEnvVars = ["JWT_SECRET", "HUGGING_FACE_API_KEY"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// API key rotation
class APIKeyManager {
  private keys: Map<string, APIKey> = new Map();

  rotateKey(service: string): void {
    // Implement key rotation logic
  }

  getActiveKey(service: string): string {
    // Return currently active key
  }
}
```

---

## 🧪 **Testing Strategy**

### Test Structure

```typescript
// Unit Tests
describe("AIServiceProduction", () => {
  test("should generate image with correct parameters", async () => {
    const request = {
      prompt: "A beautiful sunset",
      model: "flux-pro",
      category: "photorealistic",
    };

    const result = await generateImage(request);

    expect(result.status).toBe("completed");
    expect(result.url).toBeDefined();
    expect(result.metadata.width).toBeGreaterThanOrEqual(2048);
  });
});

// Integration Tests
describe("Studio API", () => {
  test("should create generation with authentication", async () => {
    const token = await loginAsDemo();

    const response = await request(app)
      .post("/api/studio/generate-image")
      .set("Authorization", `Bearer ${token}`)
      .send({
        prompt: "Test image",
        model: "flux-dev",
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
  });
});

// E2E Tests (Playwright/Cypress)
test("user can generate and view image", async ({ page }) => {
  await page.goto("/studio");
  await page.fill("[data-testid=prompt-input]", "A beautiful landscape");
  await page.click("[data-testid=generate-button]");

  await expect(page.locator("[data-testid=canvas-image]")).toBeVisible();
});
```

### Test Configuration

```typescript
// Jest Configuration
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/tests/**"],
};

// Test Utilities
export const createTestUser = (): User => ({
  id: "test-user",
  email: "test@example.com",
  name: "Test User",
  credits: 100,
});

export const mockAIResponse = (type: "image" | "video") => {
  // Mock successful AI service response
};
```

---

## 📊 **Monitoring & Logging**

### Logging Implementation

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Usage
logger.info("Generation started", {
  userId: user.id,
  type: "image",
  model: "flux-pro",
});

logger.error("AI service failed", {
  error: error.message,
  service: "huggingface",
  requestId: req.id,
});
```

### Performance Metrics

```typescript
class MetricsCollector {
  private metrics = new Map<string, Metric>();

  recordGeneration(duration: number, success: boolean, model: string): void {
    this.metrics.set(`generation.${model}.duration`, duration);
    this.metrics.set(`generation.${model}.success`, success ? 1 : 0);
  }

  recordAPICall(service: string, duration: number, statusCode: number): void {
    this.metrics.set(`api.${service}.duration`, duration);
    this.metrics.set(`api.${service}.status.${statusCode}`, 1);
  }

  getMetrics(): MetricsSummary {
    // Return aggregated metrics
  }
}

// Health Check Endpoint
app.get("/health", (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      huggingface: checkHuggingFaceHealth(),
      database: checkDatabaseHealth(),
    },
  };

  res.json(health);
});
```

### Error Tracking

```typescript
// Sentry Integration (Production)
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// Custom Error Tracking
class ErrorTracker {
  track(error: Error, context: ErrorContext): void {
    logger.error("Application error", {
      error: error.message,
      stack: error.stack,
      context,
    });

    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error, { extra: context });
    }
  }
}
```

---

## 🔄 **API Versioning & Migration**

### Versioning Strategy

```typescript
// URL-based versioning
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

// Header-based versioning
const versionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const version = req.headers["api-version"] || "v1";
  req.apiVersion = version;
  next();
};

// Backwards compatibility
const compatibilityLayer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.apiVersion === "v1") {
    // Transform v1 request to v2 format
    req.body = transformV1ToV2(req.body);
  }
  next();
};
```

### Migration Scripts

```typescript
// Database migration example
class Migration_002_AddUserCredits {
  async up(): Promise<void> {
    // Add credits field to users
    users.forEach((user) => {
      if (!user.credits) {
        user.credits = 50; // Default credits
      }
    });
  }

  async down(): Promise<void> {
    // Remove credits field
    users.forEach((user) => {
      delete user.credits;
    });
  }
}
```

---

This technical guide provides comprehensive information for understanding, developing, and maintaining the CraftFrame platform. For specific implementation questions, refer to the source code or contact the development team.
