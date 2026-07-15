import { Link, useLocation } from 'react-router-dom'
import { Compass, LayoutDashboard, PlaneTakeoff, TriangleAlert, Wrench } from 'lucide-react'
import { paths } from '@/app/paths'

/** Shell-preserving not-found page with useful ways back. */
export function NotFoundPage() {
  const { pathname } = useLocation()
  return (
    <div className="page">
      <div className="notfound">
        <span className="notfound-code">404 · {pathname}</span>
        <Compass size={40} aria-hidden="true" style={{ color: 'var(--text-faint)' }} />
        <h1>This route isn’t on the flight plan</h1>
        <p>
          The page you’re looking for doesn’t exist in this preview build. It may have moved, or the
          reference in the address bar may be incorrect.
        </p>
        <div className="notfound-actions">
          <Link to={paths.dashboard} className="btn btn--primary">
            <LayoutDashboard size={15} aria-hidden="true" />
            Back to dashboard
          </Link>
          <Link to={paths.fleetAvailability} className="btn btn--secondary">
            <PlaneTakeoff size={15} aria-hidden="true" />
            Fleet availability
          </Link>
          <Link to={paths.workOrders} className="btn btn--secondary">
            <Wrench size={15} aria-hidden="true" />
            Work orders
          </Link>
          <Link to={paths.defectReview} className="btn btn--secondary">
            <TriangleAlert size={15} aria-hidden="true" />
            Defect review queue
          </Link>
        </div>
      </div>
    </div>
  )
}
