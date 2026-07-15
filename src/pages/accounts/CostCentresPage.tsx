import { Link, useParams } from 'react-router-dom'
import { Building2, Plus } from 'lucide-react'
import { paths } from '@/app/paths'
import { getAccount } from '@/data'
import { fmtCurrency } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, TableFooter, type Column } from '@/components/ui/DataTable'
import { ProgressBar, EmptyState } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'
import type { CostCentre } from '@/data/types'

export function CostCentresPage() {
  const { id = '' } = useParams()
  const account = getAccount(id)
  if (!account) return <NotFoundPage />

  const { costCentres } = account
  const totalSpend = costCentres.reduce((sum, c) => sum + c.spend, 0)
  const totalBudget = costCentres.reduce((sum, c) => sum + c.budget, 0)
  const utilisation = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0

  const columns: Column<CostCentre>[] = [
    { key: 'code', header: 'Code', render: (c) => <span className="ref cell-main">{c.code}</span> },
    {
      key: 'name',
      header: 'Name',
      render: (c) => (
        <>
          <span className="cell-main">{c.name}</span>
          <span className="cell-sub">{c.description}</span>
        </>
      ),
    },
    {
      key: 'spend',
      header: 'Current spend',
      numeric: true,
      render: (c) => <span className="num">{fmtCurrency(c.spend)}</span>,
    },
    {
      key: 'budget',
      header: 'Budget',
      numeric: true,
      hideMobile: true,
      render: (c) => <span className="num">{fmtCurrency(c.budget)}</span>,
    },
    {
      key: 'util',
      header: 'Utilisation',
      render: (c) => {
        const pct = c.budget > 0 ? (c.spend / c.budget) * 100 : 0
        return <ProgressBar value={pct} tone={pct > 100 ? 'red' : pct > 85 ? 'orange' : undefined} />
      },
    },
    {
      key: 'aircraft',
      header: 'Linked aircraft',
      render: (c) =>
        c.aircraftIds.length > 0 ? (
          <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {c.aircraftIds.map((aid) => (
              <Link key={aid} to={paths.aircraftDetail(aid)} className="chip ref">
                {aid}
              </Link>
            ))}
          </span>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: 'wos',
      header: 'Linked work orders',
      render: (c) =>
        c.workOrderIds.length > 0 ? (
          <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {c.workOrderIds.slice(0, 2).map((wid) => (
              <Link key={wid} to={paths.workOrder(wid)} className="table-link ref">
                {wid}
              </Link>
            ))}
            {c.workOrderIds.length > 2 && <span className="muted">+{c.workOrderIds.length - 2}</span>}
          </span>
        ) : (
          <span className="muted">—</span>
        ),
    },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
  ]

  return (
    <div className="page">
      <PageHeader
        crumbs={[
          { label: 'Supply & Commercial' },
          { label: 'Accounts', to: paths.accounts },
          { label: account.name, to: paths.account(account.id) },
          { label: 'Cost centres' },
        ]}
        title={`Cost centres — ${account.name}`}
        description="Budgets, spend and utilisation for every cost centre this account attributes maintenance work to."
        actions={
          <button type="button" className="btn btn--primary">
            <Plus size={15} aria-hidden="true" />
            New cost centre
          </button>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Cost centres" value={costCentres.length} icon={Building2} />
        <MetricCard label="Total spend MTD" value={fmtCurrency(totalSpend)} tone={utilisation > 85 ? 'orange' : undefined} />
        <MetricCard label="Total budget" value={fmtCurrency(totalBudget)} />
        <MetricCard label="Utilisation" value={`${utilisation}%`} tone={utilisation > 100 ? 'red' : utilisation > 85 ? 'orange' : 'green'} />
      </div>

      <section className="card">
        <DataTable
          caption={`Cost centres for ${account.name}`}
          columns={columns}
          rows={costCentres}
          rowKey={(c) => c.code}
          empty={
            <EmptyState icon={Building2} title="No cost centres">
              Supplier accounts don't carry cost centres — spend against {account.name} is tracked through
              purchase orders instead.
            </EmptyState>
          }
          footer={<TableFooter shown={costCentres.length} total={costCentres.length} />}
        />
      </section>
    </div>
  )
}
