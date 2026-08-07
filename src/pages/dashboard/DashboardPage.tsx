import { Link } from 'react-router-dom'
import { PlaneTakeoff, TriangleAlert } from 'lucide-react'
import { paths } from '@/app/paths'
import { currentUser } from '@/data'
import { PageHeader } from '@/components/shell/PageHeader'
import { RoleHandoffDashboard } from './RoleHandoffDashboard'

export function DashboardPage() {
  return (
    <div className="page">
      <PageHeader
        title="Maintenance handoff dashboard"
        description={`Good afternoon, ${currentUser.name.split(' ')[0]}. Review work waiting on your role from the canonical defect-to-release workflow.`}
        actions={
          <>
            <Link to={paths.defectNew} className="btn btn--secondary">
              <TriangleAlert size={15} aria-hidden="true" />
              Report defect
            </Link>
            <Link to={paths.fleetAvailability} className="btn btn--primary">
              <PlaneTakeoff size={15} aria-hidden="true" />
              Availability board
            </Link>
          </>
        }
      />

      <RoleHandoffDashboard />
    </div>
  )
}
