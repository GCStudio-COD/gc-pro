"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminTaskOverviewWidget() {
  const [data, setData] = useState<{dept: string, open: number, completed: number}[]>([])

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/departments', {}, effectiveRole).then(res => res.json()),
      fetchApi('/tasks', {}, effectiveRole).then(res => res.json())
    ]).then(([departments, tasks]) => {
      if (Array.isArray(departments) && Array.isArray(tasks)) {
        const deptData: any = {};
        
        departments.forEach(d => {
          deptData[d.id] = {
            dept: d.name.substring(0, 4), // Short name
            open: 0,
            completed: 0,
            employees: new Set(d.employees?.map((e: any) => e.id) || [])
          }
        });

        tasks.forEach(t => {
          if (t.assigneeId) {
            // Find which department this assignee is in
            const deptId = Object.keys(deptData).find(id => deptData[id].employees.has(t.assigneeId));
            if (deptId) {
              if (t.status === 'Done' || t.status === 'Completed') {
                deptData[deptId].completed++;
              } else {
                deptData[deptId].open++;
              }
            }
          }
        });

        setData(Object.values(deptData).map((d: any) => ({
          dept: d.dept,
          open: d.open,
          completed: d.completed
        })));
      }
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Task Velocity</CardTitle>
          <CardDescription>Open vs Completed tasks by department.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              completed: { label: "Completed", color: "var(--foreground)" },
              open: { label: "Open", color: "var(--muted-foreground)" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.length > 0 ? data : [{dept: "None", open: 0, completed: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="dept" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="open" fill="var(--color-open)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
