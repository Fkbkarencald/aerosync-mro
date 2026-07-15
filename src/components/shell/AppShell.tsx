import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

/**
 * Global application shell: collapsible sidebar (drawer below 768px),
 * sticky top bar, content region and the persistent prototype
 * disclaimer footer.
 */
export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  // Reset scroll and close the mobile drawer on navigation.
  useEffect(() => {
    setDrawerOpen(false)
    window.scrollTo({ top: 0 })
  }, [pathname])

  // Escape closes the drawer.
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <div
      className="app-shell"
      data-sidebar={collapsed ? 'collapsed' : 'expanded'}
      data-drawer={drawerOpen ? 'open' : 'closed'}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        onNavigate={closeDrawer}
      />
      <button
        type="button"
        className="nav-scrim"
        aria-label="Close navigation menu"
        tabIndex={drawerOpen ? 0 : -1}
        onClick={closeDrawer}
      />

      <div className="app-main">
        <TopBar onOpenDrawer={() => setDrawerOpen(true)} />

        <main id="main-content" className="app-content" tabIndex={-1}>
          <Outlet />
        </main>

        <footer className="prototype-footer">
          <TriangleAlert size={14} aria-hidden="true" />
          <span>
            <strong>Prototype</strong> — not for operational use or airworthiness decisions.
          </span>
          <span className="foot-meta">AeroSync MRO · Design preview build · Ops time pinned to 15 Jul 2026, 13:00</span>
        </footer>
      </div>
    </div>
  )
}
