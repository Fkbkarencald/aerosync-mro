# Design System — AeroSync MRO UI Preview

All values live as CSS custom properties in `src/styles/tokens.css`. Components consume tokens only —
no raw hex values inside page code.

## Colour

| Role | Token | Value |
|---|---|---|
| Sidebar background | `--nav-bg` | `#101b2d` deep navy slate |
| Sidebar raised / borders | `--nav-bg-raised` / `--nav-border` | `#182540` / `#223148` |
| Workspace background | `--bg` | `#f3f5f8` light neutral |
| Content surface | `--surface` | `#ffffff` |
| Sunken surface (table heads, form footers) | `--surface-sunken` | `#f8fafb` |
| Borders | `--border` / `--border-strong` | `#e2e7ee` / `#cbd4df` |
| Text | `--text` / `--text-secondary` / `--text-muted` | `#1c2736` / `#4c5b70` / `#77839a` |
| Accent (restrained blue) | `--accent` | `#1d5fd6`, hover `#174db1` |

### Status tones (docs/15 conventions)

Each tone ships `-bg`, `-text`, `-border`, `-dot` so badges are readable and bordered — never colour-only.

| Tone | Used for |
|---|---|
| green | Available, Clear, Serviceable, Closed, Released, Success |
| amber | Monitor, Restricted, Assigned, Deferred, Transfer/In Transit |
| orange | At Risk, Awaiting Parts / Inspection / Sign-off, Urgent, Low Stock, Backordered |
| red | AOG, No Go, Critical, Unserviceable, Suspended, Overdue, Denied |
| grey | Cancelled, Archived, Inactive, Draft, Routine |
| blue | Open, Reported, Under Review, In Progress, Scheduled, Informational, Minor |

Mapping lives in `src/lib/status.ts` (`toneFor`). **Never rely on colour alone** — StatusBadge always
carries the label; Severity/Risk badges add shape icons (octagon/triangle/circle).

## Typography

- Sans: **Inter Variable** (self-hosted via `@fontsource-variable/inter`)
- Mono: **JetBrains Mono Variable** — all reference numbers (`.ref`): VH-OYU, WO-2026-0031…
- Body 14px; tables 13px; table headers 11px uppercase +0.055em; page titles 19px/600;
  entity titles 24px/650; metric values 28px/650 `tabular-nums`.

## Spacing, radius, elevation, density

- 4px spacing scale (`--sp-1…12`); content padding 24px (20px ≤1279px, 14px ≤767px).
- Radius: 6 controls · 8 cards-small · 10 cards · 14 dialogs · full badges.
- Shadows xs/sm on surfaces, md popovers, lg drawers/dialogs — subtle throughout. No gradients, no glassmorphism.
- Table rows: 10px vertical padding (6px compact); controls 34px high (28 sm / 40 lg).

## Breakpoints

| Token (documented) | px | Behaviour |
|---|---|---|
| sm | 640 | — |
| md | 768 | below: sidebar → drawer, search hidden, `.hide-mobile` columns drop, forms single-column, actions stretch |
| lg | 1024 | below: two-column layouts stack, split view stacks, settings nav horizontal |
| xl | 1280 | below: content padding tightens, dashboard side column stacks |
| 2xl | 1440 | content max-width 1600px centred |

## Layout patterns

- `.page` — vertical stack, gap 20px, max-width 1600px.
- `.two-col` — main + 360px side rail (detail pages). Stacks ≤1023px.
- `.dash-grid` — dashboard main + 370px rail. Stacks ≤1279px.
- `.split-view` — 380–420px queue + preview panel (review queue). Stacks ≤1023px.
- `.metric-grid` — auto-fit KPI cards, min 168px.
- Cards: `.card` > `.card-header` (`.card-title`, `.card-actions`) + `.card-body` / `.table-wrap` / `.row-list` + `.card-footer`.

## Voice

Operational, specific, calm. Realistic Australian regional-aviation content (CASA LAME licences,
VH- registrations, MEL/MQL/ABX ports). No lorem ipsum, no "coming soon", no exclamation marks.
The persistent disclaimer reads: **"Prototype — not for operational use or airworthiness decisions."**
