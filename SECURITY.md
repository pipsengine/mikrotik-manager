# Security Policy

mikroktic-manager follows secure-by-default enterprise practices:

- HTTPS-only deployment.
- Secure, HTTP-only cookies.
- JWT access tokens with refresh token rotation.
- MFA-ready authentication model.
- Account lockout and failed login detection.
- Password expiry and password policy enforcement.
- Device tracking and login history.
- RBAC and permission checks for every API route and UI action.
- Input validation through DTOs and Zod schemas.
- Prisma parameterization for SQL injection protection.
- CSP, CSRF protection, rate limiting, and secure headers.
- Encrypted secrets vault and encrypted backups.
- Immutable audit trail for changes, approvals, validation, rollback, and AI actions.

Report vulnerabilities privately to the platform security administrator.
