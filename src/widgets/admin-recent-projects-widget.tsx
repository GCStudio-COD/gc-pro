"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminRecentProjectsWidget() {
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
          const recent = data
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4)
            .map(p => ({
              id: p.id,
              name: p.name,
              status: p.status
            }));
          setProjects(recent);
        }
      }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length > 0 ? projects.map((proj) => (
              <div key={proj.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors">
                <span className="font-medium text-sm">{proj.name}</span>
                <Badge variant="outline">{proj.status}</Badge>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No recent projects.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
