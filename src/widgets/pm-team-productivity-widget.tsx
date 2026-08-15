"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function PmTeamProductivityWidget() {
  const [data, setData] = useState<{name: string, velocity: number, assigned: number}[]>([])
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/plaky/tasks', {}, effectiveRole).then(res => res.json()),
      fetchApi('/employees', {}, effectiveRole).then(res => res.json())
    ]).then(([tasks, employees]) => {
      if (Array.isArray(tasks) && Array.isArray(employees)) {

        const empVelocity = employees.map(emp => {
          let velocity = 0;
          let assigned = 0;
          tasks.forEach((t: any) => {
            if (t.assigneeId === emp.id || t.assignees?.includes(emp.id)) {
              assigned++;
              if (t.status === "Done" || t.status === "Completed") {
                velocity++;
              }
            }
          });
          return {
            name: emp.firstName,
            velocity,
            assigned
          };
        });

        // Sort by assigned tasks descending
        empVelocity.sort((a, b) => b.assigned - a.assigned);
        setData(empVelocity);
      }
    }).catch(console.error);
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="col-span-1 lg:col-span-3"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Employee Velocity</CardTitle>
          <CardDescription>Total assigned vs completed tasks.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              assigned: { label: "Total Assigned", color: "#64748b" },
              velocity: { label: "Completed", color: "#10b981" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.length > 0 ? data : [{name: "No Data", velocity: 0, assigned: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                  interval={0} 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36} />
                <Bar dataKey="assigned" fill="var(--color-assigned)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="velocity" fill="var(--color-velocity)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
