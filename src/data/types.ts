/**
 * AeroSync MRO — mock-data entity model.
 *
 * One typed, internally consistent dataset drives the whole design
 * preview. Route params use human-readable reference numbers
 * (VH-OYU, DEF-2026-0042, WO-2026-0031 …) so every cross-link in the
 * UI resolves to a real page.
 */

// ---- Status vocabularies (docs/15-status-workflows.md) -----------

export type AvailabilityStatus =
  | 'Available'
  | 'Assigned'
  | 'Restricted'
  | 'Under Maintenance'
  | 'AOG'
  | 'Planned Maintenance'
  | 'Awaiting Parts'
  | 'Awaiting Sign-off'

export type AircraftStatus =
  | 'Serviceable'
  | 'Unserviceable'
  | 'Under Maintenance'
  | 'AOG'
  | 'Restricted'

export type DefectStatus =
  | 'Reported'
  | 'Under Review'
  | 'Deferred'
  | 'Work Order Created'
  | 'Rectified'
  | 'Closed'
  | 'Cancelled'

export type DefectSeverity = 'Minor' | 'Significant' | 'Critical'
export type DefectCategory = 'Technical' | 'Cabin' | 'Cosmetic'
export type DefectSource = 'Pilot Report' | 'Line Inspection' | 'Scheduled Check' | 'Cabin Crew'

export type WorkOrderStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Awaiting Parts'
  | 'Awaiting Inspection'
  | 'Ready for Sign-off'
  | 'Closed'
  | 'Cancelled'

export type WorkOrderPriority = 'Routine' | 'Urgent' | 'AOG'
export type PartsState = 'Not Required' | 'Requested' | 'Issued' | 'Backordered'

export type FlightRisk = 'Clear' | 'Monitor' | 'At Risk' | 'No Go'
export type FlightStatus = 'Scheduled' | 'Boarding' | 'Departed' | 'Completed' | 'Cancelled' | 'Delayed'

export type FleetPlanStatus = 'Draft' | 'Published' | 'Archived'

export type UserStatus = 'Active' | 'Suspended' | 'Invited'

export type Role =
  | 'Admin'
  | 'Fleet Planner'
  | 'Maintenance Controller'
  | 'Engineer'
  | 'Licensed Engineer'
  | 'Pilot'
  | 'Stores Officer'
  | 'Accounts Officer'
  | 'Auditor'

export type SignOffType = 'Line Release' | 'Return to Service' | 'Inspection'
export type ReleaseStatus = 'Released' | 'Released with Limitations'

export type StockState = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Quarantine'
export type TransactionType = 'Issue' | 'Return' | 'Transfer' | 'Adjustment' | 'Receipt'
export type RequestUrgency = 'AOG' | 'Urgent' | 'Routine'
export type RequestStatus = 'Open' | 'Approved' | 'Picked' | 'In Transit' | 'Issued' | 'Backordered' | 'Cancelled'

export type AccountType = 'Operator' | 'Customer' | 'Internal' | 'Supplier'
export type BillingState = 'Current' | 'Invoiced' | 'Overdue' | 'Internal'

export type AuditOutcome = 'Success' | 'Denied' | 'Failed'

// ---- Shared shapes -------------------------------------------------

export interface TimelineEvent {
  at: string // ops-local ISO "2026-07-15T14:05"
  title: string
  detail?: string
  byUserId?: string
  tone?: 'green' | 'amber' | 'orange' | 'red' | 'grey' | 'blue'
  refLink?: { label: string; to: string }
}

export interface Attachment {
  name: string
  kind: 'photo' | 'document'
  size: string // "1.2 MB"
  uploadedByUserId: string
  uploadedAt: string
}

// ---- Entities --------------------------------------------------------

