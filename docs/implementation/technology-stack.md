# Technology Stack

## Frontend Technologies

### Core Framework
- Next.js 15 (App Router)
- React 19
- TypeScript 5.7

### UI Components & Animation
- Shadcn UI (Extended with motion primitives)
- Radix UI Primitives (Animated versions)
- Framer Motion 10.16 (Core animation engine)
- Custom Motion System Features:
  - Physics-based animations
  - GPU-accelerated transitions
  - Scroll-linked effects
  - Advanced cursor interactions
  - Dynamic layout morphing
- Motion Primitives (Advanced animations)
  - Gesture handling
  - Animation composition
  - Physics-based animations
- Motion One (Performance animations)
  - Web Animations API
  - ScrollTimeline
  - Advanced sequencing
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
- PNPM Workspaces (v8.14)
- Turbo Repo (v2.3)
- Changesets for versioning

### Code Quality
- ESLint v9 with TypeScript support
  - next/core-web-vitals preset
  - @typescript-eslint/parser
  - Custom configurations per package
- Prettier v3.4
- TypeScript strict mode
- Husky for git hooks
- Commitlint

### Testing
- Jest v29.7
  - TypeScript support via ts-jest
  - ESM module support
  - @jest/globals for type safety
- React Testing Library
- Component-level unit tests
- Integration tests
- Custom test utilities in @greatforai/tests

### CI/CD & Deployment
- GitHub Actions
  - CI workflow for testing and building
  - CD workflow for Vercel deployment
  - Artifact sharing between workflows
  - Caching for dependencies and builds
- Vercel Platform
  - Preview deployments
  - Production deployments
  - Environment configuration
  - Project aliasing

## Monitoring & Analytics

### Performance Monitoring
- Vercel Analytics
- Vercel Speed Insights
- Core Web Vitals tracking
- Error tracking

### Business Analytics
- Custom event tracking
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
- Test-driven development

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

### Animation Performance
- Motion component LCP optimization
- Selective hydration for complex animations
- Animation frame batching
- Spring physics optimization
- Smart animation suspension for background tabs
- Adaptive animation quality based on device capabilities 