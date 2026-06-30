# User Roles and Security

AeroSync MRO uses a **two-layer security model**:

1. **Role** — describes what the user *is* (job function).
2. **Security profile** — describes what the user *may do* (permissions).

A user has one primary role and one or more security profiles. Effective permissions are the union of all assigned profile permissions.

---

## Roles

| Role | Description |
|------|-------------|
| Admin | Full system administration |
| Fleet Planner | Fleet availability and schedule assignment |
| Maintenance Controller | Defect review and work order management |
| Engineer | Line and hangar maintenance execution |
| Licensed Engineer | Authorized to sign off aircraft release |
| Pilot | Defect reporting and flight context |
| Stores Officer | Parts inventory operations (V2) |
| Accounts Officer | Customer accounts and costing (V2) |
| Auditor | Read-only access to operational and audit data |

Roles appear in UI for context (e.g. "Assigned engineer") and may drive default profile suggestions at user creation. **Authorization is always enforced via permissions**, not role name alone.

---

## Security profiles

A security profile is a named bundle of permissions assigned to users.

**Example:**

```text
Role: Engineer
Security Profile: Line Maintenance Engineer - MEL
```

This profile may allow:

```text
View aircraft at MEL
Update assigned work orders
Add labour notes
Attach photos
Request parts
```

This profile may prevent:

```text
Signing off aircraft release
Managing users
Deleting records
Viewing finance/account data
Changing security profiles
```

---

## Permission catalog

Permissions use a `resource.action` naming convention.

| Permission | Description |
|------------|-------------|
| `aircraft.view` | View aircraft registry |
| `aircraft.create` | Register new aircraft |
| `aircraft.edit` | Edit aircraft details |
| `aircraft.archive` | Soft-delete / retire aircraft |
| `fleet_plan.view` | View fleet plans |
| `fleet_plan.create` | Create fleet plans |
| `fleet_plan.edit` | Edit fleet plans |
| `fleet_plan.approve` | Approve fleet plan |
| `defect.create` | Report defects |
| `defect.view` | View defects |
| `defect.review` | Triage and review defects |
| `defect.defer` | Defer defects (MEL-style) |
| `defect.close` | Close defects |
| `work_order.create` | Create work orders |
| `work_order.view` | View work orders |
| `work_order.assign` | Assign engineers |
| `work_order.update` | Update tasks and progress |
| `work_order.close` | Close work orders |
| `inventory.view` | View stock (V2) |
| `inventory.request` | Request parts (V2) |
| `inventory.issue` | Issue parts (V2) |
| `inventory.return` | Return parts (V2) |
| `inventory.adjust` | Stock adjustments (V2) |
| `signoff.perform` | Perform release sign-off |
| `signoff.view` | View sign-off records |
| `accounts.view` | View accounts (V2) |
| `accounts.create` | Create accounts (V2) |
| `accounts.edit` | Edit accounts (V2) |
| `users.view` | View users |
| `users.create` | Create users |
| `users.edit` | Edit users |
| `users.suspend` | Suspend users |
| `security_profiles.view` | View profiles |
| `security_profiles.create` | Create profiles |
| `security_profiles.edit` | Edit profiles |
| `audit_logs.view` | View audit trail |
| `reports.view` | View reports (V2) |
| `reports.export` | Export reports (V2) |

---

## Example profile templates

| Profile name | Typical role | Key permissions |
|--------------|--------------|-----------------|
| System Administrator | Admin | All permissions |
| Fleet Planner - Standard | Fleet Planner | `aircraft.view`, `fleet_plan.*`, `defect.view` |
| Maintenance Controller | Maintenance Controller | `defect.*`, `work_order.*`, `aircraft.view` |
| Line Engineer - MEL | Engineer | `work_order.view`, `work_order.update`, `defect.create`, `inventory.request` |
| Licensed Engineer - Release | Licensed Engineer | Above + `signoff.perform` |
| Pilot - Line Report | Pilot | `defect.create`, `defect.view`, `aircraft.view` |
| Auditor - Read Only | Auditor | `*.view`, `audit_logs.view`, `reports.view` |

---

## Authorization flow

```text
User signs in
    ↓
Load user record + role + security_profiles
    ↓
Resolve permissions (union of profile permissions)
    ↓
API middleware checks required permission for route
    ↓
UI hides/disables actions user cannot perform
    ↓
Denied action → 403 + audit log entry (optional)
```

---

## Important data fields

### `users`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `email` | string | Login identifier |
| `full_name` | string | Display name |
| `role` | enum | Primary role |
| `status` | enum | `active`, `suspended`, `invited` |
| `account_id` | UUID | Operator scope |
| `last_login_at` | timestamp | |

### `security_profiles`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `name` | string | e.g. "Line Maintenance Engineer - MEL" |
| `description` | text | |
| `is_system` | boolean | Prevent deletion if true |

### `user_security_profiles`

| Field | Type |
|-------|------|
| `user_id` | UUID |
| `security_profile_id` | UUID |

---

## Example workflow: onboarding a new engineer

```text
Admin creates user jane@example.com, role = Engineer
Admin assigns profile "Line Maintenance Engineer - MEL"
Jane receives invite email
Jane logs in → sees assigned WOs only (row-level filter in V2; MVP: all WOs with update on assigned)
Jane cannot access Security Profiles or Accounts menus
```

---

## MVP notes

- Seed 5–8 default security profiles matching table above.
- Enforce permissions on API; UI hiding is secondary.
- Row-level scoping (e.g. engineer sees only assigned WOs): optional in MVP, recommended in V2.
- Single `account_id` per deployment acceptable for MVP.

## Future improvements

- Time-bound profile assignment (temporary elevation).
- Approval workflow for sensitive permissions.
- SSO (SAML/OIDC) via Clerk or Keycloak.
- IP allow lists for admin routes.
