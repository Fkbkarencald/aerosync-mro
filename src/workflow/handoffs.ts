import { users } from '@/data'
import type { DefectStatus, Role, User, WorkOrder, WorkOrderPriority } from '@/data/types'
import type { WorkflowState } from './engine'

export type HandoffRole = Extract<Role, 'Pilot' | 'Maintenance Controller' | 'Engineer' | 'Licensed Engineer'>

export class HandoffAccessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HandoffAccessError'
  }
}

export interface HandoffItem {
  id: string
  aircraftId: string
  title: string
  status: string
  detail: string
  to: string
  tone: 'green' | 'amber' | 'orange' | 'red' | 'blue' | 'grey'
  eligible?: boolean
}

export interface HandoffDashboard {
  user: User
  role: HandoffRole
  heading: string
  summary: string
  groups: Array<{ id: string; title: string; empty: string; items: HandoffItem[] }>
  visibleAircraftIds: string[]
  visibleMaintenanceRecordIds: string[]
}

const priorityRank: Record<WorkOrderPriority, number> = { AOG: 0, Urgent: 1, Routine: 2 }

const sortWorkOrders = (left: WorkOrder, right: WorkOrder) =>
  priorityRank[left.priority] - priorityRank[right.priority] || left.dueAt.localeCompare(right.dueAt) || left.id.localeCompare(right.id)

const workOrderTone = (workOrder: WorkOrder): HandoffItem['tone'] =>
  workOrder.priority === 'AOG' ? 'red' : workOrder.priority === 'Urgent' ? 'orange' : 'blue'

const defectTone = (status: DefectStatus): HandoffItem['tone'] =>
  status === 'Closed' ? 'green' : status === 'Deferred' ? 'amber' : status === 'Reported' ? 'blue' : 'orange'

const pilotStatus = (status: DefectStatus): string => {
  if (status === 'Reported') return 'Awaiting review'
  if (status === 'Under Review') return 'Under review'
  if (status === 'Deferred') return 'Deferred'
  if (status === 'Closed' || status === 'Cancelled') return status
  return 'Accepted for maintenance'
}

const seededUser = (userId: string): User => {
  const user = users.find((item) => item.id === userId)
  if (!user || user.status !== 'Active') throw new HandoffAccessError('An active seeded user is required to view a handoff dashboard.')
  if (!['Pilot', 'Maintenance Controller', 'Engineer', 'Licensed Engineer'].includes(user.role)) {
    throw new HandoffAccessError(`${user.role} does not have a maintenance handoff dashboard.`)
  }
  return user
}

const inBase = (state: WorkflowState, aircraftId: string, user: User): boolean =>
  state.aircraft.some((aircraft) => aircraft.id === aircraftId && aircraft.base === user.base)

export function canViewAircraft(state: WorkflowState, userId: string, aircraftId: string): boolean {
  const user = seededUser(userId)
  if (user.role === 'Maintenance Controller') return inBase(state, aircraftId, user)
  if (user.role === 'Pilot') return state.defects.some((defect) => defect.aircraftId === aircraftId && defect.reportedByUserId === user.id)
  return state.workOrders.some(
    (workOrder) =>
      workOrder.aircraftId === aircraftId &&
      inBase(state, workOrder.aircraftId, user) &&
      (user.role === 'Licensed Engineer' || workOrder.assignedToUserId === user.id || workOrder.teamUserIds.includes(user.id)),
  )
}

export function canViewMaintenanceRecord(state: WorkflowState, userId: string, recordId: string): boolean {
  const user = seededUser(userId)
  const record = state.maintenanceRecords.find((item) => item.id === recordId)
  if (!record || user.role === 'Pilot') return false
  if (!inBase(state, record.aircraftId, user)) return false
  if (user.role === 'Maintenance Controller' || user.role === 'Licensed Engineer') return true
  return record.performedByUserId === user.id || record.certifiedByUserId === user.id
}

