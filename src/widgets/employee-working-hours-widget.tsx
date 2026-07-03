"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function EmployeeWorkingHoursWidget() {
  const [data, setData] = useState<{day: string, hours: number}[]>([])
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
          // Get last 5 days
          const daysMap = new Map()
          for (let i = 4; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' })
            daysMap.set(d.toISOString().split('T')[0], { day: dayStr, seconds: 0 })
          }

          logs.forEach(log => {
            if (log.durationSeconds) {
              const dStr = new Date(log.startTime).toISOString().split('T')[0]
              if (daysMap.has(dStr)) {
                daysMap.get(dStr).seconds += log.durationSeconds
              }
            }
          })

          const chartData = Array.from(daysMap.values()).map(val => ({
            day: val.day,
            hours: Number((val.seconds / 3600).toFixed(1))
          }))
          setData(chartData)
        }
      })
      .catch(console.error)
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
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>Hours logged this week vs 8h target.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              hours: { label: "Hours", color: "#3b82f6" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.length > 0 ? data : [{day: 'Mon', hours: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} domain={[0, 10]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReferenceLine y={8} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
