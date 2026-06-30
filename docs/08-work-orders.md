# Work Orders

Work Orders are the execution container for maintenance work. They track assignment, tasks, progress, parts usage, and closure through to sign-off.

---

## Why this module exists

Once a defect is accepted for rectification, teams need a structured record: who is doing the work, what tasks are required, what status the job is in, and when it is ready for release. Work orders bridge maintenance control and engineering.

---

## Key features

- Create WO manually or from defect
- Assign lead engineer and team
- Task checklist with completion tracking
- Labour notes and time entries (simplified)
- Link to parts requests/issues (V2)
- Status workflow through to sign-off
- WO search and filters
- Print/export WO summary (basic)

---

## Work order statuses

| Status | Meaning |
|--------|---------|
| Open | Created; not yet assigned |
| Assigned | Engineer assigned |
| In Progress | Work underway |
| Awaiting Parts | Blocked on inventory |
| Awaiting Inspection | Work done; inspection pending |
| Ready for Sign-off | Cleared for licensed engineer |
| Closed | Complete and signed off |
| Cancelled | Job cancelled |

---

## Status transitions

```text
Open → Assigned → In Progress
In Progress → Awaiting Parts → In Progress
In Progress → Awaiting Inspection → Ready for Sign-off
Ready for Sign-off → Closed (after sign_off recorded)
Any (pre-closed) → Cancelled (controller only)
```

Closing a WO should require a linked `sign_offs` record when aircraft release is involved.

---

## Important data fields

### `work_orders`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `reference_number` | string | e.g. WO-2024-0089 |
| `aircraft_id` | UUID | Required |
| `defect_id` | UUID | Optional |
| `title` | string | |
| `description` | text | Work scope |
| `priority` | enum | `routine`, `urgent`, `aog` |
| `status` | enum | See above |
| `assigned_to` | UUID | Lead engineer |
| `created_by` | UUID | Usually controller |
| `scheduled_start` | timestamp | |
| `scheduled_end` | timestamp | |
| `actual_start` | timestamp | |
| `actual_end` | timestamp | |
| `estimated_manhours` | decimal | |
| `actual_manhours` | decimal | Sum of tasks |
| `closed_by` | UUID | |
| `closed_at` | timestamp | |
| `account_id` | UUID | |

### `work_order_tasks`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `work_order_id` | UUID | |
| `sequence` | integer | Order in checklist |
| `description` | text | Task text |
| `is_completed` | boolean | |
| `completed_by` | UUID | |
| `completed_at` | timestamp | |
| `labour_notes` | text | |
| `manhours` | decimal | |

---

## Example workflow: defect to closed WO

```text
Controller creates WO from DEF-2024-0142
Status Open → assigns Engineer Jane → Assigned
Jane starts work → In Progress
Jane completes tasks, adds labour notes
Jane marks Ready for Sign-off
Licensed Engineer performs sign_off
Controller/System sets WO → Closed
Defect → Rectified → Closed
Aircraft availability → Available
```

---

## Example workflow: awaiting parts

```text
Engineer needs hydraulic seal kit
Requests part (V2) or notes in WO
Status → Awaiting Parts
Stores issues part → status back to In Progress
Work continues
```

---

## Priority handling

| Priority | UI treatment | Suggested SLA (demo) |
|----------|--------------|----------------------|
| AOG | Red banner | Immediate |
| Urgent | Orange | Same day |
| Routine | Default | Per plan |

---

## MVP notes

- Tasks as simple checklist; no nested work packages.
- Manhours as decimal on tasks; no full timekeeping integration.
- Parts request as text field in MVP; inventory link in V2.
- Engineers update only assigned WOs if row-level scoping enabled.

## Future improvements

- Work order templates by defect type.
- Digital task cards with sign-by-step.
- Sub-contractor WO assignment (external MRO portal V2).
- Cost rollup to account/cost centre.
