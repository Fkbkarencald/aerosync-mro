import { Link, useParams } from 'react-router-dom'
import { Building2, Pencil, Plane } from 'lucide-react'
import { paths } from '@/app/paths'
import { getAccount, getAircraft, openWorkOrders, workOrders } from '@/data'
import { fmtCurrency, fmtDate, fmtDateTime } from '@/lib/format'
import { Breadcrumbs } from '@/components/shell/PageHeader'
import { EntityHeader } from '@/components/ui/EntityHeader'
import { PriorityBadge, RiskBadge, StatusBadge, StatusCell } from '@/components/ui/Badge'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { HBarChart } from '@/components/ui/Charts'
import { Timeline } from '@/components/ui/Timeline'
import { EmptyState } from '@/components/ui/Misc'
import { NotFoundPage } from '@/pages/NotFoundPage'
import type { Aircraft, WorkOrder } from '@/data/types'

export function AccountDetailPage() {
  const { id = '' } = useParams()
  const account = getAccount(id)
  if (!account) return <NotFoundPage />

  const fleet = account.aircraftIds.map((aid) => getAircraft(aid)).filter((a): a is Aircraft => Boolean(a))
  const fleetIds = new Set(fleet.map((a) => a.id))
  const activeWork = openWorkOrders.filter((w) => fleetIds.has(w.aircraftId))
  const recentWork = workOrders
    .filter((w) => fleetIds.has(w.aircraftId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)

  const totalSpend = account.costCentres.reduce((sum, c) => sum + c.spend, 0)

  const fleetCols: Column<Aircraft>[] = [
    {
      key: 'reg',
      header: 'Registration',
      render: (a) => (
        <Link to={paths.aircraftDetail(a.id)} className="table-link ref">
          {a.registration}
        </Link>
      ),
    },
    { key: 'model', header: 'Model', render: (a) => a.model },
    { key: 'status', header: 'Availability', render: (a) => <StatusCell status={a.availability} reason={a.availabilityReason} /> },
    { key: 'risk', header: 'Maint. risk', render: (a) => <RiskBadge risk={a.maintenanceRisk} /> },
  ]

  const activeWorkCols: Column<WorkOrder>[] = [
    {
      key: 'ref',
      header: 'Reference',
      render: (w) => (
        <Link to={paths.workOrder(w.id)} className="table-link ref">
          {w.id}
        </Link>
      ),
    },
    {
      key: 'aircraft',
      header: 'Aircraft',
      render: (w) => (
        <Link to={paths.aircraftDetail(w.aircraftId)} className="chip ref">
          {w.aircraftId}
        </Link>
      ),
    },
    { key: 'title', header: 'Title', render: (w) => <span className="cell-main">{w.title}</span> },
    { key: 'priority', header: 'Priority', render: (w) => <PriorityBadge priority={w.priority} /> },
    { key: 'status', header: 'Status', render: (w) => <StatusBadge status={w.status} /> },
  ]

  const recentWorkCols: Column<WorkOrder>[] = [
    {
      key: 'ref',
      header: 'Reference',
      render: (w) => (
        <Link to={paths.workOrder(w.id)} className="table-link ref">
          {w.id}
        </Link>
      ),
    },
    { key: 'title', header: 'Title', render: (w) => <span className="cell-main">{w.title}</span> },
    { key: 'status', header: 'Status', render: (w) => <StatusBadge status={w.status} /> },
    { key: 'created', header: 'Created', render: (w) => <span className="nowrap">{fmtDateTime(w.createdAt)}</span> },
  ]

  return (
    <div className="page">
      <Breadcrumbs crumbs={[{ label: 'Supply & Commercial' }, { label: 'Accounts', to: paths.accounts }, { label: account.name }]} />

      <EntityHeader
        identIcon={Building2}
        title={account.name}
        badges={
          <>
            <StatusBadge status={account.type} />
            <StatusBadge status={account.billingState} />
          </>
        }
        subtitle={`${account.code} · ${account.id} · customer since ${fmtDate(account.since)}`}
        meta={[
          { label: 'Contact', value: account.primaryContact.name },
          { label: 'Email', value: account.primaryContact.email },
          { label: 'Phone', value: account.primaryContact.phone },
          { label: 'Cost MTD', value: fmtCurrency(account.currentCostMtd) },
        ]}
        actions={
          <>
            <Link to={paths.accountCostCentres(account.id)} className="btn btn--secondary">
              Cost centres
            </Link>
            <button type="button" className="btn btn--primary">
              <Pencil size={15} aria-hidden="true" />
              Edit account
            </button>
          </>
        }
      />

      <div className="two-col">
        <div className="col-main">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Aircraft under this account</h2>
            </div>
            <DataTable
              caption={`Aircraft under ${account.name}`}
              columns={fleetCols}
              rows={fleet}
              rowKey={(a) => a.id}
              empty={
                <EmptyState icon={Plane} title="No aircraft associated">
                  {account.type === 'Supplier'
                    ? 'Supplier accounts are ad-hoc relationships — parts and logistics only, no aircraft attached.'
                    : 'This account has no dedicated tails; work is arranged ad-hoc as visiting aircraft require support.'}
                </EmptyState>
              }
            />
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Active work</h2>
            </div>
            <DataTable
              caption={`Open work orders for ${account.name}`}
              columns={activeWorkCols}
              rows={activeWork}
              rowKey={(w) => w.id}
              rowTone={(w) => (w.priority === 'AOG' ? 'red' : undefined)}
              empty={
                <EmptyState icon={Building2} title="No active work">
                  No open work orders are currently attributed to this account's aircraft.
                </EmptyState>
              }
            />
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Recent work orders</h2>
            </div>
            <DataTable
              caption={`Recent work orders for ${account.name}`}
              columns={recentWorkCols}
              rows={recentWork}
              rowKey={(w) => w.id}
              empty={
                <EmptyState icon={Building2} title="No work order history">
                  Nothing has been raised yet against this account's aircraft.
                </EmptyState>
              }
            />
          </section>
        </div>

        <div className="col-side">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Contact & billing</h2>
            </div>
            <div className="card-body">
              <DetailGrid
                items={[
                  { label: 'Primary contact', value: `${account.primaryContact.name} — ${account.primaryContact.title}` },
                  { label: 'Email', value: account.primaryContact.email },
                  { label: 'Phone', value: account.primaryContact.phone },
                  { label: 'Billing address', value: account.billingAddress },
                  { label: 'Billing state', value: <StatusBadge status={account.billingState} /> },
                  { label: 'Notes', value: account.notes },
                ]}
              />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Cost summary</h2>
            </div>
            <div className="card-body">
              {account.costCentres.length > 0 ? (
                <HBarChart
                  ariaLabel={`Spend by cost centre for ${account.name}`}
                  rows={account.costCentres.map((c) => ({
                    label: c.code,
                    value: c.spend,
                    tone: c.spend / c.budget > 0.85 ? 'orange' : 'accent',
                  }))}
                  unit=""
                />
              ) : (
                <p className="muted" style={{ fontSize: 'var(--fs-md)' }}>
                  Supplier accounts don't carry internal cost centres — spend here reflects purchase orders raised
                  against this supplier instead.
                </p>
              )}
            </div>
            {account.costCentres.length > 0 && (
              <div className="card-footer">Total spend MTD: {fmtCurrency(totalSpend)}</div>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Activity</h2>
            </div>
            <div className="card-body">
              <Timeline events={account.activity} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
