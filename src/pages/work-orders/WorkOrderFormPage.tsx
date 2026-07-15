import { Link } from 'react-router-dom'
import { Save } from 'lucide-react'
import { paths } from '@/app/paths'
import { aircraft, defects, users } from '@/data'
import { PageHeader } from '@/components/shell/PageHeader'
import {
  CheckRow,
  FormCard,
  FormFooter,
  FormSection,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/ui/Form'
import { Banner } from '@/components/ui/Misc'

const AIRCRAFT_OPTIONS = aircraft.map((a) => `${a.registration} — ${a.model}`)
const OPEN_DEFECT_OPTIONS = [
  ...defects
    .filter((d) => d.status !== 'Closed' && d.status !== 'Cancelled')
    .map((d) => `${d.id} — ${d.title}`),
  'No linked defect',
]
const ENGINEER_OPTIONS = [...users.filter((u) => u.role === 'Engineer' || u.role === 'Licensed Engineer').map((u) => u.name), 'Assign later']
const COST_CENTRE_OPTIONS = ['LINE-MAINT', 'HANGAR', 'AOG-RECOVERY', 'CHARTER-SUP']

export function WorkOrderFormPage() {
  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Operations' }, { label: 'Work orders', to: paths.workOrders }, { label: 'New' }]}
        title="Create work order"
        description="Raise a work order to schedule rectification or scheduled maintenance. Link a defect where applicable so its status carries through automatically."
      />

      <form className="form-stack" onSubmit={(e) => e.preventDefault()} aria-label="Create work order">
        <FormCard>
          <FormSection title="Work order" hint="What needs to be done, and how urgently.">
            <SelectField id="wo-aircraft" label="Aircraft" required options={AIRCRAFT_OPTIONS} placeholder="Select aircraft" />
            <SelectField
              id="wo-defect"
              label="Source defect"
              options={OPEN_DEFECT_OPTIONS}
              placeholder="Select a defect"
              hint="Optional — link the defect this work order rectifies"
            />
            <TextField id="wo-title" label="Title" required full placeholder="e.g. Replace nose gear taxi light lamp" />
            <TextAreaField
              id="wo-scope"
              label="Work scope"
              required
              full
              rows={5}
              placeholder="Describe the work to be performed, referencing the applicable maintenance data (AMM reference, task cards, etc.)."
            />
            <SelectField
              id="wo-priority"
              label="Priority"
              options={['Routine', 'Urgent', 'AOG']}
              defaultValue="Routine"
              hint="AOG escalates aircraft availability and cost centre automatically"
            />
            <SelectField id="wo-cost-centre" label="Cost centre" options={COST_CENTRE_OPTIONS} placeholder="Select cost centre" />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Assignment & schedule" hint="Who will do the work, and when it needs to happen.">
            <SelectField id="wo-lead" label="Lead engineer" options={ENGINEER_OPTIONS} defaultValue="Assign later" />
            <SelectField id="wo-support" label="Supporting engineer" options={ENGINEER_OPTIONS} defaultValue="Assign later" />
            <TextField id="wo-scheduled-start" label="Scheduled start" type="datetime-local" />
            <TextField id="wo-due" label="Due" type="datetime-local" />
            <TextField id="wo-manhours" label="Estimated manhours" type="number" placeholder="0" />
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Initial tasks" hint="Seed the task checklist — more tasks can be added once the work order is created.">
            <TextField id="wo-task-1" label="Task 1" full placeholder="Open access panel and isolate system" />
            <TextField id="wo-task-2" label="Task 2" full placeholder="Remove unserviceable part and record part off" />
            <TextField id="wo-task-3" label="Task 3" full placeholder="Install serviceable part and operational check" />
            <div className="field field--full">
              <button type="button" className="btn btn--ghost">
                Add another task
              </button>
              <span className="field-hint">Tasks are numbered in sequence and drive the completion checklist.</span>
            </div>
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Parts & inspection">
            <CheckRow id="wo-parts-required" label="Parts required — raise part requests after creation" />
            <CheckRow id="wo-inspection-required" label="Independent inspection required" />
            <TextAreaField
              id="wo-inspection-notes"
              label="Inspection notes"
              full
              placeholder="Describe the inspection scope, e.g. flight-control zone disturbance, duplicate inspection requirements…"
            />
          </FormSection>
          <FormFooter note="Preview only — nothing is created or persisted.">
            <Link to={paths.workOrders} className="btn btn--ghost">
              Cancel
            </Link>
            <button type="submit" className="btn btn--primary">
              <Save size={15} aria-hidden="true" />
              Create work order
            </button>
          </FormFooter>
        </FormCard>
      </form>

      <Banner tone="neutral">
        In the full product, creating a work order from a defect updates that defect to{' '}
        <code>Work Order Created</code> and adjusts aircraft availability per the documented automation rules.
      </Banner>
    </div>
  )
}
