import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Plus } from 'lucide-react'
import { paths } from '@/app/paths'
import { getPart, partRequests, shortName } from '@/data'
import { fmtDateTime, fmtRelative } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { EmptyState } from '@/components/ui/Misc'
import type { PartRequest } from '@/data/types'

const URGENCIES = ['AOG', 'Urgent', 'Routine']
const STATUSES = ['Open', 'Approved', 'Picked', 'In Transit', 'Issued', 'Backordered']

export function RequestsPage() {
  const [q, setQ] = useState('')
  const [urgency, setUrgency] = useState('')
  const [status, setStatus] = useState('')

  const openCount = partRequests.filter((r) => r.status !== 'Issued' && r.status !== 'Cancelled').length
  const aogCount = partRequests.filter((r) => r.urgency === 'AOG').length
  const backorderedCount = partRequests.filter((r) => r.status === 'Backordered').length
  const issuedThisWeek = partRequests.filter((r) => r.status === 'Issued').length

  const sorted = useMemo(
    () => [...partRequests].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)),
    [],
  )

  const rows = useMemo(
    () =>
      sorted.filter((r) => {
        const part = getPart(r.partId)
        const text = `${r.id} ${r.workOrderId} ${r.aircraftId} ${part?.description ?? ''} ${r.note ?? ''}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (urgency && r.urgency !== urgency) return false
        if (status && r.status !== status) return false
        return true
      }),
    [sorted, q, urgency, status],
  )

  const columns: Column<PartRequest>[] = [
    {
      key: 'ref',
      header: 'Request',
      render: (r) => (
        <>
          <span className="ref cell-main">{r.id}</span>
          <span className="cell-sub">{fmtRelative(r.requestedAt)}</span>
        </>
      ),
    },
    {
      key: 'wo',
      header: 'Work order',
      render: (r) => (
        <Link to={paths.workOrder(r.workOrderId)} className="table-link ref">
          {r.workOrderId}
        </Link>
      ),
    },
    {
      key: 'aircraft',
      header: 'Aircraft',
      render: (r) => (
        <Link to={paths.aircraftDetail(r.aircraftId)} className="chip ref">
          {r.aircraftId}
        </Link>
      ),
    },
    {
      key: 'part',
      header: 'Part',
      render: (r) => (
        <>
          <span className="ref cell-main">{r.partId}</span>
          <span className="cell-sub">{getPart(r.partId)?.description ?? '—'}</span>
        </>
      ),
    },
    { key: 'qty', header: 'Qty', numeric: true, render: (r) => <span className="num">{r.quantity}</span> },
    { key: 'urgency', header: 'Urgency', render: (r) => <PriorityBadge priority={r.urgency} /> },
    { key: 'by', header: 'Requested by', hideMobile: true, render: (r) => shortName(r.requestedByUserId) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'required',
      header: 'Required by',
      render: (r) => <span className="nowrap">{fmtDateTime(r.requiredBy)}</span>,
    },
    {
      key: 'note',
      header: 'Note',
      hideMobile: true,
      render: (r) => <span className="cell-sub">{r.note ?? '—'}</span>,
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Supply & Commercial' }, { label: 'Part requests' }]}
        title="Part requests"
        description="Requests raised from work orders, tracked from open through to issue at the bench or line."
        actions={
          <button type="button" className="btn btn--primary">
            <Plus size={15} aria-hidden="true" />
            New request
          </button>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Open requests" value={openCount} tone="blue" icon={ClipboardList} meta="not yet issued" />
        <MetricCard label="AOG urgency" value={aogCount} tone="red" meta="grounding recovery" />
        <MetricCard label="Backordered" value={backorderedCount} tone="orange" meta="awaiting supplier" />
        <MetricCard label="Issued this week" value={issuedThisWeek} tone="green" meta="fulfilled at stores" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search request, work order, part…" value={q} onChange={setQ} width={280} />
            <SelectFilter label="Urgency" allLabel="All urgencies" options={URGENCIES} value={urgency} onChange={setUrgency} />
            <SelectFilter label="Status" allLabel="All statuses" options={STATUSES} value={status} onChange={setStatus} />
          </FilterBar>
        </div>
        <DataTable
          caption="Part requests"
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          rowTone={(r) => (r.urgency === 'AOG' && r.status !== 'Issued' ? 'red' : r.status === 'Backordered' ? 'orange' : undefined)}
          empty={
            <EmptyState icon={ClipboardList} title="No requests match these filters">
              Adjust the search or clear a filter to see the rest of the queue.
            </EmptyState>
          }
          footer={<TableFooter shown={rows.length} total={partRequests.length} />}
        />
      </section>
    </div>
  )
}
