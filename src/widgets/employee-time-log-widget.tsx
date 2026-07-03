"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function EmployeeTimeLogWidget() {
  const currentHours = 32
  const targetHours = 40
  const percentage = (currentHours / targetHours) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Time Log <Clock className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="text-5xl font-bold mb-2">{currentHours}<span className="text-xl text-muted-foreground font-normal">h</span></div>
            <p className="text-sm text-muted-foreground mb-8">logged this week</p>
            
            <div className="w-full space-y-2">
              <Progress value={percentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0h</span>
                <span>{targetHours}h Target</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
