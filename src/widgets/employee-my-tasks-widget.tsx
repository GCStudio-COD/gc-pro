"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const tasks = [
  { id: "1", title: "Review PR #412", project: "Website Redesign", priority: "High", done: false },
  { id: "2", title: "Update Button Component", project: "Design System", priority: "Medium", done: true },
  { id: "3", title: "Write weekly update", project: "Internal", priority: "Low", done: false },
  { id: "4", title: "Fix iOS Safari bug", project: "Mobile App V2", priority: "High", done: false },
]

export function EmployeeMyTasksWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-4 p-4 rounded-lg border border-border/50 transition-colors ${task.done ? "bg-muted/50 opacity-60" : "bg-card hover:bg-muted/20"}`}
              >
                <Checkbox id={task.id} defaultChecked={task.done} className="mt-1" />
                <div className="flex-1 min-w-0">
                  <label 
                    htmlFor={task.id} 
                    className={`text-sm font-medium leading-none cursor-pointer ${task.done ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                </div>
                <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "secondary" : "outline"}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
