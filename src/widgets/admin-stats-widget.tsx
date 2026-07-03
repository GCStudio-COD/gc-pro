"use client"

import { motion } from "framer-motion"
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminStatsWidget() {
  const stats = [
    { title: "Total Employees", value: "2,314", change: "+4.1%", icon: Users, trend: "up" },
    { title: "Active Projects", value: "142", change: "+12.5%", icon: Activity, trend: "up" },
    { title: "MRR", value: "$1.2M", change: "+8.2%", icon: DollarSign, trend: "up" },
    { title: "Productivity", value: "94%", change: "+1.2%", icon: TrendingUp, trend: "up" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-emerald-500 mt-1 font-medium flex items-center gap-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
