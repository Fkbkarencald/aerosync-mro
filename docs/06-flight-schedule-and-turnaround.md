# Flight Schedule and Turnaround

This module provides operational context: which flights an aircraft operates, when turnarounds occur, and whether maintenance risk affects dispatch.

---

## Why this module exists

Defects are reported in flight context. Planners assign aircraft to flights. Turnaround windows define when line maintenance can occur. Linking maintenance data to flights makes risk visible before dispatch.

---

## Key features

- Create and view flights (manual entry in MVP)
- Assign aircraft to flights (via Fleet Planning)
- Turnaround time tracking (scheduled vs actual)
- Maintenance risk status per flight/aircraft pairing
- Flight list filtered by date, route, aircraft
- Link defects to flight leg

---

## Flight maintenance risk statuses

| Status | Meaning |
|--------|---------|
| Clear | No known maintenance concerns |
| Monitor | Minor open items; ops aware |
| At Risk | Significant defect or overdue item |
| No Go | Do not dispatch until cleared |

Risk is **informational** in this prototype — not an certified dispatch system.

---

## Important data fields

### `flights`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `flight_number` | string | e.g. ABC123 |
| `departure_airport` | string | ICAO/IATA |
| `arrival_airport` | string | |
| `scheduled_departure` | timestamp | |
| `scheduled_arrival` | timestamp | |
| `actual_departure` | timestamp | nullable |
| `actual_arrival` | timestamp | nullable |
| `aircraft_id` | UUID | nullable until assigned |
| `maintenance_risk_status` | enum | Clear, Monitor, At Risk, No Go |
| `account_id` | UUID | |
| `status` | enum | `scheduled`, `active`, `completed`, `cancelled` |

### Turnaround (embedded or separate table)

| Field | Type | Notes |
|-------|------|-------|
| `flight_id` | UUID | Inbound flight |
| `next_flight_id` | UUID | Outbound flight |
| `scheduled_turnaround_minutes` | integer | |
| `actual_turnaround_minutes` | integer | nullable |
| `maintenance_window_start` | timestamp | |
| `maintenance_window_end` | timestamp | |

---

## Example workflow: plan turnaround maintenance

```text
Flight ABC123 arrives LGW 14:30
Next departure ABC124 scheduled 16:00 (90 min turnaround)
Planner sees G-ABCD assigned with status Monitor (deferred cosmetic defect)
Engineer performs brief inspection during window
Pilot accepts aircraft for ABC124
Flight maintenance_risk_status remains Monitor
```

---

## Example workflow: defect during turnaround

```text
Pilot reports hydraulic leak during preflight for ABC124
Defect linked to flight ABC124
Risk status → No Go
Fleet Planning removes G-ABCD from outbound assignment
Maintenance Controller creates WO
```

---

## Risk calculation (simplified rules)

| Condition | Risk status |
|-----------|-------------|
| No open defects | Clear |
| Open deferred defect, category minor | Monitor |
| Open defect under review or WO in progress | At Risk |
| AOG or critical open defect | No Go |

Rules run on defect/WO/availability change events.

---

## MVP notes

- Manual flight CRUD only; no import from ops system.
- Turnaround as fields on flight or simple join table.
- Risk status can be manual override by Maintenance Controller.
- No crew pairing or weight/balance.

## Future improvements

- CSV/API import from scheduling system.
- Auto-calculate turnaround from actual times.
- Mobile view for line crew at gate.
- Push notification when risk → No Go.
