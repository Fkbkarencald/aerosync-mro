import { Link, useParams } from 'react-router-dom'
import { CalendarRange, MapPin, PlaneTakeoff, Route as RouteIcon, ShieldAlert, TriangleAlert, Wrench } from 'lucide-react'
import { paths } from '@/app/paths'
import {
  getAircraft,
  getFlight,
  openDefectsForAircraft,
  openWorkOrdersForAircraft,
} from '@/data'
import { fmtDateTime, fmtDuration, fmtTime, fmtWeekday, minutesBetween, NOW } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { EntityHeader } from '@/components/ui/EntityHeader'
import { PriorityBadge, RiskBadge, SeverityBadge, StatusBadge, StatusCell } from '@/components/ui/Badge'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Timeline } from '@/components/ui/Timeline'
import { Banner, EmptyState } from '@/components/ui/Misc'
import { UserChip, Avatar } from '@/components/ui/Avatar'
import { NotFoundPage } from '@/pages/NotFoundPage'
import type { Defect, FlightRisk, WorkOrder } from '@/data/types'

const RISK_RULES: { rule: string; result: FlightRisk }[] = [
  { rule: 'No open defects on the assigned aircraft', result: 'Clear' },
  { rule: 'Deferred minor defect, reinspection current', result: 'Monitor' },
  { rule: 'Defect under review, or a work order in progress', result: 'At Risk' },
  { rule: 'Aircraft AOG, or an open critical defect', result: 'No Go' },
]

