"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminUpcomingDeadlinesWidget() {
  const [deadlines, setDeadlines] = useState<any[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/tasks', {}, effectiveRole).then(res => res.json()),
      fetchApi('/projects', {}, effectiveRole).then(res => res.json())
    ]).then(([tasks, projects]) => {
      let combined: any[] = [];
      const now = new Date();
      now.setHours(0,0,0,0);

      const getPriorityWeight = (p: string) => {
        if (p === 'Critical') return 4;
        if (p === 'High') return 3;
        if (p === 'Medium') return 2;
        return 1;
      };

      if (Array.isArray(tasks)) {
        combined.push(...tasks.filter(t => t.status !== 'Done' && t.status !== 'Completed').map(t => {
          const d = new Date(t.dueDate);
          d.setHours(0,0,0,0);
          const daysUntil = Math.round((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
          return {
            event: `Task: ${t.title}`,
            dateObj: d,
            type: "Task",
            priorityWeight: getPriorityWeight(t.priority),
            isUrgent: daysUntil <= 1
          };
        }))
      }

      if (Array.isArray(projects)) {
        combined.push(...projects.filter(p => p.status !== 'Completed').map(p => {
          const d = new Date(p.endDate);
          d.setHours(0,0,0,0);
          const daysUntil = Math.round((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
          return {
            event: `Project: ${p.name}`,
            dateObj: d,
            type: "Project",
            priorityWeight: getPriorityWeight(p.priority),
            isUrgent: daysUntil <= 2
          };
        }))
      }

      combined = combined
        .filter(d => d.dateObj >= now)
        .sort((a, b) => {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          if (b.priorityWeight !== a.priorityWeight) {
            return b.priorityWeight - a.priorityWeight;
          }
          return a.dateObj.getTime() - b.dateObj.getTime();
        })
        .slice(0, 5)
        
      setDeadlines(combined.map(d => ({
        ...d,
        date: d.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })))
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      className="col-span-1 lg:col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deadlines.length > 0 ? deadlines.map((dl, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-2 shrink-0 ${dl.isUrgent ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'}`}>
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${dl.isUrgent ? 'text-orange-500 font-semibold' : ''}`}>{dl.event}</p>
                  <p className={`text-xs mt-1 ${dl.isUrgent ? 'text-orange-500/90 font-medium' : 'text-muted-foreground'}`}>Due {dl.date}</p>
                </div>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
