import type { ReactNode } from 'react'
import {
  CircleCheck,
  CircleAlert,
  OctagonAlert,
  TriangleAlert,
  Info,
} from 'lucide-react'
import { toneFor, type Tone } from '@/lib/status'

interface BadgeProps {
  tone: Tone
  children: ReactNode
  icon?: ReactNode
  title?: string
}

export function Badge({ tone, children, icon, title }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}`} title={title}>
      {icon ?? <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  )
}

/** Any documented workflow status → tone-mapped badge with label. */
export function StatusBadge({ status, title }: { status: string; title?: string }) {
  return (
    <Badge tone={toneFor(status)} title={title}>
      {status}
    </Badge>
  )
}

/** Defect severity with a shape icon (not colour-only). */
export function SeverityBadge({ severity }: { severity: string }) {
  const tone = toneFor(severity)
  const icon =
    severity === 'Critical' ? (
      <OctagonAlert size={12} aria-hidden="true" />
    ) : severity === 'Significant' ? (
      <TriangleAlert size={12} aria-hidden="true" />
    ) : (
      <Info size={12} aria-hidden="true" />
    )
  return (
    <Badge tone={tone} icon={icon}>
      {severity}
    </Badge>
  )
}

/** Flight / aircraft maintenance risk with icon reinforcement. */
export function RiskBadge({ risk }: { risk: string }) {
  const tone = toneFor(risk)
  const icon =
    risk === 'No Go' ? (
      <OctagonAlert size={12} aria-hidden="true" />
    ) : risk === 'At Risk' ? (
      <TriangleAlert size={12} aria-hidden="true" />
    ) : risk === 'Monitor' ? (
      <CircleAlert size={12} aria-hidden="true" />
    ) : (
      <CircleCheck size={12} aria-hidden="true" />
    )
  return (
    <Badge tone={tone} icon={icon}>
      {risk}
    </Badge>
  )
}

/** Work-order priority (AOG rendered as a solid red badge). */
export function PriorityBadge({ priority }: { priority: string }) {
  if (priority === 'AOG') {
    return (
      <span className="badge badge--solid-red">
        <OctagonAlert size={12} aria-hidden="true" />
        AOG
      </span>
    )
  }
  return <StatusBadge status={priority} />
}

/** Status badge + supporting reason text for dense table cells. */
export function StatusCell({ status, reason }: { status: string; reason?: string }) {
  return (
    <div className="status-cell">
      <StatusBadge status={status} />
      {reason && (
        <span className="status-reason" title={reason}>
          {reason}
        </span>
      )}
    </div>
  )
}
