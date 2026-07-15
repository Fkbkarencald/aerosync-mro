import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, PlaneTakeoff, Plus, Wrench, OctagonAlert } from 'lucide-react'
import { paths } from '@/app/paths'
import { aircraft, fleetSummary, getFlight } from '@/data'
import { fmtDayMonth, fmtNumber, fmtTime } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { StatusBadge, StatusCell } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Misc'
import type { Aircraft } from '@/data/types'

const TYPE_OPTIONS = ['ATR 72-600', 'DHC-8-315', 'Saab 340B', 'King Air 350']
const STATUS_OPTIONS = ['Serviceable', 'Unserviceable', 'Under Maintenance', 'AOG', 'Restricted']
const BASE_OPTIONS = ['MEL', 'MQL', 'ABX']

export function AircraftListPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [base, setBase] = useState('')

  const rows = useMemo(
    () =>
      aircraft.filter((a) => {
        const text = `${a.registration} ${a.manufacturer} ${a.model} ${a.serialNumber}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (type && a.model !== type) return false
        if (status && a.status !== status) return false
        if (base && a.base !== base) return false
        return true
      }),
    [q, type, status, base],
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
          <span className="cell-sub">{a.operator}</span>
        </>
      ),
    },
    {
      key: 'type',
      header: 'Manufacturer / model',
      render: (a) => (
        <>
          <span style={{ fontWeight: 550 }}>{a.model}</span>
          <span className="cell-sub">{a.manufacturer}</span>
        </>
      ),
    },
    { key: 'sn', header: 'Serial no.', hideMobile: true, render: (a) => <span className="ref">{a.serialNumber}</span> },
    { key: 'base', header: 'Base', hideMobile: true, render: (a) => a.base },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'availability',
      header: 'Availability',
      render: (a) => <StatusCell status={a.availability} reason={a.availabilityReason} />,
    },
    { key: 'hours', header: 'Hours', numeric: true, hideMobile: true, render: (a) => <span className="num">{fmtNumber(a.totalHours, 1)}</span> },
    { key: 'cycles', header: 'Cycles', numeric: true, hideMobile: true, render: (a) => <span className="num">{fmtNumber(a.totalCycles)}</span> },
    {
      key: 'next-flight',
      header: 'Next flight',
      hideMobile: true,
      render: (a) => {
        const f = a.nextFlightId ? getFlight(a.nextFlightId) : undefined
        if (!f) return <span className="muted">—</span>
        return (
          <>
            <Link to={paths.flight(f.id)} className="table-link ref">
              {f.id}
            </Link>
            <span className="cell-sub">
              {fmtDayMonth(f.schedDep)}, {fmtTime(f.schedDep)}
            </span>
          </>
        )
      },
    },
    {
      key: 'next-maint',
      header: 'Next maintenance',
      render: (a) =>
        a.nextMaintenance ? (
          <>
            <span style={{ fontWeight: 550 }}>{a.nextMaintenance.label}</span>
            <span className="cell-sub">{fmtDayMonth(a.nextMaintenance.date)}, {fmtTime(a.nextMaintenance.date)}</span>
          </>
        ) : (
          <span className="muted">—</span>
        ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Maintenance' }, { label: 'Aircraft registry' }]}
        title="Aircraft registry"
        description="Master record for every tail — identity, airworthiness summary and operational availability."
        actions={
          <Link to={paths.aircraftNew} className="btn btn--primary">
            <Plus size={15} aria-hidden="true" />
            Register aircraft
          </Link>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Fleet size" value={fleetSummary.total} icon={Plane} meta="4 types · 2 operators" />
        <MetricCard label="Serviceable" value={aircraft.filter((a) => a.status === 'Serviceable').length} tone="green" icon={PlaneTakeoff} meta="incl. assigned tails" />
        <MetricCard label="In maintenance" value={aircraft.filter((a) => a.status === 'Under Maintenance').length} tone="blue" icon={Wrench} meta="hangar + awaiting release" />
        <MetricCard label="AOG / unserviceable" value={aircraft.filter((a) => a.status === 'AOG' || a.status === 'Unserviceable').length} tone="red" icon={OctagonAlert} meta="VH-RXT · VH-LWK" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search registration, type, serial…" value={q} onChange={setQ} width={280} />
            <SelectFilter label="Type" allLabel="All types" options={TYPE_OPTIONS} value={type} onChange={setType} />
            <SelectFilter label="Status" allLabel="All statuses" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            <SelectFilter label="Base" allLabel="All bases" options={BASE_OPTIONS} value={base} onChange={setBase} />
          </FilterBar>
        </div>
        <DataTable
          caption="Aircraft registry"
          columns={columns}
          rows={rows}
          rowKey={(a) => a.id}
          rowTone={(a) => (a.status === 'AOG' ? 'red' : a.status === 'Unserviceable' ? 'orange' : undefined)}
          empty={
            <EmptyState icon={Plane} title="No aircraft match these filters">
              Adjust the search or clear a filter to see the full registry.
            </EmptyState>
          }
          footer={<TableFooter shown={rows.length} total={aircraft.length} />}
        />
      </section>
    </div>
  )
}
