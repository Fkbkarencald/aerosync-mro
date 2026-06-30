# Fleet Planning

Fleet Planning is the operational heart of AeroSync MRO. It answers which aircraft can fly, which are stuck on the ground, and what risks exist for upcoming schedules.

---

## Why this module exists

Maintenance and operations teams constantly ask:

```text
Which aircraft are available?
Which aircraft are under maintenance?
Which aircraft are due for checks?
Which aircraft can be assigned to upcoming flights?
Which aircraft are at risk of becoming unavailable?
```

Without a single availability view, planners rely on spreadsheets and phone calls. Fleet Planning consolidates registry data, maintenance status, defects, and work orders into actionable availability.

---

## Key features

- Fleet availability dashboard (all tails at a glance)
- Fleet plan creation for date ranges (weekly / monthly)
- Assign aircraft to flights within a plan
- Planned maintenance blocks on the timeline
- Risk indicators linked to open defects and overdue checks
- Bulk status overview with filters
- History of availability changes

---

## Fleet planning statuses

| Status | Meaning |
|--------|---------|
| Available | Ready for assignment / release |
| Assigned | Allocated to a flight or plan item |
| Restricted | Flyable with limitations (e.g. deferred defect) |
| Under Maintenance | Active maintenance; not for assignment |
| AOG | Aircraft on ground; urgent unavailability |
| Planned Maintenance | Scheduled check not yet started |
| Awaiting Parts | Work blocked on parts |
| Awaiting Sign-off | Work complete; release pending |

Statuses on `aircraft_availability` may differ from `aircraft.status` — availability is **operational**, aircraft status is **airworthiness summary**.

---

## Important data fields

### `fleet_plans`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `name` | string | e.g. "Week 26 Fleet Plan" |
| `start_date` | date | |
| `end_date` | date | |
| `status` | enum | `draft`, `published`, `archived` |
| `created_by` | UUID | |
| `approved_by` | UUID | nullable |
| `approved_at` | timestamp | nullable |

### `fleet_plan_items`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `fleet_plan_id` | UUID | |
| `aircraft_id` | UUID | |
| `flight_id` | UUID | nullable |
| `planned_date` | date | |
| `notes` | text | |

### `aircraft_availability`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `aircraft_id` | UUID | |
| `status` | enum | See statuses above |
| `effective_from` | timestamp | |
| `effective_to` | timestamp | nullable = open-ended |
| `reason` | text | e.g. "WO-2024-0089 open" |
| `source_type` | enum | `defect`, `work_order`, `manual`, `planned_maintenance` |
| `source_id` | UUID | nullable |

### `aircraft_assignments`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `aircraft_id` | UUID | |
| `flight_id` | UUID | |
| `assigned_at` | timestamp | |
| `assigned_by` | UUID | |

### `planned_maintenance`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `aircraft_id` | UUID | |
| `maintenance_type` | string | e.g. "A-Check" |
| `due_date` | date | |
| `estimated_duration_hours` | decimal | |
| `status` | enum | `scheduled`, `in_progress`, `completed`, `cancelled` |

---

## Example workflow: assign aircraft to flight

```text
Planner opens Fleet Availability board
    ↓
Filters: status = Available, type = B737
    ↓
Selects G-ABCD for flight ABC123 on 2024-06-15
    ↓
System checks: no AOG, no blocking open WO
    ↓
Creates aircraft_assignment + updates availability → Assigned
    ↓
Audit log: fleet_plan.assign_aircraft
```

---

## Example workflow: defect impacts availability

```text
Defect DEF-2024-0142 created (category: significant)
    ↓
Maintenance Controller reviews → creates WO
    ↓
System auto-updates aircraft_availability → Under Maintenance
    ↓
Fleet plan shows G-ABCD unavailable for new assignments
    ↓
On WO close + sign-off → availability → Available
```

---

## Dashboard questions (UI)

| Question | Data source |
|----------|-------------|
| Available count | `aircraft_availability` where status = Available |
| AOG list | status = AOG |
| Due for check | `planned_maintenance` due within 7 days |
| At risk | open defects + flight within 24h |
| Awaiting parts | availability status filter |

---

## MVP notes

- Manual fleet plan creation; no optimization solver.
- Auto-update availability when WO opened/closed (simple rules).
- Planned maintenance as manual entries only.
- No Gantt chart required; table + calendar view sufficient.

## Future improvements

- Constraint-based auto-assignment suggestions.
- Integration with external ops schedule (CSV import).
- Predictive "at risk" scoring from defect age and MEL category.
- What-if planning (duplicate plan scenarios).
