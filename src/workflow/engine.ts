import {
  aircraft as seedAircraft,
  auditLogs as seedAuditLogs,
  defects as seedDefects,
  maintenanceRecords as seedMaintenanceRecords,
  signOffs as seedSignOffs,
  users,
  workOrders as seedWorkOrders,
} from '@/data'
import type {
  Aircraft,
  AuditLogEntry,
  Defect,
  MaintenanceRecord,
  SignOff,
  TimelineEvent,
  WorkOrder,
} from '@/data/types'

export const WORKFLOW_STORAGE_KEY = 'aerosync-mro.workflow.v1'
export const WORKFLOW_SCHEMA_VERSION = 1

export interface WorkflowState {
  schemaVersion: number
  aircraft: Aircraft[]
  defects: Defect[]
  workOrders: WorkOrder[]
  signOffs: SignOff[]
  maintenanceRecords: MaintenanceRecord[]
  auditLogs: AuditLogEntry[]
}

export interface CreateWorkOrderInput {
  defectId: string
  actorId: string
  assignedToUserId: string
  title?: string
  description?: string
  taskTitles?: string[]
  now?: string
}

export interface SignOffInput {
  workOrderId: string
  actorId: string
  statement: string
  now?: string
}

export class WorkflowTransitionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WorkflowTransitionError'
  }
}

const clone = <T,>(value: T): T => structuredClone(value)

const nowValue = (now?: string): string => now ?? new Date().toISOString().slice(0, 16)

const nextReference = (prefix: string, ids: string[], width = 4): string => {
  const sequence = ids.reduce((max, id) => {
    const match = id.match(/(\d+)$/)
    return Math.max(max, match ? Number(match[1]) : 0)
  }, 0) + 1
  return `${prefix}${String(sequence).padStart(width, '0')}`
}

const actor = (id: string) => {
  const found = users.find((user) => user.id === id)
  if (!found || found.status !== 'Active') {
    throw new WorkflowTransitionError('The workflow actor must be an active seeded user.')
  }
  return found
}

const audit = (
  state: WorkflowState,
  input: Omit<AuditLogEntry, 'id' | 'sourceIp' | 'outcome'>,
): void => {
  state.auditLogs.unshift({
    ...input,
    id: nextReference('AUD-2026-', state.auditLogs.map((entry) => entry.id), 5),
    sourceIp: 'Interactive prototype',
    outcome: 'Success',
  })
}

const timelineEvent = (
  at: string,
  title: string,
  detail: string,
  byUserId: string,
  tone: TimelineEvent['tone'],
  refLink?: TimelineEvent['refLink'],
): TimelineEvent => ({ at, title, detail, byUserId, tone, refLink })

export function createInitialWorkflowState(): WorkflowState {
  return clone({
    schemaVersion: WORKFLOW_SCHEMA_VERSION,
    aircraft: seedAircraft,
    defects: seedDefects,
    workOrders: seedWorkOrders,
    signOffs: seedSignOffs,
    maintenanceRecords: seedMaintenanceRecords,
    auditLogs: seedAuditLogs,
  })
}

export function restoreWorkflowState(serialized: string | null): WorkflowState {
  if (!serialized) return createInitialWorkflowState()
  try {
    const parsed = JSON.parse(serialized) as Partial<WorkflowState>
    if (
      parsed.schemaVersion !== WORKFLOW_SCHEMA_VERSION ||
      !Array.isArray(parsed.aircraft) ||
      !Array.isArray(parsed.defects) ||
      !Array.isArray(parsed.workOrders) ||
      !Array.isArray(parsed.signOffs) ||
      !Array.isArray(parsed.maintenanceRecords) ||
      !Array.isArray(parsed.auditLogs)
    ) {
      return createInitialWorkflowState()
    }
    return clone(parsed as WorkflowState)
  } catch {
    return createInitialWorkflowState()
  }
}

