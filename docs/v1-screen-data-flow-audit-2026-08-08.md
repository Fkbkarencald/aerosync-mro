# AeroSync MRO V1 screen and data-flow audit

**Date:** 8 August 2026  
**Branch:** `codex/audit-v1-screens-data`  
**Baseline:** `280d63a`  
**Scope:** Compare the implemented React/Vite design preview with the V1 requirements in `docs/00-overview.md` through `docs/20-sample-user-stories.md`.

## Result

The repository is a strong, internally consistent **design preview**, not an operational V1 application.

- Screen coverage is complete: the 44 route patterns described by the UI inventory have deliberate pages, and the route smoke test renders 165 concrete routes without a render failure or dead internal link.
- The frozen mock dataset tells a coherent end-to-end maintenance story. `DEF-2026-0042` links to `WO-2026-0031`, `SO-2026-0018`, maintenance record `MR-2026-0118`, aircraft `VH-OYU`, flight context, and the corresponding audit events.
- The operational V1 loop is **not completable by a user**. Forms, review actions, work-order task controls, sign-off, profile editing, authentication, uploads, and settings are explicitly preview-only and do not mutate or persist state.
- Role and permission concepts are represented in data and UI, but they are not enforced. All navigation is deliberately exposed and direct routes have no authorization guard.
- There is no backend, persistence, real authentication, file upload, API transition validation, or deployed HTTPS portfolio environment.

This means the screen-design milestone is proven, while the V1 definition of done remains incomplete.

## Evidence collected

### Automated verification

| Check | Result |
| --- | --- |
| Clean dependency install | Passed (`npm ci`) |
| Lint | Passed (`npm run lint`) |
| TypeScript and production build | Passed (`npm run build`) |
| Route render and dead-link smoke test | Passed: 165/165 concrete routes rendered; no dead links or banned placeholder wording |
| Production bundle | Built successfully; main JavaScript chunk is 598.41 kB (150.32 kB gzip) and triggers Vite's 500 kB chunk warning |
| Dependency audit | 3 high advisories: PostCSS path disclosure and React Router RSC-mode CSRF advisories; the app is a client-side SPA and does not use React Router RSC actions, but dependency remediation is still required before release |

### Rendered verification

- Desktop dashboard loaded without browser errors or warnings and exposed the documented operational modules, current fleet position, review queue, work orders, assignments, maintenance records, and audit activity.
- The closed sample loop rendered at each stage with cross-links and no alert state:
  - `/defects/DEF-2026-0042`
  - `/work-orders/WO-2026-0031`
  - `/work-orders/WO-2026-0031/sign-off`
  - `/records`
  - `/admin/audit-logs`
- The three MVP mobile-priority surfaces rendered at 390 × 844 with an exact 390 px document width, no horizontal overflow, and the prototype disclaimer present:
  - `/defects/new`
  - `/work-orders/mine`
  - `/aircraft`

## V1 outcome audit

| V1 user-facing outcome | Implemented evidence | Verdict |
| --- | --- | --- |
| Register aircraft and see availability | Registry list/detail/form and availability board are present and linked | **Visual only** — save does not create or update an aircraft |
| Manually create flights and assign aircraft | Flight list/detail/create screens and assignment fields are present | **Visual only** — no validation, persistence, or availability update |
| Pilot reports defect with photo | Mobile-priority report form includes aircraft, flight, severity, description, source, and attachment UI | **Visual only** — submit is prevented and files are not uploaded |
| Controller reviews and creates work order | Review queue, contextual actions, defect detail, and work-order form are present | **Visual only** — actions do not change state and the create-WO link does not perform an atomic defect-to-WO transition |
| Engineer completes work-order tasks | Work-order detail shows checklist, labour, notes, parts, inspection, and timeline | **Visual only** — task/labour/status changes are not saved |
| Licensed engineer signs off | Sign-off document, readiness warning, checklist, statement, licence, and signature presentation are present | **Visual only** — certification does not create a sign-off or maintenance record |
| Aircraft returns to Available | The frozen closed-loop timeline records the automatic release, followed by a later valid flight assignment | **Pre-baked evidence only** — no service-layer automation exists |
| Full audit trail visible | Searchable audit screen and linked defect/WO/sign-off/close events exist for the sample loop | **Preview-complete** — events are static and new actions are not logged |

## V1 definition-of-done audit

| Requirement from `docs/17-mvp-scope.md` | Evidence | Status |
| --- | --- | --- |
| All V1 modules accessible through navigation | All documented screen groups are reachable; smoke coverage is complete | **Met for preview** |
| Permissions enforced | `Role`, security-profile, and permission-matrix models exist; `navigation.ts` explicitly disables filtering and routes have no guards | **Not met** |
| Core workflow completable without admin intervention | A coherent completed sample exists, but user actions do not mutate state | **Not met** |
| Invalid status transitions rejected | Status unions match `docs/15`; there is no transition engine, API, or 422 rejection path | **Not met** |
| Audit log shows full path for sample WO | `WO-2026-0031` has defect-create, WO-create, sign-off, close, record, and aircraft-release evidence | **Met for frozen sample** |
| Disclaimer visible | Persistent footer and sign-off notices were rendered on desktop and mobile | **Met** |
| README and docs in repository | README plus the complete `docs/00`–`docs/20` set are present | **Met** |
| Deployed HTTPS portfolio URL | No hosting configuration or verified deployment URL exists | **Not met** |

## Documentation and implementation mismatches

1. `docs/16-main-screens.md` describes permission-filtered navigation, while `src/app/navigation.ts` intentionally exposes every module.
2. `docs/17-mvp-scope.md` describes working CRUD, authentication, status automation, uploads, and audit logging; the README correctly states that the current build has no backend, network calls, or persistence.
3. The dashboard is populated for the single preview identity, Daniel Reyes. It contains a broad operational mix, but it does not switch between the planner, controller, engineer, and admin dashboard contracts in US-080.
4. V2 inventory, accounts, and reports screens are already visually implemented even though they are V1 non-goals. They should not displace the missing operational core loop.
5. The global maintenance-record list uses `/records`, while the aircraft-specific route `/aircraft/:id/records` also exists. Both are deliberate, but the global route should be added to the screen inventory when the docs are revised.
6. The V1 technical-scope table still names Nuxt 3 and a PostgreSQL-backed API. The current preview intentionally uses React 19 and Vite; the implementation architecture for the operational build needs an explicit decision rather than an accidental divergence.

## Recommended implementation order

1. **Implement the real defect-to-release slice.** Add a persistent domain/service boundary that creates a defect, reviews it, creates and assigns a work order, completes tasks, validates transitions, signs off, creates the maintenance record, updates aircraft availability, and appends audit events atomically.
2. **Enforce identity and permissions.** Add real authentication, route/action guards, permission-filtered navigation, forbidden states, and API-side authorization. UI hiding alone is insufficient.
3. **Add role-specific dashboards.** Derive the planner, controller, engineer, licensed-engineer, and admin widgets from the same authoritative store.
4. **Add uploads and durable demo data.** Implement defect/WO photo storage, seed/reset tooling, and a deterministic portfolio demo account.
5. **Close the release gate.** Add focused unit/integration/E2E coverage, remediate the dependency advisories and bundle warning, deploy to HTTPS, and verify the complete flow in the deployed environment.

Inventory, accounts, advanced reports, and other V2 surfaces should remain preview-only until steps 1–3 are complete.

## Audit conclusion

The implemented UI can support V1 without a screen redesign, and its mock entities already prove that the intended references can remain coherent. The next meaningful increment is not another screen: it is the persistent, permission-aware defect-to-release state machine behind the existing screens.
