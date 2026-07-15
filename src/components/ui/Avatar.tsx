import { Link } from 'react-router-dom'
import { avatarHue, initials } from '@/lib/format'
import { getUser } from '@/data'
import { paths } from '@/app/paths'

export function Avatar({ name, size }: { name: string; size?: 'sm' | 'lg' }) {
  return (
    <span
      className={`avatar${size ? ` avatar--${size}` : ''}`}
      data-hue={avatarHue(name)}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

interface UserChipProps {
  userId?: string
  /** Secondary line, defaults to the user's role. */
  sub?: string
  link?: boolean
  size?: 'sm'
}

/** Avatar + name (+ role) cell, optionally linking to the admin user page. */
export function UserChip({ userId, sub, link, size }: UserChipProps) {
  const user = userId ? getUser(userId) : undefined
  if (!user) {
    return <span className="muted">Unassigned</span>
  }
  const name = link ? (
    <Link to={paths.adminUser(user.id)} className="table-link">
      {user.name}
    </Link>
  ) : (
    user.name
  )
  return (
    <span className="user-cell">
      <Avatar name={user.name} size={size} />
      <span>
        <span className="user-cell-name">{name}</span>
        {sub !== '' && <span className="user-cell-sub" style={{ display: 'block' }}>{sub ?? user.role}</span>}
      </span>
    </span>
  )
}
