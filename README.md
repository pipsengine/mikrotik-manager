# mikroktic-manager

Enterprise AI-powered MikroTik Network Management Platform.

The platform is designed as a Network Operations Center with secure RouterOS connectivity, ITIL change management, RBAC, auditability, AI-assisted planning, automatic backup, validation, and rollback.

## Workspace

- `apps/web` - Next.js App Router frontend.
- `apps/api` - NestJS API.
- `apps/worker` - BullMQ background workers.
- `packages/database` - Prisma schema and database client.
- `packages/shared` - shared roles, permissions, navigation, workflow, and domain metadata.
- `packages/ui` - reusable UI primitives.
- `packages/security-kit` - security policy helpers.
- `docs` - architecture, deployment, security, AI workflow, and user documentation.

## Network Control Center

The Network Control Center module adds enterprise device access control, bandwidth governance, website/application/social-media restrictions, time-based access, special access devices, bulk actions, policy scheduling, activity logs and usage reports.

## AI-NOC 2.0

AI-NOC 2.0 adds a network operations center dashboard, digital twin, asset management, identity-based networking, policy templates, AI optimization, compliance, predictive analytics, drift detection, risk scoring, dry-run simulation, quality analytics, Wi-Fi analytics, approval workspace, automation recipes, multi-site hierarchy, plugin architecture and enterprise integration APIs.

## Requirements

- Node.js LTS 22+
- pnpm 9+
- Microsoft SQL Server 2022+
- Redis
- HTTPS reverse proxy on Windows Server/IIS for production

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm lint
```

## Security Principles

- Microsoft SQL Server only.
- No direct router changes without read, analyze, backup, plan, approval, execute, validate, document, and rollback readiness.
- RBAC is enforced on pages, buttons, APIs, and actions.
- Audit logs are mandatory for every user, router, approval, execution, validation, rollback, and security event.
