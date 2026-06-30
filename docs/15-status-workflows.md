# Status Workflows

Central reference for all status enums and allowed transitions across AeroSync MRO.

---

## Why this document exists

Status drives UI badges, filters, automation (availability updates), and audit logs. Developers need one authoritative map to implement consistent state machines.

---

## Fleet planning / availability statuses

| Status | Description |
|--------|-------------|
| Available | Ready for flight assignment |
| Assigned | Linked to flight/plan |
| Restricted | Limited operation |
| Under Maintenance | Active maintenance |
| AOG | Aircraft on ground |
| Planned Maintenance | Future check scheduled |
| Awaiting Parts | WO blocked |
| Awaiting Sign-off | Work done; release pending |

### Typical transitions

```text
Available → Assigned (flight assignment)
Available → Under Maintenance (WO opened)
Available → AOG (critical defect)
Under Maintenance → Awaiting Parts → Under Maintenance
Under Maintenance → Awaiting Sign-off → Available
Restricted → Available (deferral cleared)
AOG → Under Maintenance → Awaiting Sign-off → Available
Planned Maintenance → Under Maintenance (check starts)
```

---

## Aircraft registry statuses

| Status | Description |
|--------|-------------|
| Serviceable | Fit for operation |
| Unserviceable | Not fit |
| Under Maintenance | Work in progress |
| AOG | Grounded |
| Restricted / Deferred Defect | Known limitation |

Registry status should align with availability but may lag briefly during updates.

---

## Defect statuses

| Status | Description |
|--------|-------------|
| Reported | New |
| Under Review | Triage |
| Deferred | Accepted limitation |
| Work Order Created | WO linked |
| Rectified | Fix done |
| Closed | Complete |
| Cancelled | Void |

```text
Reported → Under Review
Under Review → Deferred | Work Order Created | Cancelled
Deferred → Work Order Created | Closed
Work Order Created → Rectified → Closed
```

---

## Work order statuses

| Status | Description |
|--------|-------------|
| Open | Created |
| Assigned | Engineer set |
| In Progress | Active work |
| Awaiting Parts | Blocked |
| Awaiting Inspection | Inspection needed |
| Ready for Sign-off | Awaiting licensed engineer |
| Closed | Done |
| Cancelled | Void |

```text
Open → Assigned → In Progress
In Progress ↔ Awaiting Parts
In Progress → Awaiting Inspection → Ready for Sign-off → Closed
* → Cancelled (authorized roles only)
```

---

## Flight maintenance risk statuses

| Status | Description |
|--------|-------------|
| Clear | No concerns |
| Monitor | Minor items |
| At Risk | Significant concern |
| No Go | Do not dispatch |

Auto-calculated from defects/WO/aircraft status; manual override by Maintenance Controller.

---

## Fleet plan statuses

| Status | Description |
|--------|-------------|
| draft | Editable |
| published | Active plan |
| archived | Historical |

---

## User statuses

| Status | Description |
|--------|-------------|
| active | Normal access |
| suspended | Login blocked |
| invited | Pending first login |

---

## Cross-module automation rules

| Trigger | Automatic update |
|---------|------------------|
| Defect severity critical | aircraft → AOG, availability → AOG |
| WO created from defect | defect → Work Order Created, availability → Under Maintenance |
| WO → Awaiting Parts | availability → Awaiting Parts |
| WO → Ready for Sign-off | availability → Awaiting Sign-off |
| sign_off recorded | WO → Closed, defect → Closed, aircraft → Serviceable, availability → Available |
| Defect deferred | aircraft → Restricted, risk → Monitor |

Implement in service layer, not DB triggers only (for testability).

---

## Status badge colors (UI convention)

| Severity/Status | Color |
|-----------------|-------|
| Available / Clear / Closed | Green |
| Monitor / Restricted / Assigned | Amber |
| At Risk / Awaiting * | Orange |
| AOG / No Go / Critical | Red |
| Cancelled / Archived | Gray |

---

## MVP notes

- Enforce transitions in API; reject invalid jumps with 422.
- Log every status change to audit_logs.
- No parallel status fields on same entity without documented owner (availability vs aircraft.status).

## Future improvements

- Configurable transition rules per account.
- SLA timers based on status entry time.
- Webhook on AOG transition.
