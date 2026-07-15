import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, OctagonAlert, Plane } from 'lucide-react'
import { paths } from '@/app/paths'
import { reviewQueueDefects, userName, shortName } from '@/data'
import { fmtRelative } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge'
import { Banner } from '@/components/ui/Misc'
import { DetailGrid } from '@/components/ui/DetailGrid'

export function DefectReviewPage() {
  const [selectedId, setSelectedId] = useState(reviewQueueDefects[0]?.id ?? '')
  const selected = reviewQueueDefects.find((d) => d.id === selectedId) ?? reviewQueueDefects[0]

  const oldest = reviewQueueDefects.reduce(
    (min, d) => (d.reportedAt < min ? d.reportedAt : min),
    reviewQueueDefects[0]?.reportedAt ?? '',
  )
  const criticalWaiting = reviewQueueDefects.filter((d) => d.severity === 'Critical').length
  const aircraftAffected = new Set(reviewQueueDefects.map((d) => d.aircraftId)).size

  const suggestedActions = (() => {
    if (!selected) return null
    if (selected.severity === 'Critical') {
      return (
        <>
          <button type="button" className="btn btn--danger">
            Ground aircraft (AOG)
          </button>
          <button type="button" className="btn btn--primary">
            Create work order
          </button>
        </>
      )
    }
    if (selected.severity === 'Significant') {
      return (
        <>
          <button type="button" className="btn btn--primary">
            Create work order
          </button>
          <button type="button" className="btn btn--secondary">
            Defer
          </button>
        </>
      )
    }
    return (
      <>
        <button type="button" className="btn btn--secondary">
          Defer
        </button>
        <button type="button" className="btn btn--secondary">
          Create work order
        </button>
      </>
    )
  })()

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Operations' }, { label: 'Defects', to: paths.defects }, { label: 'Review queue' }]}
        title="Defect review queue"
        description="Newly reported and in-review defects, ordered by severity then age. Triage each one to defer, escalate, or raise a work order."
        actions={
          <Link to={paths.defects} className="btn btn--secondary">
            All defects
          </Link>
        }
      />

      <div className="split-view">
        <div className="split-list">
          {reviewQueueDefects.map((d) => (
            <button
              key={d.id}
              type="button"
              className="queue-card"
              aria-pressed={d.id === selectedId}
              data-selected={d.id === selectedId}
              onClick={() => setSelectedId(d.id)}
            >
              <div className="queue-card-top">
                <span className="ref">{d.id}</span>
                <SeverityBadge severity={d.severity} />
                <StatusBadge status={d.status} />
              </div>
              <div className="queue-card-title">{d.title}</div>
              <div className="queue-card-meta">
                <span className="ref">{d.aircraftId}</span>
                <span>reported {fmtRelative(d.reportedAt)}</span>
                <span>{shortName(d.reportedByUserId)}</span>
                <span>{d.ataChapter}</span>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="ref">{selected.id}</span> {selected.title}
              </h2>
              <div className="card-actions">
                <Link to={paths.defect(selected.id)} className="btn btn--primary btn--sm">
                  Open full defect
                </Link>
              </div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p>{selected.description}</p>

              <DetailGrid
                items={[
                  { label: 'Aircraft', value: <Link to={paths.aircraftDetail(selected.aircraftId)}>{selected.aircraftId}</Link> },
                  {
                    label: 'Flight',
                    value: selected.flightId ? <Link to={paths.flight(selected.flightId)}>{selected.flightId}</Link> : '—',
                  },
                  { label: 'Severity', value: <SeverityBadge severity={selected.severity} /> },
                  { label: 'Age', value: fmtRelative(selected.reportedAt) },
                  { label: 'Reporter', value: userName(selected.reportedByUserId) },
                  { label: 'Source', value: selected.source },
                  { label: 'ATA chapter', value: selected.ataChapter },
                ]}
              />

              <Banner tone="warn">
                <strong>Availability impact.</strong> {selected.availabilityImpact}
              </Banner>

              {selected.flightImpact && (
                <Banner tone="info">
                  <strong>Flight impact.</strong> {selected.flightImpact}
                </Banner>
              )}

              <div>
                <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 8 }}>Suggested next actions</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {suggestedActions}
                  <button type="button" className="btn btn--ghost">
                    Start review
                  </button>
                </div>
                <p className="muted" style={{ fontSize: 'var(--fs-sm)', marginTop: 8 }}>
                  Actions are visual previews — no state changes.
                </p>
              </div>
            </div>
            <div className="card-footer">
              <span>{selected.attachments.length} attachment{selected.attachments.length === 1 ? '' : 's'}</span>
              <span>·</span>
              <span>Last update: {selected.timeline[selected.timeline.length - 1]?.title}</span>
            </div>
          </section>
        )}
      </div>

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Queue insights</h2>
        </div>
        <div className="card-body">
          <div className="metric-grid">
            <MetricCard label="Oldest report" value={oldest ? fmtRelative(oldest) : '—'} icon={Clock} />
            <MetricCard label="Critical waiting" value={criticalWaiting} tone="red" icon={OctagonAlert} />
            <MetricCard label="Aircraft affected" value={aircraftAffected} icon={Plane} />
          </div>
        </div>
      </section>
    </div>
  )
}
