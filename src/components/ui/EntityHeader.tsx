import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EntityHeaderProps {
  /** Short identity glyph, e.g. an icon or "OYU". */
  identIcon?: LucideIcon
  identText?: string
  identTone?: 'red'
  title: ReactNode
  badges?: ReactNode
  subtitle?: ReactNode
  meta?: { icon?: LucideIcon; label: string; value: ReactNode }[]
  actions?: ReactNode
}

/** Strong entity header card for detail pages (aircraft, WO, defect…). */
export function EntityHeader({
  identIcon: IdentIcon,
  identText,
  identTone,
  title,
  badges,
  subtitle,
  meta,
  actions,
}: EntityHeaderProps) {
  return (
    <section className="entity-header">
      <span className="entity-ident" data-tone={identTone} aria-hidden="true">
        {IdentIcon ? <IdentIcon size={24} /> : <span style={{ fontWeight: 700, fontSize: 13 }}>{identText}</span>}
      </span>
      <div className="entity-head-main">
        <div className="entity-title-row">
          <h1>{title}</h1>
          {badges}
        </div>
        {subtitle && <p className="entity-sub">{subtitle}</p>}
        {meta && meta.length > 0 && (
          <div className="entity-meta-row">
            {meta.map((m) => (
              <span className="meta-pair" key={m.label}>
                {m.icon && <m.icon size={13} aria-hidden="true" />}
                {m.label}: <strong>{m.value}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
      {actions && <div className="entity-actions">{actions}</div>}
    </section>
  )
}
