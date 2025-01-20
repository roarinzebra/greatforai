# AIAO Monorepo Project Structure

```
aiao-platform/
├── .github/
│   └── workflows/
│       ├── web.yml
│       ├── mobile.yml           # Prepared for future mobile CI/CD
│       └── shared.yml
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── apps/
│   ├── web/                    # Current focus - Next.js web application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── signup/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   ├── discovery/
│   │   │   │   │   ├── optimization/
│   │   │   │   │   └── settings/
│   │   │   │   ├── api/
│   │   │   │   │   ├── ai-detection/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   └── optimization/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   └── types/
│   │   ├── public/
│   │   ├── tests/
│   │   ├── .env
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   └── mobile/                 # Prepared for future React Native app
│       ├── .gitkeep
│       └── README.md           # Plans and setup instructions for future mobile development
│
├── packages/                   # Shared packages between web and future mobile
│   ├── ai-core/               # Core AI detection and optimization logic
│   │   ├── src/
│   │   │   ├── detection/
│   │   │   ├── optimization/
│   │   │   └── types/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── analytics/             # Shared analytics functionality
│   │   ├── src/
│   │   │   ├── metrics/
│   │   │   ├── reports/
│   │   │   └── types/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-ui/            # Shared UI components (when applicable)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── types/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/               # Shared configuration
│       ├── src/
│       │   ├── constants/
│       │   └── types/
│       ├── package.json
│       └── tsconfig.json
│
├── tools/                    # Build and development tools
│   ├── eslint-config/
│   ├── typescript-config/
│   └── jest-config/
│
├── .env.example
├── .eslintrc.js
├── .gitignore
├── jest.config.js
├── package.json
├── pnpm-workspace.yaml      # Workspace configuration
├── tsconfig.json
└── turbo.json              # Turborepo configuration
```

## Key Configuration Files

### 1. pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

### 2. turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### 3. Root package.json
```json
{
  "name": "aiao-platform",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@aiao/eslint-config": "workspace:*",
    "@aiao/typescript-config": "workspace:*",
    "prettier": "^3.1.0",
    "turbo": "^1.11.0",
    "husky": "^8.0.0"
  },
  "packageManager": "pnpm@8.9.0"
}
```

## Key Aspects of this Structure:

1. **Monorepo Organization**:
   - Clear separation between apps and shared packages
   - Web app as current focus
   - Mobile app structure prepared but not implemented
   - Shared packages for cross-platform functionality

2. **Shared Packages**:
   - `ai-core`: Core AI functionality that can be used in both web and mobile
   - `analytics`: Shared analytics logic
   - `shared-ui`: UI components that could be shared (where applicable)
   - `config`: Shared configuration and constants

3. **Development Tools**:
   - Centralized ESLint configuration
   - Shared TypeScript configuration
   - Common Jest setup

4. **Build System**:
   - Turborepo for build orchestration
   - PNPM workspaces for package management
   - Optimized for monorepo development

5. **Current Focus**:
   - Web application is fully structured and ready for development
   - Mobile structure is minimal but prepared for future expansion
   - Shared packages are ready for web-first development but structured for future mobile use


This structure allows you to:
- Start development immediately on the web application
- Share code between platforms when mobile development begins
- Maintain clean separation of concerns
- Scale the project efficiently as it grows