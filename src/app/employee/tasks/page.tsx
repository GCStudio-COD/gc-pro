import { TaskList } from "@/features/tasks/components/task-list"
import { AppLayout } from "@/components/layout/app-layout"

export default function TasksPage() {
  return (
    <AppLayout>
      <TaskList />
    </AppLayout>
  )
}
