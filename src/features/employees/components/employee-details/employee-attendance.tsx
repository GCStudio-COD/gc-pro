"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", daysPresent: 21, daysAbsent: 1, daysLeave: 0 },
  { month: "Feb", daysPresent: 19, daysAbsent: 0, daysLeave: 1 },
  { month: "Mar", daysPresent: 22, daysAbsent: 1, daysLeave: 0 },
  { month: "Apr", daysPresent: 18, daysAbsent: 0, daysLeave: 3 },
  { month: "May", daysPresent: 21, daysAbsent: 0, daysLeave: 1 },
  { month: "Jun", daysPresent: 20, daysAbsent: 2, daysLeave: 0 },
]

const chartConfig = {
  daysPresent: {
    label: "Present",
    color: "hsl(var(--primary))",
  },
  daysAbsent: {
    label: "Absent",
    color: "hsl(var(--destructive))",
  },
  daysLeave: {
    label: "On Leave",
    color: "hsl(var(--muted-foreground))",
  },
}

export function EmployeeAttendance() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Attendance Record</CardTitle>
        <CardDescription>Monthly attendance statistics for the current year.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="daysPresent" fill="var(--color-daysPresent)" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="daysLeave" fill="var(--color-daysLeave)" radius={[0, 0, 0, 0]} stackId="a" />
              <Bar dataKey="daysAbsent" fill="var(--color-daysAbsent)" radius={[0, 0, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
