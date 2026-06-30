# Parts and Inventory

Parts and Inventory manages the stores function: catalogued parts, stock locations, requests from work orders, issues, returns, and adjustments.

---

## Why this module exists

Many work orders cannot progress without parts. Stores needs to know what is in stock, what was issued to which aircraft/WO, and what must be reordered. This module supports the **Awaiting Parts** work order state.

> **Scope note:** Full inventory is **Version 2**. MVP may stub parts requests as text on work orders.

---

## Key features

- Parts master catalog
- Stock by location (main store, line cart, quarantine)
- Request parts from work order
- Issue parts to WO/aircraft
- Return unused parts
- Stock adjustments with reason
- Low-stock alerts (simple threshold)
- Transaction history

---

## Important data fields

### `parts`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `part_number` | string | Unique PN |
| `description` | string | |
| `manufacturer` | string | |
| `unit_of_measure` | enum | `each`, `metre`, `litre` |
| `ata_chapter` | string | Optional |
| `minimum_stock_level` | integer | |
| `is_active` | boolean | |
| `account_id` | UUID | |

### `inventory_locations`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `code` | string | e.g. MAIN, LINE-1 |
| `name` | string | |
| `location_type` | enum | `store`, `line`, `quarantine` |

### `inventory_transactions`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `part_id` | UUID | |
| `location_id` | UUID | |
| `transaction_type` | enum | `receipt`, `issue`, `return`, `adjustment` |
| `quantity` | decimal | Negative for issue |
| `work_order_id` | UUID | Nullable |
| `aircraft_id` | UUID | Nullable |
| `performed_by` | UUID | Stores officer |
| `performed_at` | timestamp | |
| `reference` | string | PO number, etc. |
| `notes` | text | |

### Stock view (computed or materialized)

| Field | Type | Notes |
|-------|------|-------|
| `part_id` | UUID | |
| `location_id` | UUID | |
| `quantity_on_hand` | decimal | Sum of transactions |

---

## Example workflow: request and issue

```text
Engineer on WO-2024-0089 requests PN-12345 qty 1
Stores sees request queue
Checks stock at MAIN → available
Issues part → inventory_transaction type issue
WO status Awaiting Parts → In Progress (manual or auto)
Audit log: inventory.issue
```

---

## Example workflow: return to stock

```text
Unused seal kit returned
Stores creates return transaction
quantity_on_hand incremented
Linked to original WO for traceability
```

---

## Transaction types

| Type | Effect on stock |
|------|-----------------|
| receipt | Increase |
| issue | Decrease |
| return | Increase |
| adjustment | +/- per count |

---

## Permissions

| Action | Permission |
|--------|------------|
| View stock | `inventory.view` |
| Request from WO | `inventory.request` |
| Issue | `inventory.issue` |
| Return | `inventory.return` |
| Adjust | `inventory.adjust` |

---

## MVP notes

- **Not in MVP V1.** Document schema now for V2 implementation.
- MVP workaround: `parts_required` text field on work orders.
- Single main store location sufficient for V2 initial release.

## Future improvements

- Barcode/QR scanning (V3).
- Supplier PO integration.
- Batch/lot and shelf-life tracking.
- Core exchange and rotable tracking (V3).
- Reserved stock for planned maintenance.
