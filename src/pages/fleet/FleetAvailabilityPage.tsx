import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, LayoutGrid, Plane, RefreshCw, Rows3 } from 'lucide-react'
import { paths } from '@/app/paths'
import { getFlight } from '@/data'
import { useWorkflow } from '@/workflow/useWorkflow'
import { fmtTime, fmtDayMonth } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, FilterSpacer, SearchInput, SelectFilter, Segmented } from '@/components/ui/FilterBar'
import { RiskBadge, StatusCell } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Misc'
import type { Aircraft } from '@/data/types'

const TYPE_OPTIONS = ['ATR 72-600', 'DHC-8-315', 'Saab 340B', 'King Air 350']
const STATUS_OPTIONS = [
  'Available',
  'Assigned',
  'Restricted',
  'Under Maintenance',
  'AOG',
  'Awaiting Parts',
  'Awaiting Sign-off',
]

export function FleetAvailabilityPage() {
  const { state } = useWorkflow()
  const { aircraft, defects, workOrders } = state
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [view, setView] = useState('table')

  const openDefectCount = (aircraftId: string) =>
    defects.filter((defect) => defect.aircraftId === aircraftId && defect.status !== 'Closed' && defect.status !== 'Cancelled').length
  const openWorkOrderCount = (aircraftId: string) =>
    workOrders.filter((workOrder) => workOrder.aircraftId === aircraftId && workOrder.status !== 'Closed' && workOrder.status !== 'Cancelled').length
  const fleetSummary = {
    total: aircraft.length,
    available: aircraft.filter((item) => item.availability === 'Available').length,
    assigned: aircraft.filter((item) => item.availability === 'Assigned').length,
    restricted: aircraft.filter((item) => item.availability === 'Restricted').length,
    underMaintenance: aircraft.filter((item) => item.availability === 'Under Maintenance').length,
    awaitingParts: aircraft.filter((item) => item.availability === 'Awaiting Parts').length,
    awaitingSignOff: aircraft.filter((item) => item.availability === 'Awaiting Sign-off').length,
    aog: aircraft.filter((item) => item.availability === 'AOG').length,
  }

  const rows = useMemo(
    () =>
      aircraft.filter((a) => {
        const text = `${a.registration} ${a.model} ${a.availabilityReason} ${a.location}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (type && a.model !== type) return false
        if (status && a.availability !== status) return false
        return true
      }),
    [aircraft, q, type, status],
  )

  const columns: Column<Aircraft>[] = [
    {
      key: 'reg',
      header: 'Registration',
      render: (a) => (
        <>
          <Link to={paths.aircraftDetail(a.id)} className="table-link ref">
            {a.registration}
          </Link>
          <span className="cell-sub">{a.location}</span>
        </>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      hideMobile: true,
      render: (a) => (
        <>
          <span className="cell-main" style={{ fontWeight: 500 }}>{a.model}</span>
          <span className="cell-sub">{a.serialNumber}</span>
        </>
      ),
    },
    {
      key: 'status',
      header: 'Availability',
      render: (a) => <StatusCell status={a.availability} reason={a.availabilityReason} />,
    },
    {
      key: 'next-flight',
      header: 'Next flight',
      render: (a) => {
        const f = a.nextFlightId ? getFlight(a.nextFlightId) : undefined
        if (!f) return <span className="muted">—</span>
        return (
          <>
            <Link to={paths.flight(f.id)} className="table-link ref">
              {f.id}
            </Link>
            <span className="cell-sub">
              {f.origin} → {f.destination}
            </span>
          </>
        )
      },
    },
    {
      key: 'dep',
      header: 'Departure',
      hideMobile: true,
      render: (a) => {
        const f = a.nextFlightId ? getFlight(a.nextFlightId) : undefined
        if (!f) return <span className="muted">—</span>
        return (
          <span className="nowrap num">
            {fmtDayMonth(f.schedDep)}, {fmtTime(f.schedDep)}
          </span>
        )
      },
    },
    {
      key: 'risk',
      header: 'Maint. risk',
      render: (a) => <RiskBadge risk={a.maintenanceRisk} />,
    },
    {
      key: 'defects',
      header: 'Defects',
      numeric: true,
      render: (a) => {
        const n = openDefectCount(a.id)
        return n > 0 ? (
          <Link to={paths.defects} className={`chip${a.availability === 'AOG' ? ' chip--alert' : ''}`}>
            {n} open
          </Link>
        ) : (
          <span className="muted">0</span>
        )
      },
    },
    {
      key: 'wos',
      header: 'Work orders',
      numeric: true,
      render: (a) => {
        const n = openWorkOrderCount(a.id)
        return n > 0 ? (
          <Link to={paths.workOrders} className="chip">
            {n} open
          </Link>
        ) : (
          <span className="muted">0</span>
        )
      },
    },
    {
      key: 'plan',
      header: 'Fleet plan',
      hideMobile: true,
      render: (a) =>
        a.assignedPlanId ? (
          <Link to={paths.fleetPlan(a.assignedPlanId)} className="table-link ref">
            {a.assignedPlanId}
          </Link>
        ) : (
          <span className="muted">Unplanned</span>
        ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Fleet planning' }, { label: 'Availability' }]}
        title="Fleet availability"
        description="Live operational picture of every tail: who can fly, who is stuck, and why. Statuses follow the documented availability workflow."
        actions={
          <>
            <button type="button" className="btn btn--secondary">
              <RefreshCw size={15} aria-hidden="true" />
              Refresh view
            </button>
            <Link to={paths.fleetPlan('FP-2026-0715')} className="btn btn--primary">
              <CalendarDays size={15} aria-hidden="true" />
              Current plan
            </Link>
          </>
        }
      />

      {/* Fleet status summary */}
      <div className="stat-strip" role="group" aria-label="Fleet status summary">
        <div className="stat">
          <span className="stat-label">Fleet</span>
          <span className="stat-value">{fleetSummary.total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">
            <span className="badge-dot" style={{ background: 'var(--tone-green-dot)', width: 7, height: 7, borderRadius: 99, display: 'inline-block' }} aria-hidden="true" />
            Available
          </span>
          <span className="stat-value">{fleetSummary.available}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Assigned</span>
          <span className="stat-value">{fleetSummary.assigned}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Restricted</span>
          <span className="stat-value">{fleetSummary.restricted}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Maintenance</span>
          <span className="stat-value">{fleetSummary.underMaintenance}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Awaiting parts</span>
          <span className="stat-value">{fleetSummary.awaitingParts}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Awaiting sign-off</span>
          <span className="stat-value">{fleetSummary.awaitingSignOff}</span>
        </div>
        <div className="stat">
          <span className="stat-label" style={{ color: 'var(--tone-red-text)' }}>AOG</span>
          <span className="stat-value" style={{ color: 'var(--tone-red-text)' }}>{fleetSummary.aog}</span>
        </div>
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search registration, reason, location…" value={q} onChange={setQ} width={280} />
            <SelectFilter label="Aircraft type" allLabel="All types" options={TYPE_OPTIONS} value={type} onChange={setType} />
            <SelectFilter label="Availability status" allLabel="All statuses" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            <SelectFilter label="Operational window" options={['Today · Wed 15 Jul', 'Tomorrow · Thu 16 Jul', 'Next 7 days']} />
            <FilterSpacer />
            <Segmented
              label="View"
              value={view}
              onChange={setView}
              options={[
                { label: 'Table', value: 'table', icon: <Rows3 size={13} aria-hidden="true" /> },
                { label: 'Board', value: 'board', icon: <LayoutGrid size={13} aria-hidden="true" /> },
              ]}
            />
          </FilterBar>
        </div>

        {view === 'table' ? (
          <DataTable
            caption="Fleet availability by aircraft"
            columns={columns}
            rows={rows}
            rowKey={(a) => a.id}
            rowTone={(a) =>
              a.availability === 'AOG'
                ? 'red'
                : a.availability === 'Awaiting Parts' || a.availability === 'Awaiting Sign-off'
                  ? 'orange'
                  : undefined
            }
            empty={
              <EmptyState icon={Plane} title="No aircraft match these filters">
                Adjust the search or clear a filter to see the rest of the fleet.
              </EmptyState>
            }
            footer={<TableFooter shown={rows.length} total={aircraft.length} />}
          />
        ) : (
          <div className="card-body">
            <div className="card-list">
              {rows.map((a) => (
                <div
                  className="item-card"
                  key={a.id}
                  data-tone={
                    a.availability === 'AOG'
                      ? 'red'
                      : a.availability === 'Awaiting Parts' || a.availability === 'Awaiting Sign-off'
                        ? 'orange'
                        : undefined
                  }
                >
                  <div className="item-card-head">
                    <Link to={paths.aircraftDetail(a.id)} className="table-link ref item-card-title">
                      {a.registration}
                    </Link>
                    <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>{a.model}</span>
                    <span style={{ marginLeft: 'auto' }}>
                      <RiskBadge risk={a.maintenanceRisk} />
                    </span>
                  </div>
                  <StatusCell status={a.availability} reason={a.availabilityReason} />
                  <div className="item-card-meta">
                    <span>{a.location}</span>
                    <span>{openDefectCount(a.id)} defects</span>
                    <span>{openWorkOrderCount(a.id)} WOs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
