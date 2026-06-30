# AeroSync MRO — Overview

**Tagline:** Fleet maintenance, planning, and release control.

AeroSync MRO is a simplified aviation maintenance operations platform for managing aircraft availability, fleet planning, defects, work orders, user accounts, security profiles, sign-offs, and maintenance history.

> **Disclaimer:** AeroSync MRO is an educational and portfolio-grade product prototype inspired by real MRO workflows (e.g. TRAX, PilotLog, QuickTurn, Maintenix). It is **not** certified compliance software and must not be used for actual airworthiness decisions without independent validation.

---

## What the system does

AeroSync MRO connects the people and data involved in keeping aircraft available for flight:

- **Planners** see which aircraft can fly and assign them to schedules.
- **Pilots** report defects from the line.
- **Maintenance controllers** triage defects and raise work orders.
- **Engineers** perform work, request parts, and document labour.
- **Licensed engineers** sign off release to service.
- **Stores and accounts** track parts movement and cost.
- **Auditors and admins** review who did what and when.

The platform is designed to be buildable as a SaaS application with a clear MVP path and room to grow.

---

## Core workflow

```text
Fleet Planner checks aircraft availability
        ↓
Aircraft assigned to flight schedule
        ↓
Pilot reports defect
        ↓
Maintenance Controller reviews defect
        ↓
Work order created
        ↓
Fleet Planning updates aircraft availability
        ↓
Engineer performs work
        ↓
Parts issued if required
        ↓
Licensed Engineer signs off
        ↓
Aircraft becomes available again
        ↓
Account/cost record updated
        ↓
Audit trail stored
```

---

## Core modules

```text
AeroSync MRO
├── Fleet Planning
├── Aircraft Registry
├── Flight / Turnaround Schedule
├── Defect Reporting
├── Work Orders
├── Parts & Inventory
├── Accounts
├── Security Profiles
├── Sign-off & Maintenance Records
└── Audit Logs
```

---

## User roles (summary)

| Role | Primary responsibility |
|------|------------------------|
| Admin | System configuration, users, security profiles |
| Fleet Planner | Aircraft availability and schedule assignment |
| Maintenance Controller | Defect triage, work order creation |
| Engineer | Execute assigned work orders |
| Licensed Engineer | Release sign-off |
| Pilot | Defect reporting, flight context |
| Stores Officer | Parts issue, return, stock levels |
| Accounts Officer | Customer accounts, cost tracking |
| Auditor | Read-only audit and report access |

Roles describe **who** the user is. **Security profiles** describe **what** they can do. See [03-user-roles-and-security.md](./03-user-roles-and-security.md).

---

## Recommended tech stack

| Layer | Options |
|-------|---------|
| Frontend | Nuxt 3 |
| Backend | Supabase or NestJS |
| Database | PostgreSQL |
| ORM | Prisma (if custom backend) |
| Auth | Supabase Auth, Auth.js, Clerk, or Keycloak |
| Storage | S3-compatible or Supabase Storage |
| Hosting | Cloudflare, Render, Fly.io, Supabase, or AWS |

---

## Documentation map

| File | Topic |
|------|-------|
| [01-product-vision.md](./01-product-vision.md) | Goals, principles, non-goals |
| [02-core-modules.md](./02-core-modules.md) | Module index and relationships |
| [03-user-roles-and-security.md](./03-user-roles-and-security.md) | Roles, profiles, permissions |
| [04–13](./04-fleet-planning.md) | Per-module specifications |
| [14-database-design.md](./14-database-design.md) | Tables and relationships |
| [15-status-workflows.md](./15-status-workflows.md) | Status machines |
| [16-main-screens.md](./16-main-screens.md) | UI screen inventory |
| [17-mvp-scope.md](./17-mvp-scope.md) | Version 1 delivery plan |
| [18-future-roadmap.md](./18-future-roadmap.md) | Versions 2 and 3 |
| [19-technical-architecture.md](./19-technical-architecture.md) | System design |
| [20-sample-user-stories.md](./20-sample-user-stories.md) | Backlog-ready stories |

---

## MVP scope (summary)

**Version 1:** Aircraft Registry, Fleet Planning, Defect Reporting, Work Orders, User Accounts, Security Profiles, Sign-off, Audit Logs.

**Version 2:** Inventory, Business Accounts, Cost Centres, Supplier Accounts, Billing, Advanced Forecasting, External MRO Portal, Reports.

**Version 3:** MEL/CDL references, ATA analytics, scheduled maintenance planning, component tracking, offline mobile, barcode/QR, advanced audit exports, Jasper-style reports.

See [17-mvp-scope.md](./17-mvp-scope.md) for full detail.

---

## MVP notes

- Ship the end-to-end defect → work order → sign-off → availability loop before adding inventory and billing depth.
- Use role + security profile from day one even if permission granularity is coarse initially.
- Audit every state change on defects, work orders, availability, and sign-offs.

## Future improvements

- Multi-tenant operator support with isolated data per airline/MRO.
- Integration adapters for external scheduling and ERP systems.
- Mobile-first pilot defect capture with photo upload.
