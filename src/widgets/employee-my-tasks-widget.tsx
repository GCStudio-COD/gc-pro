"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function EmployeeMyTasksWidget() {
  const [tasks, setTasks] = useState<any[]>([])
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
          setTasks(data.slice(0, 5))
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((task, i) => {
              const isDone = task.status === "Done" || task.status === "Completed"
              return (
                <div 
                  key={task.id || i} 
                  className={`flex items-start gap-4 p-4 rounded-lg border border-border/50 transition-colors ${isDone ? "bg-muted/50 opacity-60" : "bg-card hover:bg-muted/20"}`}
                >
                  <Checkbox id={task.id} defaultChecked={isDone} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={task.id} 
                      className={`text-sm font-medium leading-none cursor-pointer ${isDone ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">{task.project || 'Unknown Project'}</p>
                  </div>
                  <Badge variant={task.priority === "High" || task.priority === "Critical" ? "destructive" : task.priority === "Medium" ? "secondary" : "outline"}>
                    {task.priority || 'Low'}
                  </Badge>
                </div>
              )
            }) : (
              <div className="text-center p-4 text-muted-foreground text-sm">
                No tasks assigned yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
