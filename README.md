# Great For AI

A modern AI-powered web application built with cutting-edge technologies.

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI / Radix UI
- Vercel AI SDK

### Backend
- Node.js with TypeScript
- Edge Functions
- Vercel AI SDK Integrations

### Testing & Quality
- Jest
- Cypress
- ESLint
- Prettier

### Monitoring & Analytics
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Grafana
- Lighthouse CI

### Infrastructure
- Vercel Platform
- Edge Functions
- Serverless Architecture

## Project Structure

```
.
├── apps/
│   ├── web/                 # Next.js web application
│   └── mobile/             # Mobile application
├── packages/
│   ├── scoring/            # Scoring engine
│   └── shared/             # Shared utilities
├── services/
│   ├── api/                # API services
│   ├── worker/             # Background workers
│   └── scheduler/          # Task scheduler
├── tools/
│   ├── docker/             # Docker configurations
│   └── testing/            # Testing utilities
└── environments/           # Environment configurations
```

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm dev`

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
