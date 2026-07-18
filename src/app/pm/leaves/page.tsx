import { AppLayout } from "@/components/layout/app-layout"
import { LeaveApplicationWidget } from "@/components/widgets/leave-application-widget"
import { LeaveApprovalsWidget } from "@/components/widgets/leave-approvals-widget"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeLeaveBalanceWidget } from "@/widgets/employee-leave-balance-widget"

export default function LeavesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-4 md:p-8 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground mt-1">Manage your time off and review team requests.</p>
        </div>

        <EmployeeLeaveBalanceWidget />

        <Tabs defaultValue="my-leaves" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>
            <TabsTrigger value="approvals">Team Approvals</TabsTrigger>
          </TabsList>
          <TabsContent value="my-leaves">
            <LeaveApplicationWidget />
          </TabsContent>
          <TabsContent value="approvals">
            <LeaveApprovalsWidget />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
