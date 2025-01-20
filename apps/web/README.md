# GreatForAI Web Application

## Overview
Next.js 15 web application with App Router, providing the main interface for the GreatForAI platform.

## Directory Structure
```
src/
├── app/                  # App router pages
│   ├── (auth)/          # Authentication routes
│   ├── (dashboard)/     # Dashboard routes
│   └── api/             # API routes
├── components/          # React components
├── lib/                 # Shared utilities
├── providers/          # AI provider integrations
├── simulation/         # Simulation system
└── types/             # TypeScript types
```

## Key Features
- Authentication and authorization
- AI detection and scoring dashboards
- Real-time simulation interface
- Advanced data visualization
- Multi-provider AI integration

## Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Technology Stack
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS
- Shadcn UI
- Vercel AI SDK 