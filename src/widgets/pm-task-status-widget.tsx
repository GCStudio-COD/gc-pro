"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

const COLORS = ["hsl(var(--primary))", "#f59e0b", "#3b82f6", "#10b981"]

export function PmTaskStatusWidget() {
  const [data, setData] = useState<any[]>([])
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
          const empData = employees.map(emp => {
            let todo = 0, inProgress = 0, review = 0, done = 0;
            let total = 0;
            tasks.forEach((t: any) => {
              if (t.assigneeId === emp.id || t.assignees?.includes(emp.id)) {
                 if (t.status === "To Do") todo++;
                 else if (t.status === "In Progress") inProgress++;
                 else if (t.status === "Review") review++;
                 else if (t.status === "Done" || t.status === "Completed") done++;
                 total++;
              }
            });
            return { 
              name: emp.firstName, 
              todo, 
              inProgress, 
              review, 
              done,
              total
            };
          });
          
          // Sort by total tasks
          empData.sort((a, b) => b.total - a.total);
          
          setData(empData);
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Employee Task Statuses</CardTitle>
          <CardDescription>Current sprint task statuses broken down by employee.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              todo: { label: "To Do", color: COLORS[0] },
              inProgress: { label: "In Progress", color: COLORS[1] },
              review: { label: "Review", color: COLORS[2] },
              done: { label: "Done", color: COLORS[3] },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.length > 0 ? data : [{name: "No Data", todo: 0, inProgress: 0, review: 0, done: 0}]} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
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
                <Bar dataKey="todo" stackId="a" fill="var(--color-todo)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="inProgress" stackId="a" fill="var(--color-inProgress)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="review" stackId="a" fill="var(--color-review)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="done" stackId="a" fill="var(--color-done)" radius={[4, 4, 0, 0]} />
                <Legend verticalAlign="bottom" height={36} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
