"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sun, CheckCircle2 } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function EmployeeWelcomeWidget() {
  const [date, setDate] = useState("")
  const [userName, setUserName] = useState("Employee")
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
    
    // Fetch user details
    fetchApi('/auth/me', {}, effectiveRole)
      .then(res => res.json())
      .then(user => {
        if (user && user.firstName) setUserName(user.firstName)
      }).catch(console.error)
  }, [effectiveRole])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="h-full border-none bg-black dark:bg-white text-white dark:text-black shadow-none overflow-hidden relative">
        <CardContent className="p-8 h-full flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Sun className="h-5 w-5" />
            <span className="font-semibold text-sm tracking-tight uppercase">Good Morning, {userName}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Ready to crush it today?</h2>
          <p className="text-white/70 dark:text-black/70 max-w-xl mb-6">
            It's {date}. You have 3 tasks due today and a team sync at 2:00 PM. 
          </p>
          
          <div className="flex items-center gap-3 bg-white/5 dark:bg-sidebar border border-white/10 dark:text-white px-4 py-2.5 rounded-xl w-max">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Daily Focus</p>
              <p className="text-xs text-white/70">Complete PR #412</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
