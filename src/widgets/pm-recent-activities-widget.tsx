"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitMerge, MessageSquare, CheckCircle2, Clock, CheckSquare } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function PmRecentActivitiesWidget() {
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
      .then(tasks => {
        if (Array.isArray(tasks)) {
          const recentTasks = tasks
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5)
            .map((t: any) => {
              const updatedAt = new Date(t.updatedAt);
              const diffMs = new Date().getTime() - updatedAt.getTime();
              const diffMins = Math.round(diffMs / 60000);
              let timeStr = `${diffMins} mins ago`;
              if (diffMins >= 60) {
                const diffHrs = Math.floor(diffMins / 60);
                if (diffHrs >= 24) timeStr = `${Math.floor(diffHrs / 24)} days ago`;
                else timeStr = `${diffHrs} hours ago`;
              }
              
              const isDone = t.status === 'Done' || t.status === 'Completed';
              return {
                action: isDone ? `Completed task: ${t.title}` : `Updated task: ${t.title}`,
                project: t.project?.name || 'Unknown Project',
                user: t.assignee?.firstName ? `${t.assignee.firstName} ${t.assignee.lastName?.charAt(0)}.` : 'System',
                time: timeStr,
                icon: isDone ? CheckCircle2 : CheckSquare,
                color: isDone ? "text-emerald-500" : "text-blue-500"
              }
            });
          
          setActivities(recentTasks);
        }
      }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
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
                    <p className="text-sm font-medium">
                      <span className="font-semibold">{act.user}</span> {act.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{act.project}</span>
                      <span>•</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="text-sm text-muted-foreground text-center py-4">No recent activity.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
