import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProjectTimeline({ project }: { project: any }) {
  const activities: any[] = []

  if (project?.createdAt) {
    activities.push({
      id: `proj-create-${project.id}`,
      action: "Project Created",
      details: "Project initialized in the system.",
      timestamp: new Date(project.createdAt).getTime(),
      date: new Date(project.createdAt).toLocaleString()
    })
  }

  // Add notes
  if (project?.notes && Array.isArray(project.notes)) {
    project.notes.forEach((note: any) => {
      const creatorName = note.creator ? `${note.creator.firstName} ${note.creator.lastName}` : 'Someone';
      activities.push({
        id: `note-${note.id}`,
        action: "Note Added",
        details: `${creatorName} added a note: "${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}"`,
        timestamp: new Date(note.createdAt).getTime(),
        date: new Date(note.createdAt).toLocaleString()
      })
    })
  }

  // Add tasks
  if (project?.tasks && Array.isArray(project.tasks)) {
    project.tasks.forEach((task: any) => {
      activities.push({
        id: `task-create-${task.id}`,
        action: "Task Created",
        details: `Task "${task.title}" was added.`,
        timestamp: new Date(task.createdAt).getTime(),
        date: new Date(task.createdAt).toLocaleString()
      })

      // If task was updated later (more than 10 seconds diff)
      const cTime = new Date(task.createdAt).getTime()
      const uTime = new Date(task.updatedAt).getTime()
      if (uTime - cTime > 10000) {
        activities.push({
          id: `task-update-${task.id}-${uTime}`,
          action: "Task Updated",
          details: `Task "${task.title}" is currently marked as ${task.status}.`,
          timestamp: uTime,
          date: new Date(task.updatedAt).toLocaleString()
        })
      }
    })
  }

  // If project itself was updated
  if (project?.updatedAt) {
    const cTime = new Date(project.createdAt).getTime()
    const uTime = new Date(project.updatedAt).getTime()
    if (uTime - cTime > 10000) {
      activities.push({
        id: `proj-update-${project.id}-${uTime}`,
        action: "Project Details Edited",
        details: "General project settings or details were updated.",
        timestamp: uTime,
        date: new Date(project.updatedAt).toLocaleString()
      })
    }
  }

  // Sort by timestamp descending (newest first)
  activities.sort((a, b) => b.timestamp - a.timestamp)

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Recent updates and actions on this project.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {activities.length > 0 ? activities.map((activity) => (
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
            )) : (
              <div className="text-sm text-muted-foreground">No recent activity.</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
