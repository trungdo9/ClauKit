---
name: backend-development
description: Build robust backend systems with modern technologies (Node.js, Python, Go, Rust), frameworks (NestJS, FastAPI, Django), databases (PostgreSQL, MongoDB, Redis), APIs (REST, GraphQL, gRPC), authentication (OAuth 2.1, JWT), testing strategies, security best practices (OWASP Top 10), performance optimization, scalability patterns (microservices, caching, sharding), DevOps practices (Docker, Kubernetes, CI/CD), and monitoring. Use when designing APIs, implementing authentication, optimizing database queries, setting up CI/CD pipelines, handling security vulnerabilities, building microservices, or developing production-ready backend systems.
license: MIT
version: 1.0.0
---

# Backend Development Skill

Production-ready backend development with modern technologies, best practices, and proven patterns.

## When to Use

- Designing RESTful, GraphQL, or gRPC APIs
- Building authentication/authorization systems
- Optimizing database queries and schemas
- Implementing caching and performance optimization
- OWASP Top 10 security mitigation
- Designing scalable microservices
- Testing strategies (unit, integration, E2E)
- CI/CD pipelines and deployment
- Monitoring and debugging production systems

## Technology Selection Guide

**Languages:** Node.js/TypeScript (full-stack), Python (data/ML), Go (concurrency), Rust (performance)
**Frameworks:** NestJS, FastAPI, Django, Express, Gin
**Databases:** PostgreSQL (ACID), MongoDB (flexible schema), Redis (caching)
**APIs:** REST (simple), GraphQL (flexible), gRPC (performance)

See: `references/backend-technologies.md` for detailed comparisons

## Reference Navigation

**Core Technologies:**
- `backend-technologies.md` - Languages, frameworks, databases, message queues, ORMs
- `backend-api-design.md` - REST, GraphQL, gRPC patterns and best practices

**Security & Authentication:**
- `backend-security.md` - Input validation, rate limiting, security headers (OWASP → `security` skill)
- `backend-authentication.md` - OAuth 2.1, JWT, RBAC, MFA, session management, password hashing

**Performance & Architecture:**
- `backend-performance.md` - Connection pooling, N+1, caching, load balancing, queues, CDN
- `backend-architecture.md` - Microservices, event-driven, CQRS, saga, DDD, CAP/PACELC, tech debt, resilience, scaling

**Quality & Operations:**
- `../test-automation/references/api-integration-testing.md` - API/integration testing (moved from `backend-testing.md`)
- `backend-code-quality.md` - SOLID principles, design patterns, clean code
- `backend-devops.md` - Docker, Kubernetes, deployment strategies, observability, secrets
- `backend-debugging.md` - Debugger CLIs, MongoDB/Redis, HTTP, profiling, failure scenarios

**Related skills:** testing → [test-automation](../test-automation/SKILL.md) · debugging method → [debugging](../../debugging/SKILL.md) · security audit / OWASP → [security](../../security/SKILL.md) · PostgreSQL queries, indexes, EXPLAIN → [database/databases](../../database/databases/SKILL.md)

## Key Best Practices

**Security:** argon2id passwords (bcrypt cost ≥ 12 acceptable), parameterized queries, OAuth 2.1 + PKCE, rate limiting, security headers

**Performance:** Redis caching, indexes driven by query patterns, CDN for static assets, connection pooling

**Testing:** Mostly unit, fewer integration, fewest E2E; contract tests between microservices; test migrations

**DevOps:** Blue-green/canary deployments, feature flags, Prometheus/Grafana metrics, OpenTelemetry tracing

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Fast development | Node.js + NestJS |
| Data/ML integration | Python + FastAPI |
| High concurrency | Go + Gin |
| Max performance | Rust + Axum |
| ACID transactions | PostgreSQL |
| Flexible schema | MongoDB |
| Caching | Redis |
| Internal services | gRPC |
| Public APIs | GraphQL/REST |
| Real-time events | Kafka |

## Implementation Checklist

**API:** Choose style → Design schema → Validate input → Add auth → Rate limiting → Documentation → Error handling

**Database:** Choose DB → Design schema → Create indexes → Connection pooling → Migration strategy → Backup/restore → Test performance

**Security:** OWASP Top 10 → Parameterized queries → OAuth 2.1 + JWT → Security headers → Rate limiting → Input validation → argon2id passwords

**Testing:** Unit 70% → Integration 20% → E2E 10% → Load tests → Migration tests → Contract tests (microservices)

**Deployment:** Docker → CI/CD → Blue-green/canary → Feature flags → Monitoring → Logging → Health checks

## Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OAuth 2.1: https://oauth.net/2.1/
- OpenTelemetry: https://opentelemetry.io/
