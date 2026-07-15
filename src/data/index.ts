/**
 * Central mock-data access layer.
 *
 * Pages import entities and lookups from here only — no component
 * hard-codes operational values. All lookups are simple in-memory
 * scans over the static dataset (10 aircraft / 21 flights / 12
 * defects / 16 work orders / 13 users / 10 profiles / 8 sign-offs /
 * 20 parts / 4 accounts / 22 audit entries / 4 plans / 9 events).
 */

import { aircraft } from './aircraft'
import { flights } from './flights'
import { defects } from './defects'
import { workOrders } from './workOrders'
import { signOffs, maintenanceRecords } from './signOffs'
import { users, securityProfiles, permissionDomains, CURRENT_USER_ID } from './people'
import { parts, stockLevels, inventoryTransactions, partRequests } from './inventory'
import { accounts } from './accounts'
import { fleetPlans, maintenanceEvents } from './fleetPlans'
import { auditLogs } from './audit'
import { availabilityTrend, notifications } from './dashboard'
import type {
  Aircraft,
  Account,
  Defect,
  Flight,
  FleetPlan,
  MaintenanceEvent,
  MaintenanceRecord,
  Part,
  PartRequest,
  SecurityProfile,
  SignOff,
  User,
  WorkOrder,
} from './types'

export * from './types'
export {
  aircraft,
  flights,
  defects,
  workOrders,
  signOffs,
  maintenanceRecords,
  users,
  securityProfiles,
  permissionDomains,
  CURRENT_USER_ID,
  parts,
  stockLevels,
  inventoryTransactions,
  partRequests,
  accounts,
  fleetPlans,
  maintenanceEvents,
  auditLogs,
  availabilityTrend,
  notifications,
}

export const OPERATOR_NAME = 'AeroSync Regional Operations'

// ---- Lookups ---------------------------------------------------------

export const getAircraft = (id: string): Aircraft | undefined =>
  aircraft.find((a) => a.id.toUpperCase() === id.toUpperCase())

export const getFlight = (id: string): Flight | undefined =>
  flights.find((f) => f.id.toUpperCase() === id.toUpperCase())

export const getDefect = (id: string): Defect | undefined =>
  defects.find((d) => d.id.toUpperCase() === id.toUpperCase())

export const getWorkOrder = (id: string): WorkOrder | undefined =>
  workOrders.find((w) => w.id.toUpperCase() === id.toUpperCase())

export const getSignOff = (id: string): SignOff | undefined =>
  signOffs.find((s) => s.id.toUpperCase() === id.toUpperCase())

export const getUser = (id: string): User | undefined =>
  users.find((u) => u.id.toUpperCase() === id.toUpperCase())

export const getProfile = (id: string): SecurityProfile | undefined =>
  securityProfiles.find((p) => p.id.toUpperCase() === id.toUpperCase())

export const getAccount = (id: string): Account | undefined =>
  accounts.find((a) => a.id.toUpperCase() === id.toUpperCase())

export const getFleetPlan = (id: string): FleetPlan | undefined =>
  fleetPlans.find((p) => p.id.toUpperCase() === id.toUpperCase())

export const getPart = (id: string): Part | undefined =>
  parts.find((p) => p.id.toUpperCase() === id.toUpperCase())

export const currentUser: User = users.find((u) => u.id === CURRENT_USER_ID)!

// ---- Convenience -----------------------------------------------------

export const userName = (id?: string): string =>
  (id && getUser(id)?.name) || 'System'

/** "Jack Munro" → "J. Munro" for dense table cells. */
export const shortName = (id?: string): string => {
  const n = id && getUser(id)?.name
  if (!n) return 'System'
  const bits = n.split(' ')
  return bits.length > 1 ? `${bits[0]![0]}. ${bits.slice(1).join(' ')}` : n
}

// ---- Relations -------------------------------------------------------

export const defectsForAircraft = (aircraftId: string): Defect[] =>
  defects.filter((d) => d.aircraftId === aircraftId)

