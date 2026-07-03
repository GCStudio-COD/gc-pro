"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, CheckSquare, Briefcase, CalendarDays } from "lucide-react"
import Link from "next/link"

export function EmployeeQuickActionsWidget() {
  const actions = [
    { label: "Request Leave", icon: Plane, url: "/employee/leaves", variant: "default" as const },
    { label: "View Tasks", icon: CheckSquare, url: "/employee/tasks", variant: "outline" as const },
    { label: "My Projects", icon: Briefcase, url: "/employee/projects", variant: "outline" as const },
    { label: "My Attendance", icon: CalendarDays, url: "/employee/attendance", variant: "outline" as const },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {actions.map((act, i) => {
              const Icon = act.icon
              return (
                <Button key={i} variant={act.variant} className="w-full justify-start h-10" asChild>
                  <Link href={act.url}>
                    <Icon className="mr-2 h-4 w-4" /> {act.label}
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

