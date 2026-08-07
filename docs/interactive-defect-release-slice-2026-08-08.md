# Interactive defect-to-release slice — 2026-08-08

## Outcome

The highest-priority V1 gap identified by the screen and data-flow audit now has a working browser-persistent path:

`Reported defect → Under Review → Assigned work order → In Progress → Ready for Sign-off → Released`

Release closes the originating defect and work order, creates a sign-off and maintenance record, returns the aircraft to `Serviceable / Available`, and records each mutation in the audit log.

## Role and transition boundaries

- Maintenance Controller or Admin: start defect review and create the linked work order.
- Assigned Engineer: start work and complete work-order tasks.
- Active Licensed Engineer with a licence number: certify release with a non-empty statement.
- Invalid roles, out-of-order transitions, duplicate task completion, and release before task completion are rejected by the workflow engine.

## Persistence and scope

The workflow state is versioned and stored in browser `localStorage` under `aerosync-mro.workflow.v1`. Corrupt or incompatible data safely resets to the seed state. Mutations clone state and persist a complete snapshot, keeping defect, work order, aircraft, sign-off, maintenance-record, timeline, and audit views consistent after reload.

This is deliberately a prototype boundary. There is no server database, authentication session, concurrent-write control, or certified airworthiness authority. The persistent application disclaimer remains visible.

## Verification

- `npm run lint`
- `npm run build`
- `npm run test:workflow`
- 165 route/render/dead-link smoke assertions
- Browser acceptance: complete DEF-2026-0048 through WO-2026-0039, SO-2026-0019, and MR-2026-0119; reload; confirm closed records, aircraft availability, and audit evidence with no browser errors or horizontal overflow.
