import { Link, useParams } from 'react-router-dom'
import { Paperclip, TriangleAlert, Wrench } from 'lucide-react'
import { paths } from '@/app/paths'
import { getAircraft, getDefect, getWorkOrder, userName } from '@/data'
import { fmtDate, fmtDateTimeFull } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { EntityHeader } from '@/components/ui/EntityHeader'
import { PriorityBadge, RiskBadge, SeverityBadge, StatusBadge, StatusCell } from '@/components/ui/Badge'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { Timeline } from '@/components/ui/Timeline'
import { UserChip } from '@/components/ui/Avatar'
import { AttachmentDropzone } from '@/components/ui/Form'
import { AttachmentGrid, Banner, EmptyState } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function DefectDetailPage() {
  const { id = '' } = useParams()
  const d = getDefect(id)
  if (!d) return <NotFoundPage />

  const linkedWo = d.workOrderId ? getWorkOrder(d.workOrderId) : undefined
  const ac = getAircraft(d.aircraftId)

  const contextualActions = (() => {
    switch (d.status) {
      case 'Reported':
        return (
          <>
            <button type="button" className="btn btn--primary">
              Start review
            </button>
            <button type="button" className="btn btn--danger">
              Cancel defect
            </button>
          </>
        )
      case 'Under Review':
        return (
          <>
            <button type="button" className="btn btn--secondary">
              Defer
            </button>
            <Link to={paths.workOrderNew} className="btn btn--primary">
              Create work order
            </Link>
          </>
        )
      case 'Deferred':
        return (
          <>
            <Link to={paths.workOrderNew} className="btn btn--primary">
              Create work order
            </Link>
            <button type="button" className="btn btn--secondary">
              Close defect
            </button>
          </>
        )
      case 'Work Order Created':
      case 'Rectified':
        return d.workOrderId ? (
          <Link to={paths.workOrder(d.workOrderId)} className="btn btn--primary">
            Open work order
          </Link>
        ) : null
      case 'Closed':
        return (
          <button type="button" className="btn btn--secondary">
            Reopen (admin)
          </button>
        )
      default:
        return null
    }
  })()

  return (
    <div className="page">
      <Breadcrumbs crumbs={[{ label: 'Defects', to: paths.defects }, { label: d.id }]} />

      <EntityHeader
        identIcon={TriangleAlert}
        identTone={d.severity === 'Critical' ? 'red' : undefined}
        title={<span className="ref">{d.id}</span>}
        badges={
          <>
            <SeverityBadge severity={d.severity} />
            <StatusBadge status={d.status} />
          </>
        }
        subtitle={d.title}
        meta={[
          { label: 'Aircraft', value: <Link to={paths.aircraftDetail(d.aircraftId)}>{d.aircraftId}</Link> },
          ...(d.flightId ? [{ label: 'Flight', value: <Link to={paths.flight(d.flightId)}>{d.flightId}</Link> }] : []),
          { label: 'ATA chapter', value: d.ataChapter },
          { label: 'Reported', value: fmtDateTimeFull(d.reportedAt) },
          { label: 'Reporter', value: userName(d.reportedByUserId) },
        ]}
        actions={
          <>
            {contextualActions}
            <button type="button" className="btn btn--ghost">
              <Paperclip size={15} aria-hidden="true" />
              Add attachment
            </button>
          </>
        }
      />

      <div className="two-col">
        <div className="col-main">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Description</h2>
            </div>
            <div className="card-body">
              <p style={{ marginBottom: 14 }}>{d.description}</p>
              <DetailGrid
                items={[
                  { label: 'Location on aircraft', value: d.locationOnAircraft },
                  { label: 'Reported location', value: d.reportedLocation },
                  { label: 'Category', value: d.category },
                  { label: 'Source', value: d.source },
                  { label: 'Severity', value: <SeverityBadge severity={d.severity} /> },
                  { label: 'Availability impact', value: d.availabilityImpact },
                  { label: 'Flight impact', value: d.flightImpact ?? 'Nil' },
                ]}
              />
            </div>
          </section>

          {d.deferral && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Deferral</h2>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Banner tone="warn">{d.deferral.reason}</Banner>
                <DetailGrid
                  items={[
                    { label: 'Deferred until', value: fmtDate(d.deferral.until) },
                    { label: 'Reference', value: <span className="ref">{d.deferral.reference}</span> },
                    { label: 'Approved by', value: userName(d.deferral.approvedByUserId) },
                  ]}
                />
              </div>
            </section>
          )}

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Attachments</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AttachmentGrid attachments={d.attachments} />
              <AttachmentDropzone hint="Photos of the finding — visual preview only, files are not uploaded" />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Status timeline</h2>
            </div>
            <div className="card-body">
              <Timeline events={d.timeline} />
            </div>
          </section>
        </div>

        <div className="col-side">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Review</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {d.reviewNotes ? <p>{d.reviewNotes}</p> : <p className="muted">Not yet reviewed</p>}
              {d.reviewedByUserId && <UserChip userId={d.reviewedByUserId} sub="Reviewer" />}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Linked work order</h2>
            </div>
            {linkedWo ? (
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to={paths.workOrder(linkedWo.id)} className="table-link ref" style={{ fontSize: 'var(--fs-base)' }}>
                  {linkedWo.id}
                </Link>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <StatusBadge status={linkedWo.status} />
                  <PriorityBadge priority={linkedWo.priority} />
                </div>
                <UserChip userId={linkedWo.assignedToUserId} sub="Assigned engineer" />
              </div>
            ) : (
              <div className="card-body">
                <EmptyState
                  icon={Wrench}
                  title="No work order yet"
                  action={
                    (d.status === 'Reported' || d.status === 'Under Review' || d.status === 'Deferred') && (
                      <Link to={paths.workOrderNew} className="btn btn--secondary btn--sm">
                        Create work order
                      </Link>
                    )
                  }
                >
                  Raise a work order to schedule rectification against this defect.
                </EmptyState>
              </div>
            )}
          </section>

          {ac && (
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Aircraft context</h2>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <StatusCell status={ac.availability} reason={ac.availabilityReason} />
                <DetailGrid items={[{ label: 'Maintenance risk', value: <RiskBadge risk={ac.maintenanceRisk} /> }]} />
                <Link to={paths.aircraftDetail(ac.id)} className="btn btn--secondary btn--sm" style={{ alignSelf: 'flex-start' }}>
                  View {ac.registration}
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
