import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  PlaneTakeoff,
  CalendarRange,
  Route as RouteIcon,
  TriangleAlert,
  Wrench,
  ClipboardCheck,
  Plane,
  CalendarClock,
  FileCheck2,
  Archive,
  Package,
  Boxes,
  ArrowLeftRight,
  Inbox,
  Building2,
  BarChart3,
  Users,
  ShieldCheck,
  ScrollText,
  Settings,
} from 'lucide-react'
import { paths } from './paths'
import { myWorkOrders, reviewQueueDefects, openWorkOrders } from '@/data'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** Extra path prefixes that keep this item highlighted. */
  match?: string[]
  count?: number
  countTone?: 'red' | 'default'
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/**
 * Grouped sidebar navigation. Permission filtering is intentionally
 * not applied in the design preview — every module is reachable.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: paths.dashboard, icon: LayoutDashboard }],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Fleet Availability', to: paths.fleetAvailability, icon: PlaneTakeoff },
      { label: 'Fleet Plans', to: paths.fleetPlans, icon: CalendarRange },
      { label: 'Flights', to: paths.flights, icon: RouteIcon },
      {
        label: 'Defects',
        to: paths.defects,
        icon: TriangleAlert,
        match: [paths.defectReview],
        count: reviewQueueDefects.length,
        countTone: 'red',
      },
      {
        label: 'Work Orders',
        to: paths.workOrders,
        icon: Wrench,
        count: openWorkOrders.length,
      },
      {
        label: 'My Assignments',
        to: paths.myWorkOrders,
        icon: ClipboardCheck,
        count: myWorkOrders().length,
      },
    ],
  },
  {
    label: 'Maintenance',
    items: [
      { label: 'Aircraft Registry', to: paths.aircraftList, icon: Plane },
      { label: 'Planned Maintenance', to: paths.plannedMaintenance, icon: CalendarClock },
      { label: 'Sign-offs', to: paths.signOffs, icon: FileCheck2 },
      { label: 'Maintenance Records', to: paths.maintenanceRecords, icon: Archive },
    ],
  },
  {
    label: 'Supply & Commercial',
    items: [
      { label: 'Parts Catalogue', to: paths.inventoryParts, icon: Package },
      { label: 'Stock Levels', to: paths.inventoryStock, icon: Boxes },
      { label: 'Inventory Transactions', to: paths.inventoryTransactions, icon: ArrowLeftRight },
      { label: 'Part Requests', to: paths.inventoryRequests, icon: Inbox },
      { label: 'Accounts', to: paths.accounts, icon: Building2 },
      { label: 'Reports', to: paths.reports, icon: BarChart3 },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Users', to: paths.adminUsers, icon: Users },
      { label: 'Security Profiles', to: paths.adminProfiles, icon: ShieldCheck },
      { label: 'Audit Logs', to: paths.adminAuditLogs, icon: ScrollText },
      { label: 'Settings', to: paths.adminSettings, icon: Settings },
    ],
  },
]

/** True when the nav item should render as the active route. */
export function isNavActive(item: NavItem, pathname: string): boolean {
  if (item.to === '/') return pathname === '/'
  const targets = [item.to, ...(item.match ?? [])]
  // "My Assignments" is nested under /work-orders — keep matches exact-first
  if (pathname === item.to) return true
  return targets.some((t) => {
    if (t !== '/' && pathname.startsWith(`${t}/`)) {
      // Avoid /work-orders matching /work-orders/mine (owned by My Assignments)
      if (t === paths.workOrders && pathname.startsWith(paths.myWorkOrders)) return false
      return true
    }
    return pathname === t
  })
}