export function startDefectReview(
  current: WorkflowState,
  defectId: string,
  actorId: string,
  now?: string,
): WorkflowState {
  const state = clone(current)
  const user = actor(actorId)
  if (user.role !== 'Maintenance Controller' && user.role !== 'Admin') {
    throw new WorkflowTransitionError('Only a maintenance controller or admin can start defect review.')
  }
  const defect = state.defects.find((item) => item.id === defectId)
  if (!defect) throw new WorkflowTransitionError(`Defect ${defectId} was not found.`)
  if (defect.status !== 'Reported') {
    throw new WorkflowTransitionError(`Cannot start review from ${defect.status}.`)
  }

  const at = nowValue(now)
  defect.status = 'Under Review'
  defect.reviewedByUserId = actorId
  defect.reviewNotes = 'Interactive V1 triage started; create a work order or defer the defect.'
  defect.timeline.push(timelineEvent(at, 'Review started', `Triage opened by ${user.name}`, actorId, 'amber'))
  audit(state, {
    at,
    userId: actorId,
    role: user.role,
    action: 'defect.review',
    entityType: 'Defect',
    entityRef: defect.id,
    entityLink: `/defects/${defect.id}`,
    summary: `Defect review started for ${defect.id}`,
    before: { status: 'Reported' },
    after: { status: 'Under Review' },
  })
  return state
}

export function createWorkOrderFromDefect(
  current: WorkflowState,
  input: CreateWorkOrderInput,
): { state: WorkflowState; workOrderId: string } {
  const state = clone(current)
  const user = actor(input.actorId)
  if (user.role !== 'Maintenance Controller' && user.role !== 'Admin') {
    throw new WorkflowTransitionError('Only a maintenance controller or admin can create a work order from a defect.')
  }
  const assignee = actor(input.assignedToUserId)
  if (assignee.role !== 'Engineer' && assignee.role !== 'Licensed Engineer') {
    throw new WorkflowTransitionError('A work order must be assigned to an engineer or licensed engineer.')
  }

  const defect = state.defects.find((item) => item.id === input.defectId)
  if (!defect) throw new WorkflowTransitionError(`Defect ${input.defectId} was not found.`)
  if (defect.status !== 'Under Review' && defect.status !== 'Deferred') {
    throw new WorkflowTransitionError(`Cannot create a work order from ${defect.status}.`)
  }
  if (defect.workOrderId) {
    throw new WorkflowTransitionError(`Defect ${defect.id} already has work order ${defect.workOrderId}.`)
  }

  const aircraft = state.aircraft.find((item) => item.id === defect.aircraftId)
  if (!aircraft) throw new WorkflowTransitionError(`Aircraft ${defect.aircraftId} was not found.`)

  const at = nowValue(input.now)
  const previousDefectStatus = defect.status
  const workOrderId = nextReference('WO-2026-', state.workOrders.map((item) => item.id))
  const taskTitles = input.taskTitles?.filter(Boolean) ?? [
    'Confirm defect and isolate the affected system',
    'Rectify the defect in accordance with approved maintenance data',
    'Perform operational check and record the result',
  ]
  if (taskTitles.length === 0) throw new WorkflowTransitionError('A work order requires at least one task.')

  const workOrder: WorkOrder = {
    id: workOrderId,
    aircraftId: defect.aircraftId,
    defectId: defect.id,
    title: input.title ?? `Rectify ${defect.title}`,
    description: input.description ?? defect.description,
    priority: defect.severity === 'Critical' ? 'AOG' : defect.severity === 'Significant' ? 'Urgent' : 'Routine',
    status: 'Assigned',
    assignedToUserId: input.assignedToUserId,
    teamUserIds: [],
    createdByUserId: input.actorId,
    createdAt: at,
    dueAt: at,
    estimatedManhours: taskTitles.length,
    actualManhours: 0,
    partsState: 'Not Required',
    partRequestIds: [],
    inspection: { required: false, status: 'Not Required' },
    tasks: taskTitles.map((title, index) => ({ seq: index + 1, title, done: false })),
    labour: [],
    notes: [],
    attachments: [],
    timeline: [
      timelineEvent(at, 'Work order created and assigned', `${defect.id} assigned to ${assignee.name}`, input.actorId, 'blue', {
        label: defect.id,
        to: `/defects/${defect.id}`,
      }),
    ],
    costCentreCode: defect.severity === 'Critical' ? 'AOG-RECOVERY' : 'LINE-MAINT',
  }

  state.workOrders.unshift(workOrder)
  defect.status = 'Work Order Created'
  defect.workOrderId = workOrderId
  defect.timeline.push(
    timelineEvent(at, 'Work order created', `${workOrderId} assigned to ${assignee.name}`, input.actorId, 'blue', {
      label: workOrderId,
      to: `/work-orders/${workOrderId}`,
    }),
  )
  aircraft.status = defect.severity === 'Critical' ? 'AOG' : 'Under Maintenance'
  aircraft.availability = defect.severity === 'Critical' ? 'AOG' : 'Under Maintenance'
  aircraft.availabilityReason = `${workOrderId} opened from ${defect.id}`
  aircraft.maintenanceRisk = defect.severity === 'Critical' ? 'No Go' : 'At Risk'

  audit(state, {
    at,
    userId: input.actorId,
    role: user.role,
    action: 'work_order.create',
    entityType: 'Work order',
    entityRef: workOrderId,
    entityLink: `/work-orders/${workOrderId}`,
    summary: `Work order created from ${defect.id}; ${aircraft.id} moved to ${aircraft.availability}`,
    before: { defectStatus: previousDefectStatus },
    after: { defectStatus: 'Work Order Created', workOrderStatus: 'Assigned', availability: aircraft.availability },
  })
  return { state, workOrderId }
}

