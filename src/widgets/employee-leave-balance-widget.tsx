"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plane } from "lucide-react"

export function EmployeeLeaveBalanceWidget() {
  const leaves = [
    { type: "Paid Time Off", used: 12, total: 20, color: "bg-primary" },
    { type: "Sick Leave", used: 2, total: 10, color: "bg-destructive" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plane className="h-5 w-5" /> Leave Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {leaves.map((leave, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{leave.type}</span>
                  <span className="text-xs text-muted-foreground">{leave.total - leave.used} days left</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${leave.color}`} style={{ width: `${(leave.used / leave.total) * 100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground">
                  Used {leave.used} of {leave.total}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
