import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid, Rows3, TriangleAlert } from 'lucide-react'
import { paths } from '@/app/paths'
import { currentUser, myWorkOrders } from '@/data'
import { fmtDateTime } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Segmented } from '@/components/ui/FilterBar'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import { EmptyState, ProgressBar } from '@/components/ui/Misc'
import type { WorkOrder } from '@/data/types'

const mine = myWorkOrders()

const dueSoon = mine
  .filter((w) => w.status !== 'Closed' && w.status !== 'Cancelled')
  .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
const awaitingParts = mine.filter((w) => w.status === 'Awaiting Parts')
const awaitingInspection = mine.filter((w) => w.status === 'Awaiting Inspection')
const readyForSignOff = mine.filter((w) => w.status === 'Ready for Sign-off')
const completedRecently = mine.filter((w) => w.status === 'Closed')

const dueTodayCount = mine.filter(
  (w) => (w.dueAt.startsWith('2026-07-15') || w.dueAt.startsWith('2026-07-16')) && w.status !== 'Closed' && w.status !== 'Cancelled',
).length

function woProgress(w: WorkOrder): number {
  const done = w.tasks.filter((t) => t.done).length
  return w.tasks.length === 0 ? 0 : (done / w.tasks.length) * 100
}

function rowTone(w: WorkOrder): 'red' | 'orange' | undefined {
  if (w.priority === 'AOG' && w.status !== 'Closed' && w.status !== 'Cancelled') return 'red'
  if (w.status === 'Ready for Sign-off' || w.status === 'Awaiting Parts') return 'orange'
  return undefined
}

function ItemCard({ w }: { w: WorkOrder }) {
  return (
    <div className="item-card" data-tone={rowTone(w)}>
      <div className="item-card-head">
        <Link to={paths.workOrder(w.id)} className="table-link ref item-card-title">
          {w.id}
        </Link>
        <PriorityBadge priority={w.priority} />
      </div>
      <div className="item-card-body">
        {w.title} · <span className="ref">{w.aircraftId}</span>
      </div>
      <div className="item-card-meta">
        <span>Due {fmtDateTime(w.dueAt)}</span>
        <StatusBadge status={w.status} />
      </div>
      <ProgressBar value={woProgress(w)} tone={w.status === 'Ready for Sign-off' ? 'orange' : undefined} />
      {w.status === 'Ready for Sign-off' && (
        <Link to={paths.workOrderSignOff(w.id)} className="btn btn--primary btn--sm" style={{ alignSelf: 'flex-start' }}>
          Certify now
        </Link>
      )}
    </div>
  )
}

const columns: Column<WorkOrder>[] = [
  {
    key: 'ref',
    header: 'Reference',
    render: (w) => (
      <Link to={paths.workOrder(w.id)} className="table-link ref">
        {w.id}
      </Link>
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
  { key: 'title', header: 'Title', render: (w) => <span className="cell-main">{w.title}</span> },
  { key: 'priority', header: 'Priority', render: (w) => <PriorityBadge priority={w.priority} /> },
  { key: 'status', header: 'Status', render: (w) => <StatusBadge status={w.status} /> },
  { key: 'due', header: 'Due', render: (w) => <span className="nowrap">{fmtDateTime(w.dueAt)}</span> },
  { key: 'progress', header: 'Progress', render: (w) => <ProgressBar value={woProgress(w)} /> },
  {
    key: 'action',
    header: '',
    render: (w) =>
      w.status === 'Ready for Sign-off' ? (
        <Link to={paths.workOrderSignOff(w.id)} className="btn btn--primary btn--sm">
          Certify
        </Link>
      ) : (
        <Link to={paths.workOrder(w.id)} className="btn btn--secondary btn--sm">
          Open
        </Link>
      ),
  },
]

export function MyWorkOrdersPage() {
  const [view, setView] = useState('cards')

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Operations' }, { label: 'My assignments' }]}
        title="My assignments"
        description={`Work orders assigned to you or where you're the inspecting engineer, ${currentUser.name} — licensed under ${currentUser.licenceNumber}.`}
        actions={
          <Link to={paths.defectNew} className="btn btn--secondary">
            <TriangleAlert size={15} aria-hidden="true" />
            Report defect
          </Link>
        }
      />

      <div className="stat-strip" role="group" aria-label="Assignment summary">
        <div className="stat">
          <span className="stat-label">Assigned</span>
          <span className="stat-value">{dueSoon.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Due today</span>
          <span className="stat-value">{dueTodayCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Awaiting inspection</span>
          <span className="stat-value">{awaitingInspection.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Ready for sign-off</span>
          <span className="stat-value">{readyForSignOff.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Segmented
          label="View"
          value={view}
          onChange={setView}
          options={[
            { label: 'Cards', value: 'cards', icon: <LayoutGrid size={13} aria-hidden="true" /> },
            { label: 'Table', value: 'table', icon: <Rows3 size={13} aria-hidden="true" /> },
          ]}
        />
      </div>

      {mine.length === 0 ? (
        <section className="card">
          <div className="card-body">
            <EmptyState icon={TriangleAlert} title="No assignments">
              You have no work orders assigned right now.
            </EmptyState>
          </div>
        </section>
      ) : view === 'table' ? (
        <section className="card">
          <DataTable caption="My assigned work orders" columns={columns} rows={mine} rowKey={(w) => w.id} rowTone={rowTone} />
        </section>
      ) : (
        <div className="section-stack">
          {readyForSignOff.length > 0 && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Ready for sign-off</h2>
              </div>
              <div className="card-body">
                <div className="card-list">
                  {readyForSignOff.map((w) => (
                    <ItemCard w={w} key={w.id} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {dueSoon.length > 0 && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Due soon</h2>
              </div>
              <div className="card-body">
                <div className="card-list">
                  {dueSoon.map((w) => (
                    <ItemCard w={w} key={w.id} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {awaitingParts.length > 0 && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Awaiting parts</h2>
              </div>
              <div className="card-body">
                <div className="card-list">
                  {awaitingParts.map((w) => (
                    <ItemCard w={w} key={w.id} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {awaitingInspection.length > 0 && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Awaiting inspection</h2>
              </div>
              <div className="card-body">
                <div className="card-list">
                  {awaitingInspection.map((w) => (
                    <ItemCard w={w} key={w.id} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {completedRecently.length > 0 && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Completed recently</h2>
              </div>
              <div className="card-body">
                <div className="card-list">
                  {completedRecently.map((w) => (
                    <ItemCard w={w} key={w.id} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
