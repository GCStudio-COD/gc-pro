"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const projects = [
  { name: "Website Redesign", progress: 85, status: "On Track", dueDate: "Oct 15" },
  { name: "Mobile App V2", progress: 42, status: "At Risk", dueDate: "Nov 01" },
  { name: "Database Migration", progress: 15, status: "On Track", dueDate: "Dec 10" },
]

export function PmPortfolioWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="col-span-2"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Active Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((proj, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{proj.name}</div>
                  <Badge variant={proj.status === "On Track" ? "default" : "destructive"}>
                    {proj.status}
                  </Badge>
                </div>
                <Progress value={proj.progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{proj.progress}% Complete</span>
                  <span>Due {proj.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
