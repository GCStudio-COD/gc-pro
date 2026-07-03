"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sun, CheckCircle2 } from "lucide-react"

export function EmployeeWelcomeWidget() {
  const [date, setDate] = useState("")

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="h-full border-none bg-gradient-to-r from-emerald-500/10 via-background to-background shadow-none overflow-hidden relative">
        <div className="absolute left-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
        <CardContent className="p-8 h-full flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Sun className="h-5 w-5" />
            <span className="font-semibold text-sm tracking-tight uppercase">Good Morning, Alex</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Ready to crush it today?</h2>
          <p className="text-muted-foreground max-w-xl mb-6">
            It's {date}. You have 3 tasks due today and a team sync at 2:00 PM. 
          </p>
          
          <div className="bg-background/50 border border-border/50 rounded-lg p-4 flex items-center gap-4 w-max backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Daily Focus</p>
              <p className="text-xs text-muted-foreground">Complete PR #412</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
