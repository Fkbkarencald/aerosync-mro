import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface TabDef {
  id: string
  label: string
  count?: number
  content: ReactNode
}

/**
 * Accessible tabs: roving arrow-key focus, aria-selected, labelled
 * panels. State is local to the page (preview behaviour).
 */
export function Tabs({ tabs, initial }: { tabs: TabDef[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id ?? '')
  const baseId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = tabs.length - 1
    if (next >= 0) {
      e.preventDefault()
      const tab = tabs[next]!
      setActive(tab.id)
      refs.current[next]?.focus()
    }
  }

  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <div>
      <div className="tabs" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${t.id}`}
            aria-selected={t.id === active}
            aria-controls={`${baseId}-panel-${t.id}`}
            tabIndex={t.id === active ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
            {typeof t.count === 'number' && <span className="tab-count">{t.count}</span>}
          </button>
        ))}
      </div>
      {activeTab && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeTab.id}`}
          aria-labelledby={`${baseId}-tab-${activeTab.id}`}
          style={{ paddingTop: 'var(--sp-5)' }}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  )
}
