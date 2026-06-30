# AeroSync MRO

**Fleet maintenance, planning, and release control.**

A simplified aviation maintenance operations platform for managing aircraft availability, fleet planning, defects, work orders, user accounts, security profiles, sign-offs, and maintenance history.

> **Note:** Educational/product prototype inspired by real MRO workflows. Not certified compliance software.

## Documentation

Full product and technical specs live in [`docs/`](./docs/):

| Doc | Topic |
|-----|-------|
| [00-overview](./docs/00-overview.md) | System overview |
| [01-product-vision](./docs/01-product-vision.md) | Goals and principles |
| [02-core-modules](./docs/02-core-modules.md) | Module index |
| [03-user-roles-and-security](./docs/03-user-roles-and-security.md) | Roles and permissions |
| [04–13](./docs/04-fleet-planning.md) | Module specifications |
| [14-database-design](./docs/14-database-design.md) | PostgreSQL schema |
| [15-status-workflows](./docs/15-status-workflows.md) | Status machines |
| [16-main-screens](./docs/16-main-screens.md) | UI inventory |
| [17-mvp-scope](./docs/17-mvp-scope.md) | Version 1 scope |
| [18-future-roadmap](./docs/18-future-roadmap.md) | Versions 2 & 3 |
| [19-technical-architecture](./docs/19-technical-architecture.md) | System design |
| [20-sample-user-stories](./docs/20-sample-user-stories.md) | Backlog stories |

## Core Modules

```
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

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run linter               |

## Stack

- React 19
- TypeScript
- Vite
