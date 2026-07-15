import { Link, useParams } from 'react-router-dom'
import { CalendarRange, Save } from 'lucide-react'
import { paths } from '@/app/paths'
import { aircraft, getFleetPlan, todaysFlights } from '@/data'
import { fmtTime } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { CheckRow, FormCard, FormFooter, FormSection, SelectField, TextAreaField, TextField } from '@/components/ui/Form'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Banner } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'
import type { Flight } from '@/data/types'

/**
 * Shared plan editor for /fleet/plans/new and /fleet/plans/:id/edit.
 * Visual only — nothing is persisted or validated against a backend.
 */
export function FleetPlanFormPage({ mode }: { mode: 'new' | 'edit' }) {
  const { id = '' } = useParams()
  const plan = mode === 'edit' ? getFleetPlan(id) : undefined
  if (mode === 'edit' && !plan) return <NotFoundPage />

  const title = mode === 'new' ? 'Create fleet plan' : `Edit ${plan!.name}`

  const flightCols: Column<Flight>[] = [
    {
      key: 'flight',
      header: 'Flight',
      render: (f) => <span className="ref">{f.id}</span>,
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
    { key: 'dep', header: 'Dep time', render: (f) => <span className="nowrap">{fmtTime(f.schedDep)}</span> },
    {
      key: 'assign',
      header: 'Assigned aircraft',
      render: (f) => (
        <select id={`plan-flight-ac-${f.id}`} aria-label={`Assigned aircraft for ${f.id}`} defaultValue={f.aircraftId ?? ''}>
          <option value="">Unassigned</option>
          {aircraft.map((a) => (
            <option key={a.id} value={a.id}>
              {a.registration} — {a.model}
            </option>
          ))}
        </select>
      ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[
          { label: 'Fleet planning' },
          { label: 'Plans', to: paths.fleetPlans },
          ...(mode === 'edit' ? [{ label: plan!.id, to: paths.fleetPlan(plan!.id) }] : []),
          { label: mode === 'new' ? 'New' : 'Edit' },
        ]}
        title={title}
        description={
          mode === 'new'
            ? 'Build a new operating plan: select the aircraft in scope, review today’s flight assignments, and publish once conflicts are resolved.'
            : 'Update the draft plan. Publishing becomes available once all flagged conflicts are cleared.'
        }
      />

      <form className="form-stack" onSubmit={(e) => e.preventDefault()} aria-label={title}>
        <FormCard>
          <FormSection title="Plan details" hint="Naming convention: “Week NN Fleet Plan (start–end)”.">
            <TextField
              id="fp-name"
              label="Plan name"
              required
              full
              defaultValue={plan?.name}
              placeholder="Week 32 Fleet Plan (3–9 Aug)"
            />
            <TextField id="fp-start" label="Start date" type="date" required defaultValue={plan?.startDate} />
            <TextField id="fp-end" label="End date" type="date" required defaultValue={plan?.endDate} />
            <SelectField id="fp-base" label="Operating base" options={['MEL', 'MQL', 'ABX']} defaultValue={plan?.base ?? 'MEL'} />
            <TextAreaField
              id="fp-description"
              label="Description"
              full
              defaultValue={plan?.description}
              placeholder="Summarise the operating assumptions for this week — scheduled checks, aircraft in/out of service, charter cover…"
            />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Aircraft selection" hint="Choose the tails in scope for this plan. Availability shown reflects the current fleet position.">
            <div className="field field--full">
              <div className="row-list" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                {aircraft.map((a) => (
                  <div className="row-list-item" key={a.id}>
                    <CheckRow
                      id={`plan-ac-${a.id}`}
                      label={
                        <>
                          <span className="ref" style={{ fontWeight: 600 }}>{a.registration}</span> · {a.model} ·{' '}
                          <span className="muted">{a.availability}</span>
                        </>
                      }
                      defaultChecked={mode === 'edit' ? plan!.aircraftIds.includes(a.id) : a.availability === 'Available'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Flight assignment" hint="Today's schedule, shown for preview — the full board covers the entire plan window.">
            <div className="field field--full">
              <DataTable
                caption="Flight assignments for this plan"
                columns={flightCols}
                rows={todaysFlights}
                rowKey={(f) => f.id}
                compact
              />
            </div>
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Notes" hint="Visible to fleet planning and maintenance control on the plan detail page.">
            <TextAreaField
              id="fp-notes"
              label="Planning notes"
              full
              defaultValue={plan?.notes}
              placeholder="Recovery priorities, cover arrangements, anything the next planner should know…"
            />
          </FormSection>
          <FormFooter note="Preview only — plans are not persisted.">
            <Link to={paths.fleetPlans} className="btn btn--ghost">
              Cancel
            </Link>
            <button type="button" className="btn btn--secondary">
              Save draft
            </button>
            <button type="button" className="btn btn--primary">
              <Save size={15} aria-hidden="true" />
              Publish plan
            </button>
          </FormFooter>
        </FormCard>
      </form>

      <Banner tone="neutral" icon={<CalendarRange size={15} aria-hidden="true" />}>
        In the completed product, publishing recalculates conflicts across the full fleet schedule and writes a{' '}
        <code>fleet_plan.publish</code> audit entry.
      </Banner>
    </div>
  )
}
