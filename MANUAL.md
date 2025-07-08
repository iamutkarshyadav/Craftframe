# 📖 CraftFrame Complete Manual

**The definitive guide to CraftFrame - AI Content Generation Platform**

---

## 🎯 **Quick Reference**

### 🚀 **Get Started in 5 Minutes**

```bash
# 1. Clone & Install
git clone https://github.com/your-repo/craftframe.git
cd craftframe && npm install

# 2. Configure Environment
cp .env.example .env
# Add your HuggingFace token: hf_your_token_here

# 3. Start Development
npm run dev

# 4. Open in Browser
http://localhost:3000
```

### 🔑 **Demo Access**

- **Email**: `demo@craftframe.app`
- **Password**: `demo123`
- **Credits**: 1000 (auto-refreshes)

---

## 📚 **Documentation Index**

| Document                                      | Purpose                        | Audience     |
| --------------------------------------------- | ------------------------------ | ------------ |
| [README.md](README.md)                        | Project overview & features    | Everyone     |
| [LOCAL_SETUP.md](docs/LOCAL_SETUP.md)         | Windows/Mac development setup  | Developers   |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md)           | Vercel & production deployment | DevOps       |
| [TECHNICAL_GUIDE.md](docs/TECHNICAL_GUIDE.md) | Architecture & implementation  | Developers   |
| [FEATURE_ROADMAP.md](FEATURE_ROADMAP.md)      | Future features & planning     | Product Team |
| **This Manual**                               | Complete reference guide       | Everyone     |

---

## 🌟 **Platform Features**

### 🎨 **Image Generation**

- **8 Art Categories**: Photorealistic, Anime/Manga, Digital Painting, Sketch, Real Life, 3D Render, Abstract, Fantasy
- **Premium Models**: FLUX.1 Dev, SDXL-Lightning, Stable Diffusion XL
- **Quality**: Minimum 2K resolution (2048x2048)
- **Advanced Controls**: Steps, CFG Scale, Style presets
- **Credits**: 1-4 credits per generation

### 🎬 **Video Generation**

- **Best AI Models**: CogVideoX-5B, Stable Video Diffusion XL, AnimateDiff V1.5
- **Quality**: HD resolution with customizable duration and FPS
- **Providers**: HuggingFace, Runway ML, Pika Labs, Luma Labs
- **Credits**: 4-5 credits per generation

### 🖼️ **Professional Canvas**

- **Advanced Viewer**: Zoom, pan, rotate, fullscreen
- **Tools**: Grid overlay, fit-to-screen, reset view
- **Navigation**: Multi-image switching with keyboard shortcuts
- **Auto-scroll**: Automatic navigation to latest generation
- **Sharing**: Direct social media integration

---

## 🏗️ **Architecture Overview**

```
Frontend (React/TypeScript)
├── Studio Interface
├── Canvas Component
├── Dashboard
└── Authentication

Backend (Node.js/Express)
├── AI Service Layer
├── Authentication API
├── Generation API
���── User Management

AI Integration
├── HuggingFace (Premium)
├── Pollinations (Reliable)
├── Multiple Providers
└── Fallback System
```

---

## ⚡ **Quick Start Guides**

### 🔧 **Developers**

#### Prerequisites

- Node.js 16+, npm, Git
- HuggingFace API token
- Code editor (VS Code recommended)

#### Setup (3 Steps)

```bash
# 1. Install
git clone <repo> && cd craftframe && npm install

# 2. Configure
cp .env.example .env
# Edit .env with your HF token

# 3. Run
npm run dev
```

#### Project Structure

```
craftframe/
├── client/          # React frontend
├── server/          # Node.js backend
├── docs/           # Documentation
└── api/            # Vercel serverless (production)
```

### 👤 **Users**

#### Generate Images

1. Go to **Studio** page
2. Enter your prompt
3. Select art category
4. Adjust advanced settings
5. Click **Generate**
6. View in canvas

#### Canvas Features

- **Zoom**: Mouse wheel or +/- buttons
- **Pan**: Click and drag when zoomed
- **Navigate**: Arrow keys or navigation buttons
- **Share**: Share button → select platform
- **Download**: Download button for high-res files

### 🚀 **Deployment**

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production
vercel --prod
```

#### Environment Variables

- `JWT_SECRET`: 64-character random string
- `HUGGING_FACE_API_KEY`: Your HF token
- `NODE_ENV`: production

---

## 🎛️ **Configuration Reference**

### 🔐 **Environment Variables**

#### Required (Minimum Setup)

```bash
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
HUGGING_FACE_API_KEY=hf_your_token_here
```

#### Optional (Enhanced Features)

```bash
# Additional AI Providers
RUNWAY_API_KEY=your_runway_key
PIKA_API_KEY=your_pika_key
LUMALABS_API_KEY=your_luma_key
OPENAI_API_KEY=your_openai_key

