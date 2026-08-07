import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Plus, TriangleAlert } from 'lucide-react'
import { paths } from '@/app/paths'
import { defects as seedDefects, shortName } from '@/data'
import { useWorkflow } from '@/workflow/useWorkflow'
import { fmtDateTime, fmtRelative } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { MetricCard } from '@/components/ui/MetricCard'
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Misc'
import type { Defect } from '@/data/types'

const STATUS_OPTIONS = ['Reported', 'Under Review', 'Deferred', 'Work Order Created', 'Rectified', 'Closed', 'Cancelled']
const SEVERITY_OPTIONS = ['Minor', 'Significant', 'Critical']
const AIRCRAFT_OPTIONS = [...new Set(seedDefects.map((d) => d.aircraftId))].sort()
const SOURCE_OPTIONS = ['Pilot Report', 'Line Inspection', 'Scheduled Check', 'Cabin Crew']

export function DefectsPage() {
  const { state } = useWorkflow()
  const { defects } = state
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [severity, setSeverity] = useState('')
  const [aircraft, setAircraft] = useState('')
  const [source, setSource] = useState('')

  const openDefects = defects.filter((d) => d.status !== 'Closed' && d.status !== 'Cancelled')
  const reviewQueueDefects = defects.filter((d) => d.status === 'Reported' || d.status === 'Under Review')
  const defectSeverityBreakdown = {
    critical: openDefects.filter((d) => d.severity === 'Critical').length,
    significant: openDefects.filter((d) => d.severity === 'Significant').length,
    minor: openDefects.filter((d) => d.severity === 'Minor').length,
  }
  const deferredCount = defects.filter((d) => d.status === 'Deferred').length
  const closedThisMonthCount = defects.filter((d) => d.status === 'Closed' && d.closedAt?.startsWith('2026-07')).length

  const rows = useMemo(
    () =>
      [...defects]
        .filter((d) => {
          const text = `${d.id} ${d.title} ${d.aircraftId}`.toLowerCase()
          if (q && !text.includes(q.toLowerCase())) return false
          if (status && d.status !== status) return false
          if (severity && d.severity !== severity) return false
          if (aircraft && d.aircraftId !== aircraft) return false
          if (source && d.source !== source) return false
          return true
        })
        .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt)),
    [defects, q, status, severity, aircraft, source],
  )

  const columns: Column<Defect>[] = [
    {
      key: 'ref',
      header: 'Reference',
      render: (d) => (
        <Link to={paths.defect(d.id)} className="table-link ref">
          {d.id}
        </Link>
      ),
    },
    {
      key: 'aircraft',
      header: 'Aircraft',
      render: (d) => (
        <Link to={paths.aircraftDetail(d.aircraftId)} className="chip ref">
          {d.aircraftId}
        </Link>
      ),
    },
    {
      key: 'flight',
      header: 'Flight',
      hideMobile: true,
      render: (d) =>
        d.flightId ? (
          <Link to={paths.flight(d.flightId)} className="table-link ref">
            {d.flightId}
          </Link>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: 'ata',
      header: 'ATA',
      hideMobile: true,
      render: (d) => <span>{d.ataChapter}</span>,
    },
    {
      key: 'summary',
      header: 'Summary',
      render: (d) => (
        <>
          <span className="cell-main">{d.title}</span>
          <span className="cell-sub">{d.description}</span>
        </>
      ),
    },
    { key: 'severity', header: 'Severity', render: (d) => <SeverityBadge severity={d.severity} /> },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
    {
      key: 'reporter',
      header: 'Reported by',
      hideMobile: true,
      render: (d) => shortName(d.reportedByUserId),
    },
    {
      key: 'reported',
      header: 'Reported',
      hideMobile: true,
      render: (d) => (
        <>
          <span className="nowrap">{fmtDateTime(d.reportedAt)}</span>
          <span className="cell-sub">{fmtRelative(d.reportedAt)}</span>
        </>
      ),
    },
    {
      key: 'wo',
      header: 'Work order',
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

  const isOpen = (d: Defect) => d.status !== 'Closed' && d.status !== 'Cancelled'

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Operations' }, { label: 'Defects' }]}
        title="Defects"
        description="Every defect reported across the fleet — pilot reports, line inspection findings, cabin crew logs and scheduled-check discoveries."
        actions={
          <>
            <Link to={paths.defectReview} className="btn btn--secondary">
              <Inbox size={15} aria-hidden="true" />
              Review queue
            </Link>
            <Link to={paths.defectNew} className="btn btn--primary">
              <Plus size={15} aria-hidden="true" />
              Report defect
            </Link>
          </>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Open defects" value={openDefects.length} tone="blue" />
        <MetricCard label="Awaiting review" value={reviewQueueDefects.length} tone="blue" to={paths.defectReview} />
        <MetricCard label="Critical" value={defectSeverityBreakdown.critical} tone="red" />
        <MetricCard label="Deferred" value={deferredCount} tone="amber" />
        <MetricCard label="Closed this month" value={closedThisMonthCount} tone="green" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search reference, title, aircraft…" value={q} onChange={setQ} width={260} />
            <SelectFilter label="Status" allLabel="All statuses" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            <SelectFilter label="Severity" allLabel="All severities" options={SEVERITY_OPTIONS} value={severity} onChange={setSeverity} />
            <SelectFilter label="Aircraft" allLabel="All aircraft" options={AIRCRAFT_OPTIONS} value={aircraft} onChange={setAircraft} />
            <SelectFilter label="Source" allLabel="All sources" options={SOURCE_OPTIONS} value={source} onChange={setSource} />
          </FilterBar>
        </div>
        <DataTable
          caption="Defect log"
          columns={columns}
          rows={rows}
          rowKey={(d) => d.id}
          rowTone={(d) =>
            isOpen(d) && d.severity === 'Critical' ? 'red' : isOpen(d) && d.severity === 'Significant' ? 'orange' : undefined
          }
          empty={
            <EmptyState icon={TriangleAlert} title="No defects match these filters">
              Adjust the search or clear a filter to see the rest of the log.
            </EmptyState>
          }
          footer={<TableFooter shown={rows.length} total={defects.length} />}
        />
      </section>
    </div>
  )
}
