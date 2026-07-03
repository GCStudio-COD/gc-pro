import { AppLayout } from "@/components/layout/app-layout"
import { PmWelcomeWidget } from "@/widgets/pm-welcome-widget"
import { PmMyProjectsWidget } from "@/widgets/pm-my-projects-widget"
import { PmQuickActionsWidget } from "@/widgets/pm-quick-actions-widget"
import { PmProjectProgressWidget } from "@/widgets/pm-project-progress-widget"
import { PmTaskStatusWidget } from "@/widgets/pm-task-status-widget"
import { PmTeamProductivityWidget } from "@/widgets/pm-team-productivity-widget"
import { PmAssignedTeamsWidget } from "@/widgets/pm-assigned-teams-widget"
import { PmUpcomingDeadlinesWidget } from "@/widgets/pm-upcoming-deadlines-widget"
import { PmTodaysMeetingsWidget } from "@/widgets/pm-todays-meetings-widget"
import { PmNotificationsWidget } from "@/widgets/pm-notifications-widget"
import { PmRecentActivitiesWidget } from "@/widgets/pm-recent-activities-widget"

export default function ProjectManagerDashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-4 md:p-8 w-full max-w-[1400px] mx-auto">
        
        {/* Top: Welcome & High-level stats */}
        <div className="grid grid-cols-1 gap-6">
          <PmWelcomeWidget />
          <PmMyProjectsWidget />
        </div>
        
        {/* Middle: Data & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PmProjectProgressWidget />
          <PmQuickActionsWidget />
          <PmTeamProductivityWidget />
          <PmTaskStatusWidget />
        </div>

        {/* Bottom: Lists, Tables, and feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PmAssignedTeamsWidget />
          <PmTodaysMeetingsWidget />
          <PmUpcomingDeadlinesWidget />
          
          <PmRecentActivitiesWidget />
          <PmNotificationsWidget />
        </div>
        
      </div>
    </AppLayout>
  )
}
