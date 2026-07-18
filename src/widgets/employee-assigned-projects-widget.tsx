"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function EmployeeAssignedProjectsWidget() {
  const [projects, setProjects] = useState<any[]>([])
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/projects', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.slice(0, 3).map(p => {
            const isCompleted = p.status === 'Completed' || p.status === 'Done';
            return {
              name: p.name || 'Untitled Project',
              role: 'Team Member',
              progress: isCompleted ? 100 : (p.progress || 0),
              health: isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
            }
          })
          setProjects(formatted)
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="col-span-1 lg:col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> My Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.length > 0 ? projects.map((proj, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${proj.health}`} />
                      {proj.name}
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">{proj.role}</div>
                  </div>
                  <span className="text-xs font-semibold">{proj.progress}%</span>
                </div>
                <Progress value={proj.progress} className="h-1.5 ml-4" />
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No assigned projects.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
