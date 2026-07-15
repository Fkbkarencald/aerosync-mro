import { Link, useParams } from 'react-router-dom'
import { Archive, Save } from 'lucide-react'
import { paths } from '@/app/paths'
import { getAircraft } from '@/data'
import { PageHeader } from '@/components/shell/PageHeader'
import {
  AttachmentDropzone,
  CheckRow,
  FormCard,
  FormFooter,
  FormSection,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/ui/Form'
import { Banner } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Shared registration form for /aircraft/new and /aircraft/:id/edit.
 * Visual only — nothing is persisted. Includes example validation
 * styling on the registration field in "new" mode.
 */
export function AircraftFormPage({ mode }: { mode: 'new' | 'edit' }) {
  const { id = '' } = useParams()
  const ac = mode === 'edit' ? getAircraft(id) : undefined
  if (mode === 'edit' && !ac) return <NotFoundPage />

  const title = mode === 'new' ? 'Register aircraft' : `Edit ${ac!.registration}`

  return (
    <div className="page">
      <PageHeader
        crumbs={[
          { label: 'Aircraft registry', to: paths.aircraftList },
          ...(mode === 'edit' ? [{ label: ac!.registration, to: paths.aircraftDetail(ac!.id) }] : []),
          { label: mode === 'new' ? 'Register' : 'Edit' },
        ]}
        title={title}
        description={
          mode === 'new'
            ? 'Add a new tail to the registry. On save the aircraft would be created Serviceable with availability Available.'
            : 'Update registry details. Status and availability changes are audited in the full product.'
        }
      />

      <form className="form-stack" onSubmit={(e) => e.preventDefault()} aria-label={title}>
        <FormCard>
          <FormSection title="Identity" hint="Registration must be unique within the operator account.">
            <TextField
              id="ac-reg"
              label="Registration"
              required
              defaultValue={ac?.registration}
              placeholder="VH-XXX"
              error={mode === 'new' ? 'Registration is required — example validation state' : undefined}
            />
            <TextField id="ac-serial" label="Serial number" required defaultValue={ac?.serialNumber} placeholder="MSN 0000" />
            <SelectField
              id="ac-manufacturer"
              label="Manufacturer"
              required
              options={['ATR', 'De Havilland Canada', 'Saab', 'Beechcraft']}
              defaultValue={ac?.manufacturer}
              placeholder="Select manufacturer"
            />
            <SelectField
              id="ac-model"
              label="Model"
              required
              options={['ATR 72-600', 'DHC-8-315', 'Saab 340B', 'King Air 350']}
              defaultValue={ac?.model}
              placeholder="Select model"
            />
            <TextField id="ac-year" label="Year of manufacture" type="number" defaultValue={ac ? String(ac.yearOfManufacture) : ''} placeholder="2020" />
            <TextField id="ac-type-code" label="ICAO type code" defaultValue={ac?.typeCode} placeholder="AT76" hint="Used on schedule boards and flight rows." />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Operator & base" hint="Links the aircraft to an account for costing and multi-operator support.">
            <SelectField
              id="ac-operator"
              label="Operator account"
              required
              options={['AeroSync Regional Operations (ACC-001)', 'Westline Charter Pty Ltd (ACC-002)']}
              defaultValue={ac?.accountId === 'ACC-002' ? 'Westline Charter Pty Ltd (ACC-002)' : 'AeroSync Regional Operations (ACC-001)'}
            />
            <SelectField id="ac-base" label="Home base" required options={['MEL', 'MQL', 'ABX', 'WGA']} defaultValue={ac?.base} />
            <SelectField
              id="ac-status"
              label="Airworthiness status"
              options={['Serviceable', 'Unserviceable', 'Under Maintenance', 'AOG', 'Restricted']}
              defaultValue={ac?.status ?? 'Serviceable'}
              hint="New aircraft start Serviceable / Available."
            />
            <TextField id="ac-location" label="Current location" defaultValue={ac?.location} placeholder="MEL · Bay 12" />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Utilisation" hint="Manual entry in this release — flight-log integration is on the roadmap.">
            <TextField id="ac-hours" label="Total flight hours" type="number" defaultValue={ac ? String(ac.totalHours) : ''} placeholder="0.0" />
            <TextField id="ac-cycles" label="Total cycles" type="number" defaultValue={ac ? String(ac.totalCycles) : ''} placeholder="0" />
            <TextField id="ac-seats" label="Seats" type="number" defaultValue={ac ? String(ac.seats) : ''} placeholder="70" />
            <TextField id="ac-engines" label="Engines" defaultValue={ac?.engines} placeholder="2 × PW127M" />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Configuration & documents" hint="Cabin layout, STCs and registration imagery.">
            <TextAreaField
              id="ac-config"
              label="Configuration notes"
              full
              defaultValue={ac?.configurationNotes}
              placeholder="Cabin layout, avionics fit, STC references…"
            />
            <div className="field field--full">
              <span className="field-hint" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                Registration / livery photo
              </span>
              <AttachmentDropzone hint="Optional livery photo for the registry header — visual preview only" />
            </div>
            <CheckRow id="ac-archived" label="Archive this aircraft (soft delete — hidden from operational views)" defaultChecked={false} />
          </FormSection>
          <FormFooter note="Preview only — nothing is saved or validated against a backend.">
            <Link to={mode === 'edit' ? paths.aircraftDetail(ac!.id) : paths.aircraftList} className="btn btn--ghost">
              Cancel
            </Link>
            {mode === 'edit' && (
              <button type="button" className="btn btn--danger">
                <Archive size={15} aria-hidden="true" />
                Archive aircraft
              </button>
            )}
            <button type="submit" className="btn btn--primary">
              <Save size={15} aria-hidden="true" />
              {mode === 'new' ? 'Register aircraft' : 'Save changes'}
            </button>
          </FormFooter>
        </FormCard>
      </form>

      <Banner tone="neutral">
        In the completed product this form enforces unique registrations, blocks archiving with open work
        orders, and writes an <code>aircraft.create</code> / <code>aircraft.edit</code> audit entry.
      </Banner>
    </div>
  )
}
