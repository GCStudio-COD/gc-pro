import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  { id: 1, user: "Alice", action: "pushed code to", target: "main branch", time: "2 hours ago", avatar: "/avatars/01.png" },
  { id: 2, user: "Bob", action: "commented on", target: "Issue #42", time: "3 hours ago", avatar: "/avatars/02.png" },
  { id: 3, user: "Charlie", action: "completed task", target: "UI Design", time: "5 hours ago", avatar: "/avatars/03.png" },
  { id: 4, user: "Dave", action: "created new project", target: "Client Portal", time: "Yesterday", avatar: "/avatars/04.png" },
  { id: 5, user: "Eve", action: "uploaded document", target: "Q3 Report.pdf", time: "Yesterday", avatar: "/avatars/05.png" },
]

export function TeamActivity() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
        <CardDescription>Recent actions by your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border bg-card shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-sm text-foreground">{activity.user}</div>
                    <time className="font-caveat font-medium text-xs text-muted-foreground">{activity.time}</time>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
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
