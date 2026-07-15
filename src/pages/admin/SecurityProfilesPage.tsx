import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShieldCheck } from 'lucide-react'
import { paths } from '@/app/paths'
import { fmtDateTime } from '@/lib/format'
import { securityProfiles, shortName, users } from '@/data'
import type { Role, SecurityProfile } from '@/data/types'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { EmptyState } from '@/components/ui/Misc'

const ROLE_OPTIONS: Role[] = [
  'Admin',
  'Fleet Planner',
  'Maintenance Controller',
  'Engineer',
  'Licensed Engineer',
  'Pilot',
  'Stores Officer',
  'Accounts Officer',
  'Auditor',
]

const KIND_OPTIONS = ['System', 'Custom']

export function SecurityProfilesPage() {
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [kind, setKind] = useState('')

  const assignedCount = (profileId: string) => users.filter((u) => u.securityProfileIds.includes(profileId)).length

  const rows = useMemo(
    () =>
      securityProfiles.filter((p) => {
        const text = `${p.name} ${p.description}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (role && p.typicalRole !== role) return false
        if (kind === 'System' && !p.isSystem) return false
        if (kind === 'Custom' && p.isSystem) return false
        return true
      }),
    [q, role, kind],
  )

  const columns: Column<SecurityProfile>[] = [
    {
      key: 'profile',
      header: 'Profile',
      render: (p) => (
        <>
          <Link to={paths.adminProfile(p.id)} className="table-link cell-main">
            {p.name}
          </Link>
          <span className="cell-sub ref">{p.id}</span>
        </>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (p) => (
        <span className="cell-sub" style={{ maxWidth: 420, whiteSpace: 'normal' }}>
          {p.description}
        </span>
      ),
    },
    { key: 'role', header: 'Typical role', render: (p) => p.typicalRole },
    { key: 'users', header: 'Assigned users', numeric: true, render: (p) => <span className="num">{assignedCount(p.id)}</span> },
    { key: 'perms', header: 'Permissions', numeric: true, render: (p) => <span className="num">{p.permissions.length}</span> },
    {
      key: 'kind',
      header: 'Kind',
      render: (p) => (p.isSystem ? <span className="chip">System profile</span> : <span className="chip">Custom</span>),
    },
    {
      key: 'updated',
      header: 'Last updated',
      hideMobile: true,
      render: (p) => (
        <>
          <span className="nowrap">{fmtDateTime(p.updatedAt)}</span>
          <span className="cell-sub">by {shortName(p.updatedByUserId)}</span>
        </>
      ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Administration' }, { label: 'Security profiles' }]}
        title="Security profiles"
        description="A two-layer access model: roles describe who a user is; security profiles describe exactly what they can do."
        actions={
          <>
            <button type="button" className="btn btn--secondary">
              Duplicate from existing
            </button>
            <button type="button" className="btn btn--primary">
              <Plus size={15} aria-hidden="true" />
              New profile
            </button>
          </>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Profiles" value={securityProfiles.length} icon={ShieldCheck} />
        <MetricCard label="System profiles" value={securityProfiles.filter((p) => p.isSystem).length} tone="grey" />
        <MetricCard label="Custom" value={securityProfiles.filter((p) => !p.isSystem).length} tone="blue" />
        <MetricCard label="Users covered" value={users.length} />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search name or description…" value={q} onChange={setQ} width={260} />
            <SelectFilter label="Typical role" allLabel="All roles" options={ROLE_OPTIONS} value={role} onChange={setRole} />
            <SelectFilter label="Kind" allLabel="All kinds" options={KIND_OPTIONS} value={kind} onChange={setKind} />
          </FilterBar>
        </div>

        <DataTable
          caption="Security profiles"
          columns={columns}
          rows={rows}
          rowKey={(p) => p.id}
          empty={
            <EmptyState icon={ShieldCheck} title="No profiles match these filters">
              Adjust the search or clear a filter to see the rest of the profile catalogue.
            </EmptyState>
          }
          footer={<TableFooter shown={rows.length} total={securityProfiles.length} />}
        />
      </section>
    </div>
  )
}
