"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminAttendanceSummaryWidget() {
  const [data, setData] = useState<{day: string, attendance: number}[]>([])

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/attendance', {}, effectiveRole).then(res => res.json()),
      fetchApi('/employees', {}, effectiveRole).then(res => res.json())
    ]).then(([attendanceLogs, employees]) => {
      if (Array.isArray(attendanceLogs) && Array.isArray(employees)) {
        const totalEmps = employees.length || 1; // avoid division by zero
        const now = new Date();
        const daysData = [];

        // Last 5 days
        for (let i = 4; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
          daysData.push({
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateStr: d.toDateString(),
            attendance: 0
          });
        }

        // Count unique attendances per day
        daysData.forEach(d => {
          const uniqueEmpsForDay = new Set();
          attendanceLogs.forEach(log => {
            const logDate = new Date(log.date || log.checkInTime).toDateString();
            if (logDate === d.dateStr) {
              uniqueEmpsForDay.add(log.employeeId);
            }
          });
          d.attendance = Math.min(100, Math.round((uniqueEmpsForDay.size / totalEmps) * 100));
        });

        setData(daysData.map(d => ({ day: d.day, attendance: d.attendance })));
      }
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Attendance Trends</CardTitle>
          <CardDescription>Daily attendance percentage.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              attendance: { label: "Attendance %", color: "var(--foreground)" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.length > 0 ? data : [{day: "Mon", attendance: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-attendance)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-attendance)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="attendance" stroke="var(--color-attendance)" fillOpacity={1} fill="url(#colorAttendance)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
