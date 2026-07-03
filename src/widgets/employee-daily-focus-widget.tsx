"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sun, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function EmployeeDailyFocusWidget() {
  const [tasksDueToday, setTasksDueToday] = useState(0)
  
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
          const today = new Date().toISOString().split('T')[0]
          const dueToday = tasks.filter((t: any) => t.dueDate?.startsWith(today) && t.status !== 'Done' && t.status !== 'Completed')
          setTasksDueToday(dueToday.length)
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-1 lg:col-span-3 mb-6"
    >
      <Card className="border-none bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-none overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sun className="h-5 w-5" />
                <span className="font-semibold text-sm tracking-tight uppercase">Good Morning, Alex</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Ready to crush it today?</h2>
              <p className="text-muted-foreground max-w-xl">
                You have {tasksDueToday} tasks due today and a team sync at 2:00 PM. Don't forget to log your time before you leave!
              </p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-background border border-border/50 rounded-lg p-4 flex items-center gap-4 flex-1 md:flex-initial">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Daily Goal</p>
                  <p className="text-xs text-muted-foreground">Complete PR #412</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/employee/time-tracking">Clock In</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
