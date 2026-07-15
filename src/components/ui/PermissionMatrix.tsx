import { Check, Minus } from 'lucide-react'
import { permissionDomains } from '@/data'

/**
 * Permission matrix preview grouped by domain. Read/create/edit/
 * approve/close-style actions per row; checks reflect the profile's
 * granted permission codes. Editing is visual only.
 */
export function PermissionMatrix({ granted, editable }: { granted: string[]; editable?: boolean }) {
  // Union of action columns across domains, in a stable curated order.
  const columnOrder = ['view', 'create', 'edit', 'update', 'review', 'assign', 'request', 'issue', 'adjust', 'defer', 'approve', 'perform', 'suspend', 'archive', 'close', 'export']
  const usedActions = columnOrder.filter((a) =>
    permissionDomains.some((d) => d.actions.some((x) => x.key === a)),
  )

  return (
    <div className="perm-matrix-wrap">
      <table className="perm-matrix">
        <caption className="visually-hidden">
          Permission matrix by domain{editable ? ' (editor preview)' : ''}
        </caption>
        <thead>
          <tr>
            <th scope="col">Domain</th>
            {usedActions.map((a) => (
              <th scope="col" key={a}>
                {a}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissionDomains.map((domain) => (
            <tr key={domain.key}>
              <td className="perm-domain">
                {domain.label}
                <span className="cell-sub">{domain.description}</span>
              </td>
              {usedActions.map((action) => {
                const applies = domain.actions.some((a) => a.key === action)
                const checked = granted.includes(`${domain.key}.${action}`)
                return (
                  <td className="perm-check" key={action}>
                    {applies ? (
                      <span
                        className="perm-check-box"
                        data-checked={checked}
                        role={editable ? 'checkbox' : 'img'}
                        aria-checked={editable ? checked : undefined}
                        aria-label={`${domain.label} — ${action}${checked ? ': granted' : ': not granted'}`}
                        tabIndex={editable ? 0 : undefined}
                      >
                        {checked && <Check size={13} aria-hidden="true" />}
                      </span>
                    ) : (
                      <span className="perm-check-box" data-na="true" aria-label={`${domain.label} — ${action}: not applicable`}>
                        <Minus size={12} aria-hidden="true" style={{ color: 'var(--text-faint)' }} />
                      </span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
