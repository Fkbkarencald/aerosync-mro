# Product Vision

AeroSync MRO aims to demonstrate how modern SaaS design can simplify the daily coordination problems found in aviation maintenance — without pretending to replace regulated MRO systems.

---

## Why this product exists

Real MRO platforms solve complex problems: fleet availability, defect lifecycle, parts traceability, sign-off authority, and auditability. Smaller operators, training environments, and portfolio builders need a **credible but buildable** version of those workflows.

AeroSync MRO exists to:

1. **Model realistic maintenance operations** in software a small team can implement.
2. **Show end-to-end traceability** from pilot report to aircraft release.
3. **Separate identity (role) from authorization (security profile)** like enterprise MRO tools do.
4. **Provide a portfolio-grade SaaS** with clear modules, data model, and roadmap.

---

## Product principles

| Principle | Meaning |
|-----------|---------|
| Workflow-first | Every module supports a step in the availability → defect → work → sign-off loop |
| Simplified, not naive | Use aviation terms (AOG, MEL, turnaround) but avoid fake regulatory claims |
| Audit by default | Important actions leave an immutable trail |
| Progressive complexity | MVP proves the core loop; inventory and billing come later |
| Multi-account ready | Design for operator/customer accounts even if MVP is single-tenant |

---

## Target users

- **Internal demo / portfolio:** Show full MRO story in one app.
- **Training:** Teach maintenance control and fleet planning concepts.
- **Startup prototype:** Foundation for a niche regional MRO SaaS.

Not targeted at: Part 145 certified production use without substantial additional validation, legal review, and regulatory integration.

---

## Success criteria

| Metric | Definition |
|--------|------------|
| Core loop complete | Pilot defect → WO → sign-off → aircraft available again |
| Authorization works | Users see only what their profile allows |
| Planner visibility | Dashboard answers availability questions in under 30 seconds |
| Audit completeness | Any defect or WO status change is reconstructable |

---

## Non-goals (MVP)

- DO-178 / EASA Part-M compliance certification
- Full engineering document control (IPC, CMM, SB libraries)
- Real-time ACARS / FDM integration
- Payroll, HR, or full ERP replacement

---

## Inspiration (not imitation)

Inspired by capabilities seen in TRAX, PilotLog, QuickTurn, and Maintenix:

- Fleet and availability boards
- Line defect capture
- Work package / work order tracking
- Parts issue and return
- Release to service sign-off

AeroSync MRO intentionally **reduces** scope to what a developer can ship in weeks, not years.

---

## MVP notes

- Position clearly as a **prototype** in UI footer and README.
- Optimize for one operator with 5–20 aircraft in MVP demos.
- English-only UI; UTC timestamps in database.

## Future improvements

- White-label branding per operator account.
- Configurable regulatory disclaimer text per deployment.
- Industry-specific templates (helicopter, regional jet, cargo).
