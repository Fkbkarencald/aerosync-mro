# Core Modules

This document indexes every major module in AeroSync MRO, explains why it exists, and shows how modules connect.

---

## Module map

```text
AeroSync MRO
├── Fleet Planning ............... availability & assignment decisions
├── Aircraft Registry ............ master aircraft data
├── Flight / Turnaround Schedule . operational context for defects & planning
├── Defect Reporting ............. pilot/line fault capture
├── Work Orders .................. maintenance execution container
├── Parts & Inventory ............ stock, issue, return (V2)
├── Accounts ..................... customers, cost centres (V2)
├── Security Profiles ............ permission bundles
├── Sign-off & Maintenance Records release & history
└── Audit Logs ................... system-wide activity trail
```

Cross-cutting: **User Accounts**, **Reports** (V2+).

---

## Module relationships

```text
Aircraft Registry ──► Fleet Planning ──► Flight / Turnaround Schedule
        │                    │
        │                    └──► aircraft_availability (status)
        │
        ├──► Defect Reporting ──► Work Orders ──► Sign-off & Maintenance Records
        │                              │
        │                              └──► Parts & Inventory (V2)
        │
        └──► Accounts (V2) ◄── cost_centres, billing

Security Profiles ──► all modules (authorization)
Audit Logs ──► all modules (observability)
```

---

## Module summary

| Module | Why it exists | Primary users | MVP |
|--------|---------------|---------------|-----|
| Fleet Planning | Answer "which aircraft can fly?" | Fleet Planner | Yes |
| Aircraft Registry | Single source of truth for tail numbers | Admin, Planner | Yes |
| Flight / Turnaround Schedule | Tie defects and planning to flights | Planner, Pilot | Partial |
| Defect Reporting | Capture faults at source | Pilot, Engineer | Yes |
| Work Orders | Track rectification work | Controller, Engineer | Yes |
| Parts & Inventory | Support parts-dependent WOs | Stores Officer | V2 |
| Accounts | Customer and cost attribution | Accounts Officer | V2 |
| Security Profiles | Fine-grained access control | Admin | Yes |
| Sign-off & Maintenance Records | Release and historical proof | Licensed Engineer | Yes |
| Audit Logs | Accountability | Auditor, Admin | Yes |

---

## Data ownership rules

| Entity | Created by | Owned by module |
|--------|------------|-----------------|
| `aircraft` | Admin | Aircraft Registry |
| `aircraft_availability` | System / Planner | Fleet Planning |
| `defects` | Pilot, Engineer | Defect Reporting |
| `work_orders` | Controller | Work Orders |
| `sign_offs` | Licensed Engineer | Sign-off & Maintenance Records |
| `inventory_transactions` | Stores Officer | Parts & Inventory (V2) |
| `audit_logs` | System | Audit Logs |

---

## Integration points (future)

| Module | External system | Purpose |
|--------|-----------------|---------|
| Flight Schedule | Ops scheduling tool | Import flights |
| Inventory | Supplier catalog | Part numbers |
| Accounts | ERP / billing | Invoice export |
| Audit Logs | SIEM | Security monitoring |

---

## Key features (platform-wide)

- Unified aircraft timeline (defects, WOs, availability changes, sign-offs)
- Role + security profile authorization on every API route
- Status-driven workflows with explicit transitions
- Attachment support on defects and work orders
- Full-text search on tail number, WO number, defect reference

---

## Important shared fields

| Field | Used on | Purpose |
|-------|---------|---------|
| `aircraft_id` | Most operational tables | Link to registry |
| `account_id` | Multi-tenant rows | Operator/customer scope |
| `created_by` / `updated_by` | All mutable entities | User attribution |
| `status` | Defects, WOs, availability | Workflow state |
| `reference_number` | Defects, WOs | Human-readable ID |

---

## Example workflow: module handoffs

```text
[Flight Schedule] Flight ABC123 lands, turnaround window opens
        ↓
[Defect Reporting] Pilot creates DEF-2024-0142 on G-ABCD
        ↓
[Fleet Planning] Availability → Restricted / Under Maintenance
        ↓
[Work Orders] MC creates WO-2024-0089 from defect
        ↓
[Work Orders] Engineer updates tasks, adds labour notes
        ↓
[Sign-off] Licensed Engineer signs release
        ↓
[Fleet Planning] Availability → Available
        ↓
[Audit Logs] All transitions recorded
```

---

## MVP notes

- Flight / Turnaround Schedule: MVP supports manual flight entry and turnaround timestamps; no live feed.
- Accounts module stubbed with `account_id` on rows for future multi-tenancy.
- Reports deferred to V2; basic list exports from each module in MVP.

## Future improvements

- Module-level dashboard widgets composable by role.
- Event bus (e.g. `DefectCreated`, `WorkOrderClosed`) for notifications and webhooks.
- Read-only API for external BI tools.
