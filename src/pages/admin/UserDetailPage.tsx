import { Link, useParams } from 'react-router-dom'
import { Building2, IdCard, MapPin, Phone, ScrollText } from 'lucide-react'
import { paths } from '@/app/paths'
import { auditLogs, getAccount, getProfile, getUser } from '@/data'
import type { SecurityProfile, TimelineEvent } from '@/data/types'
import { fmtDate, fmtDateTimeFull, initials } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { EntityHeader } from '@/components/ui/EntityHeader'
import { StatusBadge } from '@/components/ui/Badge'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { PermissionMatrix } from '@/components/ui/PermissionMatrix'
import { Timeline } from '@/components/ui/Timeline'
import { Banner, EmptyState } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function UserDetailPage() {
  const { id = '' } = useParams()
  const user = getUser(id)
  if (!user) return <NotFoundPage />

  const profiles = user.securityProfileIds
    .map((pid) => getProfile(pid))
    .filter((p): p is SecurityProfile => p !== undefined)
  const effectivePermissions = Array.from(new Set(profiles.flatMap((p) => p.permissions)))

  const activity = auditLogs
    .filter((a) => a.userId === user.id)
    .slice(0, 6)
    .map<TimelineEvent>((a) => ({
      at: a.at,
      title: a.summary,
      detail: `${a.action} · ${a.entityRef}`,
      byUserId: a.userId,
      tone: a.outcome === 'Denied' ? 'red' : 'blue',
    }))

  return (
    <div className="page">
      <Breadcrumbs crumbs={[{ label: 'Users', to: paths.adminUsers }, { label: user.name }]} />

      <EntityHeader
        identText={initials(user.name)}
        title={user.name}
        badges={
          <>
            <StatusBadge status={user.status} />
            <span className="chip">{user.role}</span>
          </>
        }
        subtitle={`${user.title} · ${user.email}`}
        meta={[
          { icon: MapPin, label: 'Base', value: user.base },
          { icon: Phone, label: 'Phone', value: user.phone },
          { icon: IdCard, label: 'User ID', value: <span className="ref">{user.id}</span> },
          ...(user.licenceNumber
            ? [{ icon: IdCard, label: 'Licence', value: <span className="ref">{user.licenceNumber}</span> }]
            : []),
        ]}
        actions={
          <>
            <button type="button" className="btn btn--primary">
              Edit user
            </button>
            {user.status === 'Active' && (
              <button type="button" className="btn btn--danger">
                Suspend user
              </button>
            )}
            {user.status === 'Suspended' && (
              <button type="button" className="btn btn--secondary">
                Reactivate
              </button>
            )}
            {user.status === 'Invited' && (
              <button type="button" className="btn btn--secondary">
                Resend invite
              </button>
            )}
          </>
        }
      />

      {user.status === 'Suspended' && (
        <Banner tone="danger">
          This account is suspended — sign-in is blocked. Suspended 28 Jun 2026 by Marcus Hale pending
          authorisation renewal.
        </Banner>
      )}

      <div className="two-col">
        <div className="col-main">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Assigned security profiles</h2>
            </div>
            <div className="row-list">
              {profiles.length === 0 && <div className="row-list-item muted">No security profiles assigned.</div>}
              {profiles.map((p) => (
                <div className="row-list-item" key={p.id}>
                  <div className="row-main">
                    <div className="row-title">
                      <Link to={paths.adminProfile(p.id)}>{p.name}</Link>
                      {p.isSystem && <span className="chip">System</span>}
                    </div>
                    <div className="row-sub">{p.description}</div>
                  </div>
                  <div className="row-end">
                    <span className="chip">{p.permissions.length} permissions</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Effective permissions</h2>
            </div>
            <div className="card-body">
              <p className="muted" style={{ marginBottom: 12 }}>
                Union of all assigned profiles.
              </p>
              <PermissionMatrix granted={effectivePermissions} />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Recent activity</h2>
            </div>
            {activity.length > 0 ? (
              <div className="card-body">
                <Timeline events={activity} />
              </div>
            ) : (
              <EmptyState icon={ScrollText} title="No recent activity">
                No audited actions recorded for this user yet.
              </EmptyState>
            )}
          </section>
        </div>

        <div className="col-side">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Access</h2>
            </div>
            <div className="card-body">
              <DetailGrid
                items={[
                  { label: 'Status', value: <StatusBadge status={user.status} /> },
                  { label: 'Primary role', value: user.role },
                  {
                    label: 'Account',
                    value: (
                      <Link to={paths.account(user.accountId)}>
                        <Building2 size={13} aria-hidden="true" className="inline-icon" />{' '}
                        {getAccount(user.accountId)?.name ?? user.accountId}
                      </Link>
                    ),
                  },
                  { label: 'Member since', value: fmtDate(user.createdAt) },
                ]}
              />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Recent sign-in</h2>
            </div>
            <div className="card-body">
              <DetailGrid
                items={[
                  { label: 'Last login', value: user.lastLoginAt ? fmtDateTimeFull(user.lastLoginAt) : 'Never' },
                  { label: 'Source', value: user.lastLoginSource ?? '—' },
                  { label: 'MFA', value: <span className="chip">Enabled (preview)</span> },
                ]}
              />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Contact</h2>
            </div>
            <div className="card-body">
              <DetailGrid
                items={[
                  { label: 'Email', value: user.email },
                  { label: 'Phone', value: user.phone },
                  { label: 'Base', value: user.base },
                ]}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
