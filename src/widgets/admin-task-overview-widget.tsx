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
  const [data, setData] = useState<{name: string, open: number, completed: number, total: number}[]>([])

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/employees', {}, effectiveRole).then(res => res.json()),
      fetchApi('/plaky/tasks', {}, effectiveRole).then(res => res.json())
    ]).then(([employees, tasks]) => {
      const isFinished = (status?: string) => {
        if (!status) return false;
        const s = status.trim().toLowerCase();
        return s === 'done' || s === 'completed' || s === 'complete' || s === 'approved' || s === 'closed';
      };

      if (Array.isArray(employees) && Array.isArray(tasks)) {
        const empData = employees.map(emp => {
          let open = 0;
          let completed = 0;
          
          tasks.forEach((t: any) => {
            if (t.assigneeId === emp.id || t.assignees?.includes(emp.id) || t.assignee?.id === emp.id) {
              if (isFinished(t.status)) {
                completed++;
              } else {
                open++;
              }
            }
          });
          
          return {
            name: emp.firstName,
            open,
            completed,
            total: open + completed
          };
        });

        // Sort by total tasks descending
        empData.sort((a, b) => b.total - a.total);

        setData(empData);
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
          <CardTitle>Employee Task Overview</CardTitle>
          <CardDescription>Open vs Completed tasks by employee.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              completed: { label: "Completed", color: "#10b981" },
              open: { label: "Open", color: "#64748b" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.length > 0 ? data : [{name: "None", open: 0, completed: 0, total: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
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
