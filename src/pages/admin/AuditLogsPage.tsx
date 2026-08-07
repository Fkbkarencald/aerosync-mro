import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Download, ScrollText } from 'lucide-react'
import { getUser, shortName } from '@/data'
import { useWorkflow } from '@/workflow/useWorkflow'
import { fmtDateTime, fmtDateTimeFull, fmtRelative } from '@/lib/format'
import { PageHeader } from '@/components/shell/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { FilterBar, SearchInput, SelectFilter } from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/Badge'
import { DetailGrid } from '@/components/ui/DetailGrid'
import { EmptyState } from '@/components/ui/Misc'
import { TableFooter } from '@/components/ui/DataTable'

const ACTION_GROUPS = [
  'auth',
  'defect',
  'work_order',
  'fleet_plan',
  'inventory',
  'signoff',
  'users',
  'security_profiles',
  'aircraft',
]

const OUTCOME_OPTIONS = ['Success', 'Denied']

export function AuditLogsPage() {
  const { state } = useWorkflow()
  const { auditLogs } = state
  const [q, setQ] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [actionGroup, setActionGroup] = useState('')
  const [entityType, setEntityType] = useState('')
  const [outcome, setOutcome] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const userNames = useMemo(
    () => Array.from(new Set(auditLogs.map((a) => getUser(a.userId)?.name).filter((n): n is string => Boolean(n)))).sort(),
    [auditLogs],
  )
  const entityTypes = useMemo(() => Array.from(new Set(auditLogs.map((a) => a.entityType))).sort(), [auditLogs])

  const deniedCount = auditLogs.filter((a) => a.outcome === 'Denied').length
  const actorCount = useMemo(() => new Set(auditLogs.map((a) => a.userId)).size, [auditLogs])
  const entityCount = useMemo(() => new Set(auditLogs.map((a) => a.entityRef)).size, [auditLogs])

  const rows = useMemo(
    () =>
      auditLogs.filter((a) => {
        const text = `${a.summary} ${a.action} ${a.entityRef}`.toLowerCase()
        if (q && !text.includes(q.toLowerCase())) return false
        if (userFilter && getUser(a.userId)?.name !== userFilter) return false
        if (actionGroup && !a.action.startsWith(actionGroup)) return false
        if (entityType && a.entityType !== entityType) return false
        if (outcome && a.outcome !== outcome) return false
        return true
      }),
    [auditLogs, q, userFilter, actionGroup, entityType, outcome],
  )

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Administration' }, { label: 'Audit logs' }]}
        title="Audit logs"
        description="An append-only trail of every action taken in AeroSync MRO — who did what, when, from where, and what changed."
        actions={
          <button type="button" className="btn btn--secondary">
            <Download size={15} aria-hidden="true" />
            Export (visual)
          </button>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Entries" value={`${auditLogs.length} shown`} icon={ScrollText} />
        <MetricCard label="Denied outcomes" value={deniedCount} tone="red" />
        <MetricCard label="Actors" value={actorCount} />
        <MetricCard label="Entities touched" value={entityCount} />
      </div>

      <section className="card">
        <div className="card-header">
          <FilterBar>
            <SearchInput placeholder="Search summary, action, entity…" value={q} onChange={setQ} width={260} />
            <SelectFilter label="User" allLabel="All users" options={userNames} value={userFilter} onChange={setUserFilter} />
            <SelectFilter label="Action group" allLabel="All actions" options={ACTION_GROUPS} value={actionGroup} onChange={setActionGroup} />
            <SelectFilter label="Entity type" allLabel="All entities" options={entityTypes} value={entityType} onChange={setEntityType} />
            <SelectFilter label="Outcome" allLabel="All outcomes" options={OUTCOME_OPTIONS} value={outcome} onChange={setOutcome} />
          </FilterBar>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={ScrollText} title="No entries match these filters">
            Adjust the search or clear a filter to see the rest of the trail.
          </EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <caption className="visually-hidden">Audit log entries</caption>
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Action</th>
                  <th scope="col">Entity</th>
                  <th scope="col">Summary</th>
                  <th scope="col" className="hide-mobile">Source</th>
                  <th scope="col">Outcome</th>
                  <th scope="col" aria-hidden="true"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => {
                  const expanded = expandedId === a.id
                  const before = a.before
                  const after = a.after
                  const keys = Array.from(new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]))
                  return (
                    <Fragment key={a.id}>
                      <tr>
                        <td>
                          <span className="nowrap">{fmtDateTime(a.at)}</span>
                          <span className="cell-sub">{fmtRelative(a.at)}</span>
                        </td>
                        <td>{shortName(a.userId)}</td>
                        <td className="muted">{a.role}</td>
                        <td>
                          <span className="ref">{a.action}</span>
                        </td>
                        <td>
                          <span className="cell-main">{a.entityType}</span>
                          <span className="cell-sub">
                            {a.entityLink ? (
                              <Link to={a.entityLink} className="table-link ref">
                                {a.entityRef}
                              </Link>
                            ) : (
                              <span className="ref">{a.entityRef}</span>
                            )}
                          </span>
                        </td>
                        <td>{a.summary}</td>
                        <td className="hide-mobile">
                          <span className="ref">{a.sourceIp}</span>
                        </td>
                        <td>
                          <StatusBadge status={a.outcome} />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="icon-btn"
                            aria-expanded={expanded}
                            aria-label={expanded ? `Collapse details for ${a.id}` : `Expand details for ${a.id}`}
                            onClick={() => setExpandedId(expanded ? null : a.id)}
                          >
                            {expanded ? (
                              <ChevronUp size={15} aria-hidden="true" />
                            ) : (
                              <ChevronDown size={15} aria-hidden="true" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={9} style={{ background: 'var(--surface-sunken)' }}>
                            <div style={{ padding: '12px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                              <DetailGrid
                                items={[
                                  { label: 'Entry ID', value: <span className="ref">{a.id}</span> },
                                  { label: 'Timestamp', value: fmtDateTimeFull(a.at) },
                                  { label: 'Source IP', value: <span className="ref">{a.sourceIp}</span> },
                                  { label: 'Outcome', value: <StatusBadge status={a.outcome} /> },
                                ]}
                              />
                              {before || after ? (
                                <div className="diff-grid">
                                  <div className="diff-col">
                                    <h4>Previous state</h4>
                                    <div className="diff-block diff-block--old">
                                      {keys.map((k) => (
                                        <div className="diff-row" data-changed={before?.[k] !== after?.[k]} key={k}>
                                          <span className="diff-key">{k}</span>
                                          <span>{before?.[k] ?? '—'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="diff-col">
                                    <h4>New state</h4>
                                    <div className="diff-block diff-block--new">
                                      {keys.map((k) => (
                                        <div className="diff-row" data-changed={before?.[k] !== after?.[k]} key={k}>
                                          <span className="diff-key">{k}</span>
                                          <span>{after?.[k] ?? '—'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="muted">
                                  No state snapshot recorded for this action (informational event).
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <TableFooter shown={rows.length} total={auditLogs.length} />
      </section>
    </div>
  )
}
