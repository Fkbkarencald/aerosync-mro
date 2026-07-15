import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight } from 'lucide-react'
import { paths } from '@/app/paths'
import {
  aircraft,
  getPart,
  inventoryTransactions,
  openWorkOrders,
  parts,
  shortName,
  stockLevels,
} from '@/data'
import { fmtDateTime } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { Overlay } from '@/components/ui/Overlay'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Form'
import type { InventoryTransaction } from '@/data/types'

const TYPES = ['Issue', 'Return', 'Transfer', 'Adjustment', 'Receipt']

export function TransactionsPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [warehouse, setWarehouse] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const warehouses = useMemo(() => Array.from(new Set(stockLevels.map((s) => s.warehouse))).sort(), [])
  const locations = useMemo(
    () => Array.from(new Set([...warehouses, ...aircraft.map((a) => a.registration)])).sort(),
    [warehouses],
  )
  const partOptions = useMemo(() => parts.map((p) => `${p.id} — ${p.description}`), [])
  const workOrderOptions = useMemo(() => [...openWorkOrders.map((w) => w.id), 'No work order'], [])

  const issuesToday = inventoryTransactions.filter(
    (t) => t.type === 'Issue' && t.performedAt.startsWith('2026-07-15'),
  ).length
  const receiptsThisWeek = inventoryTransactions.filter((t) => t.type === 'Receipt').length
  const adjustments = inventoryTransactions.filter((t) => t.type === 'Adjustment').length

  const sorted = useMemo(
    () => [...inventoryTransactions].sort((a, b) => b.performedAt.localeCompare(a.performedAt)),
    [],
  )

  const rows = useMemo(
    () =>
      sorted.filter((t) => {
        const part = getPart(t.partId)
        const text = `${t.id} ${t.reference} ${part?.description ?? ''} ${t.fromLocation} ${t.toLocation}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (type && t.type !== type) return false
        if (warehouse && t.fromLocation !== warehouse && t.toLocation !== warehouse) return false
        return true
      }),
    [sorted, q, type, warehouse],
  )

  const columns: Column<InventoryTransaction>[] = [
    {
      key: 'ref',
      header: 'Reference',
      render: (t) => (
        <>
          <span className="ref cell-main">{t.id}</span>
          <span className="cell-sub">{t.reference}</span>
        </>
      ),
    },
    { key: 'type', header: 'Type', render: (t) => <StatusBadge status={t.type} /> },
    {
      key: 'part',
      header: 'Part',
      render: (t) => (
        <>
          <span className="ref cell-main">{t.partId}</span>
          <span className="cell-sub">{getPart(t.partId)?.description ?? '—'}</span>
        </>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      numeric: true,
      render: (t) => (
        <span className="num">
          {t.type === 'Adjustment' && t.quantity > 0 ? '+' : ''}
          {t.quantity}
        </span>
      ),
    },
    {
      key: 'wo',
      header: 'Work order',
      render: (t) =>
        t.workOrderId ? (
          <Link to={paths.workOrder(t.workOrderId)} className="table-link ref">
            {t.workOrderId}
          </Link>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: 'aircraft',
      header: 'Aircraft',
      hideMobile: true,
      render: (t) =>
        t.aircraftId ? (
          <Link to={paths.aircraftDetail(t.aircraftId)} className="chip ref">
            {t.aircraftId}
          </Link>
        ) : (
          <span className="muted">—</span>
        ),
    },
    { key: 'by', header: 'Performed by', hideMobile: true, render: (t) => shortName(t.performedByUserId) },
    { key: 'date', header: 'Date', render: (t) => <span className="nowrap">{fmtDateTime(t.performedAt)}</span> },
    {
      key: 'route',
      header: 'From → To',
      render: (t) => (
        <>
          <span className="cell-main">{t.fromLocation}</span>
          <span className="cell-sub">→ {t.toLocation}</span>
        </>
      ),
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Supply & Commercial' }, { label: 'Inventory transactions' }]}
        title="Inventory transactions"
        description="Issue, return, transfer, adjustment and receipt movements across every warehouse, line locker and aircraft."
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setDrawerOpen(true)}>
            <ArrowLeftRight size={15} aria-hidden="true" />
            Issue or return part
          </button>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Issues today" value={issuesToday} tone="blue" meta="15 Jul movements" />
        <MetricCard label="Transfers in progress" value={1} tone="amber" meta="EDP en route MEL → MQL" />
        <MetricCard label="Receipts this week" value={receiptsThisWeek} tone="green" meta="goods-in accepted" />
        <MetricCard label="Adjustments" value={adjustments} meta="stocktake variances" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search reference, part, location…" value={q} onChange={setQ} width={280} />
            <SelectFilter label="Type" allLabel="All types" options={TYPES} value={type} onChange={setType} />
            <SelectFilter label="Warehouse" allLabel="All warehouses" options={warehouses} value={warehouse} onChange={setWarehouse} />
          </FilterBar>
        </div>
        <DataTable
          caption="Inventory transactions"
          columns={columns}
          rows={rows}
          rowKey={(t) => t.id}
          rowTone={(t) => (t.type === 'Transfer' && t.id === 'ITX-2026-0212' ? 'orange' : undefined)}
          footer={<TableFooter shown={rows.length} total={inventoryTransactions.length} />}
        />
      </section>

      <Overlay
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Issue or return part"
        variant="drawer"
        footer={
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn--primary" onClick={() => setDrawerOpen(false)}>
              Record transaction
            </button>
          </>
        }
      >
        <form className="form-grid" onSubmit={(e) => e.preventDefault()} aria-label="Issue or return part">
          <SelectField
            id="txn-type"
            label="Transaction type"
            options={['Issue', 'Return', 'Transfer', 'Adjustment']}
            defaultValue="Issue"
            required
          />
          <SelectField id="txn-part" label="Part" options={partOptions} placeholder="Select a part" required full />
          <TextField id="txn-qty" label="Quantity" type="number" defaultValue="1" required />
          <SelectField id="txn-from" label="From location" options={locations} placeholder="Select a location" required />
          <SelectField id="txn-to" label="To location" options={locations} placeholder="Select a location" required />
          <SelectField id="txn-wo" label="Work order" options={workOrderOptions} defaultValue="No work order" full />
          <TextAreaField id="txn-notes" label="Notes" placeholder="Add any handling or routing notes…" full />
          <p className="muted" style={{ fontSize: 'var(--fs-sm)', gridColumn: '1 / -1' }}>
            Preview only — nothing here is recorded against live stock.
          </p>
        </form>
      </Overlay>
    </div>
  )
}
