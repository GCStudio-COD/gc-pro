"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminDepartmentsWidget() {
  const [departments, setDepartments] = useState<any[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/departments', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDepartments(data.map(d => ({
            id: d.id,
            name: d.name,
            head: d.head?.firstName ? `${d.head.firstName} ${d.head.lastName}` : "Unassigned",
            employees: d.employees?.length || 0,
            status: "Healthy" // Default status, could compute based on tasks later
          })))
        }
      }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No departments found.
              </div>
            ) : (
              departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground">Head: {dept.head}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="font-medium">{dept.employees} Employees</div>
                  </div>
                  <Badge variant={dept.status === "Healthy" ? "default" : dept.status === "Warning" ? "secondary" : "destructive"} className="ml-4">
                    {dept.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
