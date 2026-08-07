import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardCheck, Plus, Wrench } from 'lucide-react'
import { paths } from '@/app/paths'
import { getUser, shortName, users, workOrders as seedWorkOrders } from '@/data'
import { useWorkflow } from '@/workflow/useWorkflow'
import { fmtDateTime, fmtRelative } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { MetricCard } from '@/components/ui/MetricCard'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import { ProgressBar, EmptyState } from '@/components/ui/Misc'
import type { WorkOrder } from '@/data/types'

const STATUS_OPTIONS = ['Open', 'Assigned', 'In Progress', 'Awaiting Parts', 'Awaiting Inspection', 'Ready for Sign-off', 'Closed', 'Cancelled']
const PRIORITY_OPTIONS = ['Routine', 'Urgent', 'AOG']
const AIRCRAFT_OPTIONS = [...new Set(seedWorkOrders.map((w) => w.aircraftId))].sort()
const ENGINEER_OPTIONS = [...new Set(users.filter((u) => u.role === 'Engineer' || u.role === 'Licensed Engineer').map((u) => u.name))].sort()

export function WorkOrdersPage() {
  const { state } = useWorkflow()
  const { workOrders } = state
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [aircraft, setAircraft] = useState('')
  const [engineer, setEngineer] = useState('')

  const openWorkOrders = workOrders.filter((w) => w.status !== 'Closed' && w.status !== 'Cancelled')
  const aogOpenCount = openWorkOrders.filter((w) => w.priority === 'AOG').length
  const awaitingPartsCount = workOrders.filter((w) => w.status === 'Awaiting Parts').length
  const readyForSignOffCount = workOrders.filter((w) => w.status === 'Ready for Sign-off').length
  const closedCount = workOrders.filter((w) => w.status === 'Closed').length

  const rows = useMemo(
    () =>
      [...workOrders]
        .filter((w) => {
          const text = `${w.id} ${w.title} ${w.aircraftId}`.toLowerCase()
          if (q && !text.includes(q.toLowerCase())) return false
          if (status && w.status !== status) return false
          if (priority && w.priority !== priority) return false
          if (aircraft && w.aircraftId !== aircraft) return false
          if (engineer) {
            const name = getUser(w.assignedToUserId ?? '')?.name
            if (name !== engineer) return false
          }
          return true
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [workOrders, q, status, priority, aircraft, engineer],
  )

  const columns: Column<WorkOrder>[] = [
    {
      key: 'ref',
      header: 'Reference',
      render: (w) => (
        <>
          <Link to={paths.workOrder(w.id)} className="table-link ref">
            {w.id}
          </Link>
          <span className="cell-sub">{fmtRelative(w.createdAt)}</span>
        </>
      ),
    },
    {
      key: 'aircraft',
      header: 'Aircraft',
      render: (w) => (
        <Link to={paths.aircraftDetail(w.aircraftId)} className="chip ref">
          {w.aircraftId}
        </Link>
      ),
    },
    {
      key: 'defect',
      header: 'Source defect',
      hideMobile: true,
      render: (w) =>
        w.defectId ? (
          <Link to={paths.defect(w.defectId)} className="table-link ref">
            {w.defectId}
          </Link>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (w) => (
        <>
          <span className="cell-main">{w.title}</span>
          <span className="cell-sub">{w.description}</span>
        </>
      ),
    },
    { key: 'priority', header: 'Priority', render: (w) => <PriorityBadge priority={w.priority} /> },
    { key: 'status', header: 'Status', render: (w) => <StatusBadge status={w.status} /> },
    { key: 'engineer', header: 'Engineer', render: (w) => shortName(w.assignedToUserId) },
    {
      key: 'due',
      header: 'Due',
      hideMobile: true,
      render: (w) => <span className="nowrap">{fmtDateTime(w.dueAt)}</span>,
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (w) => {
        const done = w.tasks.filter((t) => t.done).length
        const total = w.tasks.length
        return (
          <ProgressBar
            value={total === 0 ? 0 : (done / total) * 100}
            tone={w.status === 'Ready for Sign-off' ? 'orange' : undefined}
            label={`${done} of ${total} tasks complete`}
          />
        )
      },
    },
    {
      key: 'parts',
      header: 'Parts',
      hideMobile: true,
      render: (w) => (w.partsState === 'Not Required' ? <span className="muted">—</span> : <StatusBadge status={w.partsState} />),
    },
    {
      key: 'signoff',
      header: 'Sign-off',
      render: (w) => {
        if (w.signOffId) {
          return (
            <Link to={paths.workOrderSignOff(w.id)} className="table-link ref">
              {w.signOffId}
            </Link>
          )
        }
        if (w.status === 'Ready for Sign-off') {
          return (
            <Link to={paths.workOrderSignOff(w.id)} className="btn btn--primary btn--sm">
              Certify
            </Link>
          )
        }
        return <span className="muted">—</span>
      },
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Operations' }, { label: 'Work orders' }]}
        title="Work orders"
        description="Every maintenance work order across the fleet — from routine checks to AOG recovery — with live task, parts and sign-off progress."
        actions={
          <>
            <Link to={paths.myWorkOrders} className="btn btn--secondary">
              <ClipboardCheck size={15} aria-hidden="true" />
              My assignments
            </Link>
            <Link to={paths.workOrderNew} className="btn btn--primary">
              <Plus size={15} aria-hidden="true" />
              Create work order
            </Link>
          </>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Open" value={openWorkOrders.length} tone="blue" />
        <MetricCard label="AOG priority" value={aogOpenCount} tone="red" />
        <MetricCard label="Awaiting parts" value={awaitingPartsCount} tone="orange" />
        <MetricCard label="Ready for sign-off" value={readyForSignOffCount} tone="orange" to={paths.workOrderSignOff('WO-2026-0035')} />
        <MetricCard label="Closed" value={closedCount} tone="green" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search reference, title, aircraft…" value={q} onChange={setQ} width={260} />
            <SelectFilter label="Status" allLabel="All statuses" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            <SelectFilter label="Priority" allLabel="All priorities" options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />
            <SelectFilter label="Aircraft" allLabel="All aircraft" options={AIRCRAFT_OPTIONS} value={aircraft} onChange={setAircraft} />
            <SelectFilter label="Engineer" allLabel="All engineers" options={ENGINEER_OPTIONS} value={engineer} onChange={setEngineer} />
          </FilterBar>
        </div>
        <DataTable
          caption="Work order board"
          columns={columns}
          rows={rows}
          rowKey={(w) => w.id}
          rowTone={(w) =>
            w.priority === 'AOG' && w.status !== 'Closed' && w.status !== 'Cancelled'
              ? 'red'
              : w.status === 'Awaiting Parts' || w.status === 'Ready for Sign-off'
                ? 'orange'
                : undefined
          }
          empty={
            <EmptyState icon={Wrench} title="No work orders match these filters">
              Adjust the search or clear a filter to see the rest of the board.
            </EmptyState>
          }
          footer={<TableFooter shown={rows.length} total={workOrders.length} />}
        />
      </section>
    </div>
  )
}
