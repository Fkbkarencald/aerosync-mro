import assert from 'node:assert/strict'
import {
  WorkflowTransitionError,
  completeWorkOrderTask,
  createInitialWorkflowState,
  createWorkOrderFromDefect,
  restoreWorkflowState,
  signOffWorkOrder,
  startDefectReview,
  startWork,
} from '../src/workflow/engine'

const time = {
  review: '2026-08-08T09:00',
  create: '2026-08-08T09:05',
  start: '2026-08-08T09:10',
  task1: '2026-08-08T09:20',
  task2: '2026-08-08T09:30',
  task3: '2026-08-08T09:40',
  signoff: '2026-08-08T09:50',
}

let state = createInitialWorkflowState()
const defect = state.defects.find((item) => item.status === 'Reported' && !item.workOrderId)
assert.ok(defect, 'seed data must contain a reported defect without a work order')
const originalAuditCount = state.auditLogs.length
const originalRecordCount = state.maintenanceRecords.length
const originalSignOffCount = state.signOffs.length

assert.throws(
  () => createWorkOrderFromDefect(state, { defectId: defect.id, actorId: 'USR-003', assignedToUserId: 'USR-005' }),
  (error) => error instanceof WorkflowTransitionError && error.message.includes('Reported'),
  'a work order cannot bypass defect review',
)

assert.throws(
  () => startDefectReview(state, defect.id, 'USR-005', time.review),
  (error) => error instanceof WorkflowTransitionError && error.message.includes('controller or admin'),
  'an engineer cannot start controller review',
)

state = startDefectReview(state, defect.id, 'USR-003', time.review)
assert.equal(state.defects.find((item) => item.id === defect.id)?.status, 'Under Review')

assert.throws(
  () => createWorkOrderFromDefect(state, { defectId: defect.id, actorId: 'USR-005', assignedToUserId: 'USR-005' }),
  (error) => error instanceof WorkflowTransitionError && error.message.includes('controller or admin'),
  'an engineer cannot create the work order',
)

const created = createWorkOrderFromDefect(state, {
  defectId: defect.id,
  actorId: 'USR-003',
  assignedToUserId: 'USR-005',
  now: time.create,
})
state = created.state
const workOrder = state.workOrders.find((item) => item.id === created.workOrderId)
assert.ok(workOrder)
assert.equal(workOrder.status, 'Assigned')
assert.equal(state.defects.find((item) => item.id === defect.id)?.status, 'Work Order Created')
assert.equal(state.defects.find((item) => item.id === defect.id)?.workOrderId, workOrder.id)
assert.equal(state.aircraft.find((item) => item.id === defect.aircraftId)?.availability, 'Under Maintenance')

assert.throws(
  () => startWork(state, workOrder.id, 'USR-007', time.start),
  (error) => error instanceof WorkflowTransitionError && error.message.includes('assigned engineer'),
  'an unassigned engineer cannot start the work order',
)
assert.throws(
  () => signOffWorkOrder(state, { workOrderId: workOrder.id, actorId: 'USR-014', statement: 'test', now: time.signoff }),
  (error) => error instanceof WorkflowTransitionError && error.message.includes('Assigned'),
  'sign-off cannot bypass work and task completion',
)

state = startWork(state, workOrder.id, 'USR-005', time.start)
assert.equal(state.workOrders.find((item) => item.id === workOrder.id)?.status, 'In Progress')

for (const [index, task] of workOrder.tasks.entries()) {
  state = completeWorkOrderTask(
    state,
    workOrder.id,
    task.seq,
    'USR-005',
    [time.task1, time.task2, time.task3][index] ?? time.task3,
  )
}

const ready = state.workOrders.find((item) => item.id === workOrder.id)
assert.equal(ready?.status, 'Ready for Sign-off')
assert.equal(state.aircraft.find((item) => item.id === defect.aircraftId)?.availability, 'Awaiting Sign-off')
assert.ok(ready?.tasks.every((item) => item.done))

assert.throws(
  () => signOffWorkOrder(state, { workOrderId: workOrder.id, actorId: 'USR-005', statement: 'test', now: time.signoff }),
  (error) => error instanceof WorkflowTransitionError && error.message.includes('licensed engineer'),
  'an unlicensed engineer cannot release the aircraft',
)

assert.throws(
  () => signOffWorkOrder(state, { workOrderId: workOrder.id, actorId: 'USR-014', statement: '   ', now: time.signoff }),
  (error) => error instanceof WorkflowTransitionError && error.message.includes('certification statement'),
  'release requires a non-empty certification statement',
)

const released = signOffWorkOrder(state, {
  workOrderId: workOrder.id,
  actorId: 'USR-014',
  statement: 'Approved maintenance data followed; aircraft released in respect of the work performed.',
  now: time.signoff,
})
state = released.state

assert.equal(state.workOrders.find((item) => item.id === workOrder.id)?.status, 'Closed')
assert.equal(state.defects.find((item) => item.id === defect.id)?.status, 'Closed')
assert.equal(state.aircraft.find((item) => item.id === defect.aircraftId)?.status, 'Serviceable')
assert.equal(state.aircraft.find((item) => item.id === defect.aircraftId)?.availability, 'Available')
assert.equal(state.signOffs.length, originalSignOffCount + 1)
assert.equal(state.maintenanceRecords.length, originalRecordCount + 1)
assert.equal(state.workOrders.find((item) => item.id === workOrder.id)?.signOffId, released.signOffId)
assert.equal(state.maintenanceRecords[0]?.reference, released.signOffId)
assert.equal(state.maintenanceRecords[0]?.id, released.maintenanceRecordId)
assert.equal(state.auditLogs.length, originalAuditCount + 7)
assert.deepEqual(
  restoreWorkflowState(JSON.stringify(state)),
  JSON.parse(JSON.stringify(state)),
  'the completed workflow must survive persistence',
)
assert.equal(restoreWorkflowState('{not-json').schemaVersion, 1, 'corrupt persistence must reset safely')

console.log(
  `Workflow test passed: ${defect.id} → ${workOrder.id} → ${released.signOffId} → ${released.maintenanceRecordId}; aircraft returned to Available with ${state.auditLogs.length - originalAuditCount} new audit events.`,
)
