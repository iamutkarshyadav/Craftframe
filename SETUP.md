# 🚀 AICreate Studio Setup Guide

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Copy `.env.example` to `.env` and update:

   ```env
   REPLICATE_API_TOKEN=your_replicate_token_here
   JWT_SECRET=your-secret-key-here
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Access the Studio**
   - Visit `http://localhost:8080/studio`
   - Click "Try Demo" for instant access (no signup required)

## 🤖 AI Model Integration

### Replicate API (Recommended)

**Why Replicate?**

- Production-ready AI models
- Reliable API with excellent uptime
- High-quality FLUX and SDXL models for images
- Stable Video Diffusion for videos

**Get Your API Token:**

1. Go to [Replicate.com](https://replicate.com)
2. Sign up for a free account
3. Visit your [API tokens page](https://replicate.com/account/api-tokens)
4. Create a new token
5. Add it to your `.env` file:
   ```env
   REPLICATE_API_TOKEN=r8_your_token_here
   ```

**Free Tier:**

- $10 free credits on signup
- Image generation: ~$0.003 per image
- Video generation: ~$0.02 per video
- Enough for hundreds of generations

### Models Used

**Images:**

- `FLUX Schnell` (Fast) - 1-2 seconds
- `FLUX Dev` (Quality) - 5-8 seconds
- `SDXL` (Stable) - 3-5 seconds

**Videos:**

- `Stable Video Diffusion` - Professional quality
- `AnimateDiff` - Animation style
- `Zeroscope V2 XL` - Text-to-video

## 🎯 Demo Mode

Without API tokens, the app runs in demo mode with:

- Beautiful placeholder images from Unsplash
- Sample videos
- Full UI functionality
- Real credit system

## 🔧 Production Deployment

### Environment Variables

```env
# Required
REPLICATE_API_TOKEN=your_replicate_token
JWT_SECRET=your-256-bit-secret

# Optional
NODE_ENV=production
PORT=8080
```

### Deploy Platforms

- **Vercel**: Perfect for frontend + serverless API
- **Railway**: Full-stack with persistent storage
- **Render**: Easy container deployment
- **Netlify**: Frontend + serverless functions

## 🎨 Credits & Costs

### Credit System

- New users: 500 credits
- Demo account: 1000 credits
- Images: 1 credit each
- Videos: 3 credits each

### Real API Costs (with Replicate)

- Image (FLUX): ~$0.003 each
- Video (Stable Video): ~$0.02 each
- Very affordable for testing and production

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run typecheck  # TypeScript validation
npm test          # Run tests
```

### Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **AI**: Replicate API (FLUX, SDXL, Stable Video)
- **Auth**: JWT with bcrypt
- **UI**: Radix UI components

## 🚀 Ready to Go!

The studio is now production-ready with:

- ✅ Real AI model integration
- ✅ Working image and video generation
- ✅ Credit system and authentication
- ✅ Beautiful, responsive UI
- ✅ Download functionality
- ✅ Demo mode for testing

Visit `/studio` and start creating! 🎨✨
