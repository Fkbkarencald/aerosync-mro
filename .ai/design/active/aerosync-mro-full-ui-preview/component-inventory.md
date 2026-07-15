# Component Inventory — how to build a page

Import via `@/…` alias. Every page follows the same skeleton:

```tsx
<div className="page">
  <PageHeader crumbs={[…]} title="…" description="…" actions={<…/>} />
  {/* metric-grid / stat-strip (list pages) */}
  <section className="card">
    <div className="card-header"><FilterBar>…</FilterBar></div>
    <DataTable … footer={<TableFooter shown={n} total={n} />} />
  </section>
</div>
```

Detail pages swap `PageHeader` for `Breadcrumbs` + `EntityHeader` (EntityHeader owns the `<h1>`),
then `.two-col` with cards, and usually a `Timeline` card.

## Shell (`@/components/shell/…`)

| Component | Props / notes |
|---|---|
| `AppShell` | Layout route; renders Sidebar, TopBar, `<Outlet/>`, prototype footer. Don't touch from pages. |
| `PageHeader` | `{ crumbs?, title, description?, actions?, meta? }` — crumbs auto-prefix "Dashboard". |
| `Breadcrumbs` | `{ crumbs: { label, to? }[] }` — last crumb is current page (no `to`). |
| `BrandBlock` / `BrandMark` | Auth pages reuse the brand lockup. |

## UI kit (`@/components/ui/…`)

| Component | File | Props (essentials) |
|---|---|---|
| `StatusBadge` | Badge | `{ status }` — any documented status label |
| `SeverityBadge` / `RiskBadge` / `PriorityBadge` | Badge | `{ severity }` / `{ risk }` / `{ priority }` — icons included |
| `StatusCell` | Badge | `{ status, reason? }` — badge + reason subtext for tables |
| `MetricCard` | MetricCard | `{ label, value, meta?, tone?, icon?, to? }` |
| `DataTable<T>` | DataTable | `{ columns, rows, rowKey, rowTone?, caption, compact?, empty?, footer? }`; `Column<T>`: `{ key, header, render, numeric?, hideMobile?, width? }` |
| `TableFooter` | DataTable | `{ shown, total, children? }` (children = `<Pagination/>`) |
| `FilterBar` / `FilterSpacer` | FilterBar | wrap search/selects/segmented |
| `SearchInput` | FilterBar | `{ placeholder, value?, onChange?, width? }` — pass state for live filtering, omit for static visual |
| `SelectFilter` | FilterBar | `{ label, options, value?, onChange?, allLabel? }` |
| `Segmented` | FilterBar | `{ options: {label,value,icon?}[], value, onChange, label }` |
| `Tabs` | Tabs | `{ tabs: { id, label, count?, content }[] }` — accessible, arrow keys |
| `Timeline` | Timeline | `{ events: TimelineEvent[], oldestFirst? }` — resolves user names, renders refLinks |
| `DetailGrid` | DetailGrid | `{ items: { label, value }[] }` |
| `EntityHeader` | EntityHeader | `{ identIcon?/identText?, identTone?, title, badges?, subtitle?, meta?, actions? }` |
| `Avatar` / `UserChip` | Avatar | `UserChip { userId?, sub?, link?, size? }` — renders "Unassigned" fallback |
| `ProgressBar` | Misc | `{ value(0–100), tone?, label? }` |
| `EmptyState` | Misc | `{ icon, title, children?, action? }` |
| `Banner` | Misc | `{ tone: info|warn|danger|neutral, children, icon? }` |
| `PrototypeNotice` | Misc | standalone disclaimer block (auth pages, sign-off doc) |
| `AttachmentGrid` | Misc | `{ attachments }` — icon tiles, no real files |
| `Pagination` / `usePagination` | Misc | local mock paging |
| `Overlay` | Overlay | `{ open, onClose, title, variant: 'drawer'|'dialog', footer?, children }` — focus-trapped |
| `Popover` | Popover | anchored menu (already used by TopBar) |
| `StackedBarChart` / `DonutChart` / `Sparkline` / `HBarChart` | Charts | dependency-free SVG, all take `ariaLabel` |
| `PermissionMatrix` | PermissionMatrix | `{ granted: string[], editable? }` — full domain grid |
| Form primitives | Form | `FormCard`, `FormSection{title,hint}`, `TextField`, `SelectField`, `TextAreaField`, `CheckRow`, `FormFooter{note}`, `AttachmentDropzone` — all visual-only (`defaultValue`, `onSubmit` preventDefault) |

## Data access (`@/data`)

Everything comes from `@/data`: entity arrays (`aircraft`, `flights`, `defects`, `workOrders`,
`signOffs`, `maintenanceRecords`, `users`, `securityProfiles`, `parts`, `stockLevels`,
`inventoryTransactions`, `partRequests`, `accounts`, `fleetPlans`, `maintenanceEvents`, `auditLogs`,
`availabilityTrend`, `notifications`), lookups (`getAircraft`, `getFlight`, `getDefect`,
`getWorkOrder`, `getSignOff`, `getUser`, `getProfile`, `getAccount`, `getFleetPlan`, `getPart`),
relations (`defectsForAircraft`, `openWorkOrdersForAircraft`, `requestsForWorkOrder`,
`recordsForAircraft`, `myWorkOrders`…), and derived summaries (`fleetSummary`, `atRiskFlights`,
`reviewQueueDefects`, `openWorkOrders`, `defectSeverityBreakdown`, `upcomingMaintenance`,
`currentUser`, `OPERATOR_NAME`). Name helpers: `userName(id)`, `shortName(id)`.

Formatting from `@/lib/format`: `fmtDate`, `fmtDayMonth`, `fmtWeekday`, `fmtTime`, `fmtDateTime`,
`fmtDateTimeFull`, `fmtRelative`, `fmtDuration`, `minutesBetween`, `fmtNumber`, `fmtCurrency`, `NOW`.

## Hard rules for page implementations

1. Links only via `paths.*` from `@/app/paths` — never hand-typed URL strings.
2. Detail pages resolve their param with a lookup and render `<NotFoundPage/>` when missing.
3. No new dependencies; icons from `lucide-react` only.
4. No new CSS files — the shared vocabulary covers the patterns; tiny inline `style` for one-off spacing is acceptable.
5. Forms: `onSubmit={(e) => e.preventDefault()}`, `defaultValue` everywhere, footer note that nothing persists.
6. Buttons either navigate (render a `Link` styled `.btn`) or toggle local state (drawer, tabs, filters) — no dead ends: any non-navigating action button must still do something visible (open preview overlay) or be clearly a preview control inside a form footer.
7. Status meaning: use the badge components; add reasons via `StatusCell`.
8. TypeScript strict: `import type` for types (verbatimModuleSyntax), no `any`, no unused symbols.
9. Realistic microcopy consistent with the pinned moment (Wed 15 Jul 2026 13:00). No lorem ipsum, no "TODO", no "coming soon".
