# Sign-off and Maintenance Records

This module covers release to service sign-offs and the long-lived maintenance history for each aircraft.

---

## Why this module exists

After work is complete, a **licensed engineer** must formally record that the aircraft (or specific work) is released. Maintenance records provide an auditable history of what was done, by whom, and when—supporting planners, auditors, and account costing.

> Sign-off in AeroSync MRO is a **workflow record** in a prototype system—not a substitute for regulated release documentation.

---

## Key features

- Perform sign-off on work order / aircraft
- Sign-off types: line release, return to service, partial
- Capture licensed engineer credentials reference
- Link sign-off to WO and defect closure
- Maintenance record auto-generated on WO close
- View maintenance history by aircraft
- Attachment of completion documents

---

## Important data fields

### `sign_offs`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `reference_number` | string | e.g. SO-2024-0041 |
| `aircraft_id` | UUID | |
| `work_order_id` | UUID | |
| `sign_off_type` | enum | `line_release`, `return_to_service`, `inspection` |
| `signed_by` | UUID | Licensed engineer user |
| `license_number` | string | Display/reference |
| `signed_at` | timestamp | |
| `statement` | text | e.g. "Certifies work complete per approved data" |
| `limitations` | text | Optional restrictions |
| `account_id` | UUID | |

### `maintenance_records`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `aircraft_id` | UUID | |
| `work_order_id` | UUID | |
| `defect_id` | UUID | Optional |
| `record_type` | enum | `corrective`, `inspection`, `scheduled` |
| `summary` | text | |
| `performed_by` | UUID | Engineer |
| `certified_by` | UUID | Licensed engineer |
| `performed_at` | timestamp | |
| `total_manhours` | decimal | |
| `parts_used_summary` | text | V2: structured parts list |
| `account_id` | UUID | |

---

## Example workflow: release after WO

```text
WO-2024-0089 status → Ready for Sign-off
Licensed Engineer reviews tasks and labour notes
Opens Sign-off form
Enters statement, confirms license number
Submits → sign_offs record created
WO → Closed
maintenance_records entry auto-created
defect → Closed
aircraft.status → Serviceable
aircraft_availability → Available
Audit: signoff.perform, work_order.close
```

---

## Sign-off types

| Type | Use case |
|------|----------|
| line_release | Line maintenance complete; aircraft released for flight |
| return_to_service | After heavier check or AOG repair |
| inspection | Independent inspection sign-off only |

---

## Maintenance record timeline

Each aircraft detail page shows `maintenance_records` ordered by `performed_at`:

```text
2024-06-10  Corrective  WO-2024-0089  Nav light replaced
2024-06-01  Inspection  WO-2024-0072  Weekly check
2024-05-15  Scheduled   WO-2024-0060  A-Check (simplified entry)
```

---

## Rules

| Rule | Behavior |
|------|----------|
| Sign-off permission | Requires `signoff.perform` |
| WO closure | Aircraft-release WOs require sign_off before Closed |
| Immutable sign-off | No delete; correction via new record + audit note |
| License field | Required on sign_off form |

---

## MVP notes

- Single sign-off per WO sufficient for MVP.
- `license_number` stored as text on user profile and copied to sign_off.
- No digital signature cryptography; timestamp + user ID only.
- maintenance_records created automatically on sign-off.

## Future improvements

- Multi-level sign-off (inspector + certifier).
- PDF certificate generation.
- Structured parts list on maintenance record (V2).
- Export maintenance history pack for customer account.
