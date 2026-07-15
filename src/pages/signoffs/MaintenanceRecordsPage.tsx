import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Archive, Download, Printer } from 'lucide-react'
import { paths } from '@/app/paths'
import { maintenanceRecords, shortName } from '@/data'
import { fmtDateTime, fmtNumber } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import type { MaintenanceRecord } from '@/data/types'

const RECORD_TYPES = ['Corrective', 'Inspection', 'Scheduled']

export function MaintenanceRecordsPage() {
  const [q, setQ] = useState('')
  const [registration, setRegistration] = useState('')
  const [recordType, setRecordType] = useState('')

  const registrations = useMemo(
    () => Array.from(new Set(maintenanceRecords.map((r) => r.aircraftId))).sort(),
    [],
  )

  const aircraftCovered = registrations.length
  const totalManhours = maintenanceRecords.reduce((sum, r) => sum + r.totalManhours, 0)

  const sorted = useMemo(
    () => [...maintenanceRecords].sort((a, b) => b.performedAt.localeCompare(a.performedAt)),
    [],
  )

  const rows = useMemo(
    () =>
      sorted.filter((r) => {
        const text = `${r.summary} ${r.reference}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (registration && r.aircraftId !== registration) return false
        if (recordType && r.recordType !== recordType) return false
        return true
      }),
    [sorted, q, registration, recordType],
  )

  const columns: Column<MaintenanceRecord>[] = [
    {
      key: 'released',
      header: 'Released',
      render: (r) => <span className="nowrap">{fmtDateTime(r.performedAt)}</span>,
    },
    {
      key: 'aircraft',
      header: 'Aircraft',
      render: (r) => (
        <Link to={paths.aircraftDetail(r.aircraftId)} className="chip ref">
          {r.aircraftId}
        </Link>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (r) => <StatusBadge status={r.recordType === 'Corrective' ? 'In Progress' : 'Complete'} title={r.recordType} />,
    },
    { key: 'summary', header: 'Work performed', render: (r) => <span className="cell-main">{r.summary}</span> },
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
    {
      key: 'hours',
      header: 'Manhours',
      numeric: true,
      hideMobile: true,
      render: (r) => <span className="num">{r.totalManhours.toFixed(1)}</span>,
    },
    {
      key: 'release',
      header: 'Release ref.',
      render: (r) => (
        <Link to={paths.workOrderSignOff(r.workOrderId)} className="table-link ref">
          {r.reference}
        </Link>
      ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Maintenance' }, { label: 'Maintenance records' }]}
        title="Maintenance records"
        description="Fleet-wide certified maintenance history — every record traces to a work order and release reference, suitable for audit and historical review. For a single aircraft, open its dedicated records view from the aircraft page."
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
        <MetricCard label="Records" value={maintenanceRecords.length} icon={Archive} meta="across the fleet" />
        <MetricCard label="Aircraft covered" value={aircraftCovered} meta="of 10 registered tails" />
        <MetricCard label="Certified manhours" value={fmtNumber(totalManhours, 1)} meta="all records" />
        <MetricCard label="Last release" value={fmtDateTime(sorted[0]!.performedAt)} meta={`${sorted[0]!.reference} · ${sorted[0]!.aircraftId}`} />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search work performed, references…" value={q} onChange={setQ} width={300} />
            <SelectFilter label="Aircraft" allLabel="All aircraft" options={registrations} value={registration} onChange={setRegistration} />
            <SelectFilter label="Record type" allLabel="All types" options={RECORD_TYPES} value={recordType} onChange={setRecordType} />
          </FilterBar>
        </div>
        <DataTable
          caption="Fleet-wide maintenance records"
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          footer={<TableFooter shown={rows.length} total={maintenanceRecords.length} />}
        />
        <div className="card-footer">
          Records are generated automatically at sign-off and are immutable; corrections are issued as new
          records with an audit note.
        </div>
      </section>
    </div>
  )
}
