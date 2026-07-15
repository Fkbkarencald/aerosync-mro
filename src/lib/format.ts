/**
 * Deterministic date/number formatting for the design preview.
 *
 * Mock timestamps are stored as local-ops ISO strings
 * ("2026-07-15T14:05"). Formatting works directly on the string so
 * output is identical in every environment (browser, SSR smoke test)
 * and never depends on the viewer's timezone. The preview's "now" is
 * pinned to a fixed operational moment.
 */

export const NOW = '2026-07-15T13:00'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function parts(iso: string) {
  const [d, t] = iso.split('T')
  const [y, m, day] = d.split('-').map(Number)
  return { y, m, day, time: t ? t.slice(0, 5) : '' }
}

/** "15 Jul 2026" */
export function fmtDate(iso: string): string {
  const { y, m, day } = parts(iso)
  return `${day} ${MONTHS[m - 1]} ${y}`
}

/** "15 Jul" */
export function fmtDayMonth(iso: string): string {
  const { m, day } = parts(iso)
  return `${day} ${MONTHS[m - 1]}`
}

/** "Wed 15 Jul" */
export function fmtWeekday(iso: string): string {
  const { y, m, day } = parts(iso)
  const dow = new Date(Date.UTC(y, m - 1, day)).getUTCDay()
  return `${DAYS[dow]} ${day} ${MONTHS[m - 1]}`
}

/** "14:05" */
export function fmtTime(iso: string): string {
  return parts(iso).time
}

/** "15 Jul, 14:05" */
export function fmtDateTime(iso: string): string {
  const { m, day, time } = parts(iso)
  return `${day} ${MONTHS[m - 1]}, ${time}`
}

/** "15 Jul 2026, 14:05" */
export function fmtDateTimeFull(iso: string): string {
  const { y, m, day, time } = parts(iso)
  return `${day} ${MONTHS[m - 1]} ${y}, ${time}`
}

function toMinutes(iso: string): number {
  const { y, m, day, time } = parts(iso)
  const [hh = '0', mm = '0'] = time ? time.split(':') : []
  return Date.UTC(y, m - 1, day, Number(hh), Number(mm)) / 60000
}

/**
 * Relative to the pinned preview moment: "2h ago", "35m ago",
 * "in 3h", "2d ago". Deterministic across environments.
 */
export function fmtRelative(iso: string, now: string = NOW): string {
  const diff = toMinutes(now) - toMinutes(iso)
  const abs = Math.abs(diff)
  let label: string
  if (abs < 60) label = `${Math.max(1, Math.round(abs))}m`
  else if (abs < 60 * 36) label = `${Math.round(abs / 60)}h`
  else label = `${Math.round(abs / (60 * 24))}d`
  return diff >= 0 ? `${label} ago` : `in ${label}`
}

/** Minutes between two ops timestamps (b - a). */
export function minutesBetween(a: string, b: string): number {
  return Math.round(toMinutes(b) - toMinutes(a))
}

/** "1h 25m" from minutes */
export function fmtDuration(mins: number): string {
  const h = Math.floor(Math.abs(mins) / 60)
  const m = Math.abs(mins) % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** "12,847.6" */
export function fmtNumber(n: number, dp = 0): string {
  return n.toLocaleString('en-AU', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })
}

/** "$14,820" */
export function fmtCurrency(n: number): string {
  return `$${fmtNumber(n)}`
}

/** Initials for avatars: "Daniel Reyes" → "DR" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

/** Stable 1–5 hue bucket for avatar colouring. */
export function avatarHue(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997
  return (h % 5) + 1
}