export interface Aircraft {
  /** Registration doubles as the route id, e.g. "VH-OYU". */
  id: string
  registration: string
  manufacturer: string
  model: string
  typeCode: string // "AT76"
  serialNumber: string
  yearOfManufacture: number
  base: string // home base code, e.g. "MEL"
  location: string // current location code
  operator: string
  accountId: string
  status: AircraftStatus
  availability: AvailabilityStatus
  availabilityReason: string
  maintenanceRisk: FlightRisk
  totalHours: number
  totalCycles: number
  seats: number
  engines: string
  configurationNotes: string
  nextFlightId?: string
  nextMaintenance?: { label: string; date: string; eventId: string }
  assignedPlanId?: string
  restrictions: string[]
}

export interface Flight {
  /** Flight number doubles as the route id, e.g. "ASR-214". */
  id: string
  origin: string
  destination: string
  date: string // "2026-07-15"
  schedDep: string
  schedArr: string
  estDep?: string
  estArr?: string
  aircraftId?: string
  status: FlightStatus
  risk: FlightRisk
  riskNote?: string
  turnaroundMins?: number
  nextFlightId?: string
  maintenanceWindow?: { start: string; end: string }
  captainUserId?: string
  firstOfficer?: string
  controllerNotes?: string
  planId?: string
  events?: TimelineEvent[]
}

export interface Deferral {
  reason: string
  until: string
  reference: string
  approvedByUserId: string
}

export interface Defect {
  /** Reference doubles as the route id, e.g. "DEF-2026-0042". */
  id: string
  aircraftId: string
  flightId?: string
  title: string
  description: string
  locationOnAircraft: string
  ataChapter: string // "32 — Landing Gear"
  severity: DefectSeverity
  category: DefectCategory
  source: DefectSource
  status: DefectStatus
  reportedByUserId: string
  reportedAt: string
  reportedLocation: string
  reviewedByUserId?: string
  reviewNotes?: string
  deferral?: Deferral
  workOrderId?: string
  closedAt?: string
  attachments: Attachment[]
  timeline: TimelineEvent[]
  availabilityImpact: string
  flightImpact?: string
}

export interface WorkOrderTask {
  seq: number
  title: string
  done: boolean
  completedByUserId?: string
  completedAt?: string
  note?: string
  manhours?: number
}

export interface LabourEntry {
  userId: string
  date: string
  hours: number
  note: string
}

export interface EngineerNote {
  byUserId: string
  at: string
  text: string
}

export interface WorkOrder {
  /** Reference doubles as the route id, e.g. "WO-2026-0031". */
  id: string
  aircraftId: string
  defectId?: string
  title: string
  description: string
  priority: WorkOrderPriority
  status: WorkOrderStatus
  assignedToUserId?: string
  teamUserIds: string[]
  createdByUserId: string
  createdAt: string
  dueAt: string
  scheduledStart?: string
  scheduledEnd?: string
  estimatedManhours: number
  actualManhours: number
  partsState: PartsState
  partRequestIds: string[]
  inspection: {
    required: boolean
    type?: string
    status?: 'Pending' | 'Passed' | 'Not Required'
    inspectorUserId?: string
    note?: string
  }
  signOffId?: string
  tasks: WorkOrderTask[]
  labour: LabourEntry[]
  notes: EngineerNote[]
  attachments: Attachment[]
  timeline: TimelineEvent[]
  costCentreCode?: string
}

export interface SignOff {
  /** Reference doubles as the route id, e.g. "SO-2026-0018". */
  id: string
  aircraftId: string
  workOrderId: string
  type: SignOffType
  signedByUserId: string
  licenceNumber: string
  signedAt: string
  statement: string
  limitations?: string
  releaseStatus: ReleaseStatus
  auditState: 'Verified' | 'Complete' | 'Pending Review'
}

export interface MaintenanceRecord {
  id: string
  aircraftId: string
  workOrderId: string
  defectId?: string
  recordType: 'Corrective' | 'Inspection' | 'Scheduled'
  summary: string
  performedByUserId: string
  certifiedByUserId: string
  performedAt: string
  totalManhours: number
  partsUsedSummary: string
  reference: string // release reference printed on record
}

export interface User {
  /** e.g. "USR-014" */
  id: string
  name: string
  email: string
  role: Role
  title: string
  status: UserStatus
  securityProfileIds: string[]
  accountId: string
  base: string
  phone: string
  licenceNumber?: string
  lastLoginAt?: string
  lastLoginSource?: string
  createdAt: string
}

