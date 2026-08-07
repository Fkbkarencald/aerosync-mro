import assert from 'node:assert/strict'
import {
  HandoffAccessError,
  buildHandoffDashboard,
  canViewAircraft,
  canViewMaintenanceRecord,
} from '../src/workflow/handoffs'
import { createInitialWorkflowState, startDefectReview } from '../src/workflow/engine'

const state = createInitialWorkflowState()

const pilot = buildHandoffDashboard(state, 'USR-009')
assert.equal(pilot.role, 'Pilot')
assert.ok(pilot.groups[0]?.items.every((item) => state.defects.find((defect) => defect.id === item.id)?.reportedByUserId === 'USR-009'))
const pilotStatuses = new Set(pilot.groups[0]?.items.map((item) => item.status))
assert.ok(pilotStatuses.has('Awaiting review'))
assert.ok(pilotStatuses.has('Accepted for maintenance'))
assert.ok(pilotStatuses.has('Deferred'))
assert.ok(pilotStatuses.has('Closed'))
assert.equal(pilot.visibleMaintenanceRecordIds.length, 0, 'pilots cannot see maintenance records')
const deniedPilotAircraft = state.aircraft.find((aircraft) => !pilot.visibleAircraftIds.includes(aircraft.id))
assert.ok(deniedPilotAircraft, 'seed data must contain an aircraft outside the pilot scope')
assert.equal(canViewAircraft(state, 'USR-009', deniedPilotAircraft.id), false)

const emptyPilotState = structuredClone(state)
emptyPilotState.defects = emptyPilotState.defects.filter((defect) => defect.reportedByUserId !== 'USR-009')
assert.equal(buildHandoffDashboard(emptyPilotState, 'USR-009').groups[0]?.items.length, 0, 'empty states are represented')

const controller = buildHandoffDashboard(state, 'USR-003')
assert.equal(controller.groups.length, 4)
assert.ok(controller.groups.find((group) => group.id === 'unreviewed')?.items.length)
assert.ok(controller.groups.find((group) => group.id === 'blocked')?.items.length)
assert.ok(controller.groups.find((group) => group.id === 'availability')?.items.length)

const reported = state.defects.find((defect) => defect.status === 'Reported' && state.aircraft.find((aircraft) => aircraft.id === defect.aircraftId)?.base === 'MEL')
assert.ok(reported)
const reviewedState = startDefectReview(state, reported.id, 'USR-003', '2026-08-08T10:00')
const reviewedController = buildHandoffDashboard(reviewedState, 'USR-003')
assert.equal(
  reviewedController.groups.find((group) => group.id === 'unreviewed')!.items.length,
  controller.groups.find((group) => group.id === 'unreviewed')!.items.length - 1,
  'dashboard projections refresh from workflow transitions',
)

const engineer = buildHandoffDashboard(state, 'USR-005')
const engineerItems = engineer.groups[0]!.items
assert.ok(engineerItems.length > 1)
const order = { AOG: 0, Urgent: 1, Routine: 2 }
const priorities = engineerItems.map((item) => state.workOrders.find((workOrder) => workOrder.id === item.id)!.priority)
assert.deepEqual(priorities, [...priorities].sort((left, right) => order[left] - order[right]), 'engineer work is ordered by urgency')
assert.ok(new Set(priorities).size > 1, 'seed data covers mixed priorities')

const licensed = buildHandoffDashboard(state, 'USR-014')
assert.ok(licensed.groups[0]?.items.some((item) => item.eligible), 'licensed queue includes eligible work')
assert.ok(licensed.groups[0]?.items.some((item) => !item.eligible), 'licensed queue explains blocked work')
assert.ok(licensed.groups[0]?.items.every((item) => item.to.startsWith('/work-orders/')), 'items link to canonical work-order routes')

const crossBaseState = structuredClone(state)
const crossBaseAircraft = crossBaseState.aircraft[0]!
crossBaseAircraft.base = 'MQL'
assert.equal(canViewAircraft(crossBaseState, 'USR-003', crossBaseAircraft.id), false, 'controller scope is limited to their base')
const crossBaseRecord = crossBaseState.maintenanceRecords.find((record) => record.aircraftId === crossBaseAircraft.id)
if (crossBaseRecord) assert.equal(canViewMaintenanceRecord(crossBaseState, 'USR-014', crossBaseRecord.id), false)

assert.throws(
  () => buildHandoffDashboard(state, 'USR-012'),
  (error) => error instanceof HandoffAccessError && error.message.includes('active seeded user'),
  'suspended users are denied',
)

console.log(
  `Handoff tests passed: pilot ${pilot.groups[0]!.items.length}, controller ${controller.groups.reduce((count, group) => count + group.items.length, 0)}, engineer ${engineerItems.length}, licensed ${licensed.groups[0]!.items.length}; empty, mixed-priority, blocked, permission and transition-refresh coverage verified.`,
)
