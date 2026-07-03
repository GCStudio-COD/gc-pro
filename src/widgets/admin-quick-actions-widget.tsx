"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Briefcase, CheckSquare, Building, BarChart, Calendar } from "lucide-react"
import Link from "next/link"

export function AdminQuickActionsWidget() {
  const actions = [
    { label: "Add Employee", icon: UserPlus, variant: "default" as const, url: "/admin/employees" },
    { label: "Schedule Meeting", icon: Calendar, variant: "default" as const, url: "/admin/meetings/new" },
    { label: "New Project", icon: Briefcase, variant: "outline" as const, url: "/admin/projects" },
    { label: "Create Task", icon: CheckSquare, variant: "outline" as const, url: "/admin/tasks/new" },
    { label: "Departments", icon: Building, variant: "outline" as const, url: "/admin/departments" },
    { label: "View Reports", icon: BarChart, variant: "outline" as const, url: "/admin/reports" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
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
