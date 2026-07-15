import { Link, useParams } from 'react-router-dom'
import { Archive, Download, FileCheck2, Printer } from 'lucide-react'
import { paths } from '@/app/paths'
import { getAircraft, recordsForAircraft, shortName, signOffsForAircraft, userName } from '@/data'
import { fmtDateTime, fmtNumber } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { NotFoundPage } from '@/pages/NotFoundPage'
import type { MaintenanceRecord } from '@/data/types'

/**
 * Dedicated maintenance-records view for audit and historical review:
 * the certified history of the aircraft with release references.
 */
export function AircraftRecordsPage() {
  const { id = '' } = useParams()
  const ac = getAircraft(id)
  if (!ac) return <NotFoundPage />

  const records = recordsForAircraft(ac.id)
  const releases = signOffsForAircraft(ac.id)
  const totalManhours = records.reduce((s, r) => s + r.totalManhours, 0)

  const cols: Column<MaintenanceRecord>[] = [
    {
      key: 'released',
      header: 'Released',
      render: (r) => <span className="nowrap">{fmtDateTime(r.performedAt)}</span>,
    },
    {
      key: 'type',
      header: 'Record type',
      render: (r) => <StatusBadge status={r.recordType === 'Corrective' ? 'In Progress' : 'Complete'} title={r.recordType} />,
    },
    { key: 'summary', header: 'Work performed', render: (r) => <span>{r.summary}</span> },
    {
      key: 'wo',
      header: 'Work order',
      render: (r) => (
        <Link to={paths.workOrder(r.workOrderId)} className="table-link ref">
          {r.workOrderId}
        </Link>
      ),
    },
    {
      key: 'defect',
      header: 'Defect',
      hideMobile: true,
      render: (r) =>
        r.defectId ? (
          <Link to={paths.defect(r.defectId)} className="table-link ref">
            {r.defectId}
          </Link>
        ) : (
          <span className="muted">—</span>
        ),
    },
    { key: 'performed', header: 'Performed by', hideMobile: true, render: (r) => shortName(r.performedByUserId) },
    { key: 'certified', header: 'Licensed engineer', render: (r) => shortName(r.certifiedByUserId) },
    { key: 'hours', header: 'Manhours', numeric: true, hideMobile: true, render: (r) => <span className="num">{r.totalManhours.toFixed(1)}</span> },
    { key: 'parts', header: 'Parts used', hideMobile: true, render: (r) => <span className="muted">{r.partsUsedSummary}</span> },
    { key: 'ref', header: 'Release ref.', render: (r) => <span className="ref">{r.reference}</span> },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[
          { label: 'Aircraft registry', to: paths.aircraftList },
          { label: ac.registration, to: paths.aircraftDetail(ac.id) },
          { label: 'Maintenance records' },
        ]}
        title={
          <>
            Maintenance records — <span className="ref">{ac.registration}</span>
          </>
        }
        description={`Certified maintenance history for ${ac.manufacturer} ${ac.model} ${ac.serialNumber}. Suitable for audit and historical review; every record traces to a work order and release reference.`}
        actions={
          <>
            <button type="button" className="btn btn--secondary">
              <Printer size={15} aria-hidden="true" />
              Print pack
            </button>
            <button type="button" className="btn btn--secondary">
              <Download size={15} aria-hidden="true" />
              Export history
            </button>
          </>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Records" value={records.length} icon={Archive} meta="since onboarding Feb 2026" />
        <MetricCard label="Releases" value={releases.length} tone="green" icon={FileCheck2} meta="all verified in audit" />
        <MetricCard label="Certified manhours" value={fmtNumber(totalManhours, 1)} meta="across all records" />
        <MetricCard
          label="Last release"
          value={records[0] ? fmtDateTime(records[0].performedAt).split(',')[0]! : '—'}
          meta={records[0] ? `${records[0].reference} · ${userName(records[0].certifiedByUserId)}` : 'No releases recorded'}
        />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search work performed, references…" width={280} />
            <SelectFilter label="Record type" allLabel="All types" options={['Corrective', 'Inspection', 'Scheduled']} />
            <SelectFilter label="Period" options={['Last 12 months', 'Last 6 months', 'Last 90 days']} />
          </FilterBar>
        </div>
        <DataTable
          caption={`Maintenance records for ${ac.registration}`}
          columns={cols}
          rows={records}
          rowKey={(r) => r.id}
          footer={<TableFooter shown={records.length} total={records.length} />}
        />
        <div className="card-footer">
          Records are generated automatically at sign-off and are immutable; corrections are issued as new
          records with an audit note.
        </div>
      </section>
    </div>
  )
}
