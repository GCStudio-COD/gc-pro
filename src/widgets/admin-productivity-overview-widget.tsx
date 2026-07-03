"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminProductivityOverviewWidget() {
  const [data, setData] = useState<{week: string, score: number, target: number}[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/time-logs', {}, effectiveRole).then(res => res.json()),
      fetchApi('/employees', {}, effectiveRole).then(res => res.json())
    ]).then(([timeLogs, employees]) => {
      if (Array.isArray(timeLogs) && Array.isArray(employees)) {
        const totalEmps = employees.length || 1;
        const now = new Date();
        const weeksData = [];

        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7 + now.getDay()));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          
          weeksData.push({
            week: i === 0 ? "This Wk" : `W-${i}`,
            start: startOfWeek,
            end: endOfWeek,
            score: 0,
            target: 85 // Target 85% productivity
          });
        }

        const expectedSecondsPerWeek = totalEmps * 40 * 3600; // 40 hours per week per emp

        weeksData.forEach(w => {
          let loggedSeconds = 0;
          timeLogs.forEach(log => {
            const logDate = new Date(log.startTime);
            if (logDate >= w.start && logDate <= w.end) {
              loggedSeconds += (log.durationSeconds || 0);
            }
          });
          w.score = Math.min(100, Math.round((loggedSeconds / expectedSecondsPerWeek) * 100));
        });

        setData(weeksData.map(w => ({ week: w.week, score: w.score, target: w.target })));
      }
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Productivity Score</CardTitle>
          <CardDescription>Target vs Actual.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              score: { label: "Score", color: "var(--foreground)" },
              target: { label: "Target", color: "var(--muted-foreground)" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.length > 0 ? data : [{week: "This Wk", score: 0, target: 85}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="step" dataKey="target" stroke="var(--color-target)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
