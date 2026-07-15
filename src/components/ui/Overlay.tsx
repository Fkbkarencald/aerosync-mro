import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface OverlayProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  /** "drawer" slides from the right; "dialog" is centred. */
  variant: 'drawer' | 'dialog'
}

/**
 * Accessible overlay used for preview drawers and dialogs:
 * focus moves into the panel on open, Escape and scrim-click close,
 * and focus is trapped while open.
 */
export function Overlay({ open, onClose, title, children, footer, variant }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    panel?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]!
        const last = focusables[focusables.length - 1]!
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="overlay-scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className={variant === 'drawer' ? 'drawer-panel' : 'dialog-panel'}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="overlay-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="overlay-body">{children}</div>
        {footer && <div className="overlay-foot">{footer}</div>}
      </div>
    </div>
  )
}
