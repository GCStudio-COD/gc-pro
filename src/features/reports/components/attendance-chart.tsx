"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AttendanceChart() {
  const [data, setData] = useState<{day: string, present: number, absent: number}[]>([])
  
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
        const totalEmps = employees.length;
        const now = new Date();
        const daysData = [];

        for (let i = 4; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
          daysData.push({
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateStr: d.toDateString(),
            present: 0,
            absent: totalEmps
          });
        }

        daysData.forEach(d => {
          const uniqueEmpsForDay = new Set();
          attendanceLogs.forEach(log => {
            const logDate = new Date(log.date || log.checkInTime).toDateString();
            if (logDate === d.dateStr) {
              uniqueEmpsForDay.add(log.employeeId);
            }
          });
          d.present = uniqueEmpsForDay.size;
          d.absent = Math.max(0, totalEmps - d.present);
        });

        setData(daysData.map(d => ({ day: d.day, present: d.present, absent: d.absent })));
      }
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
        <CardDescription>Present vs Absent over the last 5 days.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartContainer
          config={{
            present: {
              label: "Present",
              color: "var(--foreground)",
            },
            absent: {
              label: "Absent",
              color: "var(--destructive)",
            },
          }}
          className="w-full h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.length > 0 ? data : [{day: "Mon", present: 0, absent: 0}]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" opacity={0.2} />
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: "var(--muted-foreground)" }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: "var(--muted-foreground)" }}
                allowDecimals={false} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
