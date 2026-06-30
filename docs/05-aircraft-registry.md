# Aircraft Registry

The Aircraft Registry is the master record for every aircraft managed in AeroSync MRO. All other modules reference aircraft by `aircraft_id`.

---

## Why this module exists

Maintenance, planning, and reporting all need a consistent identity for each tail: registration, type, configuration, and current airworthiness summary. The registry prevents duplicate tail numbers and provides the anchor for defects, work orders, and history.

---

## Key features

- Register and edit aircraft
- Aircraft search by registration, type, serial number
- Airworthiness status summary
- Link aircraft to operator account
- Aircraft detail page with timeline (defects, WOs, sign-offs)
- Soft archive retired aircraft
- Basic configuration notes (seats, engines, avionics bundle)

---

## Aircraft statuses

| Status | Meaning |
|--------|---------|
| Serviceable | Fit for operation (subject to availability) |
| Unserviceable | Not fit for operation |
| Under Maintenance | Active maintenance in progress |
| AOG | On ground; urgent |
| Restricted / Deferred Defect | Operates with known limitation |

Registry status is a **summary**. Operational detail lives in `aircraft_availability` and open defects/work orders.

---

## Important data fields

### `aircraft`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `registration` | string | e.g. G-ABCD, N12345 (unique) |
| `serial_number` | string | Manufacturer S/N |
| `aircraft_type` | string | e.g. A320-214, B737-800 |
| `manufacturer` | string | Airbus, Boeing, etc. |
| `year_of_manufacture` | integer | |
| `operator_name` | string | Display; links to account in V2 |
| `account_id` | UUID | Owning operator |
| `status` | enum | See statuses above |
| `total_flight_hours` | decimal | Manual entry in MVP |
| `total_cycles` | integer | Manual entry in MVP |
| `base_location` | string | Home station ICAO |
| `configuration_notes` | text | Cabin layout, STCs |
| `is_archived` | boolean | Soft delete |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### `account_aircraft` (V2)

| Field | Type | Notes |
|-------|------|-------|
| `account_id` | UUID | Customer/operator |
| `aircraft_id` | UUID | |
| `contract_type` | enum | `owned`, `leased`, `managed` |

---

## Example workflow: register new aircraft

```text
Admin opens Aircraft Registry → New Aircraft
Enters registration, type, serial, account
Sets status = Serviceable
Saves → system creates initial aircraft_availability = Available
Audit log: aircraft.create
```

---

## Example workflow: aircraft goes AOG

```text
Pilot reports critical defect on G-ABCD
Controller sets aircraft.status → AOG
Availability → AOG with reason linked to defect
Registry detail shows red AOG badge
On rectification + sign-off → status returns to Serviceable
```

---

## Validation rules

| Rule | Implementation |
|------|----------------|
| Unique registration | DB unique constraint per account |
| Cannot archive with open WO | Block archive if WO status not Closed/Cancelled |
| Status sync | Major status changes should write audit + optional availability update |

---

## Aircraft detail page (concept)

| Section | Content |
|---------|---------|
| Header | Registration, type, status badge |
| Summary | Hours, cycles, base, operator |
| Open items | Open defects, active WOs |
| Timeline | Chronological events |
| Documents | Attachments (V2+) |

---

## MVP notes

- Manual hours/cycles entry; no flight log integration.
- Single operator account acceptable.
- No component tree or assembly tracking.
- Photo upload optional (registration livery image).

## Future improvements

- Import aircraft from CSV.
- Component / engine sub-records (V3).
- AD/SB due tracking placeholders.
- QR code on hangar tag linking to aircraft page.
