# Technology Stack

## Frontend Technologies

### Core Framework
- Next.js 15 (App Router)
- React 19
- TypeScript 5.7

### UI Components & Animation
- Shadcn UI (Core components)
- Radix UI Primitives
- Motion Primitives (Advanced animations)
  - Gesture handling
  - Animation composition
  - Physics-based animations
- Motion One (Performance animations)
  - Web Animations API
  - ScrollTimeline
  - Advanced sequencing
- Framer Motion (Complex animations)
  - Shared layout animations
  - Gestures
  - AnimatePresence
- Tailwind CSS 3.4
- Lucide Icons

### State Management & Data Fetching
- React Server Components
- Vercel AI SDK
- SWR for client-side data fetching
- Nuqs for URL state management
- Jotai for atomic state

## Backend Technologies

### Core Services
- Node.js
- TypeScript
- tRPC for type-safe APIs

### AI & Machine Learning
- Langchain
- Anthropic Claude API
- OpenAI API
- Google AI API
- Custom ML model integration

### Database & Storage
- Vercel KV for caching
- Supabase for relational data
  - Real-time subscriptions
  - Row-level security
- Neo4j for graph relationships
  - Knowledge graph
  - Learning paths
- Vercel Blob Storage for assets

### Authentication & Security
- NextAuth.js
- JWT tokens
- Role-based access control
- OAuth providers

## Development & Build Tools

### Package Management
- PNPM Workspaces
- Turbo Repo
- Changesets for versioning

### Code Quality
- ESLint
- Prettier
- TypeScript strict mode
- Husky for git hooks
- Commitlint

### Testing
- Jest
- React Testing Library
- Playwright for E2E tests
- Storybook for component testing
- Chromatic for UI testing

### CI/CD & Deployment
- GitHub Actions
- Vercel Platform
- Docker for local development
- Automated previews

## Monitoring & Analytics

### Performance Monitoring
- Vercel Analytics
- Core Web Vitals tracking
- Error tracking with Sentry
- Animation performance metrics

### Business Analytics
- PostHog for product analytics
- Custom event tracking
- A/B testing capabilities
- User journey analysis

## Infrastructure

### Hosting & Deployment
- Vercel Edge Network
- Edge Functions
- Edge Config
- Edge Middleware
- Global CDN

### Security & Compliance
- SSL/TLS encryption
- GDPR compliance tools
- Data encryption at rest
- Regular security audits
- SOC 2 compliance

## Development Architecture

### Monorepo Structure
```
greatforai/
├── apps/
│   └── web/              # Next.js web application
├── packages/
│   ├── ai-core/          # AI functionality
│   │   ├── inference/    # Model inference
│   │   ├── training/     # Model training
│   │   └── evaluation/   # Performance evaluation
│   ├── core/             # Shared utilities
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Helper functions
│   │   └── types/        # Shared types
│   ├── database/         # Database clients
│   │   ├── supabase/     # Supabase client
│   │   ├── neo4j/        # Neo4j client
│   │   └── kv/           # KV storage
│   ├── ui/               # Shared UI components
│   │   ├── primitives/   # Basic components
│   │   ├── animations/   # Animation components
│   │   └── layouts/      # Layout components
│   ├── services/         # Shared services
│   ├── billing/          # Payment integration
│   ├── tests/            # Test utilities
│   └── tools/            # Developer tools
└── config/               # Environment configuration
    ├── development/
    └── production/
```

### Key Design Patterns
- Domain-Driven Design
- Clean Architecture
- SOLID principles
- Atomic Design for UI
- Feature-based organization
- Animation composition patterns

## Third-Party Integrations

### Payment Processing
- Stripe for subscriptions
- PayPal integration (planned)
- Crypto payments (future)

### External Services
- GitHub API
- LinkedIn API for certification sharing
- Discord for community features
- Slack for notifications

### AI Model Providers
- Anthropic Claude
- OpenAI GPT-4
- Google PaLM
- Custom model deployment
- Model versioning

## Scalability & Performance

### Optimization Techniques
- Edge caching
- Static site generation
- Incremental static regeneration
- Dynamic imports
- Image optimization
- Animation performance optimization
  - GPU acceleration
  - Composite layers
  - Transform optimizations

### Database Optimization
- Connection pooling
- Query optimization
- Caching strategies
- Sharding support
- Read replicas 