import { AddTaskForm } from "@/features/tasks/components/add-task-form"
import { AppLayout } from "@/components/layout/app-layout"

export default function NewTaskPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8 w-full">
        <AddTaskForm />
      </div>
    </AppLayout>
  )
}
