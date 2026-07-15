# Route Inventory

44 routes (43 documented + `/records` fleet-wide records list backing the "Maintenance Records"
sidebar item). Canonical mock ids: aircraft **VH-OYU**, plan **FP-2026-0715**, flight **ASR-214**,
defect **DEF-2026-0042**, work order **WO-2026-0031**, sign-off **SO-2026-0018**, account **ACC-001**,
user **USR-014**, profile **SP-006**.

| Route | Page | Highlights |
|---|---|---|
| `/login` | LoginPage | Standalone split layout, brand panel, visual-only form |
| `/forgot-password` | ForgotPasswordPage | Email form + confirmation-state preview toggle |
| `/invite/:token` | InvitePage | Invitation summary (Aisha Khan, SP-006), password fields |
| `/` | DashboardPage | 8 KPIs, at-risk flights, review queue, 7-day availability chart, severity donut, my WOs, planned maintenance, maintenance + audit activity |
| `/fleet/availability` | FleetAvailabilityPage | **Flagship.** Status strip, live filters, dense 9-col board, table/board toggle, AOG row accents |
| `/fleet/plans` | FleetPlansPage | Published / draft / archived, list + calendar view control |
| `/fleet/plans/:id` | FleetPlanDetailPage | FP-2026-0715: approvals, aircraft & flight assignments, conflicts, revisions |
| `/fleet/plans/new` · `/fleet/plans/:id/edit` | FleetPlanFormPage | Shared visual form, aircraft selection, save draft / publish |
| `/fleet/planned-maintenance` | PlannedMaintenancePage | 14-day Gantt-style timeline + upcoming checks table |
| `/aircraft` | AircraftListPage | Registry metrics, 10-col fleet table, filters |
| `/aircraft/:id` | AircraftDetailPage | Entity header; tabs: Summary / Open items / Timeline / Maintenance records |
| `/aircraft/new` · `/aircraft/:id/edit` | AircraftFormPage | Shared registration form, validation styling |
| `/aircraft/:id/records` | AircraftRecordsPage | Audit-grade certified history with release references |
| `/flights` | FlightsPage | Date selector, schedule table, risk filter |
| `/flights/:id` | FlightDetailPage | Turnaround countdown, risk, restrictions, open items, event timeline |
| `/flights/new` | FlightFormPage | Schedule + aircraft assignment form |
| `/defects` | DefectsPage | Metrics, filters, 10-col defect log |
| `/defects/:id` | DefectDetailPage | Full status timeline, attachments, deferral, preview actions |
| `/defects/new` | DefectReportPage | **Mobile-priority** report form with photo dropzone |
| `/defects/review` | DefectReviewPage | **Flagship.** Queue + preview split view, impact chips, next-action controls |
| `/work-orders` | WorkOrdersPage | Metrics, filters, 11-col table with progress + parts/sign-off state |
| `/work-orders/:id` | WorkOrderDetailPage | Tasks checklist, labour, notes, parts, inspection, sign-off panel, audit metadata, timeline |
| `/work-orders/new` | WorkOrderFormPage | Visual creation form (defect link, assignment, tasks) |
| `/work-orders/mine` | MyWorkOrdersPage | **Mobile-priority.** Buckets: due soon / awaiting parts / inspection / sign-off / recent; table+card |
| `/work-orders/:id/sign-off` | SignOffPage | Formal release document: checklist, licence, signature visual, release statement |
| `/sign-offs` | SignOffsPage | Release history table → WOs and aircraft |
| `/records` | MaintenanceRecordsPage | Fleet-wide certified records (sidebar "Maintenance Records") |
| `/inventory/parts` | PartsPage | Catalogue with effectivity + stock state |
| `/inventory/stock` | StockPage | Stock by warehouse/bin, serviceable/unserviceable/reserved/available |
| `/inventory/transactions` | TransactionsPage | Issue/return/transfer/adjustment log + issue-or-return drawer |
| `/inventory/requests` | RequestsPage | Request queue with urgency and required-by |
| `/accounts` | AccountsPage | Operator/customer/supplier list with billing state |
| `/accounts/:id` | AccountDetailPage | Contacts, fleet, active work, costs, activity |
| `/accounts/:id/cost-centres` | CostCentresPage | Budget vs spend per centre |
| `/reports` | ReportsPage | 10 report cards with chart previews + recent-report history |
| `/admin/users` | UsersPage | Directory with role/status/profile filters, invite action |
| `/admin/users/:id` | UserDetailPage | Identity, profiles, effective permissions, logins, activity, suspend visual |
| `/admin/security-profiles` | SecurityProfilesPage | 10 profiles, system indicators, permission counts |
| `/admin/security-profiles/:id` | SecurityProfileDetailPage | Permission-matrix editor preview, assigned users, system warning |
| `/admin/audit-logs` | AuditLogsPage | Filterable trail, expandable before/after diff |
| `/admin/settings` | SettingsPage | Operator, branding, reference formats, time zone, bases, statuses, notifications, security, disclaimer |
| `*` | NotFoundPage | Shell-preserving 404 with useful nav |

## Cross-link contract

Aircraft rows → aircraft detail; defect rows → defect detail; WO links resolve both ways
(defect ↔ WO ↔ sign-off); aircraft detail → records; flights ↔ aircraft ↔ defects; sign-off history →
WOs + aircraft; account rows → account detail → cost centres; user rows → user detail; profile rows →
matrix editor; audit entity refs → entity pages; breadcrumbs → correct parent lists. All links built
from `paths.*`.
