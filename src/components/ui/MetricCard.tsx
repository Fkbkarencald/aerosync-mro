import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import type { Tone } from '@/lib/status'

interface MetricCardProps {
  label: string
  value: ReactNode
  meta?: ReactNode
  tone?: Tone
  icon?: LucideIcon
  to?: string
}

/** Compact KPI card; renders as a link when `to` is provided. */
export function MetricCard({ label, value, meta, tone, icon: Icon, to }: MetricCardProps) {
  const body = (
    <>
      <span className="metric-label">
        {Icon && <Icon size={13} aria-hidden="true" />}
        {label}
      </span>
      <span className="metric-value">{value}</span>
      {meta && <span className="metric-meta">{meta}</span>}
    </>
  )
  if (to) {
    return (
      <Link to={to} className="metric-card" data-tone={tone}>
        {body}
      </Link>
    )
  }
  return (
    <div className="metric-card" data-tone={tone}>
      {body}
    </div>
  )
}
