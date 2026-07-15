import { Link, useParams } from 'react-router-dom'
import { CalendarRange, ClipboardCheck, ListChecks, Pencil, PlaneTakeoff, TriangleAlert } from 'lucide-react'
import { paths } from '@/app/paths'
import { getAircraft, getFlight, getFleetPlan, userName } from '@/data'
import { fmtDate, fmtDateTime, fmtDayMonth, fmtTime } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { EntityHeader } from '@/components/ui/EntityHeader'
import { RiskBadge, StatusBadge, StatusCell } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Timeline } from '@/components/ui/Timeline'
import { EmptyState } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'
import type { Aircraft, Flight, PlanConflict, TimelineEvent } from '@/data/types'

export function FleetPlanDetailPage() {
  const { id = '' } = useParams()
  const plan = getFleetPlan(id)
  if (!plan) return <NotFoundPage />

  const planAircraft = plan.aircraftIds
    .map((aid) => getAircraft(aid))
    .filter((a): a is Aircraft => a !== undefined)

  const planFlights = plan.flightIds
    .map((fid) => getFlight(fid))
    .filter((f): f is Flight => f !== undefined)

  const atRiskPlanFlights = planFlights.filter((f) => f.risk === 'At Risk' || f.risk === 'No Go')

  const revisionEvents: TimelineEvent[] = plan.revisions.map((r) => ({
    at: r.at,
    title: `Revision ${r.version}`,
    detail: r.note,
    byUserId: r.byUserId,
    tone: (r.version === 1 ? 'grey' : 'blue') as TimelineEvent['tone'],
  }))

  const aircraftCols: Column<Aircraft>[] = [
    {
      key: 'reg',
      header: 'Registration',
      render: (a) => (
        <Link to={paths.aircraftDetail(a.id)} className="table-link ref">
          {a.registration}
        </Link>
      ),
    },
    { key: 'model', header: 'Model', hideMobile: true, render: (a) => a.model },
    {
      key: 'status',
      header: 'Availability',
      render: (a) => <StatusCell status={a.availability} reason={a.availabilityReason} />,
    },
    { key: 'risk', header: 'Maint. risk', render: (a) => <RiskBadge risk={a.maintenanceRisk} /> },
  ]

  const flightCols: Column<Flight>[] = [
    {
      key: 'flight',
      header: 'Flight',
      render: (f) => (
        <Link to={paths.flight(f.id)} className="table-link ref">
          {f.id}
        </Link>
      ),
    },
    {
      key: 'route',
      header: 'Route',
      render: (f) => (
        <span className="nowrap">
          {f.origin} → {f.destination}
        </span>
      ),
    },
    {
      key: 'dep',
      header: 'Sched dep',
      render: (f) => (
        <span className="nowrap">
          {fmtDayMonth(f.schedDep)}, {fmtTime(f.schedDep)}
        </span>
      ),
    },
    {
      key: 'aircraft',
      header: 'Aircraft',
      render: (f) =>
        f.aircraftId ? (
          <Link to={paths.aircraftDetail(f.aircraftId)} className="chip ref">
            {f.aircraftId}
          </Link>
        ) : (
          <span className="chip chip--alert">Unassigned</span>
        ),
    },
    { key: 'risk', header: 'Risk', render: (f) => <RiskBadge risk={f.risk} /> },
    { key: 'status', header: 'Status', render: (f) => <StatusBadge status={f.status} /> },
  ]

  const flightRowTone = (f: Flight): 'red' | 'orange' | undefined =>
    f.risk === 'No Go' ? 'red' : f.risk === 'At Risk' ? 'orange' : undefined

  const conflictTone = (severity: PlanConflict['severity']) => (severity === 'Critical' ? 'Critical' : 'Monitor')

  return (
    <div className="page">
      <Breadcrumbs crumbs={[{ label: 'Fleet planning' }, { label: 'Fleet plans', to: paths.fleetPlans }, { label: plan.id }]} />

      <EntityHeader
        identIcon={CalendarRange}
        title={plan.name}
        badges={<StatusBadge status={plan.status} />}
        subtitle={<span className="ref">{plan.id}</span>}
        meta={[
          { label: 'Period', value: `${fmtDate(plan.startDate)} – ${fmtDate(plan.endDate)}` },
          { label: 'Base', value: plan.base },
          { label: 'Owner', value: userName(plan.createdByUserId) },
          {
            label: 'Approved',
            value:
              plan.approvedByUserId && plan.approvedAt
                ? `${userName(plan.approvedByUserId)} · ${fmtDateTime(plan.approvedAt)}`
                : 'Not yet approved',
          },
        ]}
        actions={
          <>
            <Link to={paths.fleetPlanEdit(plan.id)} className="btn btn--secondary">
              <Pencil size={15} aria-hidden="true" />
              Edit plan
            </Link>
            <Link to={paths.fleetAvailability} className="btn btn--primary">
              <PlaneTakeoff size={15} aria-hidden="true" />
              Availability board
            </Link>
          </>
        }
      />

      <div className="two-col">
        <div className="col-main">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <TriangleAlert size={16} aria-hidden="true" />
                Conflicts & warnings
              </h2>
              <span className="card-sub">{plan.conflicts.length} flagged for this plan</span>
            </div>
            {plan.conflicts.length === 0 ? (
              <div className="card-body">
                <EmptyState icon={ListChecks} title="No conflicts flagged">
                  Aircraft and flight assignments in this plan have no outstanding warnings.
                </EmptyState>
              </div>
            ) : (
              <div className="row-list">
                {plan.conflicts.map((c, i) => (
                  <div className="row-list-item" key={`${c.message}-${i}`}>
                    <div className="row-main">
                      <div className="row-title">
                        <StatusBadge status={conflictTone(c.severity)} />
                      </div>
                      <div className="row-sub">{c.message}</div>
                    </div>
                    <div className="row-end">
                      {c.aircraftId && (
                        <Link to={paths.aircraftDetail(c.aircraftId)} className="chip ref">
                          {c.aircraftId}
                        </Link>
                      )}
                      {c.flightId && (
                        <Link to={paths.flight(c.flightId)} className="chip ref">
                          {c.flightId}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <PlaneTakeoff size={16} aria-hidden="true" />
                Aircraft assignments
              </h2>
              <span className="card-sub">{planAircraft.length} tails assigned to this plan</span>
            </div>
            <DataTable
              caption={`Aircraft assigned to ${plan.id}`}
              columns={aircraftCols}
              rows={planAircraft}
              rowKey={(a) => a.id}
              rowTone={(a) => (a.availability === 'AOG' ? 'red' : undefined)}
              empty={
                <EmptyState icon={PlaneTakeoff} title="No aircraft assigned">
                  This plan has not had aircraft assigned yet.
                </EmptyState>
              }
            />
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <CalendarRange size={16} aria-hidden="true" />
                Flight assignments
              </h2>
              <span className="card-sub">{planFlights.length} flights in the schedule</span>
            </div>
            <DataTable
              caption={`Flights assigned to ${plan.id}`}
              columns={flightCols}
              rows={planFlights}
              rowKey={(f) => f.id}
              rowTone={flightRowTone}
              empty={
                <EmptyState icon={CalendarRange} title="No flights assigned">
                  This plan does not yet carry a flight schedule.
                </EmptyState>
              }
            />
          </section>
        </div>

        <div className="col-side">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <TriangleAlert size={16} aria-hidden="true" />
                At-risk flights
              </h2>
            </div>
            {atRiskPlanFlights.length === 0 ? (
              <div className="card-body">
                <span className="muted" style={{ fontSize: 'var(--fs-md)' }}>
                  No flights in this plan are currently flagged At Risk or No Go.
                </span>
              </div>
            ) : (
              <div className="row-list">
                {atRiskPlanFlights.map((f) => (
                  <div className="row-list-item" key={f.id}>
                    <div className="row-main">
                      <div className="row-title">
                        <Link to={paths.flight(f.id)} className="table-link ref">
                          {f.id}
                        </Link>
                        <span className="text-secondary">
                          {f.origin} → {f.destination}
                        </span>
                      </div>
                      <div className="row-sub">{f.riskNote}</div>
                    </div>
                    <div className="row-end">
                      <RiskBadge risk={f.risk} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <ClipboardCheck size={16} aria-hidden="true" />
                Revision history
              </h2>
            </div>
            <div className="card-body">
              <Timeline events={revisionEvents} />
            </div>
          </section>

          {plan.notes && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Notes</h2>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 'var(--fs-md)', color: 'var(--text-secondary)' }}>{plan.notes}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
