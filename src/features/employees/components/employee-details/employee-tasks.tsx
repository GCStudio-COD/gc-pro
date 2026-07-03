import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const tasks = [
  { id: 1, title: "Implement new dashboard charts", priority: "High", completed: false, project: "PRJ-01" },
  { id: 2, title: "Review PR #412", priority: "Medium", completed: true, project: "PRJ-05" },
  { id: 3, title: "Update component documentation", priority: "Low", completed: false, project: "PRJ-01" },
  { id: 4, title: "Fix authentication bug", priority: "Critical", completed: true, project: "PRJ-05" },
  { id: 5, title: "Attend planning meeting", priority: "Medium", completed: false, project: "PRJ-12" },
]

export function EmployeeTasks() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Assigned Tasks</CardTitle>
        <CardDescription>Current and completed tasks for this employee.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-3 rounded-lg border p-4">
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
                <div className="flex gap-2 pt-2">
                  <Badge variant={task.priority === "Critical" ? "destructive" : task.priority === "High" ? "default" : "secondary"} className="text-[10px]">
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Project: {task.project}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
