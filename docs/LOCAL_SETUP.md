# 💻 CraftFrame Local Development Setup

**Complete step-by-step guide for setting up CraftFrame on Windows and macOS.**

---

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Windows Setup Guide](#windows-setup-guide)
3. [macOS Setup Guide](#macos-setup-guide)
4. [Common Setup Steps](#common-setup-steps)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Development Workflow](#development-workflow)
8. [IDE Configuration](#ide-configuration)

---

## ✅ **Prerequisites**

### Required Software

- **Node.js** v16.0.0 or higher
- **npm** v8.0.0 or higher (comes with Node.js)
- **Git** v2.30.0 or higher
- **Code Editor** (VS Code recommended)
- **HuggingFace Account** (for AI API access)

### Recommended Tools

- **Postman** or **Insomnia** (API testing)
- **Chrome/Firefox DevTools** (debugging)
- **GitHub Desktop** (optional, for Git UI)
- **Terminal/Command Prompt** with admin privileges

---

## 🪟 **Windows Setup Guide**

### Step 1: Install Node.js

```powershell
# Method 1: Download from official website
# Visit: https://nodejs.org/en/download/
# Download the "LTS" version for Windows (.msi installer)
# Run the installer and follow the setup wizard

# Method 2: Using Chocolatey (if installed)
choco install nodejs

# Method 3: Using winget (Windows Package Manager)
winget install OpenJS.NodeJS

# Verify installation
node --version
npm --version
```

### Step 2: Install Git

```powershell
# Method 1: Download from official website
# Visit: https://git-scm.com/download/win
# Download and run the installer
# Use default settings (recommended)

# Method 2: Using Chocolatey
choco install git

# Method 3: Using winget
winget install Git.Git

# Verify installation
git --version
```

### Step 3: Configure Git (First Time Only)

```powershell
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable credential storage
git config --global credential.helper manager-core
```

### Step 4: Install VS Code (Recommended)

```powershell
# Method 1: Download from website
# Visit: https://code.visualstudio.com/download
# Download and install

# Method 2: Using winget
winget install Microsoft.VisualStudioCode

# Method 3: Using Chocolatey
choco install vscode
```

### Step 5: Clone the Repository

```powershell
# Open PowerShell or Command Prompt as Administrator
# Navigate to your development folder
cd C:\Development

# Clone the repository
git clone https://github.com/your-repo/craftframe.git

# Navigate to project directory
cd craftframe

# Verify project structure
dir
```

### Step 6: Install Dependencies

```powershell
# Install all project dependencies
npm install

# If you encounter permission errors, try:
npm install --force

# Or run PowerShell as Administrator
```

---

## 🍎 **macOS Setup Guide**

### Step 1: Install Homebrew (Package Manager)

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH (follow the instructions shown after installation)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Verify installation
brew --version
```

### Step 2: Install Node.js

```bash
# Method 1: Using Homebrew (recommended)
brew install node

# Method 2: Using Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart terminal or source your profile
source ~/.zshrc
nvm install --lts
nvm use --lts

# Method 3: Download from website
# Visit: https://nodejs.org/en/download/
# Download the macOS installer (.pkg)

# Verify installation
node --version
npm --version
```

### Step 3: Install Git

```bash
# Git usually comes pre-installed on macOS
# Check if Git is installed
git --version

# If not installed or want latest version
brew install git

# Alternative: Install Xcode Command Line Tools
xcode-select --install
```

### Step 4: Configure Git (First Time Only)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable credential storage
git config --global credential.helper osxkeychain
```

### Step 5: Install VS Code (Recommended)

```bash
# Method 1: Using Homebrew Cask
brew install --cask visual-studio-code

# Method 2: Download from website
# Visit: https://code.visualstudio.com/download
# Download for macOS and drag to Applications folder
```

### Step 6: Clone the Repository

```bash
# Create development directory
mkdir -p ~/Development
cd ~/Development

# Clone the repository
git clone https://github.com/your-repo/craftframe.git

# Navigate to project directory
cd craftframe

# Verify project structure
ls -la
```

### Step 7: Install Dependencies

```bash
# Install all project dependencies
npm install

# If you encounter permissions issues, don't use sudo
# Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

---

## 🔧 **Common Setup Steps (Windows & macOS)**

### Step 1: Verify Project Structure

```
craftframe/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js application
├── docs/                   # Documentation
├── package.json           # Project dependencies
├��─ .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── README.md             # Project overview
└── tsconfig.json         # TypeScript configuration
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your credentials
# Windows: notepad .env
# macOS: nano .env or code .env
```

### Step 3: Install Global Dependencies (Optional)

```bash
# TypeScript compiler (for development)
npm install -g typescript

# Nodemon (for auto-restart during development)
npm install -g nodemon

# Prettier (code formatting)
npm install -g prettier

# ESLint (code linting)
npm install -g eslint
```

### Step 4: Verify Installation

```bash
# Check if all dependencies are installed
npm list

# Run health check
npm run check

# Start development server
npm run dev
```

---

## ⚙️ **Environment Configuration**

### Create .env File

```bash
# Copy the example file
cp .env.example .env
```

### Required Environment Variables

```bash
# ===========================================
# CRAFTFRAME ENVIRONMENT CONFIGURATION
# ===========================================

# Node Environment
NODE_ENV=development
PORT=5000

# Security
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# AI Service Configuration
HUGGING_FACE_API_KEY=hf_your_huggingface_token_here

# Optional AI Providers (for enhanced functionality)
RUNWAY_API_KEY=your_runway_api_key
PIKA_API_KEY=your_pika_labs_api_key
LUMALABS_API_KEY=your_luma_api_key
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_TOKEN=your_replicate_token

# Database Configuration (for production)
DATABASE_URL=postgresql://username:password@localhost:5432/craftframe
REDIS_URL=redis://localhost:6379

# File Storage (for production)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=craftframe-assets

# External Services
SENTRY_DSN=your_sentry_dsn_for_error_tracking
GOOGLE_ANALYTICS_ID=your_ga_tracking_id

# Social Media APIs (optional)
TWITTER_API_KEY=your_twitter_api_key
FACEBOOK_APP_ID=your_facebook_app_id
```

### Get Your HuggingFace API Key

1. **Create Account**: Visit [huggingface.co](https://huggingface.co) and sign up
2. **Navigate to Settings**: Go to your profile → Settings
3. **Access Tokens**: Click on "Access Tokens" tab
4. **Create New Token**: Click "New token"
   - Name: `CraftFrame Development`
   - Type: `Read` (for API access)
5. **Copy Token**: Copy the generated token (starts with `hf_`)
6. **Add to .env**: Paste into your `.env` file

### JWT Secret Generation

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use online generator (not recommended for production)
# Visit: https://generate-secret.vercel.app/32
```

---

## 🚀 **Development Workflow**

### Starting the Development Server

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Available Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm run client       # Start frontend only (Vite dev server)
npm run server       # Start backend only (Node.js with nodemon)

# Building
npm run build        # Build frontend for production
npm run build:client # Build frontend only
npm run build:server # Build backend only

# Testing
npm run test         # Run all tests
npm run test:client  # Run frontend tests
npm run test:server  # Run backend tests

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run prettier     # Format code with Prettier
npm run type-check   # Run TypeScript type checking

# Utilities
npm run clean        # Clean build artifacts
npm run check        # Check project health
npm run analyze      # Analyze bundle size
```

### Development URLs

```
Frontend (Client): http://localhost:3000
Backend (API):      http://localhost:5000
API Docs:          http://localhost:5000/api-docs (if enabled)
```

### File Watching and Hot Reload

- **Frontend**: Vite provides instant hot module replacement (HMR)
- **Backend**: Nodemon restarts server on file changes
- **TypeScript**: Automatic compilation with type checking

---

## 🔧 **IDE Configuration**

### VS Code Setup

#### Recommended Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode-remote.remote-containers",
    "github.copilot"
  ]
}
```

#### VS Code Settings (.vscode/settings.json)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### Launch Configuration (.vscode/launch.json)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "envFile": "${workspaceFolder}/.env",
      "runtimeArgs": ["-r", "ts-node/register"],
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Client",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/client"
    }
  ]
}
```

### WebStorm/IntelliJ Setup

```javascript
// Enable TypeScript service
// Settings → Languages & Frameworks → TypeScript
// Enable: "TypeScript Language Service"

// Configure Prettier
// Settings → Tools → File Watchers
// Add: Prettier watcher for .ts,.tsx,.js,.jsx files

// Configure ESLint
// Settings → Languages & Frameworks → ESLint
// Enable: "Automatic ESLint configuration"
```

---

## 🐛 **Troubleshooting**

### Common Issues and Solutions

#### Node.js Version Issues

```bash
# Check current version
node --version

# If version is too old, update:
# Windows (using chocolatey)
choco upgrade nodejs

# macOS (using homebrew)
brew upgrade node

# Or use Node Version Manager (nvm)
nvm install --lts
nvm use --lts
```

#### Permission Errors (Windows)

```powershell
# Run as Administrator
# Right-click PowerShell → "Run as Administrator"

# Or fix npm permissions
npm config set cache C:\npm-cache --global
mkdir C:\npm-cache

# Set execution policy (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Permission Errors (macOS)

```bash
# Never use sudo with npm!
# Fix npm permissions instead:

# Create global directory
mkdir ~/.npm-global

# Configure npm
npm config set prefix '~/.npm-global'

# Update PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

#### Port Already in Use

```bash
# Find process using port 3000 or 5000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000
kill -9 <PID>

# Or use different ports
PORT=3001 npm run client
```

#### Git Issues

```bash
# SSL certificate problems
git config --global http.sslVerify false

# Line ending issues (Windows)
git config --global core.autocrlf true

# Authentication issues
git config --global credential.helper manager-core  # Windows
git config --global credential.helper osxkeychain   # macOS
```

#### Module Not Found Errors

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules & del package-lock.json  # Windows
npm install

# Check for peer dependency issues
npm ls
```

#### TypeScript Compilation Errors

```bash
# Check TypeScript version
npx tsc --version

# Clean TypeScript cache
npx tsc --build --clean

# Check configuration
npx tsc --noEmit

# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

#### Environment Variable Issues

```bash
# Verify .env file exists
ls -la .env  # macOS/Linux
dir .env     # Windows

# Check if variables are loaded
node -e "require('dotenv').config(); console.log(process.env.HUGGING_FACE_API_KEY)"

# Escape special characters in .env
# Use quotes for values with spaces or special chars
JWT_SECRET="your secret with spaces"
```

### Getting Help

#### Check Project Health

```bash
# Run project diagnostics
npm run check

# Verify all dependencies
npm audit

# Check for outdated packages
npm outdated
```

#### Debug Information

```bash
# System information
node --version
npm --version
git --version

# Project information
npm list --depth=0
cat package.json | grep version

# Environment information
echo $NODE_ENV          # macOS/Linux
echo %NODE_ENV%         # Windows
```

#### Log Files and Debugging

```bash
# Check server logs
tail -f server.log

# Enable verbose npm logging
npm run dev --verbose

# Debug mode
DEBUG=* npm run server
```

---

## 📝 **Next Steps**

After successful setup:

1. **Explore the Code**: Browse through the project structure
2. **Test API Endpoints**: Use Postman to test `/api/ping`
3. **Generate Content**: Try creating images and videos
4. **Customize Features**: Modify components and styling
5. **Read Documentation**: Check other files in `/docs/`

### Development Best Practices

```bash
# Always work on feature branches
git checkout -b feature/my-new-feature

# Keep dependencies updated
npm update

# Run tests before committing
npm run test

# Format code before committing
npm run prettier

# Use conventional commits
git commit -m "feat: add new image generation model"
```

---

## 🎉 **You're Ready!**

Your local development environment is now set up. You can:

- ✅ Generate AI images and videos
- ✅ Modify the user interface
- ✅ Add new features
- ✅ Test API endpoints
- ✅ Deploy to production

**Happy coding! 🚀**

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

For technical details, see [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)
