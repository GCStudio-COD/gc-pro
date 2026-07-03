import { EmployeeList } from "@/features/employees/components/employee-list"
import { AppLayout } from "@/components/layout/app-layout"

export default function EmployeesPage() {
  return (
    <AppLayout>
      <EmployeeList />
    </AppLayout>
  )
}
