/**
 * Status → tone mapping.
 *
 * Documented colour conventions (docs/15-status-workflows.md):
 *   Green:  Available, Clear, Serviceable, Closed
 *   Amber:  Monitor, Restricted, Assigned
 *   Orange: At Risk, Awaiting Parts / Inspection / Sign-off
 *   Red:    AOG, No Go, Critical, Unserviceable
 *   Grey:   Cancelled, Archived, Inactive
 *   Blue:   Open, Reported, Informational, In Progress
 *
 * Meaning is never carried by colour alone — StatusBadge always
 * renders the label text alongside the tone.
 */

export type Tone = 'green' | 'amber' | 'orange' | 'red' | 'grey' | 'blue'

const TONE_BY_STATUS: Record<string, Tone> = {
  // Availability / operational
  'Available': 'green',
  'Assigned': 'amber',
  'Restricted': 'amber',
  'Under Maintenance': 'blue',
  'AOG': 'red',
  'Planned Maintenance': 'blue',
  'Awaiting Parts': 'orange',
  'Awaiting Inspection': 'orange',
  'Awaiting Sign-off': 'orange',

  // Aircraft registry
  'Serviceable': 'green',
  'Unserviceable': 'red',

  // Defects
  'Reported': 'blue',
  'Under Review': 'blue',
  'Deferred': 'amber',
  'Work Order Created': 'blue',
  'Rectified': 'green',
  'Closed': 'green',
  'Cancelled': 'grey',

  // Work orders
  'Open': 'blue',
  'In Progress': 'blue',
  'Ready for Sign-off': 'orange',

  // Flight risk
  'Clear': 'green',
  'Monitor': 'amber',
  'At Risk': 'orange',
  'No Go': 'red',

  // Severity
  'Minor': 'blue',
  'Significant': 'orange',
  'Critical': 'red',

  // Priority
  'Routine': 'grey',
  'Urgent': 'orange',

  // Flights
  'Scheduled': 'blue',
  'Boarding': 'blue',
  'Departed': 'green',
  'Completed': 'green',
  'Delayed': 'orange',

  // Fleet plans
  'Draft': 'grey',
  'Published': 'green',
  'Archived': 'grey',

  // Users
  'Active': 'green',
  'Suspended': 'red',
  'Invited': 'blue',

  // Inventory / stock
  'In Stock': 'green',
  'Low Stock': 'orange',
  'Out of Stock': 'red',
  'Quarantine': 'amber',
  'Backordered': 'orange',
  'Approved': 'blue',
  'Picked': 'amber',
  'Issued': 'green',
  'In Transit': 'amber',

  // Transactions
  'Issue': 'blue',
  'Return': 'green',
  'Transfer': 'amber',
  'Adjustment': 'grey',
  'Receipt': 'green',

  // Accounts / billing
  'Current': 'green',
  'Invoiced': 'blue',
  'Overdue': 'red',
  'Inactive': 'grey',
  'Internal': 'grey',

  // Sign-off / audit / inspection
  'Released': 'green',
  'Released with Limitations': 'amber',
  'Verified': 'green',
  'Complete': 'green',
  'Pending Review': 'orange',
  'Pending': 'orange',
  'Passed': 'green',
  'Not Required': 'grey',

  // Audit outcomes
  'Success': 'green',
  'Denied': 'red',
  'Failed': 'red',

  // Planning / generic
  'On Track': 'green',
  'Confirmed': 'green',
  'Tentative': 'grey',
  'Informational': 'blue',
}

/** Resolve the UI tone for any documented status label. */
export function toneFor(status: string): Tone {
  return TONE_BY_STATUS[status] ?? 'grey'
}
