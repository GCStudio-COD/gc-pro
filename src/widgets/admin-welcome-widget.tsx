"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sun, Cloud, Calendar } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AdminWelcomeWidget() {
  const [date, setDate] = useState("")
  const [userName, setUserName] = useState("Administrator")
  
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
      className="col-span-1 lg:col-span-full"
    >
      <Card className="border-none bg-black dark:bg-white text-white dark:text-black shadow-none overflow-hidden relative">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {userName}</h2>
              <p className="text-white/70 dark:text-black/70">
                Here's what's happening across Nuvio today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-3 bg-white/5 dark:bg-sidebar border border-white/10 dark:text-white px-4 py-2.5 rounded-xl">
                <div className="p-2 bg-white/10 rounded-md"><Calendar className="h-4 w-4" /></div>
                <div>
                  <p className="text-white/70 text-xs">Today's Date</p>
                  <p>{date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/5 dark:bg-sidebar border border-white/10 dark:text-white px-4 py-2.5 rounded-xl">
                <div className="p-2 bg-white/10 rounded-md"><Sun className="h-4 w-4 text-amber-500" /></div>
                <div>
                  <p className="text-white/70 text-xs">System Status</p>
                  <p className="text-emerald-500 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> All Operational
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
