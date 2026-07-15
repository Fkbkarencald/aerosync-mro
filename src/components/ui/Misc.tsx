import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronRight, FileText, Image as ImageIcon, TriangleAlert } from 'lucide-react'
import type { Tone } from '@/lib/status'
import type { Attachment } from '@/data/types'
import { userName } from '@/data'
import { fmtDateTime } from '@/lib/format'

/** Progress bar with textual percentage (never colour-only). */
export function ProgressBar({ value, tone, label }: { value: number; tone?: Tone; label?: string }) {
  const pct = Math.round(value)
  return (
    <span className="progress" data-tone={tone} role="img" aria-label={label ?? `${pct}% complete`}>
      <span className="progress-track">
        <span className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </span>
      <span className="progress-label">{pct}%</span>
    </span>
  )
}

/** Empty state for filtered-out or genuinely empty mock views. */
export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <Icon size={28} aria-hidden="true" />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

/** Inline banner (info / warn / danger / neutral). */
export function Banner({
  tone,
  children,
  icon,
}: {
  tone: 'info' | 'warn' | 'danger' | 'neutral'
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className={`banner banner--${tone}`} role={tone === 'danger' ? 'alert' : undefined}>
      {icon ?? <TriangleAlert size={15} aria-hidden="true" />}
      <div>{children}</div>
    </div>
  )
}

/** Prototype notice used on auth pages and formal documents. */
export function PrototypeNotice({ compact }: { compact?: boolean }) {
  return (
    <div className={`banner banner--warn`} style={compact ? { padding: '8px 12px', fontSize: 'var(--fs-sm)' } : undefined}>
      <TriangleAlert size={15} aria-hidden="true" />
      <div>
        <strong>Prototype</strong> — not for operational use or airworthiness decisions.
      </div>
    </div>
  )
}

/** Attachment tiles (no real files — visual preview only). */
export function AttachmentGrid({ attachments }: { attachments: Attachment[] }) {
  if (attachments.length === 0) {
    return <p className="muted" style={{ fontSize: 'var(--fs-md)' }}>No attachments on this record.</p>
  }
  return (
    <div className="attachment-grid">
      {attachments.map((a) => (
        <div className="attachment" key={a.name} data-kind={a.kind}>
          <div className="attachment-thumb">
            {a.kind === 'photo' ? <ImageIcon size={22} aria-hidden="true" /> : <FileText size={22} aria-hidden="true" />}
          </div>
          <div className="attachment-meta">
            <div className="attachment-name" title={a.name}>
              {a.name}
            </div>
            <div className="attachment-sub">
              {a.kind === 'photo' ? 'Photo' : 'Document'} · {a.size} · {userName(a.uploadedByUserId)} ·{' '}
              {fmtDateTime(a.uploadedAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Visual pagination that pages a local mock view. */
export function Pagination({
  pages,
  page,
  onChange,
}: {
  pages: number
  page: number
  onChange: (page: number) => void
}) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <ChevronLeft size={14} aria-hidden="true" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page">
        <ChevronRight size={14} aria-hidden="true" />
      </button>
    </nav>
  )
}
