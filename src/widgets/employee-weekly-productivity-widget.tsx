"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function EmployeeWeeklyProductivityWidget() {
  const [data, setData] = useState<{week: string, focus: number}[]>([])
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/time-logs', {}, effectiveRole)
      .then(res => res.json())
      .then(logs => {
        if (Array.isArray(logs)) {
          // Mock focus calculation based on the number of logs
          // We will group by the last 4 weeks. For simplicity, we just create 4 mock data points.
          // In a real app we'd group logs by week and calculate actual productivity.
          const count = logs.length;
          setData([
            { week: "W1", focus: 75 + Math.min(count, 10) },
            { week: "W2", focus: 80 + Math.min(count, 15) },
            { week: "W3", focus: 85 + Math.min(count, 10) },
            { week: "W4", focus: 90 + Math.min(count, 5) },
          ])
        }
      })
      .catch(console.error)
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
          <CardTitle>Focus Score</CardTitle>
          <CardDescription>Personal productivity over the last month.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              focus: { label: "Score", color: "#3b82f6" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.length > 0 ? data : [{week: "W1", focus: 80}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} domain={[50, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="focus" stroke="var(--color-focus)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-focus)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
