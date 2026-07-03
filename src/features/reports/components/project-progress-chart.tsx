"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

const COLORS = [
  "#22c55e", 
  "#3b82f6", 
  "var(--chart-3)", 
  "var(--destructive)"
]

export function ProjectProgressChart() {
  const [data, setData] = useState([
    { name: "Completed", value: 0 },
    { name: "In Progress", value: 0 },
    { name: "On Hold", value: 0 },
    { name: "Cancelled", value: 0 },
  ])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/projects', {}, effectiveRole)
      .then(res => res.json())
      .then(projects => {
        if (Array.isArray(projects)) {
          let completed = 0, inProgress = 0, onHold = 0, cancelled = 0;
          projects.forEach(p => {
            if (p.status === 'Completed') completed++;
            else if (p.status === 'On Hold') onHold++;
            else if (p.status === 'Cancelled') cancelled++;
            else inProgress++; // Planning, Active, In Progress
          });
          setData([
            { name: "Completed", value: completed },
            { name: "In Progress", value: inProgress },
            { name: "On Hold", value: onHold },
            { name: "Cancelled", value: cancelled },
          ]);
        }
      }).catch(console.error)
  }, [effectiveRole])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
        <CardDescription>Overview of all active projects.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartContainer
          config={{
            Completed: { label: "Completed", color: COLORS[0] },
            "In Progress": { label: "In Progress", color: COLORS[1] },
            "On Hold": { label: "On Hold", color: COLORS[2] },
            Cancelled: { label: "Cancelled", color: COLORS[3] },
          }}
          className="w-full h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
