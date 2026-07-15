# AeroSync MRO — Full UI Design Preview

**Package:** `aerosync-mro-full-ui-preview`
**Status:** In progress → target: complete navigable preview
**Phase scope:** Frontend presentation and preview interactions only — no auth, no backend, no persistence, no network data.

## Goal

A convincing, high-fidelity, fully navigable visual prototype of the entire documented AeroSync MRO
product (docs/00–20), suitable for walking every role through what the completed application will look
and feel like: fleet planners, maintenance controllers, engineers, licensed engineers, pilots, stores,
accounts, admins and auditors.

## Product register

Serious enterprise aviation-operations tool. Operational, structured, information-dense, trustworthy.
Explicitly **not**: a marketing site, a generic admin template, a futuristic cockpit, a game UI, or
disconnected mock-ups.

## Architecture at a glance

| Layer | Location | Notes |
|---|---|---|
| Design tokens | `src/styles/tokens.css` | Colours, type, spacing, radius, shadows, density, status tones, breakpoints |
| Base / shell / component / page CSS | `src/styles/*.css` | One shared class vocabulary; pages add no bespoke stylesheets |
| Mock data | `src/data/*` | Typed, internally consistent; single source for every page |
| Route registry | `src/app/paths.ts` | All links built via helpers — no hard-coded URLs in pages |
| Route table | `src/app/AppRoutes.tsx` | Every documented route renders a deliberate page |
| Navigation | `src/app/navigation.ts` | Grouped sidebar definition |
| Shell | `src/components/shell/*` | AppShell, Sidebar (collapsible/drawer), TopBar, PageHeader, Breadcrumbs |
| UI kit | `src/components/ui/*` | Badges, DataTable, MetricCard, FilterBar, Tabs, Timeline, DetailGrid, EntityHeader, Form primitives, Overlay, Charts, PermissionMatrix… |
| Pages | `src/pages/<module>/*` | One folder per module |

## The pinned operational moment

The preview freezes "now" at **Wed 15 Jul 2026, 13:00 local** (`NOW` in `src/lib/format.ts`).
The dataset tells one coherent story around that moment:

- **Hero chain (closed loop):** VH-OYU flew ASR-208 → pilot reported **DEF-2026-0042** (taxi light)
  → controller raised **WO-2026-0031** → engineer rectified → LAME certified **SO-2026-0018**
  → aircraft returned Available and is now **Assigned to ASR-214** under plan **FP-2026-0715**.
- **Live drama:** VH-RXT is **AOG** at MQL (DEF-2026-0044 → WO-2026-0033, pump in transit);
  VH-TRW is **Awaiting Sign-off** (WO-2026-0035, needed by 17:30 for ASR-241);
  VH-MSA is mid **A-Check**; VH-LWK is **Awaiting Parts** (radar backorder);
  VH-ZNE flies **Restricted** on a deferred defect.
- **Current user:** Daniel Reyes (USR-014), Licensed Engineer — makes "My assignments" and the
  sign-off flow first-person.

## Dataset counts

10 aircraft · 21 flights · 12 defects · 16 work orders (incl. history for records) · 13 users ·
10 security profiles (mirrors docs/12 seed list) · 8 sign-offs · 8 maintenance records · 20 parts ·
23 stock rows · 8 transactions · 8 part requests · 4 accounts · 22 audit entries · 4 fleet plans ·
9 planned-maintenance events · 5 notifications.

Counts intentionally sit at-or-just-above the brief's "approximately" numbers where the extra rows
make list pages read as genuinely operational.

## Non-goals (this phase)

Real login/auth/permissions, backend services, Supabase/Firebase, REST/GraphQL, persistence, file
uploads, email, report generation, real exports/notifications, workflow automation, airworthiness
calculations. No page makes a network request for application data.
