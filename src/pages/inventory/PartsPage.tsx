import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Plus } from 'lucide-react'
import { paths } from '@/app/paths'
import { parts } from '@/data'
import { fmtCurrency } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { EmptyState, Pagination } from '@/components/ui/Misc'
import { usePagination } from '@/components/ui/usePagination'
import type { Part } from '@/data/types'

const STOCK_STATES = ['In Stock', 'Low Stock', 'Out of Stock', 'Quarantine']

export function PartsPage() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [effectivity, setEffectivity] = useState('')
  const [stockState, setStockState] = useState('')

  const categories = useMemo(() => Array.from(new Set(parts.map((p) => p.category))).sort(), [])
  const effectivities = useMemo(() => Array.from(new Set(parts.map((p) => p.effectivity))).sort(), [])

  const lowStock = parts.filter((p) => p.stockState === 'Low Stock').length
  const outOfStock = parts.filter((p) => p.stockState === 'Out of Stock').length
  const quarantined = parts.filter((p) => p.stockState === 'Quarantine').length

  const rows = useMemo(
    () =>
      parts.filter((p) => {
        const text = `${p.id} ${p.description} ${p.manufacturer}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (category && p.category !== category) return false
        if (effectivity && p.effectivity !== effectivity) return false
        if (stockState && p.stockState !== stockState) return false
        return true
      }),
    [q, category, effectivity, stockState],
  )

  const paged = usePagination(rows, 12)

  const columns: Column<Part>[] = [
    {
      key: 'ref',
      header: 'Part number',
      render: (p) => <strong className="ref">{p.id}</strong>,
    },
    {
      key: 'desc',
      header: 'Description',
      render: (p) => (
        <>
          <span className="cell-main">{p.description}</span>
          <span className="cell-sub">{p.manufacturer}</span>
        </>
      ),
    },
    { key: 'category', header: 'Category', hideMobile: true, render: (p) => p.category },
    { key: 'ata', header: 'ATA', hideMobile: true, render: (p) => p.ataChapter },
    { key: 'effectivity', header: 'Effectivity', render: (p) => p.effectivity },
    { key: 'stock', header: 'Stock state', render: (p) => <StatusBadge status={p.stockState} /> },
    { key: 'uom', header: 'UoM', hideMobile: true, render: (p) => p.unitOfMeasure },
    {
      key: 'reorder',
      header: 'Reorder level',
      numeric: true,
      hideMobile: true,
      render: (p) => <span className="num">{p.reorderLevel}</span>,
    },
    {
      key: 'cost',
      header: 'Unit cost',
      numeric: true,
      hideMobile: true,
      render: (p) => <span className="num">{fmtCurrency(p.unitCost)}</span>,
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Supply & Commercial' }, { label: 'Parts catalogue' }]}
        title="Parts catalogue"
        description="Every part number held or approved for use across the fleet, with effectivity, category and current stock state."
        actions={
          <>
            <Link to={paths.inventoryStock} className="btn btn--secondary">
              Stock levels
            </Link>
            <button type="button" className="btn btn--primary">
              <Plus size={15} aria-hidden="true" />
              Add part
            </button>
          </>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Catalogued parts" value={parts.length} icon={Package} meta="active part numbers" />
        <MetricCard label="Low stock" value={lowStock} tone="orange" meta="below reorder level" />
        <MetricCard label="Out of stock" value={outOfStock} tone="red" meta="no serviceable units" />
        <MetricCard label="Quarantined" value={quarantined} tone="amber" meta="pending cert review" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput
              placeholder="Search part number, description, manufacturer…"
              value={q}
              onChange={setQ}
              width={300}
            />
            <SelectFilter label="Category" allLabel="All categories" options={categories} value={category} onChange={setCategory} />
            <SelectFilter label="Effectivity" allLabel="All effectivities" options={effectivities} value={effectivity} onChange={setEffectivity} />
            <SelectFilter label="Stock state" allLabel="All stock states" options={STOCK_STATES} value={stockState} onChange={setStockState} />
          </FilterBar>
        </div>
        <DataTable
          caption="Parts catalogue"
          columns={columns}
          rows={paged.rows}
          rowKey={(p) => p.id}
          rowTone={(p) => (p.stockState === 'Out of Stock' ? 'red' : p.stockState === 'Low Stock' ? 'orange' : undefined)}
          empty={
            <EmptyState icon={Package} title="No parts match these filters">
              Adjust the search or clear a filter to see the rest of the catalogue.
            </EmptyState>
          }
          footer={
            <TableFooter shown={paged.rows.length} total={rows.length}>
              <Pagination pages={paged.pages} page={paged.page} onChange={paged.setPage} />
            </TableFooter>
          }
        />
      </section>
    </div>
  )
}
