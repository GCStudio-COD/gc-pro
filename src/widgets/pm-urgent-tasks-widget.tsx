"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const tasks = [
  { title: "Fix production memory leak", project: "Mobile App V2", assignee: "Alice", due: "Today" },
  { title: "Finalize Q4 budget", project: "Internal", assignee: "You", due: "Tomorrow" },
  { title: "Review PR #412", project: "Website Redesign", assignee: "Bob", due: "Overdue" },
]

export function PmUrgentTasksWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="col-span-1 lg:col-span-3"
    >
      <Card className="border-border/50 shadow-sm border-l-4 border-l-destructive">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" /> Needs Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks.map((task, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm leading-tight">{task.title}</h4>
                  <Badge variant={task.due === "Overdue" ? "destructive" : "secondary"}>
                    {task.due}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>{task.project}</p>
                  <p className="mt-1">Assignee: {task.assignee}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
