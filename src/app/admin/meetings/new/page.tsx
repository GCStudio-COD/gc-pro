import { NewMeetingForm } from "@/features/meetings/components/new-meeting-form"
import { AppLayout } from "@/components/layout/app-layout"

export default function NewMeetingPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8 w-full max-w-5xl mx-auto">
        <NewMeetingForm />
      </div>
    </AppLayout>
  )
}
