import { AppLayout } from "@/components/layout/app-layout"
import { AdminWelcomeWidget } from "@/widgets/admin-welcome-widget"
import { AdminCompanyStatsWidget } from "@/widgets/admin-company-stats-widget"
import { AdminQuickActionsWidget } from "@/widgets/admin-quick-actions-widget"
import { AdminEmployeeStatsWidget } from "@/widgets/admin-employee-stats-widget"
import { AdminProjectOverviewWidget } from "@/widgets/admin-project-overview-widget"
import { AdminTaskOverviewWidget } from "@/widgets/admin-task-overview-widget"
import { AdminAttendanceSummaryWidget } from "@/widgets/admin-attendance-summary-widget"
import { AdminProductivityOverviewWidget } from "@/widgets/admin-productivity-overview-widget"
import { AdminDepartmentsWidget } from "@/widgets/admin-departments-widget"
import { AdminRecentEmployeesWidget } from "@/widgets/admin-recent-employees-widget"
import { AdminRecentProjectsWidget } from "@/widgets/admin-recent-projects-widget"
import { AdminUpcomingDeadlinesWidget } from "@/widgets/admin-upcoming-deadlines-widget"
import { AdminNotificationsWidget } from "@/widgets/admin-notifications-widget"
import { AdminRecentActivityWidget } from "@/widgets/admin-recent-activity-widget"

export default function AdminDashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-4 md:p-8 w-full mx-auto">
        
        {/* Top: Welcome & High-level stats */}
        <div className="grid grid-cols-1 gap-6">
          <AdminWelcomeWidget />
          <AdminCompanyStatsWidget />
        </div>
        
        {/* Middle: Data & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AdminEmployeeStatsWidget />
          <AdminProjectOverviewWidget />
          
          <AdminTaskOverviewWidget />
          <AdminQuickActionsWidget />
          
          <AdminAttendanceSummaryWidget />
          <AdminProductivityOverviewWidget />
        </div>

        {/* Bottom: Lists, Tables, and feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AdminDepartmentsWidget />
          <AdminRecentActivityWidget />
          
          <AdminRecentEmployeesWidget />
          <AdminUpcomingDeadlinesWidget />
          
          <AdminRecentProjectsWidget />
          <AdminNotificationsWidget />
        </div>
        
      </div>
    </AppLayout>
  )
}
