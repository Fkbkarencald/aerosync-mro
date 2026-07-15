import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Users as UsersIcon } from 'lucide-react'
import { paths } from '@/app/paths'
import { fmtDateTime } from '@/lib/format'
import { getProfile, securityProfiles, users } from '@/data'
import type { Role, User } from '@/data/types'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/Badge'
import { UserChip } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/Misc'
import { Overlay } from '@/components/ui/Overlay'
import { SelectField, TextField } from '@/components/ui/Form'

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

const STATUS_OPTIONS = ['Active', 'Suspended', 'Invited']

export function UsersPage() {
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [profileName, setProfileName] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)

  const rows = useMemo(
    () =>
      users.filter((u) => {
        const text = `${u.name} ${u.email}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (role && u.role !== role) return false
        if (status && u.status !== status) return false
        if (profileName && !u.securityProfileIds.some((pid) => getProfile(pid)?.name === profileName)) return false
        return true
      }),
    [q, role, status, profileName],
  )

  const active = users.filter((u) => u.status === 'Active').length
  const invited = users.filter((u) => u.status === 'Invited').length
  const suspended = users.filter((u) => u.status === 'Suspended').length

  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'User',
      render: (u) => <UserChip userId={u.id} link />,
    },
    {
      key: 'email',
      header: 'Email',
      hideMobile: true,
      render: (u) => <span className="muted">{u.email}</span>,
    },
    { key: 'role', header: 'Primary role', render: (u) => u.role },
    {
      key: 'profiles',
      header: 'Security profiles',
      render: (u) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {u.securityProfileIds.map((pid) => {
            const p = getProfile(pid)
            if (!p) return null
            return (
              <Link key={pid} to={paths.adminProfile(pid)} className="chip">
                {p.name}
              </Link>
            )
          })}
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge status={u.status} /> },
    {
      key: 'login',
      header: 'Last login',
      render: (u) => (
        <>
          {u.lastLoginAt ? <span className="nowrap">{fmtDateTime(u.lastLoginAt)}</span> : <span className="muted">Never</span>}
          {u.lastLoginSource && <span className="cell-sub">{u.lastLoginSource}</span>}
        </>
      ),
      hideMobile: true,
    },
    {
      key: 'account',
      header: 'Account',
      hideMobile: true,
      render: (u) => (
        <Link to={paths.account(u.accountId)} className="chip ref">
          {u.accountId}
        </Link>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (u) => (
        <Link to={paths.adminUser(u.id)} className="btn btn--ghost btn--sm">
          Manage
        </Link>
      ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Administration' }, { label: 'Users' }]}
        title="Users"
        description="Every account with access to AeroSync MRO — role, assigned security profiles and recent sign-in activity."
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setInviteOpen(true)}>
            <UserPlus size={15} aria-hidden="true" />
            Invite user
          </button>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Users" value={users.length} icon={UsersIcon} />
        <MetricCard label="Active" value={active} tone="green" />
        <MetricCard label="Invited" value={invited} tone="blue" />
        <MetricCard label="Suspended" value={suspended} tone="red" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search name or email…" value={q} onChange={setQ} width={240} />
            <SelectFilter label="Role" allLabel="All roles" options={ROLE_OPTIONS} value={role} onChange={setRole} />
            <SelectFilter label="Status" allLabel="All statuses" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            <SelectFilter
              label="Security profile"
              allLabel="All profiles"
              options={securityProfiles.map((p) => p.name)}
              value={profileName}
              onChange={setProfileName}
            />
          </FilterBar>
        </div>

        <DataTable
          caption="Users"
          columns={columns}
          rows={rows}
          rowKey={(u) => u.id}
          empty={
            <EmptyState icon={UsersIcon} title="No users match these filters">
              Adjust the search or clear a filter to see the rest of the account.
            </EmptyState>
          }
          footer={<TableFooter shown={rows.length} total={users.length} />}
        />
      </section>

      <Overlay
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite user"
        variant="dialog"
        footer={
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn--primary" onClick={() => setInviteOpen(false)}>
              Send invitation
            </button>
          </>
        }
      >
        <form className="form-grid" onSubmit={(e) => e.preventDefault()} aria-label="Invite user">
          <TextField id="invite-user-email" label="Email" type="email" required placeholder="name@aerosync.example" full />
          <SelectField id="invite-user-role" label="Role" options={ROLE_OPTIONS} required placeholder="Select role" />
          <SelectField
            id="invite-user-profile"
            label="Security profile"
            options={securityProfiles.map((p) => p.name)}
            required
            placeholder="Select security profile"
            hint="Multiple profiles can be assigned after the account is created."
          />
        </form>
      </Overlay>
    </div>
  )
}
