import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const tasks = [
  { id: 1, title: "Review Q3 Marketing Plan", priority: "High", completed: false },
  { id: 2, title: "Update server infrastructure", priority: "Critical", completed: true },
  { id: 3, title: "Design new landing page", priority: "Medium", completed: false },
  { id: 4, title: "Client onboarding call", priority: "High", completed: false },
]

export function RecentTasks() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>Tasks assigned to you for today.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-3 rounded-lg border p-3">
              <Checkbox id={`task-${task.id}`} checked={task.completed} className="mt-1" />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-sm font-medium leading-none ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </label>
                <div className="flex">
                  <Badge variant={task.priority === "Critical" ? "destructive" : "secondary"} className="text-[10px]">
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
