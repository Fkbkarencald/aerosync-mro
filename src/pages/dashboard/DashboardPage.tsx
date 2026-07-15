import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  FileCheck2,
  Inbox,
  OctagonAlert,
  PlaneTakeoff,
  Route as RouteIcon,
  ScrollText,
  TriangleAlert,
  Wrench,
} from 'lucide-react'
import { paths } from '@/app/paths'
import {
  atRiskFlights,
  auditLogs,
  availabilityTrend,
  currentUser,
  defectSeverityBreakdown,
  fleetSummary,
  maintenanceRecords,
  myWorkOrders,
  openWorkOrders,
  reviewQueueDefects,
  shortName,
  upcomingMaintenance,
} from '@/data'
import { fmtDateTime, fmtDayMonth, fmtRelative, fmtTime } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { PriorityBadge, RiskBadge, SeverityBadge, StatusBadge } from '@/components/ui/Badge'
import { DonutChart, StackedBarChart } from '@/components/ui/Charts'
import { ProgressBar } from '@/components/ui/Misc'

function woProgress(tasksDone: number, tasksTotal: number): number {
  return tasksTotal === 0 ? 0 : (tasksDone / tasksTotal) * 100
}

export function DashboardPage() {
  const mine = myWorkOrders().filter((w) => w.status !== 'Closed' && w.status !== 'Cancelled')
  const recentMaintenance = [...maintenanceRecords].sort((a, b) => b.performedAt.localeCompare(a.performedAt)).slice(0, 4)
  const recentAudit = auditLogs.slice(0, 5)

  return (
    <div className="page">
      <PageHeader
        title="Operations dashboard"
        description={`Good afternoon, ${currentUser.name.split(' ')[0]}. Fleet position for Wednesday 15 July — 1 aircraft AOG, 1 release pending, 4 defects awaiting review.`}
        actions={
          <>
            <Link to={paths.defectNew} className="btn btn--secondary">
              <TriangleAlert size={15} aria-hidden="true" />
              Report defect
            </Link>
            <Link to={paths.fleetAvailability} className="btn btn--primary">
              <PlaneTakeoff size={15} aria-hidden="true" />
              Availability board
            </Link>
          </>
        }
      />

      {/* Fleet position metrics */}
      <div className="metric-grid">
        <MetricCard
          label="Available"
          value={fleetSummary.available}
          tone="green"
          icon={PlaneTakeoff}
          meta={`of ${fleetSummary.total} aircraft`}
          to={paths.fleetAvailability}
        />
        <MetricCard
          label="Assigned"
          value={fleetSummary.assigned}
          tone="amber"
          icon={RouteIcon}
          meta="operating today’s schedule"
          to={paths.fleetAvailability}
        />
        <MetricCard
          label="AOG"
          value={fleetSummary.aog}
          tone="red"
          icon={OctagonAlert}
          meta="VH-RXT at MQL — pump inbound"
          to={paths.workOrder('WO-2026-0033')}
        />
        <MetricCard
          label="Awaiting sign-off"
          value={fleetSummary.awaitingSignOff}
          tone="orange"
          icon={FileCheck2}
          meta="VH-TRW — needed by 17:30"
          to={paths.workOrderSignOff('WO-2026-0035')}
        />
        <MetricCard
          label="At-risk flights"
          value={atRiskFlights.length}
          tone="orange"
          icon={TriangleAlert}
          meta="next: ASR-241 dep 18:40"
          to={paths.flights}
        />
        <MetricCard
          label="Defects to review"
          value={reviewQueueDefects.length}
          tone="blue"
          icon={Inbox}
          meta="oldest reported 15:48 yesterday"
          to={paths.defectReview}
        />
        <MetricCard
          label="Open work orders"
          value={openWorkOrders.length}
          tone="blue"
          icon={Wrench}
          meta="2 blocked on parts"
          to={paths.workOrders}
        />
        <MetricCard
          label="Assigned to you"
          value={mine.length}
          icon={ClipboardCheck}
          meta="1 inspection · 1 sign-off · 1 check"
          to={paths.myWorkOrders}
        />
      </div>

      <div className="dash-grid">
        {/* Main column */}
        <div className="dash-col">
          {/* At-risk flights */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <TriangleAlert size={16} aria-hidden="true" />
                Flights needing attention
              </h2>
              <div className="card-actions">
                <Link to={paths.flights} className="btn btn--ghost btn--sm">
                  All flights
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="row-list">
              {atRiskFlights.map((f) => (
                <div className="row-list-item" key={f.id}>
                  <div className="row-main">
                    <div className="row-title">
                      <Link to={paths.flight(f.id)} className="table-link ref">
                        {f.id}
                      </Link>
                      <span className="text-secondary">
                        {f.origin} → {f.destination}
                      </span>
                      <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                        dep {fmtDayMonth(f.schedDep)}, {fmtTime(f.schedDep)}
                      </span>
                    </div>
                    <div className="row-sub">{f.riskNote}</div>
                  </div>
                  <div className="row-end">
                    {f.aircraftId ? (
                      <Link to={paths.aircraftDetail(f.aircraftId)} className="chip ref">
                        {f.aircraftId}
                      </Link>
                    ) : (
                      <span className="chip chip--alert">Unassigned</span>
                    )}
                    <RiskBadge risk={f.risk} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Defect review queue */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Inbox size={16} aria-hidden="true" />
                New defects requiring review
              </h2>
              <div className="card-actions">
                <Link to={paths.defectReview} className="btn btn--ghost btn--sm">
                  Open review queue
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="row-list">
              {reviewQueueDefects.map((d) => (
                <div className="row-list-item" key={d.id}>
                  <div className="row-main">
                    <div className="row-title">
                      <Link to={paths.defect(d.id)} className="table-link ref">
                        {d.id}
                      </Link>
                      <span>{d.title}</span>
                    </div>
                    <div className="row-sub">
                      <Link to={paths.aircraftDetail(d.aircraftId)} className="ref">
                        {d.aircraftId}
                      </Link>{' '}
                      · reported {fmtRelative(d.reportedAt)} by {shortName(d.reportedByUserId)} · {d.ataChapter}
                    </div>
                  </div>
                  <div className="row-end">
                    <SeverityBadge severity={d.severity} />
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Availability trend + severity breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-5)' }}>
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Seven-day fleet availability</h2>
              </div>
              <div className="card-body">
                <StackedBarChart
                  ariaLabel="Stacked daily counts of available, maintenance and AOG aircraft across the past seven days"
                  labels={availabilityTrend.map((d) => d.label)}
                  series={[
                    { label: 'Available / assigned', tone: 'green', values: availabilityTrend.map((d) => d.available) },
                    { label: 'Maintenance & awaiting', tone: 'amber', values: availabilityTrend.map((d) => d.maintenance) },
                    { label: 'AOG', tone: 'red', values: availabilityTrend.map((d) => d.aog) },
                  ]}
                />
              </div>
              <div className="card-footer">
                Dip on Wed reflects the VH-MSA A-Check plus the VH-RXT grounding.
              </div>
            </section>

            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Open defects by severity</h2>
              </div>
              <div className="card-body">
                <DonutChart
                  ariaLabel="Open defects by severity: 1 critical, 4 significant and 4 minor"
                  centreValue={String(
                    defectSeverityBreakdown.critical + defectSeverityBreakdown.significant + defectSeverityBreakdown.minor,
                  )}
                  centreLabel="Open"
                  segments={[
                    { label: 'Critical', value: defectSeverityBreakdown.critical, tone: 'red' },
                    { label: 'Significant', value: defectSeverityBreakdown.significant, tone: 'orange' },
                    { label: 'Minor', value: defectSeverityBreakdown.minor, tone: 'blue' },
                  ]}
                />
              </div>
              <div className="card-footer">
                <Link to={paths.defects}>Review the defect log</Link>
              </div>
            </section>
          </div>
        </div>

        {/* Side column */}
        <div className="dash-col">
          {/* My work orders */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <ClipboardCheck size={16} aria-hidden="true" />
                Your assignments
              </h2>
              <div className="card-actions">
                <Link to={paths.myWorkOrders} className="btn btn--ghost btn--sm">
                  View all
                </Link>
              </div>
            </div>
            <div className="row-list">
              {mine.map((w) => (
                <div className="row-list-item" key={w.id}>
                  <div className="row-main">
                    <div className="row-title">
                      <Link to={paths.workOrder(w.id)} className="table-link ref">
                        {w.id}
                      </Link>
                      <PriorityBadge priority={w.priority} />
                    </div>
                    <div className="row-sub">
                      {w.title} · <span className="ref">{w.aircraftId}</span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <ProgressBar
                        value={woProgress(w.tasks.filter((t) => t.done).length, w.tasks.length)}
                        tone={w.status === 'Ready for Sign-off' ? 'orange' : undefined}
                        label={`${w.tasks.filter((t) => t.done).length} of ${w.tasks.length} tasks complete`}
                      />
                    </div>
                  </div>
                  <div className="row-end">
                    <StatusBadge status={w.status} />
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <FileCheck2 size={14} aria-hidden="true" />
              <span>
                VH-TRW release due 17:30 —{' '}
                <Link to={paths.workOrderSignOff('WO-2026-0035')}>open sign-off</Link>
              </span>
            </div>
          </section>

          {/* Upcoming planned maintenance */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <CalendarClock size={16} aria-hidden="true" />
                Upcoming planned maintenance
              </h2>
              <div className="card-actions">
                <Link to={paths.plannedMaintenance} className="btn btn--ghost btn--sm">
                  Calendar
                </Link>
              </div>
            </div>
            <div className="row-list">
              {upcomingMaintenance.slice(0, 5).map((e) => (
                <div className="row-list-item" key={e.id}>
                  <div className="row-main">
                    <div className="row-title">
                      <Link to={paths.aircraftDetail(e.aircraftId)} className="table-link ref">
                        {e.aircraftId}
                      </Link>
                      <span>{e.checkType}</span>
                    </div>
                    <div className="row-sub">
                      {fmtDateTime(e.plannedStart)} · {e.facility}
                    </div>
                  </div>
                  <div className="row-end">
                    <StatusBadge status={e.status === 'In Progress' ? 'In Progress' : e.planningRisk} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent maintenance activity */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Wrench size={16} aria-hidden="true" />
                Recent maintenance activity
              </h2>
            </div>
            <div className="row-list">
              {recentMaintenance.map((r) => (
                <div className="row-list-item" key={r.id}>
                  <div className="row-main">
                    <div className="row-title" style={{ fontSize: 'var(--fs-md)' }}>
                      <Link to={paths.workOrder(r.workOrderId)} className="table-link ref">
                        {r.workOrderId}
                      </Link>
                      <span className="ref muted">{r.aircraftId}</span>
                    </div>
                    <div className="row-sub">{r.summary}</div>
                    <div className="row-sub" style={{ marginTop: 1 }}>
                      {fmtDateTime(r.performedAt)} · certified {shortName(r.certifiedByUserId)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <Link to={paths.maintenanceRecords}>All maintenance records</Link>
            </div>
          </section>

          {/* Recent audit activity */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <ScrollText size={16} aria-hidden="true" />
                Recent audit activity
              </h2>
              <div className="card-actions">
                <Link to={paths.adminAuditLogs} className="btn btn--ghost btn--sm">
                  Audit logs
                </Link>
              </div>
            </div>
            <div className="row-list">
              {recentAudit.map((a) => (
                <div className="row-list-item" key={a.id} style={{ alignItems: 'flex-start' }}>
                  <div className="row-main">
                    <div className="row-sub" style={{ marginTop: 0 }}>
                      <code className="ref" style={{ color: 'var(--text-secondary)' }}>{a.action}</code> ·{' '}
                      {shortName(a.userId)} · {fmtRelative(a.at)}
                    </div>
                    <div style={{ fontSize: 'var(--fs-md)', marginTop: 2 }}>{a.summary}</div>
                  </div>
                  <div className="row-end">
                    <StatusBadge status={a.outcome} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
