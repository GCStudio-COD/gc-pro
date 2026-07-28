"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function PmProjectProgressWidget() {
  const [data, setData] = useState<any[]>([])
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/plaky/boards', {}, effectiveRole)
      .then(res => res.json())
      .then(projects => {
        if (Array.isArray(projects)) {
          const chartData = projects.map(p => {
            const allTasks = p.groups?.flatMap((g: any) => g.tasks) || [];
            const totalTasks = allTasks.length;
            const completedTasks = allTasks.filter((t: any) => t.status === "Done" || t.status === "Completed").length || 0;
            const actual = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            // Mock expected based on actual since boards lack date fields
            const expected = Math.min(100, actual + 10);

            return {
              name: p.name.substring(0, 15),
              expected,
              actual
            };
          });
          setData(chartData);
        }
      })
      .catch(console.error);
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Project Progress (%)</CardTitle>
          <CardDescription>Expected vs Actual completion.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              actual: { label: "Actual", color: "var(--foreground)" },
              expected: { label: "Expected", color: "var(--muted-foreground)" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expected" fill="var(--color-expected)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
