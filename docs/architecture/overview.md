# Architecture

mikroktic-manager is an enterprise NOC platform composed of:

- Next.js App Router frontend with white enterprise UI, global navigation, breadcrumbs, global search, notifications, AI status and profile menu.
- NestJS backend API with modular domains for auth, access control, MikroTik integration, configuration, AI agents, change management, backups, monitoring, security, reports, audit, secrets, jobs, queues and telemetry.
- BullMQ worker for backup, discovery, validation, notification and scheduled jobs.
- Microsoft SQL Server 2022+ via Prisma.
- Redis for background jobs.
- Windows Server/IIS reverse proxy for production.

The design assumes future multi-tenancy, high availability, clustering and cloud deployment.
