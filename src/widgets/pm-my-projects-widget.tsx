"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Briefcase, CheckCircle, AlertTriangle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function PmMyProjectsWidget() {
  const [activeProjects, setActiveProjects] = useState(0)
  const [completedProjects, setCompletedProjects] = useState(0)
  const [atRiskProjects, setAtRiskProjects] = useState(0)
  const [teamMembers, setTeamMembers] = useState(0)

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/projects', {}, effectiveRole)
      .then(res => res.json())
      .then(projects => {
        if (Array.isArray(projects)) {
          let active = 0;
          let completed = 0;
          let atRisk = 0;
          const now = new Date();

          projects.forEach(p => {
            if (p.status === 'Completed') completed++;
            else if (p.status === 'In Progress' || p.status === 'Planning') active++;

            if (p.status !== 'Completed' && (p.priority === 'High' || p.priority === 'Critical' || new Date(p.endDate) < now)) {
              atRisk++;
            }
          });

          setActiveProjects(active);
          setCompletedProjects(completed);
          setAtRiskProjects(atRisk);
        }
      }).catch(console.error)

    fetchApi('/employees', {}, effectiveRole)
      .then(res => res.json())
      .then(employees => {
        if (Array.isArray(employees)) {
          setTeamMembers(employees.length);
        }
      }).catch(console.error)
  }, [effectiveRole])

  const stats = [
    { title: "Active Projects", value: activeProjects.toString(), change: "current", icon: Briefcase, color: "text-blue-500" },
    { title: "Completed (YTD)", value: completedProjects.toString(), change: "total", icon: CheckCircle, color: "text-emerald-500" },
    { title: "At Risk", value: atRiskProjects.toString(), change: "needs attention", icon: AlertTriangle, color: "text-rose-500" },
    { title: "Team Members", value: teamMembers.toString(), change: "total", icon: Users, color: "text-indigo-500" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-xs mt-1 text-muted-foreground">
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
