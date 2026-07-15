import { useEffect, useRef, type ReactNode } from 'react'

interface PopoverProps {
  open: boolean
  onClose: () => void
  /** The trigger button — rendered inside the anchor wrapper. */
  trigger: ReactNode
  children: ReactNode
  label: string
  width?: number
}

/**
 * Lightweight anchored popover for top-bar menus. Closes on Escape
 * and on any pointer press outside the anchor.
 */
export function Popover({ open, onClose, trigger, children, label, width }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const onPress = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPress)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPress)
    }
  }, [open, onClose])

  return (
    <div className="popover-anchor" ref={ref}>
      {trigger}
      {open && (
        <div className="popover" role="dialog" aria-label={label} style={width ? { width } : undefined}>
          {children}
        </div>
      )}
    </div>
  )
}