export interface SecurityProfile {
  /** e.g. "SP-006" */
  id: string
  name: string
  description: string
  typicalRole: Role
  isSystem: boolean
  updatedAt: string
  updatedByUserId: string
  /** permission codes, e.g. "work_order.update" */
  permissions: string[]
}

export interface PermissionDomain {
  key: string // "work_order"
  label: string // "Work orders"
  description: string
  actions: { key: string; label: string }[]
}

export interface Part {
  /** Part number doubles as the id, e.g. "LG-4402-113". */
  id: string
  description: string
  manufacturer: string
  category: string
  ataChapter: string
  effectivity: string // "ATR 72-600", "All types" …
  unitOfMeasure: 'Each' | 'Metre' | 'Litre' | 'Kit'
  reorderLevel: number
  stockState: StockState
  unitCost: number
  active: boolean
}

export interface StockLevel {
  partId: string
  warehouse: string
  bin: string
  serviceable: number
  unserviceable: number
  reserved: number
  lowStock: boolean
}

export interface InventoryTransaction {
  /** e.g. "ITX-2026-0210" */
  id: string
  type: TransactionType
  partId: string
  quantity: number
  workOrderId?: string
  aircraftId?: string
  performedByUserId: string
  performedAt: string
  fromLocation: string
  toLocation: string
  reference: string
  notes?: string
}

export interface PartRequest {
  /** e.g. "PR-2026-0061" */
  id: string
  workOrderId: string
  aircraftId: string
  partId: string
  quantity: number
  urgency: RequestUrgency
  requestedByUserId: string
  requestedAt: string
  status: RequestStatus
  requiredBy: string
  note?: string
}

export interface CostCentre {
  code: string
  name: string
  description: string
  spend: number
  budget: number
  aircraftIds: string[]
  workOrderIds: string[]
  status: 'Active' | 'Inactive'
}

export interface Account {
  /** e.g. "ACC-001" */
  id: string
  name: string
  code: string
  type: AccountType
  status: 'Active' | 'Inactive'
  primaryContact: { name: string; title: string; email: string; phone: string }
  billingAddress: string
  billingState: BillingState
  currentCostMtd: number
  aircraftIds: string[]
  costCentres: CostCentre[]
  notes: string
  since: string
  activity: TimelineEvent[]
}

export interface AuditLogEntry {
  id: string
  at: string
  userId: string
  role: Role
  action: string // "signoff.perform"
  entityType: string // "Work order"
  entityRef: string // "WO-2026-0031"
  entityLink?: string // resolved route
  summary: string
  before?: Record<string, string>
  after?: Record<string, string>
  sourceIp: string
  outcome: AuditOutcome
}

export interface FleetPlanRevision {
  version: number
  at: string
  byUserId: string
  note: string
}

export interface PlanConflict {
  severity: 'Warning' | 'Critical'
  message: string
  aircraftId?: string
  flightId?: string
}

export interface FleetPlan {
  /** e.g. "FP-2026-0715" */
  id: string
  name: string
  status: FleetPlanStatus
  startDate: string
  endDate: string
  base: string
  description: string
  createdByUserId: string
  approvedByUserId?: string
  approvedAt?: string
  updatedAt: string
  aircraftIds: string[]
  flightIds: string[]
  revisions: FleetPlanRevision[]
  conflicts: PlanConflict[]
  notes?: string
}

export interface MaintenanceEvent {
  /** e.g. "ME-2026-041" */
  id: string
  aircraftId: string
  checkType: string
  description: string
  plannedStart: string
  plannedEnd: string
  downtimeHours: number
  facility: string
  planningRisk: 'On Track' | 'Monitor' | 'At Risk'
  status: 'Scheduled' | 'In Progress' | 'Completed'
  workOrderId?: string
}

export interface AppNotification {
  id: string
  tone: 'red' | 'orange' | 'blue' | 'green'
  kind: 'aog' | 'defect' | 'signoff' | 'parts' | 'plan'
  text: string
  strong: string
  at: string
  to: string
}
