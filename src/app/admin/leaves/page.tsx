import { AppLayout } from "@/components/layout/app-layout"
import { LeaveApprovalsWidget } from "@/components/widgets/leave-approvals-widget"

export default function AdminLeavesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-4 md:p-8 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Leaves</h1>
          <p className="text-muted-foreground mt-1">Review and manage time-off requests from all employees.</p>
        </div>
        <LeaveApprovalsWidget />
      </div>
    </AppLayout>
  )
}
