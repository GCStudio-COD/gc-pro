"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Briefcase, CheckSquare, Clock, Activity, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminCompanyStatsWidget() {
  const [stats, setStats] = useState([
    { title: "Total Projects", value: "0", change: "current", icon: Briefcase, trend: "up", color: "text-emerald-500" },
    { title: "Active Tasks", value: "0", change: "current", icon: CheckSquare, trend: "up", color: "text-blue-500" },
    { title: "Total Employees", value: "0", change: "current", icon: Users, trend: "up", color: "text-indigo-500" },
    { title: "On-Time Attendance", value: "100%", change: "today", icon: Clock, trend: "up", color: "text-amber-500" },
    { title: "System Uptime", value: "99.99%", change: "stable", icon: Activity, trend: "up", color: "text-emerald-500" },
    { title: "Overall Productivity", value: "100%", change: "this week", icon: TrendingUp, trend: "up", color: "text-rose-500" },
  ])

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/projects', {}, effectiveRole).then(res => res.json()),
      fetchApi('/tasks', {}, effectiveRole).then(res => res.json()),
      fetchApi('/employees', {}, effectiveRole).then(res => res.json()),
      fetchApi('/attendance', {}, effectiveRole).then(res => res.json()),
      fetchApi('/time-logs', {}, effectiveRole).then(res => res.json())
    ]).then(([projects, tasks, employees, attendance, timeLogs]) => {
      let totalProjects = 0;
      if (Array.isArray(projects)) totalProjects = projects.length;
      
      let activeTasks = 0;
      if (Array.isArray(tasks)) activeTasks = tasks.filter(t => t.status !== 'Done' && t.status !== 'Completed').length;
      
      let totalEmployees = 0;
      if (Array.isArray(employees)) totalEmployees = employees.length;
      
      let onTimeAttendance = "100%";
      if (Array.isArray(attendance) && attendance.length > 0) {
        const onTime = attendance.filter(a => {
          const hour = new Date(a.checkInTime).getHours();
          return hour <= 9; // Assume 9 AM is on-time
        }).length;
        onTimeAttendance = `${Math.round((onTime / attendance.length) * 100)}%`;
      }
      
      let overallProductivity = "100%";
      if (Array.isArray(timeLogs) && timeLogs.length > 0 && totalEmployees > 0) {
         // rough productivity calculation based on time logged
         const totalExpectedSeconds = totalEmployees * 8 * 3600; 
         const totalLoggedSeconds = timeLogs.reduce((acc, log) => acc + (log.durationSeconds || 0), 0);
         const prodPercent = Math.min(100, Math.round((totalLoggedSeconds / totalExpectedSeconds) * 100));
         overallProductivity = `${prodPercent}%`;
      }

      setStats([
        { title: "Total Projects", value: totalProjects.toString(), change: "current", icon: Briefcase, trend: "up", color: "text-emerald-500" },
        { title: "Active Tasks", value: activeTasks.toString(), change: "current", icon: CheckSquare, trend: "up", color: "text-blue-500" },
        { title: "Total Employees", value: totalEmployees.toString(), change: "current", icon: Users, trend: "up", color: "text-indigo-500" },
        { title: "On-Time Attendance", value: onTimeAttendance, change: "today", icon: Clock, trend: "up", color: "text-amber-500" },
        { title: "System Uptime", value: "99.99%", change: "stable", icon: Activity, trend: "up", color: "text-emerald-500" },
        { title: "Overall Productivity", value: overallProductivity, change: "today", icon: TrendingUp, trend: "up", color: "text-rose-500" },
      ])
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:border-primary/20 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs mt-1 font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
