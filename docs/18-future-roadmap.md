# Future Roadmap

Planned evolution of AeroSync MRO beyond MVP. Each version builds on the previous without breaking the core loop.

---

## Version 2 — Operations depth

```text
Inventory
Business Accounts
Cost Centres
Supplier Accounts
Billing
Advanced Forecasting
External MRO Portal
Reports
```

### Inventory
- Parts catalog, locations, issue/return/adjust
- Link issues to work orders
- Auto-transition WO from Awaiting Parts

### Business accounts
- Multiple operator/customer accounts
- account_aircraft contracts
- Row-level tenancy enforcement

### Cost centres & billing
- Attribute manhours and parts to cost centres
- Monthly cost rollup per account
- CSV/invoice export

### Supplier accounts
- Supplier master for parts receipts
- Simple PO reference on receipt

### Advanced forecasting
- Planned maintenance due alerts
- "At risk" aircraft scoring
- Capacity view (available tails vs demand)

### External MRO portal
- Customer read-only view of their aircraft status
- Optional WO approval workflow

### Reports
- Open defects by aircraft
- WO turnaround time
- Availability history
- Export PDF/CSV

---

## Version 3 — Aviation depth

```text
MEL/CDL references
ATA chapter analytics
Scheduled maintenance planning
Component tracking
Offline mobile mode
Barcode/QR scanning
Advanced audit exports
Jasper-style reports
```

### MEL/CDL references
- Structured deferral against simplified MEL items
- Expiry and category on deferred defects

### ATA chapter analytics
- Defect and WO charts by ATA chapter
- Reliability dashboard (demo metrics)

### Scheduled maintenance planning
- AMP-style scheduled tasks (simplified)
- Due list from hours/cycles/date

### Component tracking
- Rotables, serial numbers, install/remove history

### Offline mobile
- Pilot defect capture offline, sync on reconnect

### Barcode/QR
- Scan part and location for inventory

### Advanced audit
- WORM export, signed audit packages

### Jasper-style reports
- Template-based printable engineering reports

---

## Version comparison

| Capability | V1 | V2 | V3 |
|------------|----|----|-----|
| Defect → WO → Sign-off | Yes | Yes | Yes |
| Inventory | Stub | Full | + Barcode |
| Multi-account | Stub | Full | Full |
| Billing | No | Basic | Advanced |
| MEL/CDL | Text | Text | Structured |
| Mobile offline | No | No | Yes |
| Component tracking | No | No | Yes |

---

## Technical evolution

| Version | Architecture additions |
|---------|------------------------|
| V2 | Background jobs, report worker, inventory ledger |
| V3 | Mobile app (Capacitor/React Native), sync engine, analytics pipeline |

---

## Risk and dependency notes

| Item | Risk | Mitigation |
|------|------|------------|
| Multi-tenancy | Data leaks | RLS + integration tests |
| Inventory | Stock drift | Transaction ledger as source of truth |
| Offline sync | Conflicts | Last-write-wins + audit |
| MEL library | Legal sensitivity | Clearly labeled reference data only |

---

## MVP notes

- Do not implement V2/V3 tables until V1 loop is stable.
- Design V1 schema with extension points (account_id, nullable FKs).

## Future improvements (beyond V3)

- AI-assisted defect categorization from photos
- Integration marketplace (TRAX-style adapters as fiction for demo)
- Digital twin visualization of fleet status
