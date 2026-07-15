import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: ReactNode
  render: (row: T) => ReactNode
  /** Right-align numeric columns. */
  numeric?: boolean
  /** Hide this column below the tablet breakpoint. */
  hideMobile?: boolean
  width?: number | string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  /** Accent stripe for critical rows ("red" | "orange"). */
  rowTone?: (row: T) => 'red' | 'orange' | undefined
  caption: string
  compact?: boolean
  empty?: ReactNode
  footer?: ReactNode
}

/**
 * Dense operational table. Horizontal scrolling is handled by the
 * wrapper so wide tables never force page overflow; low-priority
 * columns can opt out on mobile via `hideMobile`.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  rowTone,
  caption,
  compact,
  empty,
  footer,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>
  }
  return (
    <>
      <div className="table-wrap">
        <table className={`data-table${compact ? ' data-table--compact' : ''}`}>
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`${c.numeric ? 'num' : ''} ${c.hideMobile ? 'hide-mobile' : ''}`.trim() || undefined}
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} data-row-tone={rowTone?.(row)}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`${c.numeric ? 'num' : ''} ${c.hideMobile ? 'hide-mobile' : ''}`.trim() || undefined}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </>
  )
}

/** Standard "n of n" table footer with optional pagination slot. */
export function TableFooter({ shown, total, children }: { shown: number; total: number; children?: ReactNode }) {
  return (
    <div className="table-foot">
      <span>
        Showing {shown} of {total}
      </span>
      {children}
    </div>
  )
}
