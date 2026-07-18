import { AppLayout } from "@/components/layout/app-layout"
import { EmployeeWelcomeWidget } from "@/widgets/employee-welcome-widget"
import { EmployeeWorkingHoursWidget } from "@/widgets/employee-working-hours-widget"
import { EmployeeTaskProgressWidget } from "@/widgets/employee-task-progress-widget"
import { EmployeeWeeklyProductivityWidget } from "@/widgets/employee-weekly-productivity-widget"
import { EmployeeQuickActionsWidget } from "@/widgets/employee-quick-actions-widget"
import { EmployeeMyTasksWidget } from "@/widgets/employee-my-tasks-widget"
import { EmployeeAssignedProjectsWidget } from "@/widgets/employee-assigned-projects-widget"
import { EmployeeUpcomingDeadlinesWidget } from "@/widgets/employee-upcoming-deadlines-widget"
import { EmployeeNotificationsWidget } from "@/widgets/employee-notifications-widget"
import { EmployeeRecentActivityWidget } from "@/widgets/employee-recent-activity-widget"

export default function EmployeeDashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-4 md:p-8 w-full mx-auto">
        
        {/* Top: Welcome */}
        <div className="flex flex-col gap-6">
          <EmployeeWelcomeWidget />
        </div>
        
        {/* Middle: Data & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <EmployeeWorkingHoursWidget />
          <EmployeeTaskProgressWidget />
          <EmployeeQuickActionsWidget />
        </div>

        {/* Bottom: Lists, Tables, and feeds */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmployeeMyTasksWidget />
            <EmployeeWeeklyProductivityWidget />
            <EmployeeAssignedProjectsWidget />
            <EmployeeUpcomingDeadlinesWidget />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <EmployeeNotificationsWidget />
            <EmployeeRecentActivityWidget />
          </div>
        </div>
        
      </div>
    </AppLayout>
  )
}
