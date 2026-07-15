import { Link, useParams } from 'react-router-dom'
import {
  Archive,
  Building2,
  CalendarClock,
  Gauge,
  MapPin,
  Pencil,
  Plane,
  Route as RouteIcon,
  ShieldAlert,
  TriangleAlert,
  Wrench,
} from 'lucide-react'
import { paths } from '@/app/paths'
import {
  defectsForAircraft,
  flightsForAircraft,
  getAircraft,
  getFlight,
  openDefectsForAircraft,
  openWorkOrdersForAircraft,
  recordsForAircraft,
  shortName,
  signOffsForAircraft,
  workOrdersForAircraft,
} from '@/data'
import { fmtDateTime, fmtNumber } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { EntityHeader } from '@/components/ui/EntityHeader'
import { PriorityBadge, RiskBadge, SeverityBadge, StatusBadge, StatusCell } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { Timeline } from '@/components/ui/Timeline'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Banner, EmptyState } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'
import type { Defect, MaintenanceRecord, TimelineEvent, WorkOrder } from '@/data/types'

export function AircraftDetailPage() {
  const { id = '' } = useParams()
  const ac = getAircraft(id)
  if (!ac) return <NotFoundPage />

  const openDefects = openDefectsForAircraft(ac.id)
  const openWos = openWorkOrdersForAircraft(ac.id)
  const records = recordsForAircraft(ac.id)
  const nextFlight = ac.nextFlightId ? getFlight(ac.nextFlightId) : undefined

  // Assemble the unified aircraft timeline from related entities.
  const timelineEvents: TimelineEvent[] = [
    ...flightsForAircraft(ac.id).map((f) => ({
      at: f.schedDep,
      title: `Flight ${f.id} — ${f.origin} → ${f.destination}`,
      detail: f.status === 'Cancelled' ? `Cancelled — ${f.riskNote ?? ''}` : `Status: ${f.status}`,
      tone: (f.status === 'Cancelled' ? 'red' : 'grey') as TimelineEvent['tone'],
      refLink: { label: f.id, to: paths.flight(f.id) },
    })),
    ...defectsForAircraft(ac.id).map((d) => ({
      at: d.reportedAt,
      title: `Defect reported — ${d.title}`,
      detail: `${d.severity} · ${d.ataChapter}`,
      byUserId: d.reportedByUserId,
      tone: (d.severity === 'Critical' ? 'red' : 'blue') as TimelineEvent['tone'],
      refLink: { label: d.id, to: paths.defect(d.id) },
    })),
    ...workOrdersForAircraft(ac.id).map((w) => ({
      at: w.createdAt,
      title: `Work order raised — ${w.title}`,
      detail: `Priority ${w.priority} · now ${w.status}`,
      byUserId: w.createdByUserId,
      tone: (w.priority === 'AOG' ? 'red' : 'blue') as TimelineEvent['tone'],
      refLink: { label: w.id, to: paths.workOrder(w.id) },
    })),
    ...signOffsForAircraft(ac.id).map((s) => ({
      at: s.signedAt,
      title: `Released to service — ${s.type}`,
      detail: `Certified under licence ${s.licenceNumber}`,
      byUserId: s.signedByUserId,
      tone: 'green' as TimelineEvent['tone'],
      refLink: { label: s.workOrderId, to: paths.workOrder(s.workOrderId) },
    })),
  ]

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
    { key: 'title', header: 'Summary', render: (d) => <span className="cell-main">{d.title}</span> },
    { key: 'sev', header: 'Severity', render: (d) => <SeverityBadge severity={d.severity} /> },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
    {
      key: 'wo',
      header: 'Work order',
      hideMobile: true,
      render: (d) =>
        d.workOrderId ? (
          <Link to={paths.workOrder(d.workOrderId)} className="table-link ref">
            {d.workOrderId}
          </Link>
        ) : (
          <span className="muted">—</span>
        ),
    },
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
    { key: 'title', header: 'Description', render: (w) => <span className="cell-main">{w.title}</span> },
    { key: 'priority', header: 'Priority', render: (w) => <PriorityBadge priority={w.priority} /> },
    { key: 'status', header: 'Status', render: (w) => <StatusBadge status={w.status} /> },
    { key: 'assignee', header: 'Engineer', hideMobile: true, render: (w) => shortName(w.assignedToUserId) },
  ]

  const recordCols: Column<MaintenanceRecord>[] = [
    { key: 'date', header: 'Released', render: (r) => <span className="nowrap">{fmtDateTime(r.performedAt)}</span> },
    { key: 'type', header: 'Type', render: (r) => <StatusBadge status={r.recordType === 'Corrective' ? 'In Progress' : 'Complete'} title={r.recordType} />, hideMobile: true },
    { key: 'summary', header: 'Work performed', render: (r) => <span>{r.summary}</span> },
    {
      key: 'wo',
      header: 'Work order',
      render: (r) => (
        <Link to={paths.workOrder(r.workOrderId)} className="table-link ref">
          {r.workOrderId}
        </Link>
      ),
    },
    { key: 'le', header: 'Licensed engineer', hideMobile: true, render: (r) => shortName(r.certifiedByUserId) },
    { key: 'ref', header: 'Reference', hideMobile: true, render: (r) => <span className="ref">{r.reference}</span> },
  ]

  return (
    <div className="page">
      <Breadcrumbs crumbs={[{ label: 'Aircraft registry', to: paths.aircraftList }, { label: ac.registration }]} />

      <EntityHeader
        identIcon={Plane}
        identTone={ac.status === 'AOG' ? 'red' : undefined}
        title={<span className="ref">{ac.registration}</span>}
        badges={
          <>
            <StatusBadge status={ac.status} />
            <StatusBadge status={ac.availability} />
            <RiskBadge risk={ac.maintenanceRisk} />
          </>
        }
        subtitle={`${ac.manufacturer} ${ac.model} · ${ac.serialNumber} · built ${ac.yearOfManufacture}`}
        meta={[
          { icon: Building2, label: 'Operator', value: ac.operator },
          { icon: MapPin, label: 'Location', value: ac.location },
          { icon: Gauge, label: 'Hours', value: fmtNumber(ac.totalHours, 1) },
          { icon: RouteIcon, label: 'Cycles', value: fmtNumber(ac.totalCycles) },
        ]}
        actions={
          <>
            <Link to={paths.aircraftRecords(ac.id)} className="btn btn--secondary">
              <Archive size={15} aria-hidden="true" />
              Maintenance records
            </Link>
            <Link to={paths.aircraftEdit(ac.id)} className="btn btn--primary">
              <Pencil size={15} aria-hidden="true" />
              Edit aircraft
            </Link>
          </>
        }
      />

      {ac.availability === 'AOG' && (
        <Banner tone="danger">
          <strong>Aircraft on ground.</strong> {ac.availabilityReason} —{' '}
          <Link to={paths.workOrder('WO-2026-0033')}>open recovery work order</Link>.
        </Banner>
      )}

      <Tabs
        tabs={[
          {
            id: 'summary',
            label: 'Summary',
            content: (
              <div className="section-stack">
                <section className="card">
                  <div className="card-header">
                    <h2 className="card-title">Aircraft summary</h2>
                  </div>
                  <div className="card-body">
                    <DetailGrid
                      items={[
                        { label: 'Registration', value: <span className="ref">{ac.registration}</span> },
                        { label: 'Type', value: `${ac.manufacturer} ${ac.model}` },
                        { label: 'Serial number', value: <span className="ref">{ac.serialNumber}</span> },
                        { label: 'Operator', value: <Link to={paths.account(ac.accountId)}>{ac.operator}</Link> },
                        { label: 'Home base', value: ac.base },
                        { label: 'Status', value: <StatusBadge status={ac.status} /> },
                        { label: 'Availability', value: <StatusCell status={ac.availability} reason={ac.availabilityReason} /> },
                        { label: 'Total hours', value: fmtNumber(ac.totalHours, 1) },
                        { label: 'Total cycles', value: fmtNumber(ac.totalCycles) },
                        { label: 'Seats', value: ac.seats },
                        { label: 'Engines', value: ac.engines },
                        {
                          label: 'Current flight assignment',
                          value: nextFlight ? (
                            <span>
                              <Link to={paths.flight(nextFlight.id)} className="ref table-link">
                                {nextFlight.id}
                              </Link>{' '}
                              {nextFlight.origin} → {nextFlight.destination}, {fmtDateTime(nextFlight.schedDep)}
                            </span>
                          ) : (
                            'None'
                          ),
                        },
                        {
                          label: 'Upcoming maintenance',
                          value: ac.nextMaintenance ? (
                            <span>
                              {ac.nextMaintenance.label} · {fmtDateTime(ac.nextMaintenance.date)} (
                              <Link to={paths.plannedMaintenance}>view calendar</Link>)
                            </span>
                          ) : (
                            'None scheduled'
                          ),
                        },
                        { label: 'Configuration', value: ac.configurationNotes },
                      ]}
                    />
                  </div>
                </section>

                {ac.restrictions.length > 0 && (
                  <section className="card">
                    <div className="card-header">
                      <h2 className="card-title">
                        <ShieldAlert size={16} aria-hidden="true" />
                        Current maintenance restrictions
                      </h2>
                    </div>
                    <div className="row-list">
                      {ac.restrictions.map((r) => (
                        <div className="row-list-item" key={r}>
                          <TriangleAlert size={15} aria-hidden="true" style={{ color: 'var(--tone-amber-dot)', flexShrink: 0 }} />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ),
          },
          {
            id: 'open-items',
            label: 'Open items',
            count: openDefects.length + openWos.length,
            content: (
              <div className="section-stack">
                <section className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <TriangleAlert size={16} aria-hidden="true" />
                      Open defects
                    </h2>
                  </div>
                  <DataTable
                    caption={`Open defects on ${ac.registration}`}
                    columns={defectCols}
                    rows={openDefects}
                    rowKey={(d) => d.id}
                    empty={
                      <EmptyState icon={TriangleAlert} title="No open defects">
                        Nothing outstanding against this aircraft.
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
                    caption={`Open work orders on ${ac.registration}`}
                    columns={woCols}
                    rows={openWos}
                    rowKey={(w) => w.id}
                    empty={
                      <EmptyState icon={Wrench} title="No open work orders">
                        No active maintenance against this aircraft.
                      </EmptyState>
                    }
                  />
                </section>
                <section className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <ShieldAlert size={16} aria-hidden="true" />
                      Restrictions & required inspections
                    </h2>
                  </div>
                  <div className="row-list">
                    {ac.restrictions.length === 0 && (
                      <div className="row-list-item muted">No active restrictions or outstanding inspections.</div>
                    )}
                    {ac.restrictions.map((r) => (
                      <div className="row-list-item" key={r}>
                        <TriangleAlert size={15} aria-hidden="true" style={{ color: 'var(--tone-amber-dot)', flexShrink: 0 }} />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ),
          },
          {
            id: 'timeline',
            label: 'Timeline',
            content: (
              <section className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <CalendarClock size={16} aria-hidden="true" />
                    Unified aircraft timeline
                  </h2>
                  <span className="card-sub">Flights, defect reports, work orders, sign-offs and status changes — newest first.</span>
                </div>
                <div className="card-body">
                  <Timeline events={timelineEvents} />
                </div>
              </section>
            ),
          },
          {
            id: 'records',
            label: 'Maintenance records',
            count: records.length,
            content: (
              <section className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <Archive size={16} aria-hidden="true" />
                    Maintenance records
                  </h2>
                  <div className="card-actions">
                    <Link to={paths.aircraftRecords(ac.id)} className="btn btn--secondary btn--sm">
                      Full records view
                    </Link>
                  </div>
                </div>
                <DataTable
                  caption={`Maintenance records for ${ac.registration}`}
                  columns={recordCols}
                  rows={records}
                  rowKey={(r) => r.id}
                  empty={
                    <EmptyState icon={Archive} title="No records yet">
                      Completed and certified work will appear here.
                    </EmptyState>
                  }
                />
              </section>
            ),
          },
        ]}
      />
    </div>
  )
}
