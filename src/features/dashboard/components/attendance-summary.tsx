"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Present", value: 85, color: "hsl(var(--chart-1))" },
  { name: "Absent", value: 5, color: "hsl(var(--chart-2))" },
  { name: "On Leave", value: 10, color: "hsl(var(--chart-3))" },
]

const chartConfig = {
  value: {
    label: "Employees",
  },
  Present: {
    label: "Present",
    color: "hsl(var(--chart-1))",
  },
  Absent: {
    label: "Absent",
    color: "hsl(var(--chart-2))",
  },
  "On Leave": {
    label: "On Leave",
    color: "hsl(var(--chart-3))",
  },
}

export function AttendanceSummary() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>Today's workforce status.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <ChartContainer config={chartConfig} className="h-[250px] w-full pb-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
