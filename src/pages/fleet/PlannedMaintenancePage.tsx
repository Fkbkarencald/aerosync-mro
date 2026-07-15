import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, ClipboardCheck, PackageSearch, PlaneTakeoff, Wrench } from 'lucide-react'
import { paths } from '@/app/paths'
import { maintenanceEvents, upcomingMaintenance } from '@/data'
import { fmtDateTime, fmtDuration } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/DataTable'
import type { MaintenanceEvent } from '@/data/types'

const GANTT_COLS = 14
const WINDOW_START = dayIndexOf('2026-07-13')
const TODAY_INDEX = dayIndexOf('2026-07-15')

const GANTT_DAYS = Array.from({ length: GANTT_COLS }, (_, i) => addDays('2026-07-13', i))

/** Day-of-epoch index for an ISO date/date-time string (UTC midnight basis). */
function dayIndexOf(iso: string): number {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return Date.UTC(y, m - 1, d) / 86_400_000
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  const t = Date.UTC(y, m - 1, d) + days * 86_400_000
  const date = new Date(t)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

function dayLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return `${dow} ${d}`
}

function barTone(e: MaintenanceEvent): 'blue' | 'red' | 'amber' | 'green' {
  if (e.status === 'In Progress') return 'blue'
  if (e.planningRisk === 'At Risk') return 'red'
  if (e.planningRisk === 'Monitor') return 'amber'
  return 'green'
}

/** Events whose window overlaps the 14-day gantt period at all. */
const ganttEvents = maintenanceEvents.filter((e) => {
  const start = dayIndexOf(e.plannedStart) - WINDOW_START
  const end = dayIndexOf(e.plannedEnd) - WINDOW_START
  return end >= 0 && start < GANTT_COLS
})

const inProgressCount = maintenanceEvents.filter((e) => e.status === 'In Progress').length
const next7DaysCount = maintenanceEvents.filter((e) => {
  const idx = dayIndexOf(e.plannedStart) - WINDOW_START
  return idx >= 2 && idx <= 9 && e.status !== 'Completed'
}).length
const totalScheduled = maintenanceEvents.filter((e) => e.status !== 'Completed').length

export function PlannedMaintenancePage() {
  const cols: Column<MaintenanceEvent>[] = [
    {
      key: 'aircraft',
      header: 'Aircraft',
      render: (e) => (
        <Link to={paths.aircraftDetail(e.aircraftId)} className="table-link ref">
          {e.aircraftId}
        </Link>
      ),
    },
    {
      key: 'check',
      header: 'Check type',
      render: (e) => (
        <>
          <span className="cell-main">{e.checkType}</span>
          <span className="cell-sub">{e.description}</span>
        </>
      ),
    },
    { key: 'start', header: 'Planned start', render: (e) => <span className="nowrap">{fmtDateTime(e.plannedStart)}</span> },
    { key: 'end', header: 'Planned completion', hideMobile: true, render: (e) => <span className="nowrap">{fmtDateTime(e.plannedEnd)}</span> },
    {
      key: 'downtime',
      header: 'Est. downtime',
      hideMobile: true,
      render: (e) => (Number.isInteger(e.downtimeHours) ? `${e.downtimeHours}h` : fmtDuration(e.downtimeHours * 60)),
    },
    { key: 'facility', header: 'Facility', hideMobile: true, render: (e) => e.facility },
    { key: 'risk', header: 'Planning risk', render: (e) => <StatusBadge status={e.planningRisk} /> },
    {
      key: 'wo',
      header: 'Work order',
      render: (e) =>
        e.workOrderId ? (
          <Link to={paths.workOrder(e.workOrderId)} className="table-link ref">
            {e.workOrderId}
          </Link>
        ) : (
          <span className="muted">—</span>
        ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Fleet planning' }, { label: 'Planned maintenance' }]}
        title="Planned maintenance"
        description="Scheduled checks and inspections across the fleet for the next 14 days, with downtime windows plotted against the operating calendar."
        actions={
          <>
            <button type="button" className="btn btn--primary">
              <Wrench size={15} aria-hidden="true" />
              Schedule check
            </button>
            <Link to={paths.fleetAvailability} className="btn btn--secondary">
              <PlaneTakeoff size={15} aria-hidden="true" />
              Availability board
            </Link>
          </>
        }
      />

      <div className="metric-grid">
        <MetricCard label="In progress" value={inProgressCount} tone="blue" icon={Wrench} meta="VH-MSA A-Check, Hangar 2" />
        <MetricCard label="Next 7 days" value={next7DaysCount} tone="amber" icon={CalendarClock} meta="checks starting 15–22 Jul" />
        <MetricCard
          label="Awaiting parts linkage"
          value={1}
          tone="orange"
          icon={PackageSearch}
          meta="VH-RXT recovery At Risk"
          to={paths.workOrder('WO-2026-0033')}
        />
        <MetricCard label="Total scheduled" value={totalScheduled} icon={ClipboardCheck} meta="open events across the fleet" />
      </div>

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">
            <CalendarClock size={16} aria-hidden="true" />
            14-day maintenance timeline
          </h2>
          <span className="card-sub">Mon 13 Jul – Sun 26 Jul, today highlighted</span>
        </div>
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <div className="gantt" style={{ ['--gantt-cols' as string]: GANTT_COLS } as CSSProperties}>
            <div className="gantt-header">
              <div />
              {GANTT_DAYS.map((d, i) => (
                <div className="gantt-day" key={d} data-today={i === TODAY_INDEX - WINDOW_START ? 'true' : undefined}>
                  {dayLabel(d)}
                </div>
              ))}
            </div>
            {ganttEvents.map((e) => {
              const rawStart = dayIndexOf(e.plannedStart) - WINDOW_START
              const rawEnd = dayIndexOf(e.plannedEnd) - WINDOW_START
              const clampedStart = Math.max(0, rawStart)
              // Ensure a same-day event still renders a visible bar (min 1 column span).
              const clampedEnd = Math.min(GANTT_COLS, Math.max(rawEnd, clampedStart + 1))
              const gridColStart = clampedStart + 2 // +1 for label column, +1 for 1-based grid lines
              const gridColEnd = clampedEnd + 2
              return (
                <div className="gantt-row" key={e.id}>
                  <div className="gantt-label">
                    <Link to={paths.aircraftDetail(e.aircraftId)} className="table-link ref cell-main">
                      {e.aircraftId}
                    </Link>
                    <div className="cell-sub">{e.checkType}</div>
                  </div>
                  {GANTT_DAYS.map((d, i) => (
                    <div
                      className="gantt-cell"
                      key={d}
                      data-today={i === TODAY_INDEX - WINDOW_START ? 'true' : undefined}
                      style={{ gridRow: 1, gridColumn: i + 2 }}
                    />
                  ))}
                  <div className="gantt-bar" data-tone={barTone(e)} style={{ gridColumn: `${gridColStart} / ${gridColEnd}` }}>
                    {e.checkType}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="card-footer">
          ELT battery replacement (VH-JDF, 28 Jul) and the VH-LWK phase inspection (4 Aug) fall outside this window — see the
          table below.
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">
            <ClipboardCheck size={16} aria-hidden="true" />
            Upcoming checks
          </h2>
          <span className="card-sub">All scheduled and in-progress maintenance events, ordered by start date</span>
        </div>
        <DataTable
          caption="Upcoming and in-progress maintenance events"
          columns={cols}
          rows={upcomingMaintenance}
          rowKey={(e) => e.id}
          rowTone={(e) => (e.planningRisk === 'At Risk' ? 'orange' : undefined)}
        />
      </section>
    </div>
  )
}
