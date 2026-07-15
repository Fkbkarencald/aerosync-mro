import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { BrandMark } from '@/components/shell/BrandMark'
import { PageHeader } from '@/components/shell/PageHeader'
import { StatusBadge } from '@/components/ui/Badge'
import { CheckRow, SelectField, TextAreaField, TextField } from '@/components/ui/Form'
import { Banner } from '@/components/ui/Misc'

const NAV_ITEMS = [
  { href: '#operator', label: 'Operator' },
  { href: '#branding', label: 'Branding' },
  { href: '#references', label: 'Reference formats' },
  { href: '#timezone', label: 'Time zone & bases' },
  { href: '#statuses', label: 'Status configuration' },
  { href: '#notifications', label: 'Notifications' },
  { href: '#security', label: 'Security' },
  { href: '#disclaimer', label: 'Prototype disclaimer' },
]

const BASES = [
  { code: 'MEL', name: 'Melbourne Airport', kind: 'Primary' },
  { code: 'MQL', name: 'Mildura', kind: 'Line station' },
  { code: 'ABX', name: 'Albury', kind: 'Line station' },
  { code: 'WGA', name: 'Wagga Wagga', kind: 'Port' },
]

const STATUS_ROWS: { tone: string; statuses: string[] }[] = [
  { tone: 'green', statuses: ['Available', 'Clear', 'Serviceable', 'Closed'] },
  { tone: 'amber', statuses: ['Monitor', 'Restricted', 'Assigned'] },
  { tone: 'orange', statuses: ['At Risk', 'Awaiting Parts', 'Awaiting Sign-off'] },
  { tone: 'red', statuses: ['AOG', 'No Go', 'Critical'] },
  { tone: 'grey', statuses: ['Cancelled', 'Archived'] },
  { tone: 'blue', statuses: ['Open', 'Reported', 'In Progress'] },
]

