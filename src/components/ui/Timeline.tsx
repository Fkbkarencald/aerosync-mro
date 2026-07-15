import { Link } from 'react-router-dom'
import type { TimelineEvent } from '@/data/types'
import { userName } from '@/data'
import { fmtDateTime, fmtRelative } from '@/lib/format'

/**
 * Vertical activity timeline. Events are rendered newest-first by
 * default (operational convention).
 */
export function Timeline({ events, oldestFirst }: { events: TimelineEvent[]; oldestFirst?: boolean }) {
  const sorted = [...events].sort((a, b) =>
    oldestFirst ? a.at.localeCompare(b.at) : b.at.localeCompare(a.at),
  )
  return (
    <ol className="timeline">
      {sorted.map((e, i) => (
        <li className="timeline-item" key={`${e.at}-${i}`}>
          <span className="timeline-dot" data-tone={e.tone ?? 'grey'} aria-hidden="true" />
          <div className="timeline-title">
            {e.title}
            <span className="timeline-time" title={fmtDateTime(e.at)}>
              {fmtDateTime(e.at)} · {fmtRelative(e.at)}
            </span>
          </div>
          {e.detail && <p className="timeline-body">{e.detail}</p>}
          <div className="timeline-meta">
            {e.byUserId ? userName(e.byUserId) : 'System'}
            {e.refLink && (
              <>
                {' · '}
                <Link to={e.refLink.to}>{e.refLink.label}</Link>
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
