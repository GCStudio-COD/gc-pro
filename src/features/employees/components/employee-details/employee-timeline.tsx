import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
  { id: 1, action: "Completed Task", details: "Review PR #412", date: "Today at 10:45 AM" },
  { id: 2, action: "Status Changed", details: "Status updated from 'On Leave' to 'Active'", date: "Yesterday at 9:00 AM" },
  { id: 3, action: "Document Uploaded", details: "Q1 Performance Review.pdf", date: "April 10, 2025" },
  { id: 4, action: "Joined Project", details: "Added to 'Website Redesign' team", date: "February 22, 2025" },
  { id: 5, action: "Account Created", details: "Initial onboarding completed", date: "January 15, 2023" },
]

export function EmployeeTimeline() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Recent system activities and updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-4 border-primary bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border bg-card shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-sm text-foreground">{activity.action}</div>
                    <time className="font-caveat font-medium text-xs text-muted-foreground">{activity.date}</time>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
