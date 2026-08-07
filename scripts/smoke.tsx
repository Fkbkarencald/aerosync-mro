/**
 * Route smoke test for the AeroSync MRO design preview.
 *
 * Server-renders EVERY route (static routes plus one concrete page per
 * entity id in the mock dataset), then:
 *   1. fails if any route throws or renders suspiciously little HTML
 *   2. extracts every internal <a href> and fails on links that do not
 *      resolve to a rendered route (dead-end detection)
 *   3. fails if banned placeholder wording appears in rendered output
 *
 * Build & run (no extra dependencies — uses the app's own toolchain):
 *   npx vite build --ssr scripts/smoke.tsx --outDir dist-smoke --emptyOutDir
 *   node dist-smoke/smoke.js
 */
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../src/app/AppRoutes'
import { WorkflowProvider } from '../src/workflow/WorkflowContext'
import { paths } from '../src/app/paths'
import {
  accounts,
  aircraft,
  defects,
  fleetPlans,
  flights,
  securityProfiles,
  users,
  workOrders,
} from '../src/data'

const routes: string[] = [
  paths.login,
  paths.forgotPassword,
  paths.invite('PRV-88XK21'),
  paths.dashboard,
  paths.fleetAvailability,
  paths.fleetPlans,
  paths.fleetPlanNew,
  ...fleetPlans.map((p) => paths.fleetPlan(p.id)),
  ...fleetPlans.map((p) => paths.fleetPlanEdit(p.id)),
  paths.plannedMaintenance,
  paths.aircraftList,
  paths.aircraftNew,
  ...aircraft.map((a) => paths.aircraftDetail(a.id)),
  ...aircraft.map((a) => paths.aircraftEdit(a.id)),
  ...aircraft.map((a) => paths.aircraftRecords(a.id)),
  paths.flights,
  paths.flightNew,
  ...flights.map((f) => paths.flight(f.id)),
  paths.defects,
  paths.defectNew,
  paths.defectReview,
  ...defects.map((d) => paths.defect(d.id)),
  paths.workOrders,
  paths.workOrderNew,
  paths.myWorkOrders,
  ...workOrders.map((w) => paths.workOrder(w.id)),
  ...workOrders.map((w) => paths.workOrderSignOff(w.id)),
  paths.signOffs,
  paths.maintenanceRecords,
  paths.inventoryParts,
  paths.inventoryStock,
  paths.inventoryTransactions,
  paths.inventoryRequests,
  paths.accounts,
  ...accounts.map((a) => paths.account(a.id)),
  ...accounts.map((a) => paths.accountCostCentres(a.id)),
  paths.reports,
  paths.adminUsers,
  ...users.map((u) => paths.adminUser(u.id)),
  paths.adminProfiles,
  ...securityProfiles.map((p) => paths.adminProfile(p.id)),
  paths.adminAuditLogs,
  paths.adminSettings,
  '/definitely-not-a-route',
]

const BANNED = [/coming soon/i, /\bTODO\b/, /lorem ipsum/i, /under construction/i]

const validTargets = new Set(routes.filter((r) => r !== '/definitely-not-a-route'))
const failures: string[] = []
const deadLinks = new Map<string, Set<string>>()

let rendered = 0
for (const route of routes) {
  let html = ''
  try {
    html = renderToString(
      <MemoryRouter initialEntries={[route]}>
        <WorkflowProvider>
          <AppRoutes />
        </WorkflowProvider>
      </MemoryRouter>,
    )
    rendered++
  } catch (err) {
    failures.push(`RENDER FAIL ${route}: ${err instanceof Error ? err.message : String(err)}`)
    continue
  }

  if (html.length < 1000) {
    failures.push(`SUSPICIOUSLY EMPTY ${route}: ${html.length} chars`)
  }

  for (const re of BANNED) {
    if (re.test(html)) failures.push(`BANNED TEXT ${route}: matches ${re}`)
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1]!
    if (!href.startsWith('/')) continue // external / anchors
    const clean = href.split('#')[0]!.split('?')[0]!
    if (clean === '' || clean === route) continue
    if (!validTargets.has(clean)) {
      if (!deadLinks.has(clean)) deadLinks.set(clean, new Set())
      deadLinks.get(clean)!.add(route)
    }
  }
}

for (const [target, sources] of deadLinks) {
  failures.push(`DEAD LINK ${target} (from ${[...sources].slice(0, 4).join(', ')}${sources.size > 4 ? '…' : ''})`)
}

console.log(`\nSmoke test: rendered ${rendered}/${routes.length} routes`)
if (failures.length > 0) {
  console.error(`\n${failures.length} failure(s):`)
  for (const f of failures) console.error(`  ✗ ${f}`)
  process.exit(1)
}
console.log('All routes render, no dead links, no banned wording. ✓')
