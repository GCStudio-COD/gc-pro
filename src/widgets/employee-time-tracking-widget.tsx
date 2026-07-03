"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Play, Square } from "lucide-react"

export function EmployeeTimeTrackingWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm text-center flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Clocked In
          </span>
        </div>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" /> Today's Session
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center pb-8">
          <div className="text-5xl font-bold tabular-nums mb-6 font-mono tracking-tighter">04:22:15</div>
          <div className="flex gap-4 w-full">
            <Button className="flex-1" variant="outline" disabled>
              <Play className="h-4 w-4 mr-2" /> Clock In
            </Button>
            <Button className="flex-1" variant="destructive">
              <Square className="h-4 w-4 mr-2" /> Clock Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
