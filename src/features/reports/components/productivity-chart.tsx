"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function ProductivityChart() {
  const [data, setData] = useState<{week: string, productivity: number, target: number}[]>([])
  
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

        // Last 5 weeks
        for (let i = 4; i >= 0; i--) {
          const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7 + now.getDay()));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          
          weeksData.push({
            week: i === 0 ? "This Wk" : `W-${i}`,
            start: startOfWeek,
            end: endOfWeek,
            productivity: 0,
            target: 80 // Target 80% productivity
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
          w.productivity = Math.min(100, Math.round((loggedSeconds / expectedSecondsPerWeek) * 100));
        });

        setData(weeksData.map(w => ({ week: w.week, productivity: w.productivity, target: w.target })));
      }
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Team Productivity</CardTitle>
        <CardDescription>Average productivity vs target over 5 weeks.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartContainer
          config={{
            productivity: {
              label: "Productivity",
              color: "var(--foreground)",
            },
            target: {
              label: "Target",
              color: "var(--muted-foreground)",
            },
          }}
          className="w-full h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.length > 0 ? data : [{week: "This Wk", productivity: 0, target: 80}]} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" opacity={0.2} />
              <XAxis 
                dataKey="week" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: "var(--muted-foreground)" }} 
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: "var(--muted-foreground)" }}
                allowDecimals={false} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="productivity" 
                stroke="var(--color-productivity)" 
                strokeWidth={3} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="step" 
                dataKey="target" 
                stroke="var(--color-target)" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
