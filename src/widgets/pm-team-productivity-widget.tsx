"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function PmTeamProductivityWidget() {
  const [data, setData] = useState<{week: string, velocity: number}[]>([])
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/tasks', {}, effectiveRole)
      .then(res => res.json())
      .then(tasks => {
        if (Array.isArray(tasks)) {
          const now = new Date();
          const weeksData = [
            { week: "4 Weeks Ago", velocity: 0, start: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000) },
            { week: "3 Weeks Ago", velocity: 0, start: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000) },
            { week: "2 Weeks Ago", velocity: 0, start: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) },
            { week: "Last Week", velocity: 0, start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
          ];

          tasks.forEach((t: any) => {
            if (t.status === "Done" || t.status === "Completed") {
              const updatedAt = new Date(t.updatedAt);
              for (let i = 3; i >= 0; i--) {
                if (updatedAt >= weeksData[i].start) {
                  weeksData[i].velocity++;
                  break;
                }
              }
            }
          });

          setData(weeksData.map(w => ({ week: w.week, velocity: w.velocity })));
        }
      })
      .catch(console.error);
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
          <CardTitle>Team Velocity</CardTitle>
          <CardDescription>Tasks completed per week.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              velocity: { label: "Completed Tasks", color: "var(--foreground)" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.length > 0 ? data : [{week: "Last Week", velocity: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="velocity" stroke="var(--color-velocity)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
