/**
 * Central route registry. Every internal link in the app is built
 * from these helpers so cross-links can never drift from the route
 * definitions in AppRoutes.tsx.
 */
export const paths = {
  dashboard: '/',

  // Auth
  login: '/login',
  forgotPassword: '/forgot-password',
  invite: (token: string) => `/invite/${token}`,

  // Fleet planning
  fleetAvailability: '/fleet/availability',
  fleetPlans: '/fleet/plans',
  fleetPlanNew: '/fleet/plans/new',
  fleetPlan: (id: string) => `/fleet/plans/${id}`,
  fleetPlanEdit: (id: string) => `/fleet/plans/${id}/edit`,
  plannedMaintenance: '/fleet/planned-maintenance',

  // Aircraft registry
  aircraftList: '/aircraft',
  aircraftNew: '/aircraft/new',
  aircraftDetail: (id: string) => `/aircraft/${id}`,
  aircraftEdit: (id: string) => `/aircraft/${id}/edit`,
  aircraftRecords: (id: string) => `/aircraft/${id}/records`,

  // Flights
  flights: '/flights',
  flightNew: '/flights/new',
  flight: (id: string) => `/flights/${id}`,

  // Defects
  defects: '/defects',
  defectNew: '/defects/new',
  defectReview: '/defects/review',
  defect: (id: string) => `/defects/${id}`,

  // Work orders
  workOrders: '/work-orders',
  workOrderNew: '/work-orders/new',
  myWorkOrders: '/work-orders/mine',
  workOrder: (id: string) => `/work-orders/${id}`,
  workOrderSignOff: (id: string) => `/work-orders/${id}/sign-off`,

  // Sign-offs & records
  signOffs: '/sign-offs',
  maintenanceRecords: '/records',

  // Inventory
  inventoryParts: '/inventory/parts',
  inventoryStock: '/inventory/stock',
  inventoryTransactions: '/inventory/transactions',
  inventoryRequests: '/inventory/requests',

  // Accounts
  accounts: '/accounts',
  account: (id: string) => `/accounts/${id}`,
  accountCostCentres: (id: string) => `/accounts/${id}/cost-centres`,

  // Reports
  reports: '/reports',

  // Administration
  adminUsers: '/admin/users',
  adminUser: (id: string) => `/admin/users/${id}`,
  adminProfiles: '/admin/security-profiles',
  adminProfile: (id: string) => `/admin/security-profiles/${id}`,
  adminAuditLogs: '/admin/audit-logs',
  adminSettings: '/admin/settings',
} as const
