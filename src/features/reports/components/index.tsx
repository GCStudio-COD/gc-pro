import { AttendanceChart } from "./attendance-chart"
import { ProjectProgressChart } from "./project-progress-chart"
import { ProductivityChart } from "./productivity-chart"

export function ReportsFeature() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Analytics and insights across your organization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Bar Chart spans 1 column */}
        <div className="col-span-1">
          <AttendanceChart />
        </div>
        
        {/* Project Pie Chart spans 1 column */}
        <div className="col-span-1">
          <ProjectProgressChart />
        </div>
        
        {/* Productivity Line Chart spans full width on large screens */}
        <div className="col-span-1 lg:col-span-2">
          <ProductivityChart />
        </div>
      </div>
    </div>
  )
}
