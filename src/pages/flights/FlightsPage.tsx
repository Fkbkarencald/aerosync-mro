import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Plus } from 'lucide-react'
import { paths } from '@/app/paths'
import { flights, openDefectCount, shortName } from '@/data'
import { fmtDayMonth, fmtDuration, fmtTime } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { RiskBadge, StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Misc'
import type { Flight } from '@/data/types'

const DATE_OPTIONS = ['Tue 14 Jul', 'Wed 15 Jul (today)', 'Thu 16 Jul']
const DATE_BY_OPTION: Record<string, string> = {
  'Tue 14 Jul': '2026-07-14',
  'Wed 15 Jul (today)': '2026-07-15',
  'Thu 16 Jul': '2026-07-16',
}
const PORT_OPTIONS = ['MEL', 'MQL', 'ABX', 'WGA', 'DBO', 'BHQ', 'MGB', 'GFF']
const RISK_OPTIONS = ['Clear', 'Monitor', 'At Risk', 'No Go']

export function FlightsPage() {
  const [date, setDate] = useState('Wed 15 Jul (today)')
  const [q, setQ] = useState('')
  const [dep, setDep] = useState('')
  const [arr, setArr] = useState('')
  const [risk, setRisk] = useState('')

  const rows = useMemo(
    () =>
      flights.filter((f) => {
        if (date && f.date !== DATE_BY_OPTION[date]) return false
        if (dep && f.origin !== dep) return false
        if (arr && f.destination !== arr) return false
        if (risk && f.risk !== risk) return false
        if (q) {
          const text = `${f.id} ${f.origin} ${f.destination} ${f.aircraftId ?? ''}`.toLowerCase()
          if (!text.includes(q.toLowerCase())) return false
        }
        return true
      }),
    [date, q, dep, arr, risk],
  )

  const columns: Column<Flight>[] = [
    {
      key: 'flight',
      header: 'Flight',
      render: (f) => (
        <>
          <Link to={paths.flight(f.id)} className="table-link ref">
            {f.id}
          </Link>
          <span className="cell-sub">{f.captainUserId ? shortName(f.captainUserId) : 'Westline crew'}</span>
        </>
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
        <>
          <span className="cell-main num">{fmtTime(f.schedDep)}</span>
          <span className="cell-sub">{fmtDayMonth(f.schedDep)}</span>
        </>
      ),
    },
    { key: 'arr', header: 'Sched arr', render: (f) => <span className="num">{fmtTime(f.schedArr)}</span> },
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
    {
      key: 'turnaround',
      header: 'Turnaround',
      hideMobile: true,
      render: (f) =>
        f.turnaroundMins ? (
          <>
            <span className="cell-main">{fmtDuration(f.turnaroundMins)}</span>
            {f.nextFlightId && (
              <span className="cell-sub">
                Next{' '}
                <Link to={paths.flight(f.nextFlightId)} className="ref">
                  {f.nextFlightId}
                </Link>
              </span>
            )}
          </>
        ) : (
          <span className="muted">—</span>
        ),
    },
    { key: 'risk', header: 'Maint. risk', render: (f) => <RiskBadge risk={f.risk} /> },
    { key: 'status', header: 'Status', render: (f) => <StatusBadge status={f.status} /> },
    {
      key: 'defects',
      header: 'Open defects',
      numeric: true,
      render: (f) => {
        if (!f.aircraftId) return <span className="muted">—</span>
        const n = openDefectCount(f.aircraftId)
        return n > 0 ? (
          <Link to={paths.aircraftDetail(f.aircraftId)} className="chip">
            {n} open
          </Link>
        ) : (
          <span className="muted">0</span>
        )
      },
    },
  ]

  const rowTone = (f: Flight): 'red' | 'orange' | undefined => {
    if (f.risk === 'No Go') return 'red'
    if (f.risk === 'At Risk') return 'orange'
    return undefined
  }

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Operations' }, { label: 'Flights' }]}
        title="Flights"
        description="Regional network schedule with live maintenance risk, aircraft assignment and turnaround detail for every departure."
        actions={
          <Link to={paths.flightNew} className="btn btn--primary">
            <Plus size={15} aria-hidden="true" />
            Create flight
          </Link>
        }
      />

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SelectFilter label="Date" options={DATE_OPTIONS} value={date} onChange={setDate} />
            <SearchInput placeholder="Search flight, port, aircraft…" value={q} onChange={setQ} width={240} />
            <SelectFilter label="Departure" allLabel="Any departure" options={PORT_OPTIONS} value={dep} onChange={setDep} />
            <SelectFilter label="Arrival" allLabel="Any arrival" options={PORT_OPTIONS} value={arr} onChange={setArr} />
            <SelectFilter label="Risk" allLabel="Any risk" options={RISK_OPTIONS} value={risk} onChange={setRisk} />
          </FilterBar>
        </div>
        <DataTable
          caption="Flight schedule"
          columns={columns}
          rows={rows}
          rowKey={(f) => f.id}
          rowTone={rowTone}
          empty={
            <EmptyState icon={CalendarDays} title="No flights match these filters">
              Adjust the date, ports or risk filter to see more of the schedule.
            </EmptyState>
          }
          footer={<TableFooter shown={rows.length} total={flights.length} />}
        />
      </section>
    </div>
  )
}
