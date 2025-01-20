# AIAO Platform Directory Structure

```
aiao-platform/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/           # App router pages
│   │   │   ├── components/    # React components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── styles/       # Global styles
│   │   │   └── utils/        # Utility functions
│   │   ├── public/           # Static assets
│   │   └── tests/            # Test files
│   └── mobile/               # React Native mobile app
├── packages/
│   ├── core/                 # Core functionality
│   │   ├── src/
│   │   │   ├── crawler/      # Web crawler
│   │   │   ├── analyzer/     # Content analysis
│   │   │   ├── graph/        # Knowledge graph
│   │   │   └── ai-detection/ # AI detection
│   │   └── tests/
│   ├── database/            # Database management
│   │   ├── src/
│   │   │   ├── migrations/  # Database migrations
│   │   │   ├── models/      # Data models
│   │   │   └── seeds/       # Seed data
│   │   └── tests/
│   └── api/                # GraphQL API
│       ├── src/
│       │   ├── resolvers/   # GraphQL resolvers
│       │   ├── schemas/     # GraphQL schemas
│       │   └── directives/  # GraphQL directives
│       └── tests/
├── services/
│   ├── queue/              # Job queue service
│   ├── cache/             # Caching service
│   └── monitoring/        # Monitoring service
├── tools/
│   ├── scripts/           # Build/deployment scripts
│   └── config/            # Configuration files
├── docs/
│   ├── api/              # API documentation
│   ├── architecture/     # Architecture docs
│   └── deployment/       # Deployment guides
└── docker/
    ├── development/      # Dev environment
    └── production/       # Prod environment
```

## Key Files

### Core Configuration
```
aiao-platform/
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
└── docker-compose.yml
```

### Application Entry Points
```
apps/web/src/
├── app/
│   └── page.tsx          # Main page
├── components/
│   └── index.ts         # Component exports
└── index.ts             # App entry point

packages/core/src/
└── index.ts             # Core functionality entry

packages/api/src/
└── index.ts             # GraphQL API entry
```

### Database Configuration
```
packages/database/src/
├── config.ts            # Database config
├── connection.ts        # Connection management
└── index.ts            # Database entry point
```

### Service Configuration
```
services/
├── queue/
│   └── config.ts       # Queue configuration
├── cache/
│   └── config.ts       # Cache configuration
└── monitoring/
    └── config.ts       # Monitoring configuration
```

This structure supports:
1. Clear separation of concerns
2. Scalable microservices architecture
3. Easy testing and deployment
4. Efficient development workflow
5. Clear documentation organization
