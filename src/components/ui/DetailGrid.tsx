import type { ReactNode } from 'react'

export interface DetailItem {
  label: string
  value: ReactNode
}

/** Key/value grid used on detail pages (definition-list semantics). */
export function DetailGrid({ items }: { items: DetailItem[] }) {
  return (
    <dl className="detail-grid">
      {items.map((item) => (
        <div className="detail-item" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