export function SettingsPage() {
  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Administration' }, { label: 'Settings' }]}
        title="Settings"
        description="Operator configuration, reference-number formats, operational bases and the disclaimer shown across the application."
        actions={
          <button type="button" className="btn btn--primary">
            Save all changes
          </button>
        }
      />

      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections">
          {NAV_ITEMS.map((item, i) => (
            <a key={item.href} href={item.href} aria-current={i === 0 ? 'true' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="form-stack">
          <section className="card" id="operator">
            <div className="form-section-head">
              <h2>Operator details</h2>
            </div>
            <form className="form-grid" onSubmit={(e) => e.preventDefault()} aria-label="Operator details">
              <TextField id="settings-operator-name" label="Operator name" defaultValue="AeroSync Regional Operations" />
              <TextField id="settings-operator-code" label="Operator code" defaultValue="ASR" />
              <TextField
                id="settings-operator-email"
                label="Primary contact email"
                type="email"
                defaultValue="marcus.hale@aerosync.example"
              />
              <TextField id="settings-operator-aoc" label="AOC reference" defaultValue="AOC-2025-114 (fictional)" />
            </form>
          </section>

          <section className="card" id="branding">
            <div className="form-section-head">
              <h2>Branding</h2>
            </div>
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="settings-brand-preview">Brand mark</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    id="settings-brand-preview"
                    style={{ background: 'var(--nav-bg)', borderRadius: 'var(--radius-md)', display: 'inline-flex', padding: 6 }}
                  >
                    <BrandMark size={40} />
                  </span>
                  <span className="field-hint">Fixed mark for this preview build — replacement upload isn't wired up.</span>
                </div>
              </div>
              <TextField
                id="settings-accent"
                label="Accent colour"
                defaultValue="#1D5FD6"
                hint="Applied to actions and active navigation"
              />
              <SelectField
                id="settings-sidebar-theme"
                label="Sidebar theme"
                options={['Deep navy (default)', 'Slate']}
                defaultValue="Deep navy (default)"
              />
            </div>
          </section>

          <section className="card" id="references">
            <div className="form-section-head">
              <h2>Reference-number formats</h2>
            </div>
            <form className="form-grid" onSubmit={(e) => e.preventDefault()} aria-label="Reference-number formats">
              <TextField
                id="settings-ref-defect"
                label="Defects"
                defaultValue="DEF-{YYYY}-{seq:4}"
                hint="Next: DEF-2026-0049"
              />
              <TextField
                id="settings-ref-wo"
                label="Work orders"
                defaultValue="WO-{YYYY}-{seq:4}"
                hint="Next: WO-2026-0039"
              />
              <TextField
                id="settings-ref-signoff"
                label="Sign-offs"
                defaultValue="SO-{YYYY}-{seq:4}"
                hint="Next: SO-2026-0019"
              />
              <TextField
                id="settings-ref-plan"
                label="Fleet plans"
                defaultValue="FP-{YYYY}-{MMDD}"
                hint="Next: FP-2026-0716"
              />
            </form>
          </section>

          <section className="card" id="timezone">
            <div className="form-section-head">
              <h2>Time zone &amp; operational bases</h2>
            </div>
            <div className="form-grid">
              <SelectField
                id="settings-timezone"
                label="Time zone"
                options={['Australia/Melbourne (AEST/AEDT)', 'Australia/Sydney', 'Australia/Brisbane']}
                defaultValue="Australia/Melbourne (AEST/AEDT)"
              />
              <CheckRow id="settings-show-utc" label="Show UTC alongside local times" />
            </div>
            <div className="row-list">
              {BASES.map((b) => (
                <div className="row-list-item" key={b.code}>
                  <div className="row-main">
                    <div className="row-title">
                      <span className="ref">{b.code}</span> {b.name}
                      {b.kind === 'Primary' && <span className="chip">Primary</span>}
                    </div>
                    <div className="row-sub">{b.kind === 'Primary' ? 'Home base' : b.kind}</div>
                  </div>
                  <div className="row-end">
                    <button type="button" className="btn btn--ghost btn--sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card" id="statuses">
            <div className="form-section-head">
              <h2>Status configuration preview</h2>
              <p>The documented tone vocabulary used across every badge in the application.</p>
            </div>
            <div className="row-list">
              {STATUS_ROWS.map((row) => (
                <div className="row-list-item" key={row.tone}>
                  <div className="row-main">
                    <div className="row-title" style={{ flexWrap: 'wrap' }}>
                      {row.statuses.map((s) => (
                        <StatusBadge key={s} status={s} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-body">
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                Transitions between these statuses are enforced by the workflow engine in the full product —
                this preview only displays the tone mapping.
              </p>
            </div>
          </section>

          <section className="card" id="notifications">
            <div className="form-section-head">
              <h2>Notification preferences</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CheckRow id="settings-notif-aog" label="AOG events — immediate, all controllers" defaultChecked />
              <CheckRow id="settings-notif-defect" label="Defect reported — controller queue digest" defaultChecked />
              <CheckRow
                id="settings-notif-signoff"
                label="Work order ready for sign-off — notify licensed engineers"
                defaultChecked
              />
              <CheckRow id="settings-notif-parts" label="Parts backorder updates — stores and requester" defaultChecked />
              <CheckRow id="settings-notif-daily" label="Daily fleet summary email — 06:00 local" />
            </div>
          </section>

          <section className="card" id="security">
            <div className="form-section-head">
              <h2>Security settings</h2>
            </div>
            <div className="form-grid">
              <SelectField
                id="settings-session-timeout"
                label="Session timeout"
                options={['30 minutes', '1 hour', '4 hours', '8 hours']}
                defaultValue="4 hours"
              />
              <TextField id="settings-password-policy" label="Password policy" defaultValue="Min 12 chars · number · symbol" />
              <CheckRow id="settings-mfa" label="Require MFA for Admin and Licensed Engineer roles" defaultChecked />
              <CheckRow id="settings-ip-allowlist" label="IP allow-list for admin routes" />
            </div>
            <div className="card-body">
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                Detailed permission grants live in <Link to={paths.adminProfiles}>Security profiles</Link>, not
                here.
              </p>
            </div>
          </section>

          <section className="card" id="disclaimer">
            <div className="form-section-head">
              <h2>Prototype disclaimer</h2>
            </div>
            <div className="form-grid">
              <TextAreaField
                id="settings-disclaimer-text"
                label="Disclaimer text"
                full
                defaultValue="Prototype — not for operational use or airworthiness decisions."
                hint="Shown persistently in the application footer and on formal documents."
              />
              <CheckRow id="settings-disclaimer-print" label="Show disclaimer on printed/exported documents" defaultChecked />
            </div>
          </section>

          <Banner tone="neutral">Settings are a visual preview — values are not persisted.</Banner>
        </div>
      </div>
    </div>
  )
}
