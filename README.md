# 🎨 CraftFrame - AI Content Generation Platform

**Professional-grade AI platform for creating stunning images and videos with cutting-edge artificial intelligence.**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/your-repo/craftframe)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

---

## 🌟 **Overview**

CraftFrame is a production-ready AI content generation platform that harnesses the power of multiple state-of-the-art AI models to create professional-quality images and videos. Built with modern technologies and designed for scalability, it offers both enterprise-grade features and an intuitive user experience.

### 🎯 **Key Highlights**

- **Premium AI Models**: Integration with HuggingFace, FLUX.1, SDXL, CogVideoX, and more
- **Professional Canvas**: Advanced image editing and manipulation tools
- **2K+ Quality**: Minimum 2048x2048 resolution for all generated content
- **Real-time Generation**: Live progress tracking with instant previews
- **Enterprise Ready**: Built for scale with production-grade architecture

---

## ✨ **Features**

### 🖼️ **Image Generation**

- **8 Art Categories**: Photorealistic, Anime/Manga, Digital Painting, Sketch, Real Life, 3D Render, Abstract, Fantasy
- **Premium Models**: FLUX.1 Dev, SDXL-Lightning, Stable Diffusion XL
- **Advanced Controls**: Steps (10-50), CFG Scale (1-20), Style presets
- **Quality Guarantee**: Minimum 2K resolution (2048x2048)
- **Smart Enhancement**: Automatic prompt optimization per category

### 🎬 **Video Generation**

- **Best-in-Class Models**:
  - Stable Video Diffusion XL
  - CogVideoX-5B
  - AnimateDiff V1.5
  - Text-to-Video MS
  - Zeroscope V2 XL
- **Professional Output**: HD quality with customizable duration and FPS
- **Motion-Aware**: Advanced video synthesis with smooth transitions

### 🎨 **Professional Canvas Studio**

- **Advanced Viewer**: Zoom, pan, rotate, fullscreen mode
- **Grid Overlay**: Professional alignment and composition tools
- **Multi-Image Navigation**: Seamless switching between generations
- **Auto-Scroll**: Automatic viewport navigation to latest content
- **Keyboard Shortcuts**: Professional workflow acceleration

### 🔧 **Generation Controls**

- **Smart Templates**: Pre-designed prompts for quick start
- **Parameter Tuning**: Real-time adjustment of AI model parameters
- **Style Presets**: Curated styles for consistent branding
- **Batch Generation**: Multiple variations from single prompt
- **Credit Management**: Transparent pricing with real-time tracking

### 🌐 **Social & Sharing**

- **Multi-Platform Sharing**: Twitter, Facebook, LinkedIn, WhatsApp, Telegram
- **Direct Downloads**: High-resolution file exports
- **URL Sharing**: Direct links to generated content
- **Metadata Preservation**: Full generation information retained

### 👤 **User Experience**

- **Modern Authentication**: Secure login with demo access
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Themes**: Customizable interface preferences
- **Real-time Feedback**: Toast notifications and progress indicators
- **Professional Dashboard**: Comprehensive generation history and analytics

### 🏗️ **Technical Architecture**

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **AI Integration**: HuggingFace, Pollinations, Multiple API providers
- **Storage**: Local and cloud-compatible file handling
- **Authentication**: JWT-based secure sessions
- **Deployment**: Vercel-ready with environment configuration

---

## 🚀 **Quick Start**

### Prerequisites

- Node.js 16+ and npm
- Git
- HuggingFace API token

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/craftframe.git
cd craftframe

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Demo Access

- **Email**: `demo@craftframe.app`
- **Password**: `demo123`

---

## 📁 **Project Structure**

