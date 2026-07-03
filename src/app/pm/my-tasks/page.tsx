import { TaskList } from "@/features/tasks/components/task-list"
import { AppLayout } from "@/components/layout/app-layout"

export default function MyTasksPage() {
  return (
    <AppLayout>
      <TaskList />
    </AppLayout>
  )
}
