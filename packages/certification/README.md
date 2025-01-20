# @greatforai/certification

The certification package provides a comprehensive system for validating and certifying websites based on their AI-optimization level, accessibility to AI agents, and implementation of AI-first SEO best practices.

## Features

- Website AI-optimization certification
- Automated analysis and scoring
- Manual review system
- Digital certificates and badges
- Blockchain verification
- Search engine integration
- Developer tools integration

## Directory Structure

```
src/
├── api/             # API endpoints and controllers
├── assessment/      # Assessment system
├── blockchain/      # Blockchain integration
├── database/        # Database layer
├── integration/     # External integrations
├── services/        # Business logic
├── types/          # TypeScript types
├── utils/          # Utility functions
└── config/         # Configuration
```

## Installation

```bash
pnpm add @greatforai/certification
```

## Usage

```typescript
import { initCertification } from '@greatforai/certification';

// Initialize the certification system
const certification = initCertification({
  // Configuration options
});

// Start an assessment
const assessment = await certification.startAssessment({
  websiteUrl: 'https://example.com',
  level: 'FOUNDATION'
});
```

## Development

```bash
# Install dependencies
pnpm install

# Run development mode
pnpm dev

# Run tests
pnpm test

# Build package
pnpm build
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Documentation

For detailed documentation, please refer to the `/docs` directory:

- [API Documentation](./docs/api/README.md)
- [Setup Guide](./docs/setup/README.md)
- [Integration Guide](./docs/integration/README.md)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This package is private and part of the GreatForAI platform. 