export const openDefectsForAircraft = (aircraftId: string): Defect[] =>
  defectsForAircraft(aircraftId).filter(
    (d) => d.status !== 'Closed' && d.status !== 'Cancelled',
  )

export const workOrdersForAircraft = (aircraftId: string): WorkOrder[] =>
  workOrders.filter((w) => w.aircraftId === aircraftId)

export const openWorkOrdersForAircraft = (aircraftId: string): WorkOrder[] =>
  workOrdersForAircraft(aircraftId).filter(
    (w) => w.status !== 'Closed' && w.status !== 'Cancelled',
  )

export const flightsForAircraft = (aircraftId: string): Flight[] =>
  flights.filter((f) => f.aircraftId === aircraftId)

export const recordsForAircraft = (aircraftId: string): MaintenanceRecord[] =>
  maintenanceRecords.filter((r) => r.aircraftId === aircraftId)

export const signOffsForAircraft = (aircraftId: string): SignOff[] =>
  signOffs.filter((s) => s.aircraftId === aircraftId)

export const eventsForAircraft = (aircraftId: string): MaintenanceEvent[] =>
  maintenanceEvents.filter((e) => e.aircraftId === aircraftId)

export const requestsForWorkOrder = (workOrderId: string): PartRequest[] =>
  partRequests.filter((r) => r.workOrderId === workOrderId)

export const openDefectCount = (aircraftId: string): number =>
  openDefectsForAircraft(aircraftId).length

export const openWorkOrderCount = (aircraftId: string): number =>
  openWorkOrdersForAircraft(aircraftId).length

export const myWorkOrders = (): WorkOrder[] =>
  workOrders.filter(
    (w) =>
      w.assignedToUserId === CURRENT_USER_ID ||
      w.teamUserIds.includes(CURRENT_USER_ID) ||
      w.inspection.inspectorUserId === CURRENT_USER_ID,
  )

// ---- Derived operational summaries ------------------------------------

export const OPEN_WO_STATUSES = [
  'Open',
  'Assigned',
  'In Progress',
  'Awaiting Parts',
  'Awaiting Inspection',
  'Ready for Sign-off',
] as const

export const openWorkOrders = workOrders.filter((w) =>
  (OPEN_WO_STATUSES as readonly string[]).includes(w.status),
)

export const reviewQueueDefects = defects
  .filter((d) => d.status === 'Reported' || d.status === 'Under Review')
  .sort((a, b) => {
    const sev = { Critical: 0, Significant: 1, Minor: 2 }
    return sev[a.severity] - sev[b.severity] || a.reportedAt.localeCompare(b.reportedAt)
  })

export const fleetSummary = {
  total: aircraft.length,
  available: aircraft.filter((a) => a.availability === 'Available').length,
  assigned: aircraft.filter((a) => a.availability === 'Assigned').length,
  aog: aircraft.filter((a) => a.availability === 'AOG').length,
  underMaintenance: aircraft.filter((a) => a.availability === 'Under Maintenance').length,
  awaitingSignOff: aircraft.filter((a) => a.availability === 'Awaiting Sign-off').length,
  awaitingParts: aircraft.filter((a) => a.availability === 'Awaiting Parts').length,
  restricted: aircraft.filter((a) => a.availability === 'Restricted').length,
}

export const atRiskFlights = flights.filter(
  (f) => (f.risk === 'At Risk' || f.risk === 'No Go') && f.status !== 'Completed',
)

export const todaysFlights = flights.filter((f) => f.date === '2026-07-15')

export const openDefects = defects.filter(
  (d) => d.status !== 'Closed' && d.status !== 'Cancelled',
)

export const defectSeverityBreakdown = {
  critical: openDefects.filter((d) => d.severity === 'Critical').length,
  significant: openDefects.filter((d) => d.severity === 'Significant').length,
  minor: openDefects.filter((d) => d.severity === 'Minor').length,
}

export const upcomingMaintenance = maintenanceEvents
  .filter((e) => e.status !== 'Completed')
  .sort((a, b) => a.plannedStart.localeCompare(b.plannedStart))
