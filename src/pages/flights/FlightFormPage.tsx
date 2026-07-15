import { Link } from 'react-router-dom'
import { PlaneTakeoff, Save } from 'lucide-react'
import { paths } from '@/app/paths'
import { aircraft, fleetPlans } from '@/data'
import { PageHeader } from '@/components/shell/PageHeader'
import { FormCard, FormFooter, FormSection, SelectField, TextField } from '@/components/ui/Form'
import { Banner } from '@/components/ui/Misc'

const PORTS = ['MEL', 'MQL', 'ABX', 'WGA', 'DBO', 'BHQ', 'MGB', 'GFF']

export function FlightFormPage() {
  const availableAircraftOptions = aircraft
    .filter((a) => a.availability === 'Available')
    .map((a) => `${a.registration} — ${a.model} (Available)`)

  const planOptions = fleetPlans.map((p) => p.name)

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Operations' }, { label: 'Flights', to: paths.flights }, { label: 'New' }]}
        title="Create flight"
        description="Add a flight to the regional schedule. Aircraft assignment can be left open and completed later from the availability board."
      />

      <form className="form-stack" onSubmit={(e) => e.preventDefault()} aria-label="Create flight">
        <FormCard>
          <FormSection title="Schedule" hint="Flight numbers follow the ASR-NNN convention.">
            <TextField id="fl-number" label="Flight number" required placeholder="ASR-XXX" />
            <TextField id="fl-date" label="Date" type="date" required defaultValue="2026-07-16" />
            <TextField id="fl-dep-time" label="Scheduled departure" type="time" required />
            <TextField id="fl-arr-time" label="Scheduled arrival" type="time" required />
            <SelectField id="fl-origin" label="Origin" required options={PORTS} defaultValue="MEL" />
            <SelectField id="fl-destination" label="Destination" required options={PORTS} placeholder="Select destination" />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection
            title="Aircraft assignment"
            hint="Only aircraft currently Available are listed. Assigning a restricted or AOG tail is blocked in the full product until it is released."
          >
            <SelectField
              id="fl-aircraft"
              label="Aircraft"
              options={availableAircraftOptions}
              placeholder="Assign later"
              full
              hint="Availability is checked against the fleet position at save time."
            />
            <SelectField id="fl-plan" label="Fleet plan" options={planOptions} defaultValue="Week 29 Fleet Plan (13–19 Jul)" full />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Turnaround" hint="Used to plan ground handling and the maintenance window between rotations.">
            <TextField id="fl-turnaround" label="Turnaround minutes" type="number" placeholder="35" />
            <TextField
              id="fl-maint-window"
              label="Maintenance window notes"
              full
              placeholder="e.g. weekly check prep, defect reinspection, fuel uplift constraints…"
            />
          </FormSection>
          <FormFooter note="Preview only — nothing is saved or validated against a backend.">
            <Link to={paths.flights} className="btn btn--ghost">
              Cancel
            </Link>
            <button type="submit" className="btn btn--primary">
              <Save size={15} aria-hidden="true" />
              Create flight
            </button>
          </FormFooter>
        </FormCard>
      </form>

      <Banner tone="neutral" icon={<PlaneTakeoff size={15} aria-hidden="true" />}>
        In the completed product this form validates aircraft availability against the fleet plan and writes a{' '}
        <code>flight.create</code> audit entry.
      </Banner>
    </div>
  )
}
