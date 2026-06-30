# Accounts

The Accounts module manages business relationships: operators, customers, cost centres, and (in later versions) billing and supplier accounts.

---

## Why this module exists

MRO work is performed **for** someone—a airline operator, lease customer, or internal cost centre. Linking aircraft, work orders, and maintenance records to accounts enables costing, invoicing, and multi-customer SaaS tenancy.

> **Scope note:** Full accounts functionality is **Version 2**. MVP uses a single default account with `account_id` on all rows for future expansion.

---

## Key features

- Operator/customer account registry
- Link users and aircraft to accounts
- Cost centres for departmental charging
- WO and maintenance cost attribution (V2)
- Account-level aircraft fleet view
- Supplier accounts for parts (V2)
- Basic billing export (V2)

---

## Important data fields

### `accounts`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `name` | string | e.g. "SkyBridge Airways" |
| `account_code` | string | Short code |
| `account_type` | enum | `operator`, `customer`, `internal`, `supplier` |
| `contact_email` | string | |
| `contact_phone` | string | |
| `billing_address` | text | |
| `is_active` | boolean | |
| `created_at` | timestamp | |

### `account_users`

| Field | Type | Notes |
|-------|------|-------|
| `account_id` | UUID | |
| `user_id` | UUID | |
| `role_at_account` | string | Optional override |

### `account_aircraft`

| Field | Type | Notes |
|-------|------|-------|
| `account_id` | UUID | |
| `aircraft_id` | UUID | |
| `contract_type` | enum | `owned`, `leased`, `managed` |
| `contract_start` | date | |
| `contract_end` | date | nullable |

### `cost_centres`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `account_id` | UUID | |
| `code` | string | e.g. LINE-MAINT |
| `name` | string | |
| `description` | text | |

---

## Example workflow: assign WO cost (V2)

```text
WO-2024-0089 closed for aircraft G-ABCD
Aircraft linked to account SkyBridge Airways
System attributes manhours and parts cost to cost_centre LINE-MAINT
Accounts Officer reviews monthly rollup
Exports CSV for finance system
```

---

## Multi-tenancy model

```text
accounts (tenant root)
  ├── account_users
  ├── account_aircraft
  ├── cost_centres
  └── all operational rows scoped by account_id
```

Row-level security filters queries by user's `account_id` unless user is platform admin.

---

## Permissions

| Permission | Description |
|------------|-------------|
| `accounts.view` | View account list and detail |
| `accounts.create` | Create accounts |
| `accounts.edit` | Edit accounts |

Accounts Officers typically have these; engineers do not.

---

## MVP notes

- Seed one default account: "Demo Operator".
- All entities include `account_id` FK.
- No billing UI in V1.
- Admin can view account name in settings only.

## Future improvements

- Per-account branding and subdomain.
- Invoice generation from closed WOs.
- Supplier PO and three-way match.
- Customer self-service portal (external MRO portal V2).
