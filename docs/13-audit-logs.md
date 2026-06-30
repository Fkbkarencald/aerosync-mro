# Audit Logs

Audit Logs provide an append-only trail of significant actions across AeroSync MRO for accountability, troubleshooting, and demo credibility.

---

## Why this module exists

MRO operations require knowing **who changed what, when, and from where**. When an aircraft status flips to AOG or a sign-off is recorded, teams and auditors need reconstructability. Audit logs centralize this without searching individual module histories.

---

## Key features

- Automatic logging of create/update/delete on core entities
- Authentication events (login, logout, failed login)
- Status transition logging with old/new values
- Filter by user, entity type, date range, action
- Detail view with JSON payload diff
- Read-only access for Auditor role
- Export CSV (V2)

---

## Logged actions (minimum)

| Category | Actions |
|----------|---------|
| Auth | `auth.login`, `auth.logout`, `auth.login_failed` |
| Aircraft | `aircraft.create`, `aircraft.update`, `aircraft.archive` |
| Availability | `availability.change` |
| Defects | `defect.create`, `defect.status_change`, `defect.defer` |
| Work orders | `work_order.create`, `work_order.assign`, `work_order.status_change` |
| Sign-off | `signoff.perform` |
| Security | `user.create`, `profile.assign`, `permission.change` |
| Inventory | `inventory.issue`, `inventory.adjust` (V2) |

---

## Important data fields

### `audit_logs`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `occurred_at` | timestamp | UTC |
| `user_id` | UUID | Nullable for system |
| `user_email` | string | Denormalized for history |
| `action` | string | e.g. `defect.status_change` |
| `entity_type` | string | `defect`, `work_order`, etc. |
| `entity_id` | UUID | |
| `entity_reference` | string | e.g. DEF-2024-0142 |
| `account_id` | UUID | |
| `ip_address` | string | Optional |
| `user_agent` | string | Optional |
| `old_values` | jsonb | Snapshot before |
| `new_values` | jsonb | Snapshot after |
| `metadata` | jsonb | Extra context |

---

## Example log entries

| occurred_at | user | action | entity | summary |
|-------------|------|--------|--------|---------|
| 2024-06-10 09:15 | pilot@ops.com | defect.create | DEF-2024-0142 | Created nav light defect |
| 2024-06-10 09:22 | mc@ops.com | defect.status_change | DEF-2024-0142 | Reported → Under Review |
| 2024-06-10 09:30 | mc@ops.com | work_order.create | WO-2024-0089 | From defect |
| 2024-06-10 14:00 | eng@ops.com | work_order.status_change | WO-2024-0089 | In Progress → Ready for Sign-off |
| 2024-06-10 14:15 | le@ops.com | signoff.perform | SO-2024-0041 | Return to service |
| 2024-06-10 14:15 | system | availability.change | G-ABCD | Under Maintenance → Available |

---

## Example workflow: auditor investigation

```text
Auditor opens Audit Logs
Filters: entity_reference = WO-2024-0089
Reviews chronological chain
Opens detail on signoff.perform
Confirms licensed engineer and timestamp
Exports CSV for management review (V2)
```

---

## Implementation pattern

```text
Service layer mutation
    ↓
Business logic completes
    ↓
auditService.log({ action, entity, old, new, user })
    ↓
Insert into audit_logs (async queue acceptable)
    ↓
Never update or delete audit rows
```

Use database triggers as backup for critical tables if needed.

---

## Retention

| Environment | Policy |
|-------------|--------|
| Demo | 90 days |
| Production SaaS | 1–7 years configurable (V2) |

MVP: no auto-purge; manual truncate in dev only.

---

## MVP notes

- Log status changes and sign-offs as priority.
- Store old/new as JSON diff of changed fields only.
- UI: searchable table with pagination.
- Permission: `audit_logs.view` only.

## Future improvements

- Immutable storage (WORM bucket export).
- SIEM webhook integration.
- Anomaly alerts (bulk delete attempts).
- Correlation ID across related events in one transaction.
