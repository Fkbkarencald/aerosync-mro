import type { AppNotification } from './types'

/** Seven-day fleet availability summary (counts of 10 tails, by day). */
export interface AvailabilityDay {
  date: string
  label: string
  available: number
  maintenance: number // planned/hangar + awaiting states
  aog: number
}

export const availabilityTrend: AvailabilityDay[] = [
  { date: '2026-07-09', label: 'Thu', available: 9, maintenance: 1, aog: 0 },
  { date: '2026-07-10', label: 'Fri', available: 9, maintenance: 1, aog: 0 },
  { date: '2026-07-11', label: 'Sat', available: 8, maintenance: 2, aog: 0 },
  { date: '2026-07-12', label: 'Sun', available: 8, maintenance: 2, aog: 0 },
  { date: '2026-07-13', label: 'Mon', available: 8, maintenance: 2, aog: 0 },
  { date: '2026-07-14', label: 'Tue', available: 7, maintenance: 3, aog: 0 },
  { date: '2026-07-15', label: 'Wed', available: 5, maintenance: 4, aog: 1 },
]

export const notifications: AppNotification[] = [
  {
    id: 'N-1',
    tone: 'red',
    kind: 'aog',
    strong: 'VH-RXT AOG at MQL',
    text: 'No.2 hydraulic pump failure — recovery pump in transit, install 16 Jul 08:00.',
    at: '2026-07-15T08:15',
    to: '/work-orders/WO-2026-0033',
  },
  {
    id: 'N-2',
    tone: 'orange',
    kind: 'signoff',
    strong: 'WO-2026-0035 ready for sign-off',
    text: 'VH-TRW landing light — certification required by 17:30 for ASR-241.',
    at: '2026-07-15T10:35',
    to: '/work-orders/WO-2026-0035/sign-off',
  },
  {
    id: 'N-3',
    tone: 'blue',
    kind: 'defect',
    strong: 'New defect DEF-2026-0048',
    text: 'VH-BHV navigation database expired — charter ASR-291 tonight.',
    at: '2026-07-15T11:32',
    to: '/defects/DEF-2026-0048',
  },
  {
    id: 'N-4',
    tone: 'orange',
    kind: 'parts',
    strong: 'Backorder update — PR-2026-0058',
    text: 'Radar R/T unit for VH-LWK: supplier ETA revised to 18 Jul.',
    at: '2026-07-13T10:20',
    to: '/inventory/requests',
  },
  {
    id: 'N-5',
    tone: 'green',
    kind: 'plan',
    strong: 'FP-2026-0715 revised (rev 4)',
    text: 'ASR-226 cancelled, ASR-258 unassigned — planner review complete.',
    at: '2026-07-15T08:30',
    to: '/fleet/plans/FP-2026-0715',
  },
]
