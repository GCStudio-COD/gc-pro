"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit, FileEdit, CheckSquare } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function EmployeeRecentActivityWidget() {
  const [activities, setActivities] = useState<any[]>([])
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/tasks', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.slice(-3).reverse().map(t => ({
            action: t.status === 'Done' || t.status === 'Completed' ? "Completed task" : "Updated task",
            target: t.title || "Unknown Task",
            time: "Recently",
            icon: t.status === 'Done' || t.status === 'Completed' ? CheckSquare : FileEdit,
            color: t.status === 'Done' || t.status === 'Completed' ? "text-emerald-500" : "text-amber-500"
          }))
          setActivities(formatted)
        }
      })
      .catch(console.error)
  }, [effectiveRole])

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
            {activities.length > 0 ? activities.map((act, i) => {
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
            }) : (
              <div className="text-sm text-muted-foreground text-center py-4">No recent activity found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
