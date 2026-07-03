"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminRecentEmployeesWidget() {
  const [employees, setEmployees] = useState<any[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/employees', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const recent = data
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4)
            .map(e => ({
              id: e.id,
              name: `${e.firstName} ${e.lastName}`,
              role: e.jobTitle || 'Employee',
              dept: e.department?.name || 'Unassigned',
              img: "01" // placeholder
            }));
          setEmployees(recent);
        }
      }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Hires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.length > 0 ? employees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{emp.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{emp.role}</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-muted rounded-md hidden sm:block">
                  {emp.dept}
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-sm text-muted-foreground">No recent hires.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
