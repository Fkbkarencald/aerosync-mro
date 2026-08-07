# Role-specific maintenance handoff dashboards — 2026-08-08

## Outcome

The operations dashboard now includes a role handoff console driven by the persisted workflow state rather than a second status store.

- Pilots see only their submitted defects, translated into awaiting review, under review, accepted for maintenance, deferred, closed, or cancelled handoff language.
- Maintenance controllers see unreviewed defects, unassigned work orders, parts/inspection blockers, and aircraft whose availability needs attention.
- Engineers see only assigned or team work, ordered AOG → Urgent → Routine and then by due time.
- Licensed engineers see a release queue that distinguishes eligible work from work blocked by incomplete tasks, inspections, or status.

Every queue item links to its canonical defect, work-order, sign-off, or aircraft route.

## Scope model

The projection layer rejects inactive users and unsupported roles. Controllers are restricted to their base. Pilots can see aircraft tied to defects they submitted and no maintenance records. Engineers can see assigned/team aircraft and records they performed or certified. Licensed engineers can see aircraft and maintenance records within their base so they can assess release readiness.

This is a seeded prototype scope model, not production authentication or row-level security. The educational-prototype disclaimer remains visible.

## Verification

- `npm run lint`
- `npm run build`
- `npm run test:workflow`
- `npm run test:handoffs`
- 165/165 route/render/dead-link smoke assertions
- Browser acceptance across all four role previews: 8 pilot, 13 controller, 4 engineer, and 8 licensed-engineer seeded handoffs.
- Transition refresh acceptance: starting review of `DEF-2026-0048` reduced the controller handoff total from 13 to 12 and removed that defect from the awaiting-review queue without a duplicate dashboard update.