export function startWork(
  current: WorkflowState,
  workOrderId: string,
  actorId: string,
  now?: string,
): WorkflowState {
  const state = clone(current)
  const user = actor(actorId)
  const workOrder = state.workOrders.find((item) => item.id === workOrderId)
  if (!workOrder) throw new WorkflowTransitionError(`Work order ${workOrderId} was not found.`)
  if (workOrder.status !== 'Assigned') {
    throw new WorkflowTransitionError(`Cannot start work from ${workOrder.status}.`)
  }
  if (workOrder.assignedToUserId !== actorId && !workOrder.teamUserIds.includes(actorId)) {
    throw new WorkflowTransitionError('Only an assigned engineer can start this work order.')
  }

  const at = nowValue(now)
  workOrder.status = 'In Progress'
  workOrder.timeline.push(timelineEvent(at, 'Work started', `${user.name} began rectification`, actorId, 'amber'))
  audit(state, {
    at,
    userId: actorId,
    role: user.role,
    action: 'work_order.start',
    entityType: 'Work order',
    entityRef: workOrder.id,
    entityLink: `/work-orders/${workOrder.id}`,
    summary: `${workOrder.id} moved to In Progress`,
    before: { status: 'Assigned' },
    after: { status: 'In Progress' },
  })
  return state
}

export function completeWorkOrderTask(
  current: WorkflowState,
  workOrderId: string,
  taskSeq: number,
  actorId: string,
  now?: string,
): WorkflowState {
  const state = clone(current)
  const user = actor(actorId)
  const workOrder = state.workOrders.find((item) => item.id === workOrderId)
  if (!workOrder) throw new WorkflowTransitionError(`Work order ${workOrderId} was not found.`)
  if (workOrder.status !== 'In Progress') {
    throw new WorkflowTransitionError(`Tasks can only be completed while work is In Progress, not ${workOrder.status}.`)
  }
  if (workOrder.assignedToUserId !== actorId && !workOrder.teamUserIds.includes(actorId)) {
    throw new WorkflowTransitionError('Only an assigned engineer can complete this task.')
  }

  const task = workOrder.tasks.find((item) => item.seq === taskSeq)
  if (!task) throw new WorkflowTransitionError(`Task ${taskSeq} was not found.`)
  if (task.done) throw new WorkflowTransitionError(`Task ${taskSeq} is already complete.`)

  const at = nowValue(now)
  task.done = true
  task.completedByUserId = actorId
  task.completedAt = at
  task.manhours = task.manhours ?? 1
  task.note = task.note ?? 'Completed in the interactive V1 workflow.'
  workOrder.actualManhours = workOrder.tasks.reduce((total, item) => total + (item.manhours ?? 0), 0)
  workOrder.timeline.push(timelineEvent(at, `Task ${task.seq} completed`, task.title, actorId, 'green'))

  const allDone = workOrder.tasks.every((item) => item.done)
  if (allDone) {
    const inspectionComplete = !workOrder.inspection.required || workOrder.inspection.status === 'Passed'
    workOrder.status = inspectionComplete ? 'Ready for Sign-off' : 'Awaiting Inspection'
    const aircraft = state.aircraft.find((item) => item.id === workOrder.aircraftId)
    if (aircraft && inspectionComplete) {
      aircraft.availability = 'Awaiting Sign-off'
      aircraft.availabilityReason = `${workOrder.id} complete — licensed release required`
      aircraft.maintenanceRisk = 'At Risk'
    }
  }

  audit(state, {
    at,
    userId: actorId,
    role: user.role,
    action: 'work_order.task.complete',
    entityType: 'Work order',
    entityRef: workOrder.id,
    entityLink: `/work-orders/${workOrder.id}`,
    summary: `Task ${task.seq} completed on ${workOrder.id}${allDone ? `; status moved to ${workOrder.status}` : ''}`,
    before: { task: 'Incomplete' },
    after: { task: 'Complete', status: workOrder.status },
  })
  return state
}

