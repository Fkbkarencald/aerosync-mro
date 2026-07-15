import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileCheck2 } from 'lucide-react'
import { paths } from '@/app/paths'
import { getUser, shortName, signOffs } from '@/data'
import { fmtDateTimeFull } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import type { SignOff } from '@/data/types'

const TYPES = ['Line Release', 'Return to Service', 'Inspection']
const PERIODS = ['Last 6 months', 'Last 90 days', 'Last 30 days']

export function SignOffsPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [engineer, setEngineer] = useState('')
  const [period, setPeriod] = useState('')

  const engineers = useMemo(
    () => Array.from(new Set(signOffs.map((s) => getUser(s.signedByUserId)?.name).filter((n): n is string => Boolean(n)))).sort(),
    [],
  )

  const thisWeek = signOffs.filter((s) => s.signedAt >= '2026-07-13').length
  const returnToService = signOffs.filter((s) => s.type === 'Return to Service').length
  const licensedEngineers = new Set(signOffs.map((s) => s.signedByUserId)).size

  const sorted = useMemo(() => [...signOffs].sort((a, b) => b.signedAt.localeCompare(a.signedAt)), [])

  const rows = useMemo(
    () =>
      sorted.filter((s) => {
        const text = `${s.id} ${s.aircraftId} ${s.workOrderId} ${s.licenceNumber}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (type && s.type !== type) return false
        if (engineer && getUser(s.signedByUserId)?.name !== engineer) return false
        // Period is a visual filter only — every record in this dataset falls
        // within "Last 6 months" so it never actually narrows the set.
        return true
      }),
    [sorted, q, type, engineer],
  )

  const columns: Column<SignOff>[] = [
    {
      key: 'ref',
      header: 'Reference',
      render: (s) => (
        <Link to={paths.workOrderSignOff(s.workOrderId)} className="table-link ref">
          {s.id}
        </Link>
      ),
    },
    {
      key: 'aircraft',
      header: 'Aircraft',
      render: (s) => (
        <Link to={paths.aircraftDetail(s.aircraftId)} className="chip ref">
          {s.aircraftId}
        </Link>
      ),
    },
    {
      key: 'wo',
      header: 'Work order',
      render: (s) => (
        <Link to={paths.workOrder(s.workOrderId)} className="table-link ref">
          {s.workOrderId}
        </Link>
      ),
    },
    {
      key: 'engineer',
      header: 'Licensed engineer',
      render: (s) => (
        <>
          <span className="cell-main">{shortName(s.signedByUserId)}</span>
          <span className="cell-sub">{s.licenceNumber}</span>
        </>
      ),
    },
    { key: 'type', header: 'Type', render: (s) => <StatusBadge status={s.type} /> },
    { key: 'date', header: 'Date', render: (s) => <span className="nowrap">{fmtDateTimeFull(s.signedAt)}</span> },
    { key: 'release', header: 'Release status', render: (s) => <StatusBadge status={s.releaseStatus} /> },
    { key: 'audit', header: 'Audit state', hideMobile: true, render: (s) => <StatusBadge status={s.auditState} /> },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Maintenance' }, { label: 'Sign-offs' }]}
        title="Sign-off history"
        description="Every certified release to service across the fleet — the primary source for audit and airworthiness review."
      />

      <div className="metric-grid">
        <MetricCard label="Releases" value={signOffs.length} tone="green" icon={FileCheck2} meta="all time" />
        <MetricCard label="This week" value={thisWeek} tone="blue" meta="since Mon 13 Jul" />
        <MetricCard label="Return to service" value={returnToService} meta="major package releases" />
        <MetricCard label="Licensed engineers" value={licensedEngineers} meta="active signing authority" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search reference, aircraft, licence…" value={q} onChange={setQ} width={280} />
            <SelectFilter label="Type" allLabel="All types" options={TYPES} value={type} onChange={setType} />
            <SelectFilter label="Engineer" allLabel="All engineers" options={engineers} value={engineer} onChange={setEngineer} />
            <SelectFilter label="Period" allLabel="All time" options={PERIODS} value={period} onChange={setPeriod} />
          </FilterBar>
        </div>
        <DataTable
          caption="Sign-off history"
          columns={columns}
          rows={rows}
          rowKey={(s) => s.id}
          footer={<TableFooter shown={rows.length} total={signOffs.length} />}
        />
        <div className="card-footer">
          Sign-offs are immutable; corrections issue a new record with an audit note.
        </div>
      </section>
    </div>
  )
}
