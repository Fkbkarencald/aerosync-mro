import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { paths } from '@/app/paths'
import { BrandBlock } from '@/components/shell/BrandMark'
import { TextField } from '@/components/ui/Form'
import { Banner, PrototypeNotice } from '@/components/ui/Misc'

/**
 * Standalone password-reset request screen. Demonstrates the
 * confirmation-state preview: submitting swaps the form for a
 * Banner acknowledging the (fictional) reset email.
 */
export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="auth-layout">
      <div className="auth-form-col">
        <div className="auth-form-inner">
          <div className="auth-brand">
            <BrandBlock />
          </div>

          <div className="auth-title">
            <h1>Reset your password</h1>
            <p>Enter the email on your AeroSync MRO account and we will send a link to reset your password.</p>
          </div>

          {!sent ? (
            <form
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              aria-label="Reset password"
            >
              <TextField
                id="forgot-email"
                label="Email"
                type="email"
                placeholder="name@operator.com.au"
                defaultValue="daniel.reyes@aerosync.example"
              />
              <button type="submit" className="btn btn--primary btn--lg btn--block">
                Send reset link
              </button>
            </form>
          ) : (
            <div className="auth-form">
              <Banner tone="info" icon={<MailCheck size={15} aria-hidden="true" />}>
                Reset link sent — check daniel.reyes@aerosync.example. The link expires in 30 minutes.
              </Banner>
              <button type="button" className="btn btn--secondary">
                Send again
              </button>
            </div>
          )}

          <div className="auth-links">
            <Link to={paths.login}>← Back to sign in</Link>
          </div>

          <PrototypeNotice compact />

          <div className="auth-foot">© 2026 AeroSync MRO · Design preview build</div>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-grid" aria-hidden="true" />
        <div className="auth-visual-content">
          <h2>Release control needs accountable access.</h2>
          <p>
            Password resets, invitations and session activity are all recorded to the audit trail —
            every account change is traceable back to an administrator and a timestamp.
          </p>
        </div>
      </div>
    </div>
  )
}