export function signOffWorkOrder(
  current: WorkflowState,
  input: SignOffInput,
): { state: WorkflowState; signOffId: string; maintenanceRecordId: string } {
  const state = clone(current)
  const user = actor(input.actorId)
  if (user.role !== 'Licensed Engineer' || !user.licenceNumber) {
    throw new WorkflowTransitionError('Release requires an active licensed engineer with a licence number.')
  }
  if (!input.statement.trim()) {
    throw new WorkflowTransitionError('Release requires a certification statement.')
  }

  const workOrder = state.workOrders.find((item) => item.id === input.workOrderId)
  if (!workOrder) throw new WorkflowTransitionError(`Work order ${input.workOrderId} was not found.`)
  if (workOrder.status !== 'Ready for Sign-off') {
    throw new WorkflowTransitionError(`Cannot sign off from ${workOrder.status}.`)
  }
  if (!workOrder.tasks.every((item) => item.done)) {
    throw new WorkflowTransitionError('Every work-order task must be complete before sign-off.')
  }
  if (workOrder.inspection.required && workOrder.inspection.status !== 'Passed') {
    throw new WorkflowTransitionError('The required inspection must pass before sign-off.')
  }

  const defect = workOrder.defectId ? state.defects.find((item) => item.id === workOrder.defectId) : undefined
  const aircraft = state.aircraft.find((item) => item.id === workOrder.aircraftId)
  if (!aircraft) throw new WorkflowTransitionError(`Aircraft ${workOrder.aircraftId} was not found.`)

  const at = nowValue(input.now)
  const signOffId = nextReference('SO-2026-', state.signOffs.map((item) => item.id))
  const maintenanceRecordId = nextReference('MR-2026-', state.maintenanceRecords.map((item) => item.id))
  const signOff: SignOff = {
    id: signOffId,
    aircraftId: aircraft.id,
    workOrderId: workOrder.id,
    type: 'Return to Service',
    signedByUserId: input.actorId,
    licenceNumber: user.licenceNumber,
    signedAt: at,
    statement: input.statement,
    releaseStatus: 'Released',
    auditState: 'Verified',
  }
  const record: MaintenanceRecord = {
    id: maintenanceRecordId,
    aircraftId: aircraft.id,
    workOrderId: workOrder.id,
    defectId: defect?.id,
    recordType: 'Corrective',
    summary: workOrder.title,
    performedByUserId: workOrder.assignedToUserId ?? input.actorId,
    certifiedByUserId: input.actorId,
    performedAt: at,
    totalManhours: workOrder.actualManhours,
    partsUsedSummary: workOrder.partsState === 'Not Required' ? 'No parts required' : workOrder.partsState,
    reference: signOffId,
  }

  state.signOffs.unshift(signOff)
  state.maintenanceRecords.unshift(record)
  workOrder.status = 'Closed'
  workOrder.signOffId = signOffId
  workOrder.timeline.push(
    timelineEvent(at, 'Released to service', `${signOffId} certified by ${user.name}`, input.actorId, 'green', {
      label: signOffId,
      to: `/work-orders/${workOrder.id}/sign-off`,
    }),
  )
  if (defect) {
    defect.status = 'Closed'
    defect.closedAt = at
    defect.timeline.push(
      timelineEvent(at, 'Defect closed on release', `${signOffId} closed ${workOrder.id}`, input.actorId, 'green', {
        label: workOrder.id,
        to: `/work-orders/${workOrder.id}`,
      }),
    )
  }
  aircraft.status = 'Serviceable'
  aircraft.availability = 'Available'
  aircraft.availabilityReason = `Released under ${signOffId}; ready for assignment`
  aircraft.maintenanceRisk = 'Clear'

  audit(state, {
    at,
    userId: input.actorId,
    role: user.role,
    action: 'signoff.perform',
    entityType: 'Sign-off',
    entityRef: signOffId,
    entityLink: `/work-orders/${workOrder.id}/sign-off`,
    summary: `${workOrder.id} released; ${defect?.id ?? 'maintenance item'} closed; ${aircraft.id} returned to Available`,
    before: { workOrder: 'Ready for Sign-off', availability: 'Awaiting Sign-off' },
    after: { workOrder: 'Closed', defect: defect?.status ?? '—', availability: 'Available' },
  })
  return { state, signOffId, maintenanceRecordId }
}