# Database (Production)
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379

# File Storage (Production)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your_bucket

# Analytics & Monitoring
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=your_ga_id
```

### 🎯 **AI Model Configuration**

#### Image Models (Credit Cost)

- **FLUX.1 Dev** (4 credits) - Premium quality
- **SDXL** (3 credits) - Professional quality
- **SDXL-Lightning** (2 credits) - Fast generation
- **Pollinations** (1 credit) - Reliable fallback

#### Video Models (Credit Cost)

- **CogVideoX-5B** (5 credits) - Best quality
- **Stable Video Diffusion** (4 credits) - Professional
- **AnimateDiff** (3 credits) - Motion-aware
- **Zeroscope V2** (2 credits) - Standard quality

### ⚙️ **Advanced Settings**

#### Image Generation

- **Steps**: 10-50 (higher = better quality, slower)
- **CFG Scale**: 1-20 (higher = more prompt adherence)
- **Size**: 1024x1024 to 2048x2048
- **Style**: Custom style modifiers

#### Video Generation

- **Duration**: 3-10 seconds
- **FPS**: 8-30 frames per second
- **Resolution**: Up to 1280x720 HD

---

## 🛠️ **Development Guide**

### 📁 **Project Structure Explained**

```
craftframe/
├── client/                    # Frontend React Application
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base components (Button, Card, etc.)
│   │   └── auth/            # Authentication components
│   ├── pages/               # Main application pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Studio.tsx       # Generation interface
│   │   └── Dashboard.tsx    # User dashboard
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and data
│   └── styles/              # Global CSS
├─��� server/                   # Backend Node.js Application
│   ├── lib/                 # Core business logic
│   │   ├── ai-service-production.ts  # Main AI orchestrator
│   │   ├── huggingface-video.ts     # HF video models
│   │   └── ai-service-enhanced.ts   # Enhanced generation
│   ├── routes/              # Express route handlers
│   │   ├── auth.ts         # Authentication endpoints
│   │   ├── studio.ts       # Generation endpoints
│   │   └── users.ts        # User management
│   ├── middleware/          # Express middleware
│   └── index.ts            # Server entry point
├── api/                     # Vercel Serverless Functions (Production)
│   ├── auth/               # Authentication API routes
│   ├── studio/             # Generation API routes
│   └── users/              # User API routes
├── docs/                    # Comprehensive Documentation
│   ├── TECHNICAL_GUIDE.md  # Technical implementation
│   ├── LOCAL_SETUP.md      # Development setup
│   └── DEPLOYMENT.md       # Production deployment
└── Configuration Files
    ├── package.json        # Dependencies and scripts
    ├── vercel.json        # Vercel deployment config
    ├── .env.example       # Environment template
    └── tsconfig.json      # TypeScript configuration
```

### 🔄 **Development Workflow**

#### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install new dependencies (if any)
npm install

# 3. Start development server
npm run dev

# 4. Make changes and test
# Frontend: http://localhost:3000
# Backend: http://localhost:5000

# 5. Run tests
npm run test

# 6. Format code
npm run prettier

# 7. Commit changes
git add .
git commit -m "feat: add new feature"
git push origin feature-branch
```

#### Available Scripts

```json
{
  "dev": "Start both frontend and backend",
  "client": "Start frontend only (Vite)",
  "server": "Start backend only (Node.js)",
  "build": "Build for production",
  "test": "Run all tests",
  "lint": "Run ESLint",
  "prettier": "Format code",
  "type-check": "Check TypeScript types"
}
```

### 🔌 **API Integration**

#### Authentication

```typescript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password",
  "name": "User Name"
}

// Demo access
POST /api/auth/demo
```

#### Generation

```typescript
// Generate Image
POST /api/studio/generate-image
Headers: Authorization: Bearer <token>
{
  "prompt": "A beautiful sunset over mountains",
  "model": "flux-pro",
  "category": "photorealistic",
  "steps": 30,
  "cfg_scale": 7.5
}

// Generate Video
POST /api/studio/generate-video
{
  "prompt": "A cat walking in a garden",
  "model": "huggingface",
  "duration": 5,
  "fps": 24
}

// Check Status
GET /api/studio/generation/:id
```

---

## 🎨 **Usage Examples**

### 🖼️ **Image Generation Examples**

#### Photorealistic Portraits

```
Prompt: "Professional headshot of a confident businesswoman in modern office"
Category: Photorealistic
Model: FLUX.1 Dev
Steps: 40
CFG Scale: 8
```

