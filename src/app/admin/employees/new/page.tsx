import { AddEmployeeForm } from "@/features/employees/components/add-employee-form"
import { AppLayout } from "@/components/layout/app-layout"

export default function NewEmployeePage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8 w-full">
        <AddEmployeeForm />
      </div>
    </AppLayout>
  )
}
