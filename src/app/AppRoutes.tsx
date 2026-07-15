import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/shell/AppShell'

// Auth (standalone layouts)
import { LoginPage } from '@/pages/auth/LoginPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { InvitePage } from '@/pages/auth/InvitePage'

// Dashboard
import { DashboardPage } from '@/pages/dashboard/DashboardPage'

// Fleet planning
import { FleetAvailabilityPage } from '@/pages/fleet/FleetAvailabilityPage'
import { FleetPlansPage } from '@/pages/fleet/FleetPlansPage'
import { FleetPlanDetailPage } from '@/pages/fleet/FleetPlanDetailPage'
import { FleetPlanFormPage } from '@/pages/fleet/FleetPlanFormPage'
import { PlannedMaintenancePage } from '@/pages/fleet/PlannedMaintenancePage'

// Aircraft registry
import { AircraftListPage } from '@/pages/aircraft/AircraftListPage'
import { AircraftDetailPage } from '@/pages/aircraft/AircraftDetailPage'
import { AircraftFormPage } from '@/pages/aircraft/AircraftFormPage'
import { AircraftRecordsPage } from '@/pages/aircraft/AircraftRecordsPage'

// Flights
import { FlightsPage } from '@/pages/flights/FlightsPage'
import { FlightDetailPage } from '@/pages/flights/FlightDetailPage'
import { FlightFormPage } from '@/pages/flights/FlightFormPage'

// Defects
import { DefectsPage } from '@/pages/defects/DefectsPage'
import { DefectDetailPage } from '@/pages/defects/DefectDetailPage'
import { DefectReportPage } from '@/pages/defects/DefectReportPage'
import { DefectReviewPage } from '@/pages/defects/DefectReviewPage'

// Work orders
import { WorkOrdersPage } from '@/pages/work-orders/WorkOrdersPage'
import { WorkOrderDetailPage } from '@/pages/work-orders/WorkOrderDetailPage'
import { WorkOrderFormPage } from '@/pages/work-orders/WorkOrderFormPage'
import { MyWorkOrdersPage } from '@/pages/work-orders/MyWorkOrdersPage'
import { SignOffPage } from '@/pages/work-orders/SignOffPage'

// Sign-offs & records
import { SignOffsPage } from '@/pages/signoffs/SignOffsPage'
import { MaintenanceRecordsPage } from '@/pages/signoffs/MaintenanceRecordsPage'

// Inventory
import { PartsPage } from '@/pages/inventory/PartsPage'
import { StockPage } from '@/pages/inventory/StockPage'
import { TransactionsPage } from '@/pages/inventory/TransactionsPage'
import { RequestsPage } from '@/pages/inventory/RequestsPage'

// Accounts
import { AccountsPage } from '@/pages/accounts/AccountsPage'
import { AccountDetailPage } from '@/pages/accounts/AccountDetailPage'
import { CostCentresPage } from '@/pages/accounts/CostCentresPage'

// Reports
import { ReportsPage } from '@/pages/reports/ReportsPage'

// Administration
import { UsersPage } from '@/pages/admin/UsersPage'
import { UserDetailPage } from '@/pages/admin/UserDetailPage'
import { SecurityProfilesPage } from '@/pages/admin/SecurityProfilesPage'
import { SecurityProfileDetailPage } from '@/pages/admin/SecurityProfileDetailPage'
import { AuditLogsPage } from '@/pages/admin/AuditLogsPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'

// Not found
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Central route table. Every route renders a deliberate page; the
 * wildcard renders the shell-preserving not-found page.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Standalone auth layouts (no application shell) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/invite/:token" element={<InvitePage />} />

      {/* Application shell */}
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/fleet/availability" element={<FleetAvailabilityPage />} />
        <Route path="/fleet/plans" element={<FleetPlansPage />} />
        <Route path="/fleet/plans/new" element={<FleetPlanFormPage mode="new" />} />
        <Route path="/fleet/plans/:id" element={<FleetPlanDetailPage />} />
        <Route path="/fleet/plans/:id/edit" element={<FleetPlanFormPage mode="edit" />} />
        <Route path="/fleet/planned-maintenance" element={<PlannedMaintenancePage />} />

        <Route path="/aircraft" element={<AircraftListPage />} />
        <Route path="/aircraft/new" element={<AircraftFormPage mode="new" />} />
        <Route path="/aircraft/:id" element={<AircraftDetailPage />} />
        <Route path="/aircraft/:id/edit" element={<AircraftFormPage mode="edit" />} />
        <Route path="/aircraft/:id/records" element={<AircraftRecordsPage />} />

        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/flights/new" element={<FlightFormPage />} />
        <Route path="/flights/:id" element={<FlightDetailPage />} />

        <Route path="/defects" element={<DefectsPage />} />
        <Route path="/defects/new" element={<DefectReportPage />} />
        <Route path="/defects/review" element={<DefectReviewPage />} />
        <Route path="/defects/:id" element={<DefectDetailPage />} />

        <Route path="/work-orders" element={<WorkOrdersPage />} />
        <Route path="/work-orders/new" element={<WorkOrderFormPage />} />
        <Route path="/work-orders/mine" element={<MyWorkOrdersPage />} />
        <Route path="/work-orders/:id" element={<WorkOrderDetailPage />} />
        <Route path="/work-orders/:id/sign-off" element={<SignOffPage />} />

        <Route path="/sign-offs" element={<SignOffsPage />} />
        <Route path="/records" element={<MaintenanceRecordsPage />} />

        <Route path="/inventory/parts" element={<PartsPage />} />
        <Route path="/inventory/stock" element={<StockPage />} />
        <Route path="/inventory/transactions" element={<TransactionsPage />} />
        <Route path="/inventory/requests" element={<RequestsPage />} />

        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="/accounts/:id/cost-centres" element={<CostCentresPage />} />

        <Route path="/reports" element={<ReportsPage />} />

        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/users/:id" element={<UserDetailPage />} />
        <Route path="/admin/security-profiles" element={<SecurityProfilesPage />} />
        <Route path="/admin/security-profiles/:id" element={<SecurityProfileDetailPage />} />
        <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
