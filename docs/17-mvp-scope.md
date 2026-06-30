# MVP Scope

Defines what ships in **Version 1** versus later releases. Goal: prove the core maintenance loop in a portfolio-grade demo.

---

## Version 1 — Core loop (MVP)

```text
Aircraft Registry
Fleet Planning
Defect Reporting
Work Orders
User Accounts
Security Profiles
Sign-off
Audit Logs
```

### V1 user-facing outcomes

1. Register aircraft and see availability board.
2. Manually create flights and assign aircraft.
3. Pilot reports defect with photo.
4. Controller reviews, creates work order.
5. Engineer completes tasks on WO.
6. Licensed engineer signs off.
7. Aircraft returns to Available.
8. Full audit trail visible.

---

## V1 feature checklist

| Module | In V1 | Notes |
|--------|-------|-------|
| Aircraft Registry | Yes | CRUD, status, archive |
| Fleet Planning | Yes | Availability board, manual plans |
| Flight Schedule | Partial | Manual flights only |
| Defect Reporting | Yes | Full status workflow |
| Work Orders | Yes | Tasks, assignment, statuses |
| Parts & Inventory | No | Text field on WO only |
| Accounts | Stub | Single default account |
| User Accounts | Yes | Invite, suspend, role |
| Security Profiles | Yes | Seed profiles + editor |
| Sign-off | Yes | One sign-off per WO |
| Maintenance Records | Yes | Auto on sign-off |
| Audit Logs | Yes | Core actions logged |
| Reports | No | List CSV export optional |

---

## V1 technical scope

| Area | Choice |
|------|--------|
| Frontend | Nuxt 3, TypeScript |
| Auth | Supabase Auth or Clerk |
| Database | PostgreSQL |
| API | Supabase RLS or NestJS REST |
| File upload | Defect/WO photos only |
| Deployment | Single environment demo |

---

## V1 non-goals

- Multi-account billing
- Inventory transactions
- MEL/CDL library
- External integrations
- Offline mode
- Advanced reporting

---

## Suggested build order

```text
Week 1–2:  Auth, users, security profiles, aircraft registry
Week 3:    Fleet availability + manual flights
Week 4:    Defects + review queue
Week 5:    Work orders + tasks
Week 6:    Sign-off + maintenance records + availability automation
Week 7:    Audit logs + dashboard polish
Week 8:    Demo data, bug fixes, deploy
```

---

## Demo data requirements

| Entity | Count |
|--------|-------|
| Aircraft | 8–12 |
| Users | 1 per role |
| Flights | 20 across 7 days |
| Defects | 10 in various statuses |
| Work orders | 6 linked to defects |
| Sign-offs | 3 completed examples |

---

## Definition of done (V1)

- [ ] All V1 modules accessible via nav with permissions enforced
- [ ] Core workflow completable without admin intervention
- [ ] Invalid status transitions rejected
- [ ] Audit log shows full path for sample WO
- [ ] Disclaimer visible in UI
- [ ] README + docs in repo
- [ ] Deployed HTTPS URL for portfolio

---

## MVP notes

- Prefer working end-to-end over feature breadth.
- Defer polish on flight schedule if WO loop is at risk.
- Seed scripts > manual test data entry.

## Future improvements

See [18-future-roadmap.md](./18-future-roadmap.md) for V2 and V3.
