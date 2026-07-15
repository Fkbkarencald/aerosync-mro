import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { paths } from '@/app/paths'
import { aircraft, currentUser, todaysFlights } from '@/data'
import { PageHeader } from '@/components/shell/PageHeader'
import {
  AttachmentDropzone,
  FormCard,
  FormFooter,
  FormSection,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/ui/Form'

const AIRCRAFT_OPTIONS = aircraft.map((a) => `${a.registration} — ${a.model}`)
const FLIGHT_OPTIONS = [...todaysFlights.map((f) => `${f.id} — ${f.origin} → ${f.destination}`), 'Not flight-related']
const ATA_OPTIONS = [
  '23 — Communications',
  '25 — Equipment & Furnishings',
  '29 — Hydraulic Power',
  '30 — Ice & Rain',
  '32 — Landing Gear',
  '33 — Lights',
  '34 — Navigation',
]

/**
 * Mobile-priority defect report form for line use — the form-grid
 * collapses to a single column at the tablet breakpoint so it works
 * as a pilot walkaround / cabin crew tool on a phone.
 */
export function DefectReportPage() {
  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Operations' }, { label: 'Defects', to: paths.defects }, { label: 'Report' }]}
        title="Report a defect"
        description="Optimised for line use on a phone or tablet — capture what you found, where, and how serious it is. A duty controller triages every report before rectification is scheduled."
      />

      <form className="form-stack" onSubmit={(e) => e.preventDefault()} aria-label="Report a defect">
        <FormCard>
          <FormSection title="Aircraft & flight" hint="Link the sector where the fault was found, if applicable.">
            <SelectField
              id="def-aircraft"
              label="Aircraft"
              required
              options={AIRCRAFT_OPTIONS}
              placeholder="Select aircraft"
            />
            <SelectField
              id="def-flight"
              label="Flight (optional)"
              options={FLIGHT_OPTIONS}
              placeholder="Select flight"
              hint="Link the sector where the fault was found"
            />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Defect">
            <TextField
              id="def-title"
              label="Defect title"
              required
              full
              placeholder="Short summary, e.g. Left nav light inop"
            />
            <TextField id="def-location" label="Location on aircraft" placeholder="e.g. NLG bay" />
            <SelectField
              id="def-severity"
              label="Severity"
              required
              options={['Minor', 'Significant', 'Critical']}
              placeholder="Select severity"
              hint="Critical triggers an immediate AOG review by the duty controller"
            />
            <SelectField id="def-ata" label="ATA chapter" options={ATA_OPTIONS} placeholder="Select ATA chapter" />
            <TextAreaField
              id="def-description"
              label="Detailed description"
              required
              full
              rows={6}
              placeholder="What did you observe? Include what was checked, any indications, and whether the fault is intermittent or confirmed."
            />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Photos" hint="A clear photo speeds up triage — attach one if you can.">
            <div className="field field--full">
              <AttachmentDropzone hint="Photos of the finding — visual preview only, files are not uploaded" />
            </div>
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Reporter">
            <TextField id="def-reporter-name" label="Name" defaultValue={currentUser.name} />
            <TextField id="def-reporter-licence" label="Licence / staff no." defaultValue={currentUser.licenceNumber ?? currentUser.id} />
            <SelectField
              id="def-source"
              label="Report source"
              options={['Pilot Report', 'Line Inspection', 'Cabin Crew', 'Scheduled Check']}
              defaultValue="Pilot Report"
            />
          </FormSection>
          <FormFooter note="Preview only — reports are not submitted.">
            <Link to={paths.defects} className="btn btn--ghost">
              Cancel
            </Link>
            <button type="button" className="btn btn--secondary">
              Save draft
            </button>
            <button type="submit" className="btn btn--primary">
              <Send size={15} aria-hidden="true" />
              Submit defect
            </button>
          </FormFooter>
        </FormCard>
      </form>
    </div>
  )
}
