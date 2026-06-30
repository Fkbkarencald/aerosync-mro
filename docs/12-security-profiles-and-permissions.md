# Security Profiles and Permissions

This document details the authorization layer: how security profiles bundle permissions and how the system enforces access across modules.

---

## Why this module exists

Job titles alone are too coarse for MRO systems. A line engineer and a hangar supervisor may share the "Engineer" role but need different access. Security profiles provide **configurable, auditable** permission sets without code changes.

---

## Key features

- Create and edit security profiles
- Assign permissions via checklist UI
- Assign multiple profiles to a user (permissions union)
- System profiles that cannot be deleted
- Profile duplication for fast setup
- Permission test/preview ("view as" in future)
- Audit changes to profiles

---

## Concepts

| Concept | Description |
|---------|-------------|
| Role | User's job function; informational + default profile hint |
| Security profile | Named permission bundle |
| Permission | Atomic `resource.action` capability |
| Effective permissions | Union of all user's profile permissions |

**Example:**

```text
Role: Engineer
Security Profile: Line Maintenance Engineer - MEL

Allowed:  work_order.view, work_order.update, defect.create, inventory.request
Denied:   signoff.perform, users.*, accounts.view, security_profiles.*
```

---

## Important data fields

### `security_profiles`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `name` | string | Unique per account |
| `description` | text | |
| `is_system` | boolean | Protect from deletion |
| `account_id` | UUID | |
| `created_at` | timestamp | |

### `permissions`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `code` | string | e.g. `work_order.update` |
| `resource` | string | `work_order` |
| `action` | string | `update` |
| `description` | text | Human-readable |

### `security_profile_permissions`

| Field | Type |
|-------|------|
| `security_profile_id` | UUID |
| `permission_id` | UUID |

### `user_security_profiles`

| Field | Type |
|-------|------|
| `user_id` | UUID |
| `security_profile_id` | UUID |
| `assigned_at` | timestamp |
| `assigned_by` | UUID |

---

## Default system profiles (seed data)

| Profile | Permissions summary |
|---------|---------------------|
| System Administrator | All |
| Fleet Planner - Standard | aircraft.view, fleet_plan.*, defect.view, flights view |
| Maintenance Controller | defect.*, work_order.*, aircraft.view, signoff.view |
| Line Engineer - MEL | work_order.view/update, defect.create/view, inventory.request |
| Licensed Engineer - Release | Engineer set + signoff.perform |
| Pilot - Line Report | defect.create/view, aircraft.view |
| Stores Officer | inventory.* |
| Accounts Officer | accounts.*, reports.view |
| Auditor - Read Only | *.view, audit_logs.view |

---

## Enforcement architecture

```text
HTTP Request
    ↓
Auth middleware (session/JWT)
    ↓
Load user + profiles + permissions (cached)
    ↓
Route guard: required permission(s)
    ↓
Optional row-level filter (account_id, assigned_to)
    ↓
Handler executes
    ↓
Audit log if sensitive mutation
```

### API example

```text
PATCH /work-orders/:id
Required: work_order.update
Optional row check: assigned_to = current_user OR work_order.assign permission
```

### UI example

```text
Button "Sign Off" visible only if signoff.perform in effective permissions
```

---

## Example workflow: create custom profile

```text
Admin opens Security Profiles → New
Name: "Hangar Engineer - No Finance"
Copies from "Line Engineer - MEL"
Removes inventory.issue, adds work_order.assign
Saves profile
Assigns to user bob@example.com
Bob's next login reflects new capabilities
Audit: security_profiles.edit
```

---

## MVP notes

- Flat permission list; no permission groups/hierarchy in V1.
- Cache permissions in JWT claims or session with short TTL.
- Deny by default; explicit grant only.
- Profile changes take effect on next request (or force session refresh).

## Future improvements

- Permission dependencies (e.g. update requires view).
- Temporary profile elevation with expiry.
- Field-level redaction (hide cost fields).
- SOC2-style access review reports.
