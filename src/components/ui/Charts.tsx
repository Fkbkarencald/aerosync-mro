/**
 * Small dependency-free SVG charts for dashboards and reports.
 * Every chart pairs colour with a text legend, and exposes an
 * accessible label.
 */

const TONE_COLORS = {
  green: 'var(--tone-green-dot)',
  amber: 'var(--tone-amber-dot)',
  orange: 'var(--tone-orange-dot)',
  red: 'var(--tone-red-dot)',
  grey: 'var(--tone-grey-dot)',
  blue: 'var(--tone-blue-dot)',
  accent: 'var(--accent)',
} as const

export type ChartTone = keyof typeof TONE_COLORS

export interface StackSeries {
  label: string
  tone: ChartTone
  values: number[]
}

interface StackedBarChartProps {
  labels: string[]
  series: StackSeries[]
  height?: number
  ariaLabel: string
}

/** Stacked columns (e.g. 7-day availability). */
export function StackedBarChart({ labels, series, height = 120, ariaLabel }: StackedBarChartProps) {
  const n = labels.length
  const totals = labels.map((_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0))
  const max = Math.max(...totals, 1)
  const gap = 8
  const w = 100 / n

  return (
    <div>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height }}
        role="img"
        aria-label={ariaLabel}
      >
        {labels.map((_, i) => {
          let y = height
          return (
            <g key={`col-${i}`}>
              {series.map((s) => {
                const v = s.values[i] ?? 0
                const h = (v / max) * (height - 6)
                y -= h
                return (
                  <rect
                    key={s.label}
                    x={i * w + gap / 2}
                    y={y}
                    width={w - gap}
                    height={Math.max(h - 1.5, 0)}
                    rx={1.5}
                    fill={TONE_COLORS[s.tone]}
                  />
                )
              })}
            </g>
          )
        })}
      </svg>
      <div className="bar-chart-labels" aria-hidden="true">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <div className="chart-legend" style={{ marginTop: 6 }}>
        {series.map((s) => (
          <span className="legend-item" key={s.label}>
            <span className="legend-swatch" style={{ background: TONE_COLORS[s.tone] }} aria-hidden="true" />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

interface DonutSegment {
  label: string
  value: number
  tone: ChartTone
}

/** Donut breakdown (e.g. open defects by severity). */
export function DonutChart({
  segments,
  centreLabel,
  centreValue,
  size = 132,
  ariaLabel,
}: {
  segments: DonutSegment[]
  centreLabel: string
  centreValue: string
  size?: number
  ariaLabel: string
}) {
  const total = Math.max(
    segments.reduce((s, seg) => s + seg.value, 0),
    1,
  )
  const r = 15.915
  let offset = 25 // start at 12 o'clock

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox="0 0 42 42" role="img" aria-label={ariaLabel}>
        <circle cx="21" cy="21" r={r} fill="none" stroke="var(--tone-grey-bg)" strokeWidth="5" />
        {segments.map((seg) => {
          const frac = (seg.value / total) * 100
          const el = (
            <circle
              key={seg.label}
              cx="21"
              cy="21"
              r={r}
              fill="none"
              stroke={TONE_COLORS[seg.tone]}
              strokeWidth="5"
              strokeDasharray={`${frac} ${100 - frac}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          )
          offset -= frac
          return el
        })}
        <text
          x="21"
          y="20"
          textAnchor="middle"
          style={{ font: '650 8px var(--font-sans)', fill: 'var(--text)' }}
        >
          {centreValue}
        </text>
        <text
          x="21"
          y="26.5"
          textAnchor="middle"
          style={{ font: '500 3.1px var(--font-sans)', fill: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
          {centreLabel}
        </text>
      </svg>
      <div className="chart-legend" style={{ flexDirection: 'column', gap: 6 }}>
        {segments.map((seg) => (
          <span className="legend-item" key={seg.label}>
            <span className="legend-swatch" style={{ background: TONE_COLORS[seg.tone] }} aria-hidden="true" />
            {seg.label} — <strong>{seg.value}</strong>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Simple sparkline for report cards. */
export function Sparkline({
  values,
  tone = 'accent',
  height = 34,
  ariaLabel,
}: {
  values: number[]
  tone?: ChartTone
  height?: number
  ariaLabel: string
}) {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${height - 3 - ((v - min) / range) * (height - 6)}`)
    .join(' ')
  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height }}
      role="img"
      aria-label={ariaLabel}
    >
      <polyline points={pts} fill="none" stroke={TONE_COLORS[tone]} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

interface HBarRow {
  label: string
  value: number
  tone?: ChartTone
  detail?: string
}

/** Horizontal comparison bars with visible values. */
export function HBarChart({ rows, ariaLabel, unit }: { rows: HBarRow[]; ariaLabel: string; unit?: string }) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <div role="img" aria-label={ariaLabel} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '130px 1fr auto', gap: 10, alignItems: 'center', fontSize: 'var(--fs-sm)' }}>
          <span className="text-secondary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.label}>
            {r.label}
          </span>
          <span style={{ background: 'var(--tone-grey-bg)', borderRadius: 3, height: 8, overflow: 'hidden' }}>
            <span
              style={{
                display: 'block',
                height: '100%',
                width: `${(r.value / max) * 100}%`,
                background: TONE_COLORS[r.tone ?? 'accent'],
                borderRadius: 3,
              }}
            />
          </span>
          <span className="num" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            {r.value}
            {unit ?? ''}
          </span>
        </div>
      ))}
    </div>
  )
}
