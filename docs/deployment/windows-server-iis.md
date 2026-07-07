# Windows Server and IIS Deployment

Production infrastructure:

- Windows Server.
- Node.js LTS.
- IIS reverse proxy.
- SSL certificate binding.
- Redis.
- Microsoft SQL Server 2022+.
- Windows Service for API and worker processes.
- Automatic backup service.

Runtime topology:

- IIS terminates HTTPS on port `2026`.
- IIS URL Rewrite proxies `/api/*` to the NestJS API on `http://localhost:4000/api/*`.
- IIS URL Rewrite proxies all other requests to the Next.js web service on `http://localhost:3000`.
- API and worker run as Windows Services.
- Web may run as a Windows Service and remain private to IIS.

Database:

- Provider: Microsoft SQL Server only.
- Database: `DLE_Mikrotik`.
- User: `sa`.
- Connection string: `DATABASE_URL` in `.env`.

Checklist:

- Enforce HTTPS.
- Configure secure headers.
- Store secrets outside source control.
- Configure Redis and MSSQL health checks.
- Run Prisma migrations against MSSQL only.
- Start web, API and worker through Windows Service.
- Point IIS at `infrastructure/iis/web.config`.
- Bind the IIS site to HTTPS port `2026`.
- Keep service ports `3000` and `4000` private to the server; expose only IIS port `2026` externally.
