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
| `npm run test:workflow` | Exercise the interactive defect-to-release state machine |
| `npm run test:handoffs` | Verify role queues, scope, ordering, blocked states, and refresh |

## Stack

- React 19
- TypeScript
- Vite

## UI Design Preview

This branch contains the **complete, navigable UI design preview** of AeroSync MRO: 44 client-side
routes covering every documented screen (docs/16), a shared enterprise design system, and one typed,
internally consistent seed dataset. The defect-to-release V1 slice is interactive and persists in the
current browser; it does not use a backend or provide multi-user operational persistence.

> **Prototype — not for operational use or airworthiness decisions.** The disclaimer is shown
> persistently in the application footer.

Highlights:

- **Application shell** — dark-slate collapsible sidebar (drawer on mobile), operator top bar with
  notification and user-menu previews, breadcrumbs, persistent disclaimer footer.
- **Flagship operational screens** — Fleet Availability board and the Defect Review queue.
- **Full workflow story** — the dataset freezes an operational moment (Wed 15 Jul 2026, 13:00):
  a closed defect→work-order→sign-off loop on `VH-OYU` (DEF-2026-0042 → WO-2026-0031 → SO-2026-0018),
  a live AOG recovery at MQL, a release due by 17:30, and an A-Check in progress.
- **Interactive V1 slice** — an authorised controller can review a reported defect and create an
  assigned work order; the assigned engineer can start work and complete its tasks; a licensed engineer
  can certify release. Work order, defect, aircraft availability, sign-off, maintenance-record, timeline,
  and audit changes are committed together to browser storage.
- **Role handoff console** — pilot, controller, engineer, and licensed-engineer previews derive their
  queues and record scope from the same workflow state. Items link to canonical records and refresh
  immediately after a workflow transition.
- **Design notes** — see [`.ai/design/active/aerosync-mro-full-ui-preview/`](./.ai/design/active/aerosync-mro-full-ui-preview/overview.md).

### Preview validation

```bash
npm run lint                                             # oxlint
npm run build                                            # tsc -b && vite build
npm run test:workflow                                    # state machine + role/transition guards
npm run test:handoffs                                    # role projections + scope and refresh guards
npx vite build --ssr scripts/smoke.tsx --outDir dist-smoke --emptyOutDir
node dist-smoke/smoke.js                                 # render all routes + dead-link scan
```
