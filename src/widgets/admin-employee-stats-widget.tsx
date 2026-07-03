"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminEmployeeStatsWidget() {
  const [data, setData] = useState<{month: string, employees: number}[]>([])

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/employees', {}, effectiveRole)
      .then(res => res.json())
      .then(employees => {
        if (Array.isArray(employees)) {
          const now = new Date();
          const monthsData = [];
          
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            monthsData.push({
              month: d.toLocaleDateString('en-US', { month: 'short' }),
              year: d.getFullYear(),
              monthNum: d.getMonth(),
              employees: 0
            });
          }

          // Count cumulative employees up to each month
          monthsData.forEach((m) => {
            const endOfMonth = new Date(m.year, m.monthNum + 1, 0, 23, 59, 59);
            m.employees = employees.filter(e => new Date(e.createdAt) <= endOfMonth).length;
          });

          setData(monthsData.map(m => ({ month: m.month, employees: m.employees })));
        }
      }).catch(console.error)
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
          <CardTitle>Headcount Growth</CardTitle>
          <CardDescription>Net positive growth over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              employees: { label: "Employees", color: "var(--foreground)" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.length > 0 ? data : [{month: "Current", employees: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="employees" stroke="var(--color-employees)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