```
craftframe/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (Button, Card, etc.)
│   │   └── auth/          # Authentication components
│   ├── pages/             # Main application pages
│   │   ├── Index.tsx      # Landing page with features
│   │   ├── Studio.tsx     # Main generation interface
│   │   └── Dashboard.tsx  # User dashboard
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and data
│   └── styles/            # Global CSS and styling
├── server/                # Backend Node.js application
│   ├── lib/               # AI service integrations
│   │   ├── ai-service-production.ts    # Main AI orchestrator
│   │   ├── huggingface-video.ts       # HF video models
│   │   └── ai-service-enhanced.ts     # Enhanced image generation
│   ├── routes/            # Express route handlers
│   │   ├── auth.ts        # Authentication endpoints
│   │   ├── studio.ts      # Generation endpoints
│   │   └── users.ts       # User management
│   ├── middleware/        # Express middleware
│   └── index.ts           # Server entry point
├── docs/                  # Comprehensive documentation
│   ├── TECHNICAL_GUIDE.md # Detailed technical documentation
│   ├── DEPLOYMENT.md      # Deployment instructions
│   └── LOCAL_SETUP.md     # Local development guide
└── FEATURE_ROADMAP.md     # Future feature planning
```

---

## 🔌 **API Integration**

### Supported AI Providers

- **HuggingFace**: Premium models (FLUX.1, SDXL, CogVideoX)
- **Pollinations**: Reliable image generation
- **Runway ML**: Professional video synthesis
- **Pika Labs**: Cinematic video creation
- **Luma Labs**: Dream Machine video generation

### Model Quality Tiers

- **Premium**: FLUX.1 Dev, CogVideoX-5B (4+ credits)
- **Professional**: SDXL, Stable Video Diffusion (3 credits)
- **Standard**: Pollinations, Zeroscope (2 credits)
- **Fast**: SDXL-Lightning, Quick models (1 credit)

---

## 🎯 **Use Cases**

### 🎨 **Creative Professionals**

- Digital artists and designers
- Content creators and influencers
- Marketing and advertising teams
- Game developers and concept artists

### 🏢 **Business Applications**

- Product visualization and mockups
- Marketing material generation
- Social media content creation
- Website and app design assets

### 📚 **Educational & Research**

- AI research and experimentation
- Educational content creation
- Prototype development
- Concept visualization

---

## 🔧 **Configuration**

### Environment Variables

```bash
# Core Configuration
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key

# AI Provider Keys
HUGGING_FACE_API_KEY=hf_your_token_here
RUNWAY_API_KEY=your_runway_key
PIKA_API_KEY=your_pika_key
LUMALABS_API_KEY=your_luma_key

# Optional Integrations
OPENAI_API_KEY=your_openai_key
REPLICATE_API_TOKEN=your_replicate_token
```

### AI Model Configuration

- **Image Resolution**: 2048x2048 minimum
- **Video Resolution**: Up to 1280x720 HD
- **Generation Timeout**: 60 seconds
- **Concurrent Requests**: 5 per user
- **File Size Limit**: 50MB per generation

---

## 📊 **Performance & Scaling**

### Metrics

- **Generation Time**: 15-45 seconds average
- **Success Rate**: 95%+ with fallback models
- **Concurrent Users**: 100+ supported
- **Uptime**: 99.9% target availability

### Optimization Features

- **Smart Caching**: Reduces redundant API calls
- **Progressive Loading**: Staged content delivery
- **Fallback Systems**: Multiple model redundancy
- **Rate Limiting**: Fair usage enforcement

---

## 🛡️ **Security & Privacy**

### Data Protection

- **No Data Storage**: Generated content not permanently stored
- **Secure Transmission**: HTTPS/WSS encryption
- **API Key Protection**: Server-side credential management
- **User Privacy**: Minimal data collection

### Authentication

- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt encryption
- **Demo Access**: Safe testing environment
- **Rate Limiting**: Abuse prevention

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 **Support**

### Documentation

- [Technical Guide](docs/TECHNICAL_GUIDE.md)
- [Local Setup](docs/LOCAL_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Reference](docs/API_REFERENCE.md)

---

**Made with ❤️ by Utkarsh Yadav**

_Transform your creative vision into reality with the power of AI._
