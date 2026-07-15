import { Link, useParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { getProfile } from '@/data'
import { BrandBlock } from '@/components/shell/BrandMark'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { CheckRow, TextField } from '@/components/ui/Form'
import { PrototypeNotice } from '@/components/ui/Misc'

/**
 * Standalone invite-acceptance screen. The token from the route is
 * shown for context only — nothing is validated against a backend.
 */
export function InvitePage() {
  const { token = '' } = useParams()
  const profile = getProfile('SP-006')

  return (
    <div className="auth-layout">
      <div className="auth-form-col">
        <div className="auth-form-inner">
          <div className="auth-brand">
            <BrandBlock />
          </div>

          <div className="auth-title">
            <h1>Accept your invitation</h1>
            <p>You have been invited to join AeroSync Regional Operations.</p>
          </div>

          <div className="card">
            <div className="card-body">
              <DetailGrid
                items={[
                  { label: 'Invited email', value: 'aisha.khan@aerosync.example' },
                  { label: 'Role', value: 'Pilot' },
                  { label: 'Security profiles', value: 'Pilot - Line Report (SP-006)' },
                  { label: 'Invited by', value: 'Marcus Hale · 12 Jul 2026' },
                  { label: 'Account', value: 'AeroSync Regional Operations (ACC-001)' },
                ]}
              />
              <p className="muted ref" style={{ fontSize: 'var(--fs-sm)', marginTop: 10 }}>
                Invitation token: {token}
              </p>
            </div>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()} aria-label="Accept invitation">
            <TextField id="invite-name" label="Full name" defaultValue="Aisha Khan" />
            <TextField
              id="invite-password"
              label="Password"
              type="password"
              required
              hint="Minimum 12 characters with a number and symbol"
            />
            <TextField id="invite-password-confirm" label="Confirm password" type="password" required />
            <CheckRow
              id="invite-terms"
              label="I accept the acceptable-use and data policies (preview)"
            />
            <Link to={paths.dashboard} className="btn btn--primary btn--lg btn--block">
              Accept invitation &amp; sign in
            </Link>
          </form>

          <PrototypeNotice compact />

          <div className="auth-foot">© 2026 AeroSync MRO · Design preview build</div>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-grid" aria-hidden="true" />
        <div className="auth-visual-content">
          <h2>Roles describe who you are. Security profiles describe what you can do.</h2>
          <p>
            Every account is assigned one or more security profiles that grant a precise set of
            permissions — this invitation carries the <span className="ref" style={{ color: '#fff' }}>SP-006</span>{' '}
            profile, scoped to pilot line reporting.
          </p>

          <div className="auth-visual-card">
            <div className="avc-row" style={{ alignItems: 'flex-start' }}>
              <span className="ref">defect.create</span>
              <span className="muted" style={{ color: 'var(--nav-text-dim)' }}>
                Report new defects from the line
              </span>
            </div>
            <div className="avc-row" style={{ alignItems: 'flex-start' }}>
              <span className="ref">defect.view</span>
              <span className="muted" style={{ color: 'var(--nav-text-dim)' }}>
                Track the status of reported defects
              </span>
            </div>
            <div className="avc-row" style={{ alignItems: 'flex-start' }}>
              <span className="ref">aircraft.view</span>
              <span className="muted" style={{ color: 'var(--nav-text-dim)' }}>
                Look up registry details for context
              </span>
            </div>
          </div>

          {profile && (
            <p className="muted" style={{ color: 'var(--nav-text-dim)', fontSize: 'var(--fs-sm)' }}>
              {profile.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