#### Digital Art

```
Prompt: "Cyberpunk cityscape with neon lights and flying cars"
Category: Digital Painting
Model: SDXL
Steps: 35
CFG Scale: 10
```

#### Anime Style

```
Prompt: "Anime girl with blue hair in magical forest"
Category: Anime/Manga
Model: FLUX Anime
Steps: 25
CFG Scale: 7
```

### 🎬 **Video Generation Examples**

#### Nature Scene

```
Prompt: "Peaceful lake with gentle waves and sunset reflection"
Model: Stable Video Diffusion
Duration: 5 seconds
FPS: 24
```

#### Animation

```
Prompt: "Cartoon character walking through colorful garden"
Model: AnimateDiff V1.5
Duration: 3 seconds
FPS: 16
```

---

## 🚨 **Troubleshooting**

### 🐛 **Common Issues**

#### Generation Fails

```
Problem: "All AI models failed to generate content"
Solution:
1. Check HuggingFace API key
2. Verify internet connection
3. Try simpler prompt
4. Check credit balance
```

#### Canvas Not Loading

```
Problem: Generated image not showing in canvas
Solution:
1. Wait for generation to complete
2. Refresh the page
3. Check browser console for errors
4. Try different browser
```

#### Authentication Issues

```
Problem: Login not working
Solution:
1. Check email/password format
2. Try demo account (demo@craftframe.app / demo123)
3. Clear browser cache
4. Check JWT_SECRET in environment
```

#### Development Server Won't Start

```
Problem: npm run dev fails
Solution:
1. Check Node.js version (16+)
2. Delete node_modules and reinstall
3. Check port 3000/5000 availability
4. Verify environment variables
```

### 🔧 **Debug Commands**

```bash
# Check system info
node --version
npm --version
git --version

# Check project health
npm run check
npm audit

# Debug build process
npm run build --verbose

# Check environment variables
node -e "console.log(process.env.HUGGING_FACE_API_KEY ? 'HF key exists' : 'Missing HF key')"

# Test API endpoints
curl http://localhost:5000/api/ping
```

---

## 🔒 **Security Guidelines**

### 🛡️ **Best Practices**

#### Environment Variables

- Never commit API keys to Git
- Use strong JWT secrets (64+ characters)
- Rotate keys regularly
- Use different keys for dev/prod

#### API Security

- Rate limiting enabled
- CORS properly configured
- Input validation on all endpoints
- Authentication required for generation

#### Frontend Security

- No sensitive data in client code
- Secure token storage
- XSS protection enabled
- Content Security Policy headers

---

## 📊 **Performance Guide**

### ⚡ **Optimization Tips**

#### Frontend Performance

- Lazy load components
- Image optimization
- Code splitting
- Bundle analysis

#### Backend Performance

- API response caching
- Connection pooling
- Efficient error handling
- Memory usage monitoring

#### AI Performance

- Model selection strategy
- Fallback mechanisms
- Request queuing
- Result caching

---

## 🎯 **Production Checklist**

### ✅ **Pre-Deployment**

- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Build succeeds
- [ ] Security headers enabled
- [ ] Error tracking setup
- [ ] Analytics configured

### ✅ **Post-Deployment**

- [ ] Site loads correctly
- [ ] API endpoints work
- [ ] Authentication functional
- [ ] Generation works
- [ ] Monitoring active
- [ ] Performance acceptable

---

## 📞 **Support & Resources**

### 📖 **Documentation**

- **Complete Guides**: `/docs/` directory
- **API Reference**: Technical guide
- **Examples**: This manual

### 🔗 **External Resources**

- **HuggingFace Docs**: https://huggingface.co/docs
- **Vercel Docs**: https://vercel.com/docs
- **React Docs**: https://react.dev

### 🆘 **Getting Help**

- **Issues**: GitHub Issues tab
- **Discussions**: GitHub Discussions
- **Community**: Join our Discord (if available)

### 🛠️ **Development Tools**

- **VS Code Extensions**: ESLint, Prettier, TypeScript
- **API Testing**: Postman, Insomnia
- **Debugging**: Browser DevTools, React DevTools

---

## 🎉 **You're All Set!**

CraftFrame is now ready for:

- ✅ **Development**: Full local environment
- ✅ **Production**: Scalable deployment
- ✅ **Generation**: AI content creation
- ✅ **Customization**: Feature modifications
- ✅ **Scaling**: Enterprise usage

**Start creating amazing AI content! 🚀**

---

_Last updated: December 2024_
_Version: 2.0.0_
_Platform: CraftFrame AI Content Generation_
