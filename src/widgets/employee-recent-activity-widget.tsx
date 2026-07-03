"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit, FileEdit, CheckSquare } from "lucide-react"

const activities = [
  { action: "Pushed 3 commits to", target: "feature/auth", time: "1 hour ago", icon: GitCommit, color: "text-blue-500" },
  { action: "Updated status of", target: "TASK-412", time: "3 hours ago", icon: FileEdit, color: "text-amber-500" },
  { action: "Completed", target: "Security Training", time: "Yesterday", icon: CheckSquare, color: "text-emerald-500" },
]

export function EmployeeRecentActivityWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">My Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((act, i) => {
              const Icon = act.icon
              return (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                  <div className={`mt-0.5 rounded-full p-2 bg-muted ${act.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      {act.action} <span className="font-semibold">{act.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{act.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
