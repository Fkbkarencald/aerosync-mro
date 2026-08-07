import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Inbox } from 'lucide-react'
import { useWorkflow } from '@/workflow/useWorkflow'
import { buildHandoffDashboard } from '@/workflow/handoffs'
import { Badge } from '@/components/ui/Badge'
import { Banner, EmptyState } from '@/components/ui/Misc'

const DEMO_USERS = [
  { id: 'USR-009', label: 'Pilot' },
  { id: 'USR-003', label: 'Controller' },
  { id: 'USR-005', label: 'Engineer' },
  { id: 'USR-014', label: 'Licensed engineer' },
] as const

export function RoleHandoffDashboard() {
  const { state } = useWorkflow()
  const [userId, setUserId] = useState('USR-014')
  const dashboard = buildHandoffDashboard(state, userId)

  return (
    <section className="card" aria-labelledby="handoff-title">
      <div className="card-header">
        <div>
          <h2 className="card-title" id="handoff-title">Role handoff console</h2>
          <p className="muted" style={{ margin: '4px 0 0' }}>{dashboard.heading} · {dashboard.user.name}</p>
        </div>
        <div className="card-actions" role="group" aria-label="Preview handoff role">
          {DEMO_USERS.map((user) => (
            <button
              key={user.id}
              type="button"
              className={`btn btn--sm ${user.id === userId ? 'btn--primary' : 'btn--ghost'}`}
              aria-pressed={user.id === userId}
              onClick={() => setUserId(user.id)}
            >
              {user.label}
            </button>
          ))}
        </div>
      </div>
      <div className="card-body" style={{ display: 'grid', gap: 'var(--sp-5)' }}>
        <Banner tone="info">
          <strong>{dashboard.summary}.</strong> This role preview derives directly from the persisted workflow state.
          Aircraft and maintenance-record counts reflect the selected user’s authorised scope.
        </Banner>

        <div className="stat-strip" role="group" aria-label="Handoff scope summary">
          <div className="stat"><span className="stat-value">{dashboard.groups.reduce((count, group) => count + group.items.length, 0)}</span><span className="stat-label">Handoffs</span></div>
          <div className="stat"><span className="stat-value">{dashboard.visibleAircraftIds.length}</span><span className="stat-label">Aircraft in scope</span></div>
          <div className="stat"><span className="stat-value">{dashboard.visibleMaintenanceRecordIds.length}</span><span className="stat-label">Records in scope</span></div>
        </div>

        <div className="dash-grid">
          {dashboard.groups.map((group) => (
            <section className="card" key={group.id} aria-labelledby={`handoff-${group.id}`}>
              <div className="card-header">
                <h3 className="card-title" id={`handoff-${group.id}`}>{group.title}</h3>
                <Badge tone={group.items.length === 0 ? 'green' : 'blue'}>{group.items.length}</Badge>
              </div>
              {group.items.length === 0 ? (
                <EmptyState icon={Inbox} title="Queue clear">{group.empty}</EmptyState>
              ) : (
                <div className="row-list">
                  {group.items.map((item) => (
                    <div className="row-list-item" key={`${group.id}-${item.id}`}>
                      <div className="row-main">
                        <div className="row-title">
                          <Link className="table-link ref" to={item.to}>{item.id}</Link>
                          <span>{item.title}</span>
                        </div>
                        <div className="row-sub">{item.detail}</div>
                      </div>
                      <div className="row-end">
                        <Badge tone={item.tone}>{item.status}</Badge>
                        <Link className="btn btn--ghost btn--sm" to={item.to} aria-label={`Open ${item.id}`}>
                          <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