export function buildHandoffDashboard(state: WorkflowState, userId: string): HandoffDashboard {
  const user = seededUser(userId)
  const role = user.role as HandoffRole
  let groups: HandoffDashboard['groups']

  if (role === 'Pilot') {
    const submitted = state.defects
      .filter((defect) => defect.reportedByUserId === user.id)
      .sort((left, right) => right.reportedAt.localeCompare(left.reportedAt))
      .map((defect) => ({
        id: defect.id,
        aircraftId: defect.aircraftId,
        title: defect.title,
        status: pilotStatus(defect.status),
        detail: `${defect.aircraftId} · reported ${defect.reportedAt.replace('T', ' ')}`,
        to: `/defects/${defect.id}`,
        tone: defectTone(defect.status),
      }))
    groups = [{ id: 'submitted', title: 'My submitted defects', empty: 'You have no submitted defects.', items: submitted }]
  } else if (role === 'Maintenance Controller') {
    const unreviewed = state.defects
      .filter((defect) => defect.status === 'Reported' && inBase(state, defect.aircraftId, user))
      .map((defect) => ({ id: defect.id, aircraftId: defect.aircraftId, title: defect.title, status: 'Awaiting review', detail: `${defect.aircraftId} · ${defect.severity}`, to: `/defects/${defect.id}`, tone: defectTone(defect.status) }))
    const unassigned = state.workOrders
      .filter((workOrder) => inBase(state, workOrder.aircraftId, user) && (workOrder.status === 'Open' || !workOrder.assignedToUserId))
      .sort(sortWorkOrders)
      .map((workOrder) => ({ id: workOrder.id, aircraftId: workOrder.aircraftId, title: workOrder.title, status: 'Needs assignment', detail: `${workOrder.aircraftId} · ${workOrder.priority}`, to: `/work-orders/${workOrder.id}`, tone: workOrderTone(workOrder) }))
    const blocked = state.workOrders
      .filter((workOrder) => inBase(state, workOrder.aircraftId, user) && ['Awaiting Parts', 'Awaiting Inspection'].includes(workOrder.status))
      .sort(sortWorkOrders)
      .map((workOrder) => ({ id: workOrder.id, aircraftId: workOrder.aircraftId, title: workOrder.title, status: workOrder.status, detail: `${workOrder.aircraftId} · ${workOrder.partsState}`, to: `/work-orders/${workOrder.id}`, tone: workOrderTone(workOrder) }))
    const attention = state.aircraft
      .filter((aircraft) => aircraft.base === user.base && !['Available', 'Assigned'].includes(aircraft.availability))
      .map((aircraft) => ({ id: aircraft.id, aircraftId: aircraft.id, title: aircraft.availabilityReason, status: aircraft.availability, detail: `${aircraft.location} · ${aircraft.maintenanceRisk}`, to: `/aircraft/${aircraft.id}`, tone: aircraft.availability === 'AOG' ? 'red' as const : 'amber' as const }))
    groups = [
      { id: 'unreviewed', title: 'Defects awaiting review', empty: 'No defects are awaiting review.', items: unreviewed },
      { id: 'unassigned', title: 'Work orders needing assignment', empty: 'No work orders need assignment.', items: unassigned },
      { id: 'blocked', title: 'Blocked maintenance handoffs', empty: 'No work orders are blocked on parts or inspection.', items: blocked },
      { id: 'availability', title: 'Aircraft needing availability attention', empty: 'All aircraft are available or assigned.', items: attention },
    ]
  } else if (role === 'Engineer') {
    const assignments = state.workOrders
      .filter((workOrder) => !['Closed', 'Cancelled'].includes(workOrder.status) && inBase(state, workOrder.aircraftId, user) && (workOrder.assignedToUserId === user.id || workOrder.teamUserIds.includes(user.id)))
      .sort(sortWorkOrders)
      .map((workOrder) => ({
        id: workOrder.id,
        aircraftId: workOrder.aircraftId,
        title: workOrder.title,
        status: workOrder.status,
        detail: `${workOrder.aircraftId} · ${workOrder.tasks.filter((task) => task.done).length}/${workOrder.tasks.length} tasks · ${workOrder.priority}`,
        to: `/work-orders/${workOrder.id}`,
        tone: workOrderTone(workOrder),
      }))
    groups = [{ id: 'assignments', title: 'My assigned work', empty: 'No open work orders are assigned to you.', items: assignments }]
  } else {
    const signoffs = state.workOrders
      .filter((workOrder) => !['Closed', 'Cancelled'].includes(workOrder.status) && inBase(state, workOrder.aircraftId, user))
      .sort(sortWorkOrders)
      .map((workOrder) => {
        const tasksComplete = workOrder.tasks.every((task) => task.done)
        const inspectionComplete = !workOrder.inspection.required || workOrder.inspection.status === 'Passed'
        const eligible = workOrder.status === 'Ready for Sign-off' && tasksComplete && inspectionComplete
        const reason = !tasksComplete ? 'Tasks incomplete' : !inspectionComplete ? 'Inspection incomplete' : workOrder.status !== 'Ready for Sign-off' ? `Status is ${workOrder.status}` : 'Eligible for licensed release'
        return { id: workOrder.id, aircraftId: workOrder.aircraftId, title: workOrder.title, status: eligible ? 'Eligible' : 'Blocked', detail: `${workOrder.aircraftId} · ${reason}`, to: eligible ? `/work-orders/${workOrder.id}/sign-off` : `/work-orders/${workOrder.id}`, tone: eligible ? 'green' as const : workOrderTone(workOrder), eligible }
      })
    groups = [{ id: 'signoffs', title: 'Licensed release queue', empty: 'No work orders are awaiting licensed release review.', items: signoffs }]
  }

  const visibleAircraftIds = state.aircraft.filter((aircraft) => canViewAircraft(state, user.id, aircraft.id)).map((aircraft) => aircraft.id)
  const visibleMaintenanceRecordIds = state.maintenanceRecords.filter((record) => canViewMaintenanceRecord(state, user.id, record.id)).map((record) => record.id)
  const itemCount = groups.reduce((count, group) => count + group.items.length, 0)

  return {
    user,
    role,
    heading: `${role} handoff dashboard`,
    summary: `${itemCount} current handoff ${itemCount === 1 ? 'item' : 'items'} in ${user.base} scope`,
    groups,
    visibleAircraftIds,
    visibleMaintenanceRecordIds,
  }
}
