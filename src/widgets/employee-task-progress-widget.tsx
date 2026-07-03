"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

const COLORS = ["hsl(var(--primary))", "#3b82f6", "#f59e0b", "#10b981"]

export function EmployeeTaskProgressWidget() {
  const [data, setData] = useState<{name: string, value: number}[]>([])
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
          const counts = { "To Do": 0, "In Progress": 0, "Review": 0, "Done": 0 }
          tasks.forEach((t: any) => {
            if (counts.hasOwnProperty(t.status)) {
              counts[t.status as keyof typeof counts]++
            } else if (t.status === "Completed") {
              counts["Done"]++
            }
          })
          
          setData([
            { name: "To Do", value: counts["To Do"] },
            { name: "In Progress", value: counts["In Progress"] },
            { name: "Review", value: counts["Review"] },
            { name: "Done", value: counts["Done"] },
          ])
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Personal sprint progress.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              "To Do": { label: "To Do", color: COLORS[0] },
              "In Progress": { label: "In Progress", color: COLORS[1] },
              "Review": { label: "Review", color: COLORS[2] },
              "Done": { label: "Done", color: COLORS[3] },
            }}
            className="w-full h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
