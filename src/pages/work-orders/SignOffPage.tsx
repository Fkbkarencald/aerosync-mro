import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileCheck2 } from 'lucide-react'
import { paths } from '@/app/paths'
import { currentUser, userName } from '@/data'
import { useWorkflow } from '@/workflow/useWorkflow'
import { fmtDateTimeFull, fmtNumber } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { StatusBadge } from '@/components/ui/Badge'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { CheckRow, FormFooter, SelectField, TextAreaField } from '@/components/ui/Form'
import { Banner, PrototypeNotice } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'

const STANDARD_STATEMENT =
  'I certify that the work described on this work order has been carried out in accordance with the applicable maintenance data and operator procedures, and in respect of that work the aircraft is released to service.'

export function SignOffPage() {
  const { id = '' } = useParams()
  const { state, signOff: certify } = useWorkflow()
  const [confirmed, setConfirmed] = useState<boolean[]>([false, false, false, false, false])
  const [feedback, setFeedback] = useState<string | null>(null)
  const w = state.workOrders.find((item) => item.id.toUpperCase() === id.toUpperCase())
  if (!w) return <NotFoundPage />

  const ac = state.aircraft.find((item) => item.id === w.aircraftId)
  const defect = w.defectId ? state.defects.find((item) => item.id === w.defectId) : undefined
  const signOff = w.signOffId ? state.signOffs.find((item) => item.id === w.signOffId) : undefined
  const done = w.tasks.filter((t) => t.done).length
  const total = w.tasks.length

  const isReleased = Boolean(signOff)
  const notReady = !isReleased && w.status !== 'Ready for Sign-off'
  const allConfirmed = confirmed.every(Boolean)

  const setConfirmation = (index: number, checked: boolean) =>
    setConfirmed((current) => current.map((value, currentIndex) => (currentIndex === index ? checked : value)))

  const performSignOff = () => {
    try {
      const result = certify({
        workOrderId: w.id,
        actorId: currentUser.id,
        statement: STANDARD_STATEMENT,
      })
      setFeedback(`${result.signOffId} created with maintenance record ${result.maintenanceRecordId}; ${w.aircraftId} returned to Available.`)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div className="page">
      <Breadcrumbs
        crumbs={[
          { label: 'Work orders', to: paths.workOrders },
          { label: w.id, to: paths.workOrder(w.id) },
          { label: 'Sign-off' },
        ]}
      />

      <PrototypeNotice />
      {feedback && <Banner tone={feedback.includes('created') ? 'info' : 'danger'}>{feedback}</Banner>}

      <div className="signoff-doc">
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FileCheck2 size={16} aria-hidden="true" />
              Certificate of release to service — interactive prototype
            </h2>
            <div className="card-actions">
              <StatusBadge status={isReleased ? 'Released' : 'Awaiting Sign-off'} />
            </div>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {notReady && (
              <Banner tone="warn">
                This work order is not yet ready for sign-off (status: {w.status}). Form shown for design preview.
              </Banner>
            )}

            <div>
              <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 10 }}>Work order summary</h3>
              <DetailGrid
                items={[
                  { label: 'Work order', value: <Link to={paths.workOrder(w.id)}>{w.id}</Link> },
                  {
                    label: 'Aircraft',
                    value: ac ? (
                      <>
                        <Link to={paths.aircraftDetail(ac.id)}>{ac.registration}</Link> — {ac.model}
                      </>
                    ) : (
                      w.aircraftId
                    ),
                  },
                  {
                    label: 'Source defect',
                    value: defect ? <Link to={paths.defect(defect.id)}>{defect.id}</Link> : '—',
                  },
                  { label: 'Priority', value: w.priority },
                  { label: 'Work performed', value: `${w.title} — ${w.description}` },
                  { label: 'Completed tasks', value: `${done}/${total}` },
                  { label: 'Total manhours', value: `${fmtNumber(w.actualManhours, 1)}h` },
                ]}
              />
            </div>

            <hr className="doc-rule" />

            <div>
              <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 10 }}>Aircraft details</h3>
              {ac ? (
                <DetailGrid
                  items={[
                    { label: 'Registration', value: <span className="ref">{ac.registration}</span> },
                    { label: 'Type', value: `${ac.manufacturer} ${ac.model}` },
                    { label: 'Serial number', value: <span className="ref">{ac.serialNumber}</span> },
                    { label: 'Hours', value: fmtNumber(ac.totalHours, 1) },
                    { label: 'Cycles', value: fmtNumber(ac.totalCycles) },
                  ]}
                />
              ) : (
                <p className="muted">Aircraft record not found.</p>
              )}
            </div>

            <hr className="doc-rule" />

            <div>
              <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 10 }}>Inspection results</h3>
              {w.inspection.required ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span>{w.inspection.type}</span>
                    <StatusBadge status={w.inspection.status ?? 'Pending'} />
                  </div>
                  {w.inspection.note && <p className="muted">{w.inspection.note}</p>}
                </div>
              ) : (
                <p className="muted">No independent inspection required.</p>
              )}
            </div>

            <hr className="doc-rule" />

            <div>
              <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 10 }}>Outstanding warnings</h3>
              {isReleased ? (
                <Banner tone="info">No outstanding warnings at time of release.</Banner>
              ) : (
                <Banner tone="warn">
                  Release required by {fmtDateTimeFull(w.dueAt)} to keep the aircraft available for its next assigned
                  sector. Confirm parts and inspection are closed out before certifying.
                </Banner>
              )}
            </div>

            <hr className="doc-rule" />

            <div>
              <TextAreaField
                id="so-statement"
                label="Certification statement"
                full
                rows={4}
                defaultValue={isReleased ? signOff!.statement : STANDARD_STATEMENT}
              />
            </div>

            <hr className="doc-rule" />

            <div>
              <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 10 }}>Licensed engineer</h3>
              <DetailGrid
                items={[
                  { label: 'Name', value: isReleased ? userName(signOff!.signedByUserId) : currentUser.name },
                  {
                    label: 'Licence / authorisation',
                    value: <span className="ref">{isReleased ? signOff!.licenceNumber : currentUser.licenceNumber}</span>,
                  },
                  {
                    label: 'Date & time',
                    value: isReleased ? fmtDateTimeFull(signOff!.signedAt) : 'On certification (preview)',
                  },
                  {
                    label: 'Sign-off type',
                    value: isReleased ? (
                      signOff!.type
                    ) : (
                      <SelectField
                        id="so-type"
                        label="Sign-off type"
                        options={['Line Release', 'Return to Service', 'Inspection']}
                        defaultValue="Line Release"
                      />
                    ),
                  },
                ]}
              />
            </div>

            <hr className="doc-rule" />

            <div>
              <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 10 }}>Confirmation checklist</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'All tasks completed and recorded',
                  'Maintenance data (AMM references) followed',
                  'Duplicate/independent inspections complete where required',
                  'Tooling and materials accounted for',
                  'Aircraft log entries raised',
                ].map((label, index) => (
                  <CheckRow
                    key={label}
                    id={`so-check-${index + 1}`}
                    label={label}
                    checked={isReleased || confirmed[index]}
                    disabled={isReleased}
                    onChange={(checked) => setConfirmation(index, checked)}
                  />
                ))}
              </div>
            </div>

            <hr className="doc-rule" />

            <div>
              <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 10 }}>Signature</h3>
              <div className="signature-box">
                <span className="signature-name">{isReleased ? userName(signOff!.signedByUserId) : currentUser.name}</span>
                <span className="signature-meta">
                  {isReleased ? signOff!.licenceNumber : currentUser.licenceNumber} · AeroSync MRO release module (preview)
                </span>
              </div>
            </div>

            <div className="release-statement">
              {isReleased
                ? 'This aircraft has been released to service in respect of the work described above, in accordance with the certification statement and licence recorded on this document.'
                : 'On certification, this aircraft will be released to service in respect of the work described above, in accordance with the certification statement and licence recorded on this document.'}
            </div>
          </div>

          {!isReleased ? (
            <FormFooter note="Non-operational prototype — the demo release persists only in this browser.">
              <Link to={paths.workOrder(w.id)} className="btn btn--ghost">
                Cancel
              </Link>
              <button
                type="button"
                className="btn btn--primary btn--lg"
                disabled={notReady || !allConfirmed}
                onClick={performSignOff}
              >
                <FileCheck2 size={16} aria-hidden="true" />
                Certify release to service
              </button>
            </FormFooter>
          ) : (
            <FormFooter note={`Released ${fmtDateTimeFull(signOff!.signedAt)} · reference ${signOff!.id}`}>
              <Link to={paths.workOrder(w.id)} className="btn btn--secondary">
                Back to work order
              </Link>
            </FormFooter>
          )}
        </section>
      </div>
    </div>
  )
}
