"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, UserPlus, Briefcase, Settings, CheckSquare } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminRecentActivityWidget() {
  const [activities, setActivities] = useState<any[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/projects', {}, effectiveRole).then(res => res.json()),
      fetchApi('/employees', {}, effectiveRole).then(res => res.json())
    ]).then(([projects, employees]) => {
      let combined = [];
      const now = new Date();

      const formatTimeDiff = (dateStr: string) => {
        const diffMs = now.getTime() - new Date(dateStr).getTime();
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} mins ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs} hours ago`;
        return `${Math.floor(diffHrs / 24)} days ago`;
      };

      if (Array.isArray(projects)) {
        combined.push(...projects.map(p => ({
          action: p.status === 'Completed' ? 'Project Completed' : 'Project Updated',
          subject: p.name,
          dateObj: new Date(p.updatedAt),
          time: formatTimeDiff(p.updatedAt),
          icon: Briefcase,
          color: p.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'
        })))
      }

      if (Array.isArray(employees)) {
        combined.push(...employees.map(e => ({
          action: 'New Employee Onboarded',
          subject: `${e.firstName} ${e.lastName}`,
          dateObj: new Date(e.createdAt),
          time: formatTimeDiff(e.createdAt),
          icon: UserPlus,
          color: 'text-indigo-500'
        })))
      }

      combined = combined.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime()).slice(0, 4);
      setActivities(combined);
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="col-span-1 lg:col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Global Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities.length > 0 ? activities.map((act, i) => {
              const Icon = act.icon
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-0.5 rounded-full p-1.5 bg-muted/50 ${act.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{act.action}</p>
                    <p className="text-sm text-muted-foreground">{act.subject}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" /> {act.time}
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
