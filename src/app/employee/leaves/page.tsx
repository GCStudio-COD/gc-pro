import { AppLayout } from "@/components/layout/app-layout"
import { LeaveApplicationWidget } from "@/components/widgets/leave-application-widget"
import { EmployeeLeaveBalanceWidget } from "@/widgets/employee-leave-balance-widget"

export default function EmployeeLeavesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-4 md:p-8 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaves</h1>
          <p className="text-muted-foreground mt-1">Manage your time off and view leave history.</p>
        </div>
        <EmployeeLeaveBalanceWidget />
        <LeaveApplicationWidget />
      </div>
    </AppLayout>
  )
}
