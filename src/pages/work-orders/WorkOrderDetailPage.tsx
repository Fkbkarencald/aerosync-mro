import { Link, useParams } from 'react-router-dom'
import { Clock, FileCheck2, Pencil, Printer, Wrench } from 'lucide-react'
import { paths } from '@/app/paths'
import { getAircraft, getPart, getSignOff, getWorkOrder, requestsForWorkOrder, shortName, userName } from '@/data'
import { fmtDate, fmtDateTime, fmtDateTimeFull } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { EntityHeader } from '@/components/ui/EntityHeader'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { Timeline } from '@/components/ui/Timeline'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { AttachmentGrid, Banner, EmptyState, ProgressBar } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'
import type { LabourEntry, PartRequest } from '@/data/types'

export function WorkOrderDetailPage() {
  const { id = '' } = useParams()
  const w = getWorkOrder(id)
  if (!w) return <NotFoundPage />

  const ac = getAircraft(w.aircraftId)
  const signOff = w.signOffId ? getSignOff(w.signOffId) : undefined
  const requests = requestsForWorkOrder(w.id)
  const done = w.tasks.filter((t) => t.done).length
  const total = w.tasks.length
  const totalHours = w.labour.reduce((sum, l) => sum + l.hours, 0)

  const requestCols: Column<PartRequest>[] = [
    {
      key: 'req',
      header: 'Request',
      render: (r) => (
        <Link to={paths.inventoryRequests} className="table-link ref">
          {r.id}
        </Link>
      ),
    },
    {
      key: 'part',
      header: 'Part',
      render: (r) => {
        const part = getPart(r.partId)
        return (
          <>
            <span className="cell-main">{part?.description ?? r.partId}</span>
            <span className="cell-sub">{r.partId}</span>
          </>
        )
      },
    },
    { key: 'qty', header: 'Qty', numeric: true, render: (r) => r.quantity },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  const labourCols: Column<LabourEntry>[] = [
    { key: 'engineer', header: 'Engineer', render: (l) => shortName(l.userId) },
    { key: 'date', header: 'Date', render: (l) => fmtDate(l.date) },
    { key: 'hours', header: 'Hours', numeric: true, render: (l) => l.hours.toFixed(1) },
    { key: 'note', header: 'Note', render: (l) => l.note },
  ]

  return (
    <div className="page">
      <Breadcrumbs crumbs={[{ label: 'Work orders', to: paths.workOrders }, { label: w.id }]} />

      <EntityHeader
        identIcon={Wrench}
        identTone={w.priority === 'AOG' ? 'red' : undefined}
        title={<span className="ref">{w.id}</span>}
        badges={
          <>
            <PriorityBadge priority={w.priority} />
            <StatusBadge status={w.status} />
          </>
        }
        subtitle={w.title}
        meta={[
          { label: 'Aircraft', value: <Link to={paths.aircraftDetail(w.aircraftId)}>{w.aircraftId}</Link> },
          ...(w.defectId ? [{ label: 'Source defect', value: <Link to={paths.defect(w.defectId)}>{w.defectId}</Link> }] : []),
          { label: 'Assigned', value: shortName(w.assignedToUserId) },
          { label: 'Due', value: fmtDateTimeFull(w.dueAt) },
          { label: 'Est / actual manhours', value: `${w.estimatedManhours}h / ${w.actualManhours}h` },
        ]}
        actions={
          <>
            {w.status === 'Ready for Sign-off' && (
              <Link to={paths.workOrderSignOff(w.id)} className="btn btn--primary">
                <FileCheck2 size={15} aria-hidden="true" />
                Perform sign-off
              </Link>
            )}
            {w.status === 'Closed' && (
              <Link to={paths.workOrderSignOff(w.id)} className="btn btn--secondary">
                <FileCheck2 size={15} aria-hidden="true" />
                View sign-off record
              </Link>
            )}
            <button type="button" className="btn btn--ghost">
              <Pencil size={15} aria-hidden="true" />
              Edit
            </button>
            <button type="button" className="btn btn--ghost">
              <Printer size={15} aria-hidden="true" />
              Print
            </button>
          </>
        }
      />

      {w.priority === 'AOG' && (
        <Banner tone="danger">
          <strong>AOG recovery.</strong> {ac?.registration ?? w.aircraftId} is grounded pending completion of this
          work order. Due {fmtDateTimeFull(w.dueAt)}.
        </Banner>
      )}

      <div className="two-col">
        <div className="col-main">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Task checklist</h2>
              <div className="card-actions">
                <ProgressBar value={total === 0 ? 0 : (done / total) * 100} label={`${done} of ${total} tasks complete`} />
              </div>
            </div>
            <div className="task-list">
              {w.tasks.map((t) => (
                <div className="task-item" key={t.seq} data-done={t.done}>
                  <input type="checkbox" className="task-check" defaultChecked={t.done} aria-label={t.title} readOnly />
                  <div className="task-text">
                    <div className="task-title">{t.title}</div>
                    {t.note && <div className="task-note">{t.note}</div>}
                    {t.done && t.completedByUserId && t.completedAt && (
                      <div className="task-note">
                        {shortName(t.completedByUserId)} · {fmtDateTime(t.completedAt)}
                      </div>
                    )}
                  </div>
                  {t.manhours !== undefined && <div className="task-hours">{t.manhours}h</div>}
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Labour entries</h2>
            </div>
            <DataTable
              caption={`Labour entries for ${w.id}`}
              columns={labourCols}
              rows={w.labour}
              rowKey={(l) => `${l.userId}-${l.date}-${l.note}`}
              compact
              empty={
                <EmptyState icon={Clock} title="No labour recorded yet">
                  Time entries will appear here once work begins.
                </EmptyState>
              }
              footer={
                w.labour.length > 0 ? (
                  <div className="table-foot">
                    <span>
                      Total hours: <strong>{totalHours.toFixed(1)}h</strong>
                    </span>
                  </div>
                ) : undefined
              }
            />
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Engineer notes</h2>
            </div>
            {w.notes.length === 0 ? (
              <div className="card-body">
                <EmptyState icon={Clock} title="No notes yet">
                  Progress notes from the assigned team will appear here.
                </EmptyState>
              </div>
            ) : (
              <div className="row-list">
                {w.notes.map((n, i) => (
                  <div className="row-list-item" key={`${n.byUserId}-${n.at}-${i}`} style={{ alignItems: 'flex-start' }}>
                    <div className="row-main">
                      <div className="row-title">
                        {shortName(n.byUserId)}
                        <span className="muted" style={{ fontWeight: 400, fontSize: 'var(--fs-sm)' }}>
                          {fmtDateTime(n.at)}
                        </span>
                      </div>
                      <p style={{ marginTop: 4 }}>{n.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Attachments</h2>
            </div>
            <div className="card-body">
              <AttachmentGrid attachments={w.attachments} />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Activity timeline</h2>
            </div>
            <div className="card-body">
              <Timeline events={w.timeline} />
            </div>
          </section>
        </div>

        <div className="col-side">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Parts</h2>
              <div className="card-actions">
                <StatusBadge status={w.partsState} />
              </div>
            </div>
            {requests.length > 0 ? (
              <DataTable caption={`Part requests for ${w.id}`} columns={requestCols} rows={requests} rowKey={(r) => r.id} compact />
            ) : (
              <div className="card-body">
                <p className="muted">No parts required.</p>
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Inspection</h2>
            </div>
            <div className="card-body">
              {w.inspection.required ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <DetailGrid
                    items={[
                      { label: 'Type', value: w.inspection.type ?? '—' },
                      { label: 'Status', value: <StatusBadge status={w.inspection.status ?? 'Pending'} /> },
                      { label: 'Inspector', value: w.inspection.inspectorUserId ? shortName(w.inspection.inspectorUserId) : 'To be assigned' },
                    ]}
                  />
                  {w.inspection.note && <p className="muted">{w.inspection.note}</p>}
                </div>
              ) : (
                <p className="muted">No independent inspection required.</p>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Sign-off</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {signOff ? (
                <>
                  <Banner tone="info">Released to service</Banner>
                  <DetailGrid
                    items={[
                      { label: 'Reference', value: <span className="ref">{signOff.id}</span> },
                      { label: 'Type', value: signOff.type },
                      { label: 'Signed by', value: userName(signOff.signedByUserId) },
                      { label: 'Licence', value: <span className="ref">{signOff.licenceNumber}</span> },
                      { label: 'Signed at', value: fmtDateTimeFull(signOff.signedAt) },
                    ]}
                  />
                  <Link to={paths.workOrderSignOff(w.id)} className="btn btn--secondary btn--sm" style={{ alignSelf: 'flex-start' }}>
                    View sign-off document
                  </Link>
                </>
              ) : w.status === 'Ready for Sign-off' ? (
                <>
                  <Banner tone="warn">Awaiting certification</Banner>
                  <Link to={paths.workOrderSignOff(w.id)} className="btn btn--primary btn--sm" style={{ alignSelf: 'flex-start' }}>
                    Perform sign-off
                  </Link>
                </>
              ) : (
                <p className="muted">Sign-off available once tasks and inspections are complete.</p>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Audit metadata</h2>
            </div>
            <div className="card-body">
              <DetailGrid
                items={[
                  { label: 'Created by', value: userName(w.createdByUserId) },
                  { label: 'Created', value: fmtDateTimeFull(w.createdAt) },
                  {
                    label: 'Cost centre',
                    value: w.costCentreCode ? (
                      <Link to={paths.accountCostCentres('ACC-001')} className="chip ref">
                        {w.costCentreCode}
                      </Link>
                    ) : (
                      '—'
                    ),
                  },
                  {
                    label: 'Scheduled',
                    value: w.scheduledStart && w.scheduledEnd ? `${fmtDateTime(w.scheduledStart)} – ${fmtDateTime(w.scheduledEnd)}` : '—',
                  },
                  { label: 'Reference', value: <span className="ref">{w.id}</span> },
                ]}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
