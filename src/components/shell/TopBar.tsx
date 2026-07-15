import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Building2,
  ChevronDown,
  CircleUserRound,
  FileCheck2,
  ClipboardCheck,
  LogOut,
  Menu,
  Package,
  Plane,
  Search,
  Settings,
  TriangleAlert,
  CalendarRange,
} from 'lucide-react'
import { paths } from '@/app/paths'
import { currentUser, notifications, OPERATOR_NAME, getProfile } from '@/data'
import { fmtRelative, initials, avatarHue } from '@/lib/format'
import { Popover } from '@/components/ui/Popover'

const NOTIF_ICONS = {
  aog: TriangleAlert,
  defect: TriangleAlert,
  signoff: FileCheck2,
  parts: Package,
  plan: CalendarRange,
} as const

export function TopBar({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const profileSummary = currentUser.securityProfileIds
    .map((id) => getProfile(id)?.name)
    .filter(Boolean)
    .join(' · ')

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn topbar-menu-btn"
        onClick={onOpenDrawer}
        aria-label="Open navigation menu"
      >
        <Menu size={19} aria-hidden="true" />
      </button>

      <span className="topbar-operator">
        <Building2 size={16} aria-hidden="true" />
        <span className="operator-name">{OPERATOR_NAME}</span>
      </span>

      <div className="topbar-search" role="search">
        <Search size={15} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search aircraft, defects, work orders…"
          aria-label="Global search (visual preview)"
        />
        <span className="kbd-hint" aria-hidden="true">⌘K</span>
      </div>

      <div className="topbar-right">
        <Popover
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          label="Notifications"
          width={340}
          trigger={
            <button
              type="button"
              className="icon-btn"
              aria-label={`Notifications — ${notifications.length} unread`}
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((v) => !v)}
            >
              <Bell size={18} aria-hidden="true" />
              <span className="notif-dot" aria-hidden="true" />
            </button>
          }
        >
          <div className="popover-head">
            Notifications
            <span className="chip">{notifications.length} unread</span>
          </div>
          <div>
            {notifications.map((n) => {
              const Icon = NOTIF_ICONS[n.kind]
              return (
                <div className="notif-item" key={n.id}>
                  <span className="notif-icon" data-tone={n.tone}>
                    <Icon size={14} aria-hidden="true" />
                  </span>
                  <div className="notif-text">
                    <p>
                      <strong>{n.strong}</strong> — {n.text}
                    </p>
                    <div className="notif-time">
                      {fmtRelative(n.at)} ·{' '}
                      <Link to={n.to} onClick={() => setNotifOpen(false)}>
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="popover-foot muted">Notification delivery is a visual preview only</div>
        </Popover>

        <Popover
          open={userOpen}
          onClose={() => setUserOpen(false)}
          label="User menu"
          width={280}
          trigger={
            <button
              type="button"
              className="topbar-user-btn"
              aria-expanded={userOpen}
              aria-label={`User menu — ${currentUser.name}`}
              onClick={() => setUserOpen((v) => !v)}
            >
              <span className="avatar" data-hue={avatarHue(currentUser.name)} aria-hidden="true">
                {initials(currentUser.name)}
              </span>
              <span className="topbar-user-meta">
                <strong>{currentUser.name}</strong>
                <span>{currentUser.role} · LE Release</span>
              </span>
              <ChevronDown size={14} aria-hidden="true" className="hide-mobile" />
            </button>
          }
        >
          <div className="popover-head" style={{ display: 'block' }}>
            <div>{currentUser.name}</div>
            <div className="muted" style={{ fontWeight: 400, marginTop: 2 }}>
              {currentUser.email}
            </div>
            <div className="muted" style={{ fontWeight: 400, marginTop: 6, fontSize: 'var(--fs-xs)' }}>
              {currentUser.role} · {profileSummary}
            </div>
          </div>
          <div className="menu-list">
            <Link className="menu-item" to={paths.adminUser(currentUser.id)} onClick={() => setUserOpen(false)}>
              <CircleUserRound size={16} aria-hidden="true" />
              My profile
            </Link>
            <Link className="menu-item" to={paths.myWorkOrders} onClick={() => setUserOpen(false)}>
              <ClipboardCheck size={16} aria-hidden="true" />
              My assignments
            </Link>
            <Link className="menu-item" to={paths.aircraftList} onClick={() => setUserOpen(false)}>
              <Plane size={16} aria-hidden="true" />
              Aircraft lookup
            </Link>
            <Link className="menu-item" to={paths.adminSettings} onClick={() => setUserOpen(false)}>
              <Settings size={16} aria-hidden="true" />
              Settings
            </Link>
            <div className="menu-sep" role="separator" />
            <Link className="menu-item menu-item--danger" to={paths.login} onClick={() => setUserOpen(false)}>
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </Link>
          </div>
        </Popover>
      </div>
    </header>
  )
}
