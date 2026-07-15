import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { paths } from '@/app/paths'
import { getPart, stockLevels } from '@/data'
import { PageHeader } from '@/components/shell/PageHeader'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { EmptyState } from '@/components/ui/Misc'
import type { StockLevel } from '@/data/types'

const HEALTH_OPTIONS = ['Low stock only', 'Healthy only']

export function StockPage() {
  const [q, setQ] = useState('')
  const [warehouse, setWarehouse] = useState('')
  const [health, setHealth] = useState('')

  const warehouses = useMemo(() => Array.from(new Set(stockLevels.map((s) => s.warehouse))).sort(), [])
  const reservedTotal = stockLevels.reduce((sum, s) => sum + s.reserved, 0)
  const lowStockCount = stockLevels.filter((s) => s.lowStock).length

  const rows = useMemo(
    () =>
      stockLevels.filter((s) => {
        const part = getPart(s.partId)
        const text = `${s.partId} ${part?.description ?? ''} ${s.bin}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (warehouse && s.warehouse !== warehouse) return false
        if (health === 'Low stock only' && !s.lowStock) return false
        if (health === 'Healthy only' && s.lowStock) return false
        return true
      }),
    [q, warehouse, health],
  )

  const columns: Column<StockLevel>[] = [
    {
      key: 'part',
      header: 'Part',
      render: (s) => (
        <>
          <span className="ref cell-main">{s.partId}</span>
          <span className="cell-sub">{getPart(s.partId)?.description ?? '—'}</span>
        </>
      ),
    },
    { key: 'warehouse', header: 'Warehouse', render: (s) => s.warehouse },
    { key: 'bin', header: 'Bin', render: (s) => <span className="ref">{s.bin}</span> },
    {
      key: 'serviceable',
      header: 'Serviceable',
      numeric: true,
      render: (s) => <span className="num">{s.serviceable}</span>,
    },
    {
      key: 'unserviceable',
      header: 'Unserviceable',
      numeric: true,
      render: (s) => <span className="num">{s.unserviceable}</span>,
    },
    {
      key: 'reserved',
      header: 'Reserved',
      numeric: true,
      render: (s) => <span className="num">{s.reserved}</span>,
    },
    {
      key: 'available',
      header: 'Available',
      numeric: true,
      render: (s) => (
        <span className="num" style={{ fontWeight: 650 }}>
          {Math.max(s.serviceable - s.reserved, 0)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <StatusBadge status={s.lowStock ? 'Low Stock' : 'In Stock'} />,
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Supply & Commercial' }, { label: 'Stock levels' }]}
        title="Stock levels"
        description="Serviceable, unserviceable and reserved quantities by warehouse and bin, across every stock line in the network."
        actions={
          <>
            <button type="button" className="btn btn--secondary">
              Stock adjustment
            </button>
            <Link to={paths.inventoryTransactions} className="btn btn--primary">
              New transaction
            </Link>
          </>
        }
      />

      <div className="stat-strip" role="group" aria-label="Stock summary">
        <div className="stat">
          <span className="stat-label">Stock lines</span>
          <span className="stat-value">{stockLevels.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Warehouses</span>
          <span className="stat-value">{warehouses.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Reserved units</span>
          <span className="stat-value">{reservedTotal}</span>
        </div>
        <div className="stat">
          <span className="stat-label" style={{ color: 'var(--tone-orange-text)' }}>Low-stock lines</span>
          <span className="stat-value" style={{ color: 'var(--tone-orange-text)' }}>{lowStockCount}</span>
        </div>
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search part number, bin…" value={q} onChange={setQ} width={280} />
            <SelectFilter label="Warehouse" allLabel="All warehouses" options={warehouses} value={warehouse} onChange={setWarehouse} />
            <SelectFilter label="Stock health" allLabel="All stock" options={HEALTH_OPTIONS} value={health} onChange={setHealth} />
          </FilterBar>
        </div>
        <DataTable
          caption="Stock levels by warehouse and bin"
          columns={columns}
          rows={rows}
          rowKey={(s) => `${s.partId}-${s.warehouse}-${s.bin}`}
          rowTone={(s) => (s.lowStock ? 'orange' : undefined)}
          empty={
            <EmptyState icon={PackageSearch} title="No stock lines match these filters">
              Adjust the search or clear a filter to see the rest of the network.
            </EmptyState>
          }
          footer={<TableFooter shown={rows.length} total={stockLevels.length} />}
        />
        <div className="card-footer">
          Available = serviceable − reserved; quarantine stock is excluded from availability.
        </div>
      </section>
    </div>
  )
}
