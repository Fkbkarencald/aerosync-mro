import { useParams } from 'react-router-dom'
import { ShieldAlert, ShieldCheck, Users } from 'lucide-react'
import { paths } from '@/app/paths'
import { getProfile, permissionDomains, shortName, users } from '@/data'
import { fmtDateTime, fmtDateTimeFull } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { EntityHeader } from '@/components/ui/EntityHeader'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { PermissionMatrix } from '@/components/ui/PermissionMatrix'
import { UserChip } from '@/components/ui/Avatar'
import { Banner, EmptyState } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function SecurityProfileDetailPage() {
  const { id = '' } = useParams()
  const profile = getProfile(id)
  if (!profile) return <NotFoundPage />

  const assignedUsers = users.filter((u) => u.securityProfileIds.includes(profile.id))

  const grantedDomains = permissionDomains.filter((d) =>
    d.actions.some((a) => profile.permissions.includes(`${d.key}.${a.key}`)),
  )
  const noAccessDomains = permissionDomains.filter((d) => !grantedDomains.includes(d))

  return (
    <div className="page">
      <Breadcrumbs crumbs={[{ label: 'Security profiles', to: paths.adminProfiles }, { label: profile.name }]} />

      <EntityHeader
        identIcon={ShieldCheck}
        title={profile.name}
        badges={
          <>
            {profile.isSystem ? <span className="chip">System profile</span> : <span className="chip">Custom</span>}
            <span className="chip">{profile.permissions.length} permissions</span>
          </>
        }
        subtitle={profile.description}
        meta={[
          { label: 'Typical role', value: profile.typicalRole },
          { label: 'Profile ID', value: <span className="ref">{profile.id}</span> },
          { label: 'Updated', value: `${fmtDateTime(profile.updatedAt)} by ${shortName(profile.updatedByUserId)}` },
        ]}
        actions={
          <>
            <button type="button" className="btn btn--secondary">
              Duplicate profile
            </button>
            <button type="button" className="btn btn--primary">
              Save changes
            </button>
          </>
        }
      />

      {profile.isSystem && (
        <Banner tone="warn" icon={<ShieldAlert size={15} aria-hidden="true" />}>
          System profile — deletion is blocked and edits are restricted. Duplicate it to create a custom
          variant.
        </Banner>
      )}

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Permission matrix</h2>
          <span className="card-sub">
            Read / create / edit / approve / close-style grants per domain — editor preview, changes are not
            persisted.
          </span>
        </div>
        <div className="card-body">
          <PermissionMatrix granted={profile.permissions} editable />
        </div>
      </section>

      <div className="two-col">
        <div className="col-main">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Effective-permission preview</h2>
            </div>
            <div className="card-body">
              <p className="muted" style={{ marginBottom: 10 }}>
                What a user holding only this profile can do:
              </p>
            </div>
            <div className="row-list">
              {grantedDomains.map((d) => {
                const actionLabels = d.actions
                  .filter((a) => profile.permissions.includes(`${d.key}.${a.key}`))
                  .map((a) => a.label)
                return (
                  <div className="row-list-item" key={d.key}>
                    <div className="row-main">
                      <div className="row-title">{d.label}</div>
                      <div className="row-sub">{actionLabels.join(' · ')}</div>
                    </div>
                    <div className="row-end">
                      <span className="chip">{actionLabels.length}</span>
                    </div>
                  </div>
                )
              })}
              {noAccessDomains.length > 0 && (
                <div className="row-list-item muted">
                  No access: {noAccessDomains.map((d) => d.label).join(', ')}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="col-side">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Assigned users</h2>
            </div>
            {assignedUsers.length > 0 ? (
              <div className="row-list">
                {assignedUsers.map((u) => (
                  <div className="row-list-item" key={u.id}>
                    <UserChip userId={u.id} link size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Users} title="No users assigned">
                No accounts currently hold this security profile.
              </EmptyState>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Profile details</h2>
            </div>
            <div className="card-body">
              <DetailGrid
                items={[
                  { label: 'Kind', value: profile.isSystem ? 'System' : 'Custom' },
                  { label: 'Typical role', value: profile.typicalRole },
                  { label: 'Created scope', value: 'Account — AeroSync Regional Operations' },
                  {
                    label: 'Last updated',
                    value: `${fmtDateTimeFull(profile.updatedAt)} · ${shortName(profile.updatedByUserId)}`,
                  },
                ]}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
