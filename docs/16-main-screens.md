# Main Screens

UI screen inventory for AeroSync MRO. Assumes Nuxt 3 with role-aware navigation.

---

## Global layout

| Element | Description |
|---------|-------------|
| Top bar | Logo, account name, user menu, notifications |
| Side nav | Module links filtered by permissions |
| Breadcrumbs | Context navigation |
| Footer | "Prototype — not for operational use" disclaimer |

---

## Authentication

| Screen | Route | Users |
|--------|-------|-------|
| Login | `/login` | All |
| Forgot password | `/forgot-password` | All |
| Invite accept | `/invite/:token` | New users |

---

## Dashboard

| Screen | Route | Users |
|--------|-------|-------|
| Operations dashboard | `/` | All (widgets vary by role) |

**Planner widgets:** available count, AOG list, at-risk flights  
**Controller widgets:** defect review queue, open WOs  
**Engineer widgets:** my assigned WOs  
**Admin widgets:** user count, recent audit

---

## Fleet Planning

| Screen | Route | Permission |
|--------|-------|------------|
| Availability board | `/fleet/availability` | `fleet_plan.view` |
| Fleet plans list | `/fleet/plans` | `fleet_plan.view` |
| Fleet plan detail | `/fleet/plans/:id` | `fleet_plan.view` |
| Create/edit plan | `/fleet/plans/new`, `/fleet/plans/:id/edit` | `fleet_plan.create/edit` |
| Planned maintenance | `/fleet/planned-maintenance` | `fleet_plan.view` |

**Availability board columns:** registration, type, status, reason, next flight, open WO/defect

---

## Aircraft Registry

| Screen | Route | Permission |
|--------|-------|------------|
| Aircraft list | `/aircraft` | `aircraft.view` |
| Aircraft detail | `/aircraft/:id` | `aircraft.view` |
| Register aircraft | `/aircraft/new` | `aircraft.create` |
| Edit aircraft | `/aircraft/:id/edit` | `aircraft.edit` |

**Detail tabs:** Summary, Open items, Timeline, Maintenance records

---

## Flight / Turnaround

| Screen | Route | Permission |
|--------|-------|------------|
| Flight list | `/flights` | `fleet_plan.view` or defect.view |
| Flight detail | `/flights/:id` | Same |
| Create flight | `/flights/new` | `fleet_plan.edit` |

Shows assigned aircraft, risk badge, turnaround window.

---

## Defect Reporting

| Screen | Route | Permission |
|--------|-------|------------|
| Defect list | `/defects` | `defect.view` |
| Defect detail | `/defects/:id` | `defect.view` |
| Report defect | `/defects/new` | `defect.create` |
| Review queue | `/defects/review` | `defect.review` |

**Detail actions:** defer, create WO, close, attach photo

---

## Work Orders

| Screen | Route | Permission |
|--------|-------|------------|
| WO list | `/work-orders` | `work_order.view` |
| WO detail | `/work-orders/:id` | `work_order.view` |
| Create WO | `/work-orders/new` | `work_order.create` |
| My assignments | `/work-orders/mine` | `work_order.view` |

**Detail sections:** header, tasks checklist, labour notes, parts (V2), sign-off panel

---

## Parts & Inventory (V2)

| Screen | Route | Permission |
|--------|-------|------------|
| Parts catalog | `/inventory/parts` | `inventory.view` |
| Stock levels | `/inventory/stock` | `inventory.view` |
| Issue/return | `/inventory/transactions` | `inventory.issue` |
| Request queue | `/inventory/requests` | `inventory.view` |

---

## Sign-off & Records

| Screen | Route | Permission |
|--------|-------|------------|
| Sign-off form | `/work-orders/:id/sign-off` | `signoff.perform` |
| Sign-off history | `/sign-offs` | `signoff.view` |
| Maintenance records | `/aircraft/:id/records` | `signoff.view` |

---

## Accounts (V2)

| Screen | Route | Permission |
|--------|-------|------------|
| Account list | `/accounts` | `accounts.view` |
| Account detail | `/accounts/:id` | `accounts.view` |
| Cost centres | `/accounts/:id/cost-centres` | `accounts.view` |

---

## Administration

| Screen | Route | Permission |
|--------|-------|------------|
| Users list | `/admin/users` | `users.view` |
| User detail/edit | `/admin/users/:id` | `users.edit` |
| Security profiles | `/admin/security-profiles` | `security_profiles.view` |
| Profile editor | `/admin/security-profiles/:id` | `security_profiles.edit` |
| Audit logs | `/admin/audit-logs` | `audit_logs.view` |
| Settings | `/admin/settings` | Admin |

---

## Reports (V2)

| Screen | Route | Permission |
|--------|-------|------------|
| Reports hub | `/reports` | `reports.view` |
| Export | action | `reports.export` |

---

## Mobile considerations (MVP)

| Priority screen | Why |
|-----------------|-----|
| Report defect | Pilot line use |
| My work orders | Engineer hangar/line |
| Aircraft lookup | Quick tail search |

Responsive layouts; dedicated native app is V3.

---

## MVP notes

- Build 15–18 screens for V1; skip inventory and accounts screens.
- Use shared components: StatusBadge, DataTable, Timeline, EntityHeader.
- Review queue and availability board are highest-value planner/controller views.

## Future improvements

- Customizable dashboards per user.
- Keyboard shortcuts for controllers.
- Dark mode for ops center displays.
- Print-friendly WO and sign-off PDF layouts.
