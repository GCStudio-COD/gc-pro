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
          const now = new Date()
          const weeksData = [
            { week: "W1", focus: 0, seconds: 0 },
            { week: "W2", focus: 0, seconds: 0 },
            { week: "W3", focus: 0, seconds: 0 },
            { week: "W4", focus: 0, seconds: 0 }
          ]
          
          logs.forEach((log: any) => {
            if (log.durationSeconds && log.startTime) {
              const logDate = new Date(log.startTime)
              const diffTime = Math.abs(now.getTime() - logDate.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              
              if (diffDays <= 7) weeksData[3].seconds += log.durationSeconds
              else if (diffDays <= 14) weeksData[2].seconds += log.durationSeconds
              else if (diffDays <= 21) weeksData[1].seconds += log.durationSeconds
              else if (diffDays <= 28) weeksData[0].seconds += log.durationSeconds
            }
          })
          
          const targetSecondsPerWeek = 40 * 3600
          
          const finalData = weeksData.map(w => ({
            week: w.week,
            focus: Math.min(100, Math.round((w.seconds / targetSecondsPerWeek) * 100)) || 0
          }))
          
          setData(finalData)
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
