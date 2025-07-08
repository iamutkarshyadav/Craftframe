# AICreate - Production-Ready AI Content Generation Platform

A fully functional, production-ready AI content generation SaaS platform built with React, Vite, Express, and real AI model integration. Create stunning images and videos from text prompts with advanced features like user authentication, credit systems, and real-time generation tracking.

## 🚀 Features

### 🎨 AI Content Generation

- **Text-to-Image**: Generate stunning images using Stable Diffusion models
- **Text-to-Video**: Create dynamic videos from text descriptions
- **Real-time Queue System**: Track generation progress with live status updates
- **Multiple AI Models**: Integration with Hugging Face, Stability AI, and more
- **Smart Templates**: Pre-built prompts for different use cases

### 🔐 Authentication & User Management

- **Secure Auth System**: JWT-based authentication with bcrypt password hashing
- **User Registration/Login**: Complete signup and signin flow with validation
- **Session Management**: Persistent user sessions with token refresh
- **Profile Management**: User settings and account management

### 💳 Credit & Subscription System

- **Credit-based Pricing**: Pay-per-generation model with different credit costs
- **Multiple Plans**: Free (10 credits), Creator ($9.99/200 credits), Pro ($29.99/1000 credits)
- **Credit Tracking**: Real-time credit balance monitoring
- **Usage History**: Complete generation history with costs

### 🎯 Production Features

- **Real AI Integration**: Working connections to Hugging Face API and Stability AI
- **Generation Queue**: Scalable queue system for managing AI requests
- **Content Management**: Save, favorite, and organize generated content
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Mode**: Theme switching with system preference support

### 🔧 Developer Features

- **TypeScript**: Full type safety across frontend and backend
- **Modern UI**: Beautiful interface built with Radix UI and Tailwind CSS
- **Real-time Updates**: Live status tracking and notifications
- **Error Handling**: Comprehensive error handling and user feedback
- **Scalable Architecture**: Modular codebase ready for production deployment

## 🛠 Tech Stack

### Frontend

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS 3** + **Radix UI Components**
- **React Router 6** (SPA mode)
- **TanStack Query** for state management
- **Zustand** for global state

### Backend

- **Express.js** + **TypeScript**
- **JWT Authentication** with **bcryptjs**
- **In-memory Database** (easily replaceable with PostgreSQL/MongoDB)
- **AI Service Integration** (Hugging Face, Stability AI)
- **Queue System** for generation management

### AI Integration

- **Hugging Face API** - Stable Diffusion models
- **Stability AI** - Advanced image generation
- **Runway ML** - Video generation (configurable)
- **OpenAI DALL-E** - Premium image generation

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# AI API Keys (optional for demo mode)
HUGGING_FACE_API_KEY=your_hf_api_key_here
STABILITY_API_KEY=your_stability_api_key_here

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-for-production

# Server Configuration
PORT=8080
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🎯 Demo Accounts

For testing purposes, you can use:

- **Email**: `demo@aicreate.app`
- **Password**: `demo123`

Or create a new account through the registration flow.

## 📱 Application Flow

### 1. Landing Page

- **Hero Section**: Interactive demo with live preview
- **Content Showcase**: Carousel of AI-generated content
- **Feature Overview**: Detailed feature explanations
- **Pricing Plans**: Clear pricing with feature comparison
- **Testimonials**: User feedback and reviews

### 2. Authentication

- **Sign Up/Login**: Secure authentication modal
- **Account Verification**: Email validation (configurable)
- **Password Security**: Bcrypt hashing with salt rounds
- **Session Management**: Persistent login with JWT tokens

### 3. Dashboard

- **Generation Interface**: Separate tabs for image and video creation
- **Real-time Tracking**: Live status updates with progress indicators
- **History Management**: Complete generation history with filtering
- **Favorites System**: Save and organize best creations
- **Account Settings**: Profile and subscription management

### 4. Generation Process

1. **Prompt Input**: User enters text description
2. **Parameter Selection**: Choose style, quality, aspect ratio, etc.
3. **Credit Validation**: Check sufficient credits before processing
4. **Queue Addition**: Add to generation queue with position tracking
5. **AI Processing**: Send request to appropriate AI service
6. **Real-time Updates**: Live status updates via polling
7. **Result Delivery**: Download and save completed generations

## 🔧 AI Configuration

### Hugging Face Integration

```typescript
// Configure in server/lib/ai-service.ts
const HF_API_URL = "https://api-inference.huggingface.co/models";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Available models
-runwayml / stable -
  diffusion -
  v1 -
  5 -
  stabilityai / stable -
  diffusion -
  xl -
  base -
  1.0 -
  CompVis / stable -
  diffusion -
  v1 -
  4;
```

### Demo Mode

Without API keys, the application runs in demo mode with:

- **Placeholder Images**: High-quality Unsplash images
- **Simulated Processing**: Realistic delays and progress updates
- **Full Functionality**: Complete user experience without API costs

## 🎨 Customization

### Adding New AI Models

1. Update `server/lib/ai-service.ts` with new model configurations
2. Add model options to the dashboard forms
3. Update pricing in the credit system
4. Test integration with model-specific parameters

### Custom Branding

1. Update brand colors in `client/global.css`
2. Replace logo and icons in components
3. Customize landing page content in `client/lib/data.ts`
4. Update meta tags and SEO information

### Database Integration

Replace the in-memory database with a real database:

1. Install database driver (pg for PostgreSQL, mongoose for MongoDB)
2. Update `server/lib/database.ts` with real database operations
3. Add migration scripts for schema setup
4. Configure connection pooling and error handling

## 🚢 Production Deployment

### Environment Variables

```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret-256-bit
HUGGING_FACE_API_KEY=your-production-hf-key
STABILITY_API_KEY=your-production-stability-key
DATABASE_URL=your-database-connection-string
REDIS_URL=your-redis-connection-string
```

### Build Process

```bash
npm run build
npm start
```

### Deployment Platforms

- **Vercel**: Frontend deployment with serverless functions
- **Railway**: Full-stack deployment with database
- **Render**: Container-based deployment
- **AWS/GCP**: Enterprise-grade deployment with load balancing

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable salt rounds
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API endpoint protection (configurable)
- **CORS Configuration**: Cross-origin request security
- **Session Management**: Secure session handling with expiration

## 📊 Monitoring & Analytics

### Built-in Tracking

- **Generation Metrics**: Success rates, processing times
- **User Analytics**: Registration, usage patterns
- **Credit Consumption**: Revenue and cost tracking
- **Error Monitoring**: Failed generations and API errors

### Integration Ready

- **Stripe**: Payment processing and subscription management
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior tracking
- **Mixpanel**: Event tracking and user funnels

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the code comments for implementation details

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**
