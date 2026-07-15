import { Link, useLocation } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { navGroups, isNavActive } from '@/app/navigation'
import { paths } from '@/app/paths'
import { BrandBlock } from './BrandMark'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
  onNavigate: () => void
}

export function Sidebar({ collapsed, onToggleCollapsed, onNavigate }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <nav id="app-sidebar" className="app-sidebar" aria-label="Primary navigation">
      <div className="nav-head">
        <Link
          to={paths.dashboard}
          onClick={onNavigate}
          aria-label="AeroSync MRO — dashboard"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <BrandBlock />
        </Link>
      </div>

      <div className="nav-scroll">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <span className="nav-group-label" aria-hidden={collapsed}>
              {group.label}
            </span>
            <ul>
              {group.items.map((item) => {
                const active = isNavActive(item, pathname)
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="nav-item"
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      aria-label={item.label}
                      onClick={onNavigate}
                    >
                      <Icon size={17} aria-hidden="true" />
                      <span className="nav-label">{item.label}</span>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span
                          className="nav-count"
                          data-tone={item.countTone === 'red' ? 'red' : undefined}
                          aria-label={`${item.count} items`}
                        >
                          {item.count}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="nav-foot">
        <button
          type="button"
          className="nav-collapse-btn"
          onClick={onToggleCollapsed}
          aria-pressed={collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen size={17} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={17} aria-hidden="true" />
          )}
          <span className="nav-label">{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>
    </nav>
  )
}
