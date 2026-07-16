# Deployment Guide

**Last Updated**: 2026-07-16
**Version**: 1.3.6
**Project**: ClauKit

## Overview

This guide covers deployment options and configurations for projects built with the ClauKit template (`@trungdo9/ClauKit`, installed via `ck init`).

## Deployment Environments

### Local Development

```bash
# Clone and setup
git clone https://github.com/trungdo9/ClauKit.git your-project
cd your-project

# Install dependencies
npm install

# Initialize Claude Code configuration
ck init

# Start development
claude
```

### Staging Environment

1. Create staging branch from main
2. Deploy to staging server
3. Run automated tests
4. Validate functionality

### Production Deployment

1. Ensure all tests pass
2. Review code changes
3. Merge to main branch
4. Automated release triggers deployment

## CI/CD Pipeline

### GitHub Actions Workflow

Location: `.github/workflows/release.yml`

```yaml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run semantic-release
```

### Automated Release Process

1. Push changes to main branch
2. Semantic Release analyzes commits
3. Version bump determined automatically
4. Changelog generated
5. GitHub release created
6. NPM package published (if configured)

## Cloud Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

## Environment Configuration

### Required Environment Variables

```bash
# .env.example
ANTHROPIC_API_KEY=your-api-key
GEMINI_API_KEY=your-gemini-key
DATABASE_URL=your-database-url
```

### Production Considerations

- Use secure secret management
- Enable HTTPS
- Configure CORS appropriately
- Set up logging and monitoring

## Monitoring & Observability

### Logging

- Use structured logging
- Include correlation IDs
- Log at appropriate levels

### Performance Monitoring

- Track response times
- Monitor error rates
- Set up alerts

## Security Best Practices

### Environment Secrets

- Never commit .env files
- Use secret management services
- Rotate API keys regularly

### Access Control

- Implement authentication
- Use authorization checks
- Validate all inputs

## Rollback Procedures

### Git Rollback

```bash
# Find last good commit
git log --oneline -20

# Revert to specific commit
git revert <commit-hash>
```

### NPM Rollback

```bash
# Revert to previous version
npm install package@previous-version
```

## Related Documentation

- [Project Overview PDR](./project-overview-pdr.md)
- [System Architecture](./system-architecture.md)
- [Code Standards](./code-standards.md)
- [Design Guidelines](./design-guidelines.md)
