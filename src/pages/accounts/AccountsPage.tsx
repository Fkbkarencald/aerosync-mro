import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { paths } from '@/app/paths'
import { accounts, getAircraft, openWorkOrders } from '@/data'
import { fmtCurrency } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import type { Account } from '@/data/types'

const TYPES = ['Operator', 'Customer', 'Internal', 'Supplier']
const BILLING_STATES = ['Current', 'Invoiced', 'Overdue', 'Internal']

function openWosForAccount(account: Account): number {
  return openWorkOrders.filter((w) => getAircraft(w.aircraftId)?.accountId === account.id).length
}

export function AccountsPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [billingState, setBillingState] = useState('')

  const customers = accounts.filter((a) => a.type === 'Customer').length
  const totalOpenWos = accounts.reduce((sum, a) => sum + openWosForAccount(a), 0)
  const overdueBilling = accounts.filter((a) => a.billingState === 'Overdue').length

  const rows = useMemo(
    () =>
      accounts.filter((a) => {
        const text = `${a.id} ${a.name} ${a.code}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (type && a.type !== type) return false
        if (billingState && a.billingState !== billingState) return false
        return true
      }),
    [q, type, billingState],
  )

  const columns: Column<Account>[] = [
    {
      key: 'account',
      header: 'Account',
      render: (a) => (
        <>
          <Link to={paths.account(a.id)} className="table-link cell-main">
            {a.name}
          </Link>
          <span className="cell-sub">
            {a.code} · <span className="ref">{a.id}</span>
          </span>
        </>
      ),
    },
    { key: 'type', header: 'Type', render: (a) => <StatusBadge status={a.type} /> },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'contact',
      header: 'Primary contact',
      render: (a) => (
        <>
          <span className="cell-main">{a.primaryContact.name}</span>
          <span className="cell-sub">{a.primaryContact.email}</span>
        </>
      ),
    },
    {
      key: 'openWos',
      header: 'Open work orders',
      numeric: true,
      render: (a) => <span className="num">{openWosForAccount(a)}</span>,
    },
    {
      key: 'cost',
      header: 'Current cost MTD',
      numeric: true,
      render: (a) => <span className="num">{fmtCurrency(a.currentCostMtd)}</span>,
    },
    { key: 'billing', header: 'Billing', render: (a) => <StatusBadge status={a.billingState} /> },
    {
      key: 'aircraft',
      header: 'Aircraft',
      numeric: true,
      render: (a) => <span className="num">{a.aircraftIds.length}</span>,
    },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Supply & Commercial' }, { label: 'Accounts' }]}
        title="Accounts"
        description="Operator, customer, internal and supplier accounts — billing state, cost centres and the aircraft attached to each."
        actions={
          <button type="button" className="btn btn--primary">
            <Plus size={15} aria-hidden="true" />
            New account
          </button>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Accounts" value={accounts.length} meta="operator, customer, supplier" />
        <MetricCard label="Customers" value={customers} tone="blue" meta="billable relationships" />
        <MetricCard label="Open work orders" value={totalOpenWos} meta="across account aircraft" />
        <MetricCard label="Overdue billing" value={overdueBilling} tone="red" meta="follow up required" />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search account, code…" value={q} onChange={setQ} width={280} />
            <SelectFilter label="Type" allLabel="All types" options={TYPES} value={type} onChange={setType} />
            <SelectFilter label="Billing state" allLabel="All billing states" options={BILLING_STATES} value={billingState} onChange={setBillingState} />
          </FilterBar>
        </div>
        <DataTable
          caption="Accounts"
          columns={columns}
          rows={rows}
          rowKey={(a) => a.id}
          rowTone={(a) => (a.billingState === 'Overdue' ? 'red' : undefined)}
          footer={<TableFooter shown={rows.length} total={accounts.length} />}
        />
      </section>
    </div>
  )
}
