"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, CheckSquare, BarChart2, Calendar, Folder } from "lucide-react"
import Link from "next/link"

export function PmQuickActionsWidget() {
  const actions = [
    { label: "New Project", icon: Briefcase, variant: "default" as const, href: "/pm/projects/new" },
    { label: "All Projects", icon: Folder, variant: "outline" as const, href: "/pm/projects" },
    { label: "Leave Requests", icon: Calendar, variant: "outline" as const, href: "/pm/leaves" },
    { label: "View Reports", icon: BarChart2, variant: "outline" as const, href: "/pm/reports" },
    { label: "My Tasks", icon: CheckSquare, variant: "outline" as const, href: "/pm/my-tasks" },
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
                  <Link href={act.href}>
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
