import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { paths } from '@/app/paths'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Dashboard', to: paths.dashboard }, ...crumbs]
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {all.map((c, i) => {
        const last = i === all.length - 1
        return (
          <span key={`${c.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <ChevronRight size={12} className="crumb-sep" aria-hidden="true" />}
            {last || !c.to ? (
              <span aria-current={last ? 'page' : undefined}>{c.label}</span>
            ) : (
              <Link to={c.to}>{c.label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

interface PageHeaderProps {
  crumbs?: Crumb[]
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
}

/** Standard content header: breadcrumbs, title, description, actions. */
export function PageHeader({ crumbs, title, description, actions, meta }: PageHeaderProps) {
  return (
    <div className="page-header">
      {crumbs && <Breadcrumbs crumbs={crumbs} />}
      <div className="page-header-row">
        <div>
          <h1>{title}</h1>
          {description && <p className="page-desc">{description}</p>}
          {meta && <div className="entity-meta-row">{meta}</div>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
    </div>
  )
}
