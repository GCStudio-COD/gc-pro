import { AddProjectForm } from "@/features/projects/components/add-project-form"
import { AppLayout } from "@/components/layout/app-layout"

export default function NewProjectPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8 w-full">
        <AddProjectForm />
      </div>
    </AppLayout>
  )
}
