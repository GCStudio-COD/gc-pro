import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, CheckCircle, Clock } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "10,482",
    description: "+14.5% from last month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Projects",
    value: "42",
    description: "+2 from last week",
    icon: Activity,
    trend: "up",
  },
  {
    title: "Tasks Completed",
    value: "1,204",
    description: "+19% from last month",
    icon: CheckCircle,
    trend: "up",
  },
  {
    title: "Total Hours",
    value: "8,940",
    description: "-4% from last month",
    icon: Clock,
    trend: "down",
  },
]

export function StatisticsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
