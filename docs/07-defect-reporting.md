# Defect Reporting

Defect Reporting captures faults reported by pilots, engineers, or maintenance control during line and hangar operations.

---

## Why this module exists

Defects are the trigger for most maintenance activity. Capturing them early—with aircraft, flight, and category context—starts the workflow that leads to work orders, parts, and sign-off.

---

## Key features

- Create defect from pilot or engineer UI
- Link defect to aircraft and optional flight
- Categorize by severity and system (ATA chapter in V3)
- Photo and note attachments
- Maintenance Controller review queue
- Defer defect with reason (MEL-style, simplified)
- Convert defect to work order
- Defect history per aircraft

---

## Defect statuses

| Status | Meaning |
|--------|---------|
| Reported | Newly submitted |
| Under Review | Controller triaging |
| Deferred | Accepted limitation; aircraft may operate with restrictions |
| Work Order Created | Linked WO exists |
| Rectified | Fix applied; pending close |
| Closed | Complete |
| Cancelled | Invalid or duplicate report |

---

## Status transitions

```text
Reported → Under Review
Under Review → Deferred | Work Order Created | Cancelled
Deferred → Work Order Created | Closed (if no longer applicable)
Work Order Created → Rectified (when WO work done)
Rectified → Closed
```

---

## Important data fields

### `defects`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `reference_number` | string | e.g. DEF-2024-0142 |
| `aircraft_id` | UUID | Required |
| `flight_id` | UUID | Optional |
| `reported_by` | UUID | User ID |
| `reported_at` | timestamp | |
| `title` | string | Short summary |
| `description` | text | Full narrative |
| `location_on_aircraft` | string | e.g. "NLG bay" |
| `ata_chapter` | string | Optional; e.g. "32" |
| `severity` | enum | `minor`, `significant`, `critical` |
| `category` | enum | `technical`, `cabin`, `cosmetic` |
| `status` | enum | See above |
| `deferred_reason` | text | If deferred |
| `deferred_until` | date | Optional |
| `work_order_id` | UUID | When WO created |
| `reviewed_by` | UUID | Controller |
| `reviewed_at` | timestamp | |
| `closed_by` | UUID | |
| `closed_at` | timestamp | |
| `account_id` | UUID | |

### `attachments`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `entity_type` | enum | `defect`, `work_order` |
| `entity_id` | UUID | |
| `file_url` | string | Storage path |
| `file_name` | string | |
| `uploaded_by` | UUID | |

---

## Example workflow: pilot line report

```text
Pilot completes post-flight walkaround
Opens "Report Defect" on mobile/web
Selects aircraft G-ABCD, flight ABC123
Enters title: "Left nav light inop"
Severity: minor, uploads photo
Submits → status Reported
Notification to Maintenance Controller queue
```

---

## Example workflow: review and raise WO

```text
Controller opens defect DEF-2024-0142
Reviews photo and description
Status → Under Review
Decides rectification required
Clicks "Create Work Order" → WO-2024-0089
Defect status → Work Order Created
Aircraft availability → Under Maintenance (if significant+)
```

---

## Example workflow: defer defect

```text
Controller assesses defect as deferrable per operator policy (simplified)
Enters deferred_reason, deferred_until
Status → Deferred
Aircraft registry → Restricted / Deferred Defect
Fleet risk on next flight → Monitor
```

---

## MVP notes

- No formal MEL/CDL library; free-text defer reason.
- Reference numbers generated sequentially per account/year.
- Email/in-app notification optional; queue view required.
- Pilots can only create/view own defects unless profile allows broader view.

## Future improvements

- Structured MEL item reference (V3).
- Voice-to-text defect capture.
- Duplicate defect detection by keyword similarity.
- Offline capture with sync.
