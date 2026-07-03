"use client"

import { WelcomeHeader } from "./components/welcome-header"
import { StatisticsCards } from "./components/statistics-cards"
import { DashboardCharts } from "./components/dashboard-charts"
import { RecentProjects } from "./components/recent-projects"
import { RecentTasks } from "./components/recent-tasks"
import { TeamActivity } from "./components/team-activity"
import { AttendanceSummary } from "./components/attendance-summary"

export function DashboardFeature() {
  return (
    <div className="flex flex-col gap-6 w-full h-full p-2 md:p-4">
      <WelcomeHeader />
      
      <StatisticsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Row 1: Charts (Full width on small, 4 columns on large) */}
        <DashboardCharts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Row 2: Projects (3 cols) + Tasks (2 cols) */}
        <RecentProjects />
        <RecentTasks />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Row 3: Team Activity (2 cols) + Attendance (2 cols) */}
        <TeamActivity />
        <AttendanceSummary />
      </div>
    </div>
  )
}
