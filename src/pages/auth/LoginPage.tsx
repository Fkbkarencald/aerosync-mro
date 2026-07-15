import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { BrandBlock } from '@/components/shell/BrandMark'
import { StatusBadge } from '@/components/ui/Badge'
import { CheckRow, TextField } from '@/components/ui/Form'
import { PrototypeNotice } from '@/components/ui/Misc'

/**
 * Standalone sign-in screen — no application shell. "Sign in" is a
 * plain navigation Link to the dashboard, matching the preview's
 * always-authenticated convention.
 */
export function LoginPage() {
  return (
    <div className="auth-layout">
      <div className="auth-form-col">
        <div className="auth-form-inner">
          <div className="auth-brand">
            <BrandBlock />
          </div>

          <div className="auth-title">
            <h1>Sign in to AeroSync MRO</h1>
            <p>Fleet maintenance, planning and release control.</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()} aria-label="Sign in">
            <TextField
              id="login-email"
              label="Email"
              type="email"
              placeholder="name@operator.com.au"
              defaultValue="daniel.reyes@aerosync.example"
            />
            <TextField id="login-password" label="Password" type="password" defaultValue="preview-only" />

            <div className="auth-links">
              <CheckRow id="remember" label="Keep me signed in on this device" defaultChecked />
              <Link to={paths.forgotPassword}>Forgot password?</Link>
            </div>

            <Link to={paths.dashboard} className="btn btn--primary btn--lg btn--block">
              Sign in
            </Link>
          </form>

          <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
            Access is provisioned by your administrator — accounts use role plus security profiles.
          </p>

          <PrototypeNotice compact />

          <div className="auth-foot">© 2026 AeroSync MRO · Design preview build</div>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-grid" aria-hidden="true" />
        <div className="auth-visual-content">
          <h2>Every tail, every defect, every release — one operational picture.</h2>
          <p>
            Fleet planners, maintenance controllers, engineers and licensed engineers share the same live
            board — from the moment a pilot reports a defect through to the certified release that puts
            the aircraft back on the schedule.
          </p>

          <div className="auth-visual-card">
            <div className="avc-row">
              <span className="ref">VH-OYU</span>
              <span>Assigned · ASR-214 MEL→MQL</span>
              <StatusBadge status="Assigned" />
            </div>
            <div className="avc-row">
              <span className="ref">WO-2026-0035</span>
              <span>Landing light — awaiting certification</span>
              <StatusBadge status="Ready for Sign-off" />
            </div>
            <div className="avc-row">
              <span className="ref">VH-RXT</span>
              <span>Hydraulic pump — recovery in progress</span>
              <StatusBadge status="AOG" />
            </div>
          </div>

          <div className="auth-visual-stats">
            <div>
              <div className="stat-label">Aircraft managed</div>
              <div className="stat-value">10</div>
            </div>
            <div>
              <div className="stat-label">Releases this quarter</div>
              <div className="stat-value">8</div>
            </div>
            <div>
              <div className="stat-label">Audited actions today</div>
              <div className="stat-value">22</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
