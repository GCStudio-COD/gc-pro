import { EmployeeDetailsFeature } from "@/features/employees/components/employee-details"
import { AppLayout } from "@/components/layout/app-layout"

export default function EmployeeDetailsPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8 w-full">
        <EmployeeDetailsFeature />
      </div>
    </AppLayout>
  )
}
