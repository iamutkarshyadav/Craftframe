# 🚀 CraftFrame Deployment Guide

**Complete step-by-step guide for deploying CraftFrame to Vercel and other platforms.**

---

## 📋 **Table of Contents**

1. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
2. [Manual Deployment Steps](#manual-deployment-steps)
3. [Environment Configuration](#environment-configuration)
4. [Domain & DNS Setup](#domain--dns-setup)
5. [Performance Optimization](#performance-optimization)
6. [Alternative Platforms](#alternative-platforms)
7. [Database Setup (Production)](#database-setup-production)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [Troubleshooting](#troubleshooting)
10. [CI/CD Pipeline](#cicd-pipeline)

---

## 🌟 **Vercel Deployment (Recommended)**

Vercel provides the easiest and most optimized deployment for Next.js and React applications.

### Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- Project pushed to a Git repository
- Environment variables configured

### Quick Deployment (5 Minutes)

#### Method 1: One-Click Deploy

```bash
# Deploy directly from GitHub
1. Visit: https://vercel.com/new
2. Import your Git repository
3. Configure build settings (auto-detected)
4. Add environment variables
5. Click "Deploy"
```

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd craftframe
vercel

# Follow the prompts:
# ? Set up and deploy "~/craftframe"? [Y/n] y
# ? Which scope do you want to deploy to? Your Personal Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? craftframe
# ? In which directory is your code located? ./

# Production deployment
vercel --prod
```

---

## 🔧 **Manual Deployment Steps**

### Step 1: Prepare Your Repository

#### Project Structure for Vercel

```
craftframe/
├── api/                    # Serverless functions (Vercel)
│   ├── auth/
│   │   ├── login.ts
│   │   ├── register.ts
│   │   └── demo.ts
│   ├── studio/
│   │   ├── generate-image.ts
│   │   ├── generate-video.ts
│   │   └── generation/[id].ts
│   └── users/
│       └── profile.ts
├── client/                 # Frontend React app
├── server/                 # Backend logic (imported by API routes)
├── public/                 # Static assets
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies and scripts
└── .env.example           # Environment template
```

#### Create Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "name": "craftframe",
  "builds": [
    {
      "src": "client/index.html",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    },
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "client": "cd client && vite",
    "server": "cd server && nodemon index.ts",
    "build": "npm run build:client",
    "build:client": "cd client && vite build",
    "build:server": "cd server && tsc",
    "start": "node server/dist/index.js",
    "vercel-build": "npm run build:client",
    "test": "npm run test:client && npm run test:server",
    "test:client": "cd client && vitest",
    "test:server": "cd server && jest"
  }
}
```

### Step 2: Convert Express Routes to Vercel Functions

#### Create API Directory Structure

```bash
mkdir -p api/auth api/studio api/users
```

#### Convert Express Routes to Serverless Functions

**api/auth/login.ts:**

```typescript
import { VercelRequest, VercelResponse } from "@vercel/node";
import { loginHandler } from "../../server/routes/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await loginHandler(req, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
```

**api/studio/generate-image.ts:**

```typescript
import { VercelRequest, VercelResponse } from "@vercel/node";
import { generateImage } from "../../server/lib/ai-service-production";
import { authenticateToken } from "../../server/middleware/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Authentication middleware adaptation
    const authResult = await authenticateToken(req);
    if (!authResult.success) {
      res.status(401).json({ error: authResult.error });
      return;
    }

    const result = await generateImage(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Generation failed" });
  }
}
```

### Step 3: Update Frontend Configuration

**client/vite.config.ts:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target:
          process.env.NODE_ENV === "development"
            ? "http://localhost:5000"
            : "https://your-vercel-domain.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
```

---

## ⚙️ **Environment Configuration**

### Step 1: Prepare Environment Variables

Create a `.env.production` file for production values:

```bash
# Production Environment Variables
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret-64-characters-minimum
HUGGING_FACE_API_KEY=hf_your_production_token

# Optional Production APIs
RUNWAY_API_KEY=your_runway_production_key
PIKA_API_KEY=your_pika_production_key
LUMALABS_API_KEY=your_luma_production_key

# Database (if using)
DATABASE_URL=postgresql://user:pass@host:5432/craftframe_prod

# File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=craftframe-production

# Error Tracking
SENTRY_DSN=your_production_sentry_dsn

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
```

### Step 2: Add Variables to Vercel

#### Via Vercel Dashboard

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate environment:
   - `Production` - for live site
   - `Preview` - for preview deployments
   - `Development` - for local development

#### Via Vercel CLI

```bash
# Add production environment variables
vercel env add JWT_SECRET production
vercel env add HUGGING_FACE_API_KEY production
vercel env add RUNWAY_API_KEY production

# Add preview environment variables
vercel env add JWT_SECRET preview
vercel env add HUGGING_FACE_API_KEY preview

# Pull environment variables for local development
vercel env pull .env.local
```

### Step 3: Secure Your Environment Variables

```bash
# Generate secure JWT secret (64 characters minimum)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Verify environment variables are loaded
vercel logs <deployment-url>
```

---

## 🌐 **Domain & DNS Setup**

### Step 1: Add Custom Domain

#### Via Vercel Dashboard

1. Go to Project Settings → Domains
2. Add your domain: `your-domain.com`
3. Configure DNS records as instructed

#### Via Vercel CLI

```bash
# Add domain
vercel domains add your-domain.com

# List domains
vercel domains ls
```

### Step 2: Configure DNS Records

#### For Domain Registrar (GoDaddy, Namecheap, etc.)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

#### For Cloudflare

```
Type: CNAME
Name: your-domain.com
Value: cname.vercel-dns.com
Proxy Status: DNS only (gray cloud)
```

### Step 3: SSL Certificate

- Vercel automatically provides SSL certificates
- Certificates are issued by Let's Encrypt
- Auto-renewal is handled by Vercel

### Step 4: Redirect Configuration

Add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://your-domain.com/$1",
      "permanent": true,
      "has": [
        {
          "type": "host",
          "value": "www.your-domain.com"
        }
      ]
    }
  ]
}
```

---

## ⚡ **Performance Optimization**

### Frontend Optimizations

#### Code Splitting

```typescript
// Lazy load pages
const Studio = lazy(() => import('./pages/Studio'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Component with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Studio />
</Suspense>
```

#### Image Optimization

```typescript
// Use Vercel Image Optimization
import Image from 'next/image';

<Image
  src="/generated-image.jpg"
  alt="AI Generated"
  width={512}
  height={512}
  priority={true}
  placeholder="blur"
/>
```

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Backend Optimizations

#### API Route Caching

```typescript
// Add caching headers
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  // API logic
}
```

#### Edge Functions (Beta)

```javascript
// api/edge-example.js
export const config = {
  runtime: "edge",
};

export default function handler(req) {
  return new Response("Hello from Edge!");
}
```

### Vercel Analytics

#### Add Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// Add to main App component
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

---

## 🎯 **Alternative Platforms**

### Netlify Deployment

#### netlify.toml

```toml
[build]
  publish = "client/dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=client/dist
```

### Railway Deployment

#### railway.toml

```toml
[build]
cmd = "npm run build"

[deploy]
startCommand = "npm start"

[env]
NODE_ENV = "production"
```

#### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Heroku Deployment

#### Procfile

```
web: npm start
```

#### Deploy to Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create craftframe-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set HUGGING_FACE_API_KEY=your-key

# Deploy
git push heroku main
```

---

## 🗄️ **Database Setup (Production)**

### PostgreSQL on Vercel

#### Setup Vercel Postgres

```bash
# Add Vercel Postgres
vercel postgres create

# Connect to your project
vercel postgres connect
```

#### Database Schema

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  credits INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create generations table
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  prompt TEXT NOT NULL,
  model VARCHAR(100) NOT NULL,
  settings JSONB,
  status VARCHAR(20) DEFAULT 'generating',
  url TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at);
```

### Redis for Session Storage

#### Setup Upstash Redis

```bash
# Add Upstash Redis integration
vercel integrations add upstash
```

#### Redis Configuration

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Session storage
export const setSession = async (userId: string, sessionData: any) => {
  await redis.setex(`session:${userId}`, 3600, JSON.stringify(sessionData));
};

export const getSession = async (userId: string) => {
  const data = await redis.get(`session:${userId}`);
  return data ? JSON.parse(data as string) : null;
};
```

---

## 📊 **Monitoring & Analytics**

### Error Tracking with Sentry

#### Setup Sentry

```bash
npm install @sentry/node @sentry/react
```

#### Sentry Configuration

```typescript
// api/sentry.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// React app
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});
```

### Performance Monitoring

#### Vercel Analytics

- Automatic page view tracking
- Core Web Vitals monitoring
- Custom event tracking

#### Google Analytics 4

```typescript
// Install GA4
npm install gtag

// Setup tracking
import { gtag } from 'gtag';

gtag('config', process.env.REACT_APP_GA_ID, {
  page_title: document.title,
  page_location: window.location.href,
});
```

### Health Checks

#### API Health Endpoint

```typescript
// api/health.ts
export default function handler(req: VercelRequest, res: VercelResponse) {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    services: {
      huggingface: checkHuggingFaceHealth(),
      database: checkDatabaseHealth(),
    },
  };

  res.status(200).json(health);
}
```

---

## 🐛 **Troubleshooting**

### Common Deployment Issues

#### Build Failures

```bash
# Check build logs
vercel logs <deployment-url>

# Debug locally
npm run build
npm run start

# Clear cache
vercel --force
```

#### Function Timeout

```json
// Increase timeout in vercel.json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

#### Environment Variable Issues

```bash
# Check variables are set
vercel env ls

# Pull variables locally
vercel env pull .env.local

# Verify in deployment
console.log('HF Key exists:', !!process.env.HUGGING_FACE_API_KEY);
```

#### CORS Issues

```typescript
// Add CORS headers to all API routes
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader(
  "Access-Control-Allow-Methods",
  "GET, POST, PUT, DELETE, OPTIONS",
);
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
```

### Performance Issues

#### Cold Start Optimization

```typescript
// Keep functions warm
export const config = {
  maxDuration: 60,
  memory: 512,
};

// Minimize imports
import { generateImage } from "../lib/ai-service";
// Instead of importing entire module
```

#### Memory Optimization

```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 1024
    }
  }
}
```

---

## 🔄 **CI/CD Pipeline**

### GitHub Actions Workflow

#### .github/workflows/deploy.yml

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: "--prod"
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Automated Testing

#### Pre-deployment Tests

```bash
# Add to package.json scripts
"pre-deploy": "npm run test && npm run build && npm run check-types"
```

#### Integration Tests

```typescript
// tests/integration/deployment.test.ts
describe("Deployment Health", () => {
  test("API endpoints are accessible", async () => {
    const response = await fetch(`${process.env.VERCEL_URL}/api/health`);
    expect(response.status).toBe(200);
  });

  test("Frontend loads correctly", async () => {
    const response = await fetch(process.env.VERCEL_URL);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("CraftFrame");
  });
});
```

---

## ✅ **Post-Deployment Checklist**

### Immediate Checks

- [ ] Site loads correctly at production URL
- [ ] All API endpoints respond properly
- [ ] Environment variables are set
- [ ] SSL certificate is active
- [ ] Database connections work
- [ ] File uploads function
- [ ] Authentication works
- [ ] AI generation works
- [ ] Error tracking is active

### Performance Checks

- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals pass
- [ ] Images load properly
- [ ] API response times < 2 seconds
- [ ] No console errors
- [ ] Mobile responsiveness works

### SEO & Analytics

- [ ] Google Analytics tracking
- [ ] Meta tags are correct
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Social media previews work

### Security Checks

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] API keys not exposed
- [ ] Rate limiting active
- [ ] CORS properly configured

---

## 🎉 **Deployment Complete!**

Your CraftFrame application is now live! You can:

- ✅ Generate AI content at scale
- ✅ Monitor performance and errors
- ✅ Scale automatically with traffic
- ✅ Deploy updates automatically
- ✅ Manage environment variables securely

### Next Steps

1. **Monitor**: Check analytics and error tracking
2. **Optimize**: Improve performance based on real usage
3. **Scale**: Add more AI providers and features
4. **Secure**: Regular security audits and updates

**Your AI platform is ready for users! 🚀**

---

For technical support, see [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)

For local development, see [LOCAL_SETUP.md](LOCAL_SETUP.md)
