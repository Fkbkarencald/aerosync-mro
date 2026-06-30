# Database Design

PostgreSQL schema overview for AeroSync MRO. Designed for Supabase or NestJS + Prisma.

---

## Design principles

- UUID primary keys everywhere
- `account_id` on tenant-scoped tables
- `created_at`, `updated_at`, `created_by`, `updated_by` on mutable entities
- Soft delete via `is_archived` where appropriate—not on audit_logs
- Reference numbers (DEF-, WO-, SO-) unique per account + year
- Status fields as enums or check constraints

---

## Entity relationship overview

```text
accounts
  ├── users ── user_security_profiles ── security_profiles ── security_profile_permissions ── permissions
  ├── account_users
  ├── account_aircraft ── aircraft
  │       ├── aircraft_availability
  │       ├── aircraft_assignments ── flights
  │       ├── planned_maintenance
  │       ├── fleet_plans ── fleet_plan_items
  │       ├── defects ── work_orders ── work_order_tasks
  │       ├── sign_offs
  │       └── maintenance_records
  ├── parts ── inventory_locations ── inventory_transactions
  ├── cost_centres
  ├── attachments (polymorphic)
  ├── audit_logs
  └── reports (V2)
```

---

## Core tables

### Identity and security

| Table | Purpose |
|-------|---------|
| `users` | Application users |
| `roles` | Optional lookup; role also on users |
| `security_profiles` | Permission bundles |
| `permissions` | Master permission catalog |
| `security_profile_permissions` | M:N profile ↔ permission |
| `user_security_profiles` | M:N user ↔ profile |

### Accounts

| Table | Purpose |
|-------|---------|
| `accounts` | Operators/customers |
| `account_users` | User membership |
| `account_aircraft` | Aircraft ownership/contract |
| `cost_centres` | Cost attribution (V2) |

### Fleet and operations

| Table | Purpose |
|-------|---------|
| `aircraft` | Registry master |
| `flights` | Schedule legs |
| `fleet_plans` | Planning periods |
| `fleet_plan_items` | Aircraft in plan |
| `aircraft_assignments` | Aircraft ↔ flight |
| `aircraft_availability` | Time-bound availability |
| `planned_maintenance` | Scheduled checks |

### Maintenance

| Table | Purpose |
|-------|---------|
| `defects` | Defect reports |
| `work_orders` | Work containers |
| `work_order_tasks` | Checklist items |
| `sign_offs` | Release records |
| `maintenance_records` | Historical summary |

### Inventory (V2)

| Table | Purpose |
|-------|---------|
| `parts` | Parts catalog |
| `inventory_locations` | Stores |
| `inventory_transactions` | Stock movements |

### Cross-cutting

| Table | Purpose |
|-------|---------|
| `attachments` | Files on defects/WOs |
| `audit_logs` | Activity trail |
| `reports` | Saved report definitions (V2) |

---

## Key columns by table

### `users`

```sql
id UUID PK
email TEXT UNIQUE NOT NULL
full_name TEXT NOT NULL
role TEXT NOT NULL
status TEXT NOT NULL DEFAULT 'active'
account_id UUID FK → accounts
license_number TEXT NULL  -- for licensed engineers
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### `aircraft`

```sql
id UUID PK
account_id UUID FK
registration TEXT NOT NULL
serial_number TEXT
aircraft_type TEXT NOT NULL
status TEXT NOT NULL
total_flight_hours NUMERIC
total_cycles INT
is_archived BOOLEAN DEFAULT false
UNIQUE (account_id, registration)
```

### `defects`

```sql
id UUID PK
account_id UUID FK
reference_number TEXT NOT NULL
aircraft_id UUID FK
flight_id UUID FK NULL
status TEXT NOT NULL
severity TEXT NOT NULL
work_order_id UUID FK NULL
UNIQUE (account_id, reference_number)
```

### `work_orders`

```sql
id UUID PK
account_id UUID FK
reference_number TEXT NOT NULL
aircraft_id UUID FK
defect_id UUID FK NULL
status TEXT NOT NULL
assigned_to UUID FK → users NULL
priority TEXT NOT NULL
UNIQUE (account_id, reference_number)
```

### `aircraft_availability`

```sql
id UUID PK
aircraft_id UUID FK
status TEXT NOT NULL
effective_from TIMESTAMPTZ NOT NULL
effective_to TIMESTAMPTZ NULL
source_type TEXT
source_id UUID NULL
```

Only one "open" availability row per aircraft (effective_to IS NULL) enforced by app or partial unique index.

---

## Indexes (recommended)

| Table | Index |
|-------|-------|
| `aircraft` | `(account_id, registration)` |
| `defects` | `(aircraft_id, status)`, `(account_id, reference_number)` |
| `work_orders` | `(assigned_to, status)`, `(aircraft_id)` |
| `audit_logs` | `(account_id, occurred_at DESC)`, `(entity_type, entity_id)` |
| `aircraft_availability` | `(aircraft_id, effective_to)` |

---

## Reference number generation

```text
Format: {PREFIX}-{YEAR}-{SEQUENCE}
Examples: DEF-2024-0142, WO-2024-0089, SO-2024-0041

Implementation: per-account sequence table or MAX+1 with row lock
```

---

## Row-level security (Supabase)

```sql
-- Example policy pattern
account_id = auth.jwt() ->> 'account_id'
```

Apply to all tenant tables. Admin bypass via service role only.

---

## MVP notes

- Implement bold tables first; stub V2 tables in migration comments optional.
- Use Prisma schema or Supabase migrations; keep in repo `/prisma` or `/supabase/migrations`.
- attachments: store URL + metadata; file in object storage.

## Future improvements

- Read replicas for reporting.
- Partition audit_logs by month.
- Event outbox table for integrations.
- Full-text search via PostgreSQL tsvector on defects/WOs.
