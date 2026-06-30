# Sample User Stories

Backlog-ready user stories for AeroSync MRO development. Format: **As a [role], I want [goal], so that [benefit].**

Acceptance criteria included for MVP stories.

---

## Epic: Authentication & users

### US-001 — Login
**As a** user, **I want** to log in with email and password, **so that** I can access the system securely.

**Acceptance criteria:**
- Valid credentials redirect to dashboard
- Invalid credentials show error without revealing which field failed
- Failed login attempts logged to audit_logs
- Session expires after configurable idle period

### US-002 — Invite user
**As an** admin, **I want** to invite a new user with role and security profile, **so that** they can access only what their job requires.

**Acceptance criteria:**
- Invite email sent with one-time link
- User must set password on first login
- Role and profile applied on activation
- Audit log records user.create

---

## Epic: Aircraft registry

### US-010 — Register aircraft
**As an** admin, **I want** to register a new aircraft with registration and type, **so that** it appears in fleet planning.

**Acceptance criteria:**
- Registration unique per account
- Initial status Serviceable, availability Available
- Aircraft appears in registry list immediately

### US-011 — View aircraft timeline
**As a** maintenance controller, **I want** to see all defects, WOs, and sign-offs on an aircraft page, **so that** I understand its maintenance history.

**Acceptance criteria:**
- Timeline sorted newest first
- Each entry links to detail record
- Open items highlighted at top

---

## Epic: Fleet planning

### US-020 — Availability board
**As a** fleet planner, **I want** a board showing all aircraft and availability status, **so that** I know which tails can fly.

**Acceptance criteria:**
- Filter by status, type, base
- Color-coded status badges
- Shows reason text for non-available aircraft
- Updates when WO/defect changes status

### US-021 — Assign aircraft to flight
**As a** fleet planner, **I want** to assign an available aircraft to a flight, **so that** the schedule is covered.

**Acceptance criteria:**
- Cannot assign AOG or Under Maintenance aircraft
- Assignment changes availability to Assigned
- Audit log records assignment

### US-022 — Planned maintenance entry
**As a** fleet planner, **I want** to schedule a future maintenance block, **so that** availability reflects upcoming checks.

**Acceptance criteria:**
- Due date and estimated duration captured
- Shows on planner view within date range
- Status Planned Maintenance when within threshold (configurable days)

---

## Epic: Defect reporting

### US-030 — Pilot report defect
**As a** pilot, **I want** to report a defect with description and photo, **so that** maintenance is aware before the next flight.

**Acceptance criteria:**
- Must select aircraft
- Optional flight link
- Severity required
- Status set to Reported
- Reference number generated (DEF-YYYY-NNNN)

### US-031 — Review defect queue
**As a** maintenance controller, **I want** a queue of new defects, **so that** I can triage them promptly.

**Acceptance criteria:**
- Default filter: Reported and Under Review
- Sort by severity then date
- One-click open detail

### US-032 — Defer defect
**As a** maintenance controller, **I want** to defer a defect with a reason, **so that** the aircraft can operate with a documented limitation.

**Acceptance criteria:**
- Requires defer reason text
- Status → Deferred
- Aircraft status → Restricted / Deferred Defect
- Permission defect.defer required

### US-033 — Create WO from defect
**As a** maintenance controller, **I want** to create a work order from a defect, **so that** rectification work is tracked.

**Acceptance criteria:**
- WO pre-filled with defect context
- Defect status → Work Order Created
- WO linked on both records

---

## Epic: Work orders

### US-040 — Assign engineer
**As a** maintenance controller, **I want** to assign a work order to an engineer, **so that** responsibility is clear.

**Acceptance criteria:**
- Only users with Engineer role selectable
- Status Open → Assigned
- Assignee sees WO in "My assignments"

### US-041 — Complete tasks
**As an** engineer, **I want** to mark tasks complete and add labour notes, **so that** progress is documented.

**Acceptance criteria:**
- Task checkbox toggles is_completed
- labour_notes and manhours saved per task
- WO can move to Ready for Sign-off when all tasks done

### US-042 — WO status workflow
**As an** engineer, **I want** to update WO status through defined steps, **so that** the team knows current state.

**Acceptance criteria:**
- Invalid transitions rejected with clear message
- Each change audit logged
- Awaiting Parts available (manual in MVP)

---

## Epic: Sign-off

### US-050 — Sign off release
**As a** licensed engineer, **I want** to sign off a completed work order, **so that** the aircraft can return to service.

**Acceptance criteria:**
- Requires signoff.perform permission
- License number captured
- WO → Closed, defect → Closed
- maintenance_record created
- availability → Available

### US-051 — View sign-off history
**As an** auditor, **I want** to view all sign-offs with filters, **so that** I can verify releases.

**Acceptance criteria:**
- Filter by aircraft, date, signed_by
- Read-only; no edit/delete

---

## Epic: Security

### US-060 — Manage security profile
**As an** admin, **I want** to edit which permissions a profile grants, **so that** access matches operational needs.

**Acceptance criteria:**
- Permission checklist grouped by resource
- Cannot remove all admins from system profile
- Changes audit logged

### US-061 — Enforce permission denial
**As a** system, **I want** to block unauthorized API calls, **so that** users cannot bypass UI restrictions.

**Acceptance criteria:**
- 403 on missing permission
- UI hides actions user cannot perform
- Direct URL to forbidden page shows access denied

---

## Epic: Audit

### US-070 — View audit trail
**As an** auditor, **I want** to search audit logs by entity reference, **so that** I can reconstruct events.

**Acceptance criteria:**
- Search by WO/DEF/SO reference
- Detail shows old/new JSON diff
- Export not required in MVP

---

## Epic: Dashboard

### US-080 — Role-based dashboard
**As a** user, **I want** a dashboard relevant to my role, **so that** I see priority work immediately.

**Acceptance criteria:**
- Planner: availability summary
- Controller: defect queue count
- Engineer: assigned WO count
- Admin: recent audit entries

---

## Version 2 stories (backlog)

| ID | Story |
|----|-------|
| US-100 | As stores officer, issue parts to WO |
| US-101 | As accounts officer, view cost by cost centre |
| US-102 | As planner, import flights from CSV |
| US-103 | As customer, view my aircraft status in portal |
| US-104 | As manager, export open defects report |

---

## Version 3 stories (backlog)

| ID | Story |
|----|-------|
| US-200 | As controller, defer defect against MEL item |
| US-201 | As pilot, report defect offline and sync |
| US-202 | As stores officer, scan part barcode to issue |
| US-203 | As planner, view ATA chapter defect trends |

---

## MVP notes

- Implement US-001 through US-051 for demo-complete V1.
- US-060/061 are non-negotiable for SaaS credibility.
- Estimate: 2–4 points per story for solo developer.

## Future improvements

- Link stories to GitHub Issues with labels per module
- Add Gherkin scenarios for E2E tests (Playwright)
