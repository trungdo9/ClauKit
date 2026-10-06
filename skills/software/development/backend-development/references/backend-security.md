# Backend Security

Backend-specific security patterns: input validation, rate limiting, security headers.

**OWASP Top 10, audits, vulnerability rules:** owned by the `security` skill — read
[.claude/skills/software/security/SKILL.md](../../../security/SKILL.md). Current OWASP Top 10:2025
categories and the 2021 → 2025 shifts: [security/references/mindset.md](../../../security/references/mindset.md).
Pre-ship checklist: [security/references/checklists.md](../../../security/references/checklists.md).
API security checklist: [backend-api-design.md](backend-api-design.md) → "API Security Checklist".

**Password hashing:** argon2id preferred; bcrypt (cost ≥ 12) acceptable — never MD5/SHA-* or unsalted.
See [security/rules/generic/13-weak-password-hashing.md](../../../security/rules/generic/13-weak-password-hashing.md)
and [backend-authentication.md](backend-authentication.md) → "Password Security".

## Input Validation

Validate on the server, at the boundary, against an allow-list. Client-side validation is UX, not security.

**1. Type validation (class-validator / NestJS)**
```typescript
class CreateUserDto {
  @IsEmail()
  email: string;

  // NIST 800-63B: length only — no composition rules (no forced upper/digit/symbol).
  // Check against a breached-password list (e.g. HaveIBeenPwned k-anonymity API) in the service layer.
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password: string;

  @IsInt()
  @Min(18)
  age: number;
}
```

**2. Sanitization** — only where HTML input is intended: `DOMPurify.sanitize(userInput)` (`isomorphic-dompurify`).

**3. Allow-lists over deny-lists** (also blocks mass assignment)
```typescript
const allowedFields = ['name', 'email', 'age'];
const sanitized = Object.fromEntries(
  Object.entries(input).filter(([key]) => allowedFields.includes(key)),
);
```

**Injection:** parameterized queries always — `db.query('SELECT * FROM users WHERE email = $1', [email])`.

## Rate Limiting

`express-rate-limit` uses a **fixed window** counter by default (bursts of up to 2× `limit` are possible
at a window boundary). For smoother limiting use a sliding-window or token-bucket limiter
(e.g. `rate-limiter-flexible`) backed by Redis so limits hold across instances.

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute fixed window
  limit: 100,               // requests per window per key (IP by default)
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

**Suggested tiers (per 15 min):** auth 10 attempts (per account + per IP) · public 100 · authenticated 1000 · admin 50

## Security Headers

```typescript
// Essential headers (helmet sets most of these)
{
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=()',
}
```

## Secrets

Never hardcode or commit secrets; load from env / a secret manager, fail fast when missing, rotate,
least privilege. Tooling (Vault, Kubernetes Secrets): [backend-devops.md](backend-devops.md) → "Secrets Management".
Detection rule: [security/rules/generic/01-hardcoded-secret.md](../../../security/rules/generic/01-hardcoded-secret.md).

**Resources:** [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/) · [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html)
