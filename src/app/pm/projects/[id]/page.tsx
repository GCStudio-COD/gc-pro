import { ProjectDetailsFeature } from "@/features/projects/components/project-details"
import { AppLayout } from "@/components/layout/app-layout"

export default function ProjectDetailsPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8 w-full">
        <ProjectDetailsFeature />
      </div>
    </AppLayout>
  )
}
