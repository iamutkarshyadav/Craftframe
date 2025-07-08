# AICreate Setup Guide

This guide will help you set up AICreate with Pollinations for image generation and free video generation APIs.

## Prerequisites

- Node.js 18+ and npm/yarn
- Git

## Quick Start

1. **Clone and Install**

   ```bash
   git clone <your-repo>
   cd aicreate
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:

   ```bash
   # Required for JWT authentication
   JWT_SECRET=your-super-secret-jwt-key-here

   # Optional: Hugging Face token for video generation
   # If not provided, demo videos will be used
   HF_TOKEN=your_hugging_face_token_here
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## AI Service Configuration

### Image Generation (Pollinations)

AICreate now uses **Pollinations API** for image generation, which is:

- ✅ **Completely Free** - No API key required
- ✅ **Fast** - Near-instant generation
- ✅ **High Quality** - FLUX and other advanced models
- ✅ **No Rate Limits** - Generate as much as you want

Available image models:

- **FLUX** - High-quality, balanced speed/quality
- **Turbo** - Fastest generation, good quality
- **Standard** - Default Pollinations models

### Video Generation (Free APIs)

For video generation, AICreate supports:

1. **Hugging Face (Recommended)**

   - Set `HF_TOKEN` in `.env` with your free Hugging Face token
   - Uses text-to-video models like `ali-vilab/text-to-video-ms-1.7b`
   - Free tier with good quality

2. **Demo Fallback**
   - If no HF token is provided, demo videos are used
   - Perfect for testing and development

## Getting API Tokens

### Hugging Face Token (Optional for Videos)

1. Go to [Hugging Face](https://huggingface.co/)
2. Create a free account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permission
5. Add it to your `.env` file as `HF_TOKEN`

**Note:** Hugging Face provides free API access with reasonable limits.

## Features

### ✨ Current Features

- **Image Generation** with Pollinations (free, no limits)
- **Video Generation** with Hugging Face or demo mode
- **User Dashboard** to view all generated content
- **Studio Interface** for content creation
- **User Authentication** with JWT
- **Credit System** (configurable, defaults to 1000 credits)
- **Multiple Image Sizes** (square, landscape, portrait)
- **Download Functionality** for all generated content

### 🔧 Technical Features

- **React + Vite** frontend with TypeScript
- **Express** backend with in-memory database
- **Responsive Design** with Tailwind CSS
- **Dark/Light Mode** toggle
- **Real-time Generation** updates

## Project Structure

```
├── client/                 # React frontend
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and data
│   └── pages/            # Route components
├── server/                # Express backend
│   ├── lib/              # Server utilities and AI services
│   └── routes/           # API route handlers
└── shared/               # Shared types and utilities
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Content Generation

- `POST /api/studio/image` - Generate image with Pollinations
- `POST /api/studio/video` - Generate video with free APIs
- `GET /api/studio/image/:id` - Get image generation status
- `GET /api/studio/video/:id` - Get video generation status

### Dashboard

- `GET /api/dashboard/generations` - Get user's generations
- `GET /api/dashboard/stats` - Get user statistics
- `POST /api/dashboard/generations/:id/favorite` - Toggle favorite

## Environment Variables Reference

```bash
# JWT Secret (Required)
JWT_SECRET=your-super-secret-jwt-key-here

# Hugging Face API Token (Optional for video generation)
# Get from: https://huggingface.co/settings/tokens
HF_TOKEN=hf_your_token_here

# Development/Production Mode
NODE_ENV=development
```

## Deployment

### Vercel/Netlify

1. Connect your Git repository
2. Set environment variables in the dashboard
3. Deploy

### Docker

```bash
# Build image
docker build -t aicreate .

# Run container
docker run -p 3000:3000 -e JWT_SECRET=your-secret -e HF_TOKEN=your-token aicreate
```

### Manual Server

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Common Issues

1. **Images not generating**

   - Pollinations is free and should always work
   - Check browser console for network errors
   - Verify internet connection

2. **Videos showing demo content**

   - Add `HF_TOKEN` to `.env` file
   - Restart the development server
   - Check Hugging Face token permissions

3. **Authentication issues**

   - Verify `JWT_SECRET` is set in `.env`
   - Clear browser localStorage
   - Check server logs for errors

4. **Development server not starting**
   - Run `npm install` to ensure dependencies
   - Check Node.js version (18+ required)
   - Verify port 3000 is available

### Getting Help

1. Check the browser console for errors
2. Check server logs in terminal
3. Verify all environment variables are set
4. Test with demo account (demo@aicreate.app / demo123)

## Credits and Costs

- **Images**: 1 credit per generation (instant with Pollinations)
- **Videos**: 3 credits per generation (30s-3min with Hugging Face)
- **Demo Users**: Start with 1000 credits
- **New Users**: Start with 500 credits

The credit system is configurable in `server/lib/database.ts`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. See LICENSE file for details.
