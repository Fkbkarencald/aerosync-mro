import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, LayoutGrid, Plus, Rows3 } from 'lucide-react'
import { paths } from '@/app/paths'
import { fleetPlans, getFleetPlan, shortName } from '@/data'
import { fmtDateTime, fmtDayMonth } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, FilterSpacer, SearchInput, SelectFilter, Segmented } from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Misc'
import type { FleetPlan } from '@/data/types'

const STATUS_OPTIONS = ['Published', 'Draft', 'Archived']

export function FleetPlansPage() {
  const currentPlan = getFleetPlan('FP-2026-0715')!

  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [view, setView] = useState('list')

  const rows = useMemo(
    () =>
      fleetPlans.filter((p) => {
        const text = `${p.id} ${p.name} ${p.description} ${p.base}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (status && p.status !== status) return false
        return true
      }),
    [q, status],
  )

  const columns: Column<FleetPlan>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (p) => (
        <>
          <Link to={paths.fleetPlan(p.id)} className="table-link">
            {p.name}
          </Link>
          <span className="cell-sub" title={p.description}>
            {p.description.length > 84 ? `${p.description.slice(0, 84)}…` : p.description}
          </span>
        </>
      ),
    },
    {
      key: 'range',
      header: 'Date range',
      render: (p) => (
        <span className="nowrap">
          {fmtDayMonth(p.startDate)} – {fmtDayMonth(p.endDate)}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { key: 'createdBy', header: 'Created by', hideMobile: true, render: (p) => shortName(p.createdByUserId) },
    {
      key: 'updated',
      header: 'Last updated',
      hideMobile: true,
      render: (p) => <span className="nowrap">{fmtDateTime(p.updatedAt)}</span>,
    },
    { key: 'aircraft', header: 'Aircraft', numeric: true, render: (p) => p.aircraftIds.length },
    { key: 'flights', header: 'Flights', numeric: true, render: (p) => p.flightIds.length },
    {
      key: 'edit',
      header: '',
      render: (p) =>
        p.status === 'Draft' ? (
          <Link to={paths.fleetPlanEdit(p.id)} className="table-link">
            Edit
          </Link>
        ) : (
          <span className="muted">—</span>
        ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Fleet planning' }, { label: 'Plans' }]}
        title="Fleet plans"
        description="Weekly operating plans linking aircraft, flights and maintenance windows. Published plans drive the availability board; drafts are visible only to fleet planning."
        actions={
          <Link to={paths.fleetPlanNew} className="btn btn--primary">
            <Plus size={15} aria-hidden="true" />
            New plan
          </Link>
        }
      />

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">
            <CalendarRange size={16} aria-hidden="true" />
            Current published plan
          </h2>
        </div>
        <div className="card-body">
          <div className="row-list-item" style={{ padding: 0, border: 'none' }}>
            <div className="row-main">
              <div className="row-title" style={{ fontSize: 'var(--fs-md)' }}>
                <Link to={paths.fleetPlan(currentPlan.id)} className="table-link ref">
                  {currentPlan.id}
                </Link>
                <span>{currentPlan.name}</span>
                <StatusBadge status={currentPlan.status} />
              </div>
              <div className="row-sub">
                {fmtDayMonth(currentPlan.startDate)} – {fmtDayMonth(currentPlan.endDate)} · Base {currentPlan.base} ·{' '}
                {currentPlan.aircraftIds.length} aircraft · {currentPlan.flightIds.length} flights ·{' '}
                {currentPlan.conflicts.length} conflicts flagged
              </div>
              <div className="row-sub">
                Approved by {shortName(currentPlan.approvedByUserId)}
                {currentPlan.approvedAt ? ` · ${fmtDateTime(currentPlan.approvedAt)}` : ''}
              </div>
            </div>
            <div className="row-end">
              <Link to={paths.fleetPlan(currentPlan.id)} className="btn btn--secondary btn--sm">
                View plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search plan name, reference, base…" value={q} onChange={setQ} width={280} />
            <SelectFilter label="Status" allLabel="All statuses" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            <FilterSpacer />
            <Segmented
              label="View"
              value={view}
              onChange={setView}
              options={[
                { label: 'List', value: 'list', icon: <Rows3 size={13} aria-hidden="true" /> },
                { label: 'Calendar', value: 'calendar', icon: <LayoutGrid size={13} aria-hidden="true" /> },
              ]}
            />
          </FilterBar>
        </div>

        {view === 'list' ? (
          <DataTable
            caption="Fleet plans"
            columns={columns}
            rows={rows}
            rowKey={(p) => p.id}
            empty={
              <EmptyState icon={CalendarRange} title="No plans match these filters">
                Adjust the search or clear the status filter to see the rest of the plan history.
              </EmptyState>
            }
            footer={<TableFooter shown={rows.length} total={fleetPlans.length} />}
          />
        ) : (
          <div className="card-body">
            <div className="card-list">
              {rows.map((p) => (
                <div className="item-card" key={p.id} data-tone={p.conflicts.some((c) => c.severity === 'Critical') ? 'red' : undefined}>
                  <div className="item-card-head">
                    <Link to={paths.fleetPlan(p.id)} className="table-link ref item-card-title">
                      {p.id}
                    </Link>
                    <span style={{ marginLeft: 'auto' }}>
                      <StatusBadge status={p.status} />
                    </span>
                  </div>
                  <div className="item-card-body">{p.name}</div>
                  <div className="item-card-meta">
                    <span>
                      {fmtDayMonth(p.startDate)} – {fmtDayMonth(p.endDate)}
                    </span>
                    <span>Base {p.base}</span>
                    <span>{p.aircraftIds.length} aircraft</span>
                    <span>{p.flightIds.length} flights</span>
                    {p.conflicts.length > 0 && <span>{p.conflicts.length} conflicts</span>}
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