export function FlightDetailPage() {
  const { id = '' } = useParams()
  const f = getFlight(id)
  if (!f) return <NotFoundPage />

  const ac = f.aircraftId ? getAircraft(f.aircraftId) : undefined
  const openDefects = f.aircraftId ? openDefectsForAircraft(f.aircraftId) : []
  const openWos = f.aircraftId ? openWorkOrdersForAircraft(f.aircraftId) : []

  const untilDep = minutesBetween(NOW, f.schedDep)
  const countdownLabel =
    f.status === 'Completed'
      ? 'Completed'
      : f.status === 'Cancelled'
        ? 'Cancelled'
        : untilDep > 0
          ? `Departs in ${fmtDuration(untilDep)}`
          : `Departed ${fmtDuration(-untilDep)} ago`

  const defectCols: Column<Defect>[] = [
    {
      key: 'ref',
      header: 'Reference',
      render: (d) => (
        <Link to={paths.defect(d.id)} className="table-link ref">
          {d.id}
        </Link>
      ),
    },
    { key: 'title', header: 'Title', render: (d) => <span className="cell-main">{d.title}</span> },
    { key: 'sev', header: 'Severity', render: (d) => <SeverityBadge severity={d.severity} /> },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
  ]

  const woCols: Column<WorkOrder>[] = [
    {
      key: 'ref',
      header: 'Reference',
      render: (w) => (
        <Link to={paths.workOrder(w.id)} className="table-link ref">
          {w.id}
        </Link>
      ),
    },
    { key: 'title', header: 'Title', render: (w) => <span className="cell-main">{w.title}</span> },
    { key: 'priority', header: 'Priority', render: (w) => <PriorityBadge priority={w.priority} /> },
    { key: 'status', header: 'Status', render: (w) => <StatusBadge status={w.status} /> },
  ]

  return (
    <div className="page">
      <Breadcrumbs crumbs={[{ label: 'Operations' }, { label: 'Flights', to: paths.flights }, { label: f.id }]} />

      <EntityHeader
        identIcon={RouteIcon}
        identTone={f.risk === 'No Go' ? 'red' : undefined}
        title={<span className="ref">{f.id}</span>}
        badges={
          <>
            <StatusBadge status={f.status} />
            <RiskBadge risk={f.risk} />
          </>
        }
        subtitle={`${f.origin} → ${f.destination} · ${fmtWeekday(f.date)}`}
        meta={[
          { label: 'Sched dep', value: fmtDateTime(f.schedDep) },
          { label: 'Sched arr', value: fmtDateTime(f.schedArr) },
          {
            label: 'Aircraft',
            value: ac ? (
              <Link to={paths.aircraftDetail(ac.id)} className="ref table-link">
                {ac.registration}
              </Link>
            ) : (
              'Unassigned'
            ),
          },
          ...(f.planId
            ? [
                {
                  label: 'Plan',
                  value: (
                    <Link to={paths.fleetPlan(f.planId)} className="ref table-link">
                      {f.planId}
                    </Link>
                  ),
                },
              ]
            : []),
        ]}
        actions={
          <>
            {f.aircraftId && (
              <Link to={paths.aircraftDetail(f.aircraftId)} className="btn btn--secondary">
                <PlaneTakeoff size={15} aria-hidden="true" />
                View aircraft
              </Link>
            )}
            {f.planId && (
              <Link to={paths.fleetPlan(f.planId)} className="btn btn--primary">
                <CalendarRange size={15} aria-hidden="true" />
                Fleet plan
              </Link>
            )}
          </>
        }
      />

      {(f.risk === 'No Go' || f.risk === 'At Risk') && f.riskNote && (
        <Banner tone={f.risk === 'No Go' ? 'danger' : 'warn'}>
          <strong>{f.risk === 'No Go' ? 'Flight blocked. ' : 'At-risk flight. '}</strong>
          {f.riskNote}
        </Banner>
      )}

      <div className="two-col">
        <div className="col-main">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <PlaneTakeoff size={16} aria-hidden="true" />
                Turnaround
              </h2>
            </div>
            <div className="card-body">
              <div className="metric-card" style={{ boxShadow: 'none', border: 'none', padding: 0, marginBottom: 'var(--sp-4)' }}>
                <span className="metric-label">Status</span>
                <span className="metric-value">{countdownLabel}</span>
              </div>
              <DetailGrid
                items={[
                  { label: 'Turnaround window', value: f.turnaroundMins ? fmtDuration(f.turnaroundMins) : '—' },
                  {
                    label: 'Maintenance window',
                    value: f.maintenanceWindow ? `${fmtTime(f.maintenanceWindow.start)} – ${fmtTime(f.maintenanceWindow.end)}` : '—',
                  },
                  {
                    label: 'Next rotation',
                    value: f.nextFlightId ? (
                      <Link to={paths.flight(f.nextFlightId)} className="ref table-link">
                        {f.nextFlightId}
                      </Link>
                    ) : (
                      '—'
                    ),
                  },
                  { label: 'Gate / stand', value: ac?.location ?? '—' },
                ]}
              />
            </div>
          </section>

          {ac && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <ShieldAlert size={16} aria-hidden="true" />
                  Aircraft status & restrictions
                </h2>
                <div className="card-actions">
                  <Link to={paths.aircraftDetail(ac.id)} className="btn btn--ghost btn--sm">
                    Full aircraft record
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <StatusCell status={ac.availability} reason={ac.availabilityReason} />
              </div>
              {ac.restrictions.length > 0 && (
                <div className="row-list">
                  {ac.restrictions.map((r) => (
                    <div className="row-list-item" key={r}>
                      <TriangleAlert size={15} aria-hidden="true" style={{ color: 'var(--tone-amber-dot)', flexShrink: 0 }} />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <TriangleAlert size={16} aria-hidden="true" />
                Open defects on aircraft
              </h2>
            </div>
            <DataTable
              caption={`Open defects on ${ac?.registration ?? 'assigned aircraft'}`}
              columns={defectCols}
              rows={openDefects}
              rowKey={(d) => d.id}
              empty={
                <EmptyState icon={TriangleAlert} title="No open defects">
                  {ac ? `Nothing outstanding against ${ac.registration}.` : 'No aircraft is assigned to this flight yet.'}
                </EmptyState>
              }
            />
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Wrench size={16} aria-hidden="true" />
                Open work orders
              </h2>
            </div>
            <DataTable
              caption={`Open work orders on ${ac?.registration ?? 'assigned aircraft'}`}
              columns={woCols}
              rows={openWos}
              rowKey={(w) => w.id}
              empty={
                <EmptyState icon={Wrench} title="No open work orders">
                  {ac ? `No active maintenance against ${ac.registration}.` : 'No aircraft is assigned to this flight yet.'}
                </EmptyState>
              }
            />
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <RouteIcon size={16} aria-hidden="true" />
                Turnaround events
              </h2>
            </div>
            <div className="card-body">
              {f.events && f.events.length > 0 ? (
                <Timeline events={f.events} />
              ) : (
                <EmptyState icon={RouteIcon} title="No turnaround events logged">
                  Ground handling and dispatch events for this flight have not been recorded yet.
                </EmptyState>
              )}
            </div>
          </section>
        </div>

        <div className="col-side">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Crew</h2>
            </div>
            <div className="row-list">
              <div className="row-list-item">
                <UserChip userId={f.captainUserId} sub="Captain" link />
              </div>
              <div className="row-list-item">
                <span className="user-cell">
                  <Avatar name={f.firstOfficer ?? 'Unassigned'} />
                  <span>
                    <span className="user-cell-name">{f.firstOfficer ?? 'Unassigned'}</span>
                    <span className="user-cell-sub" style={{ display: 'block' }}>
                      First officer
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <MapPin size={16} aria-hidden="true" />
                Maintenance controller notes
              </h2>
            </div>
            <div className="card-body">
              {f.controllerNotes ? (
                <p style={{ fontSize: 'var(--fs-md)', color: 'var(--text-secondary)' }}>{f.controllerNotes}</p>
              ) : (
                <span className="muted" style={{ fontSize: 'var(--fs-md)' }}>No controller notes on this flight.</span>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Risk assessment</h2>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: 'var(--sp-3)' }}>
                <RiskBadge risk={f.risk} />
              </div>
              {f.riskNote && (
                <p style={{ fontSize: 'var(--fs-md)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-4)' }}>{f.riskNote}</p>
              )}
              <div className="row-list" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                {RISK_RULES.map((r) => (
                  <div
                    className="row-list-item"
                    key={r.rule}
                    style={{ fontWeight: r.result === f.risk ? 600 : undefined }}
                  >
                    <span className="row-main" style={{ fontSize: 'var(--fs-sm)' }}>
                      {r.rule} → {r.result}
                    </span>
                    {r.result === f.risk && <span className="chip">active</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
