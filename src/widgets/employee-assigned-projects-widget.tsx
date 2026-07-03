"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const projects = [
  { name: "Website Redesign", role: "Lead Developer", progress: 85, health: "bg-emerald-500" },
  { name: "Database Migration", role: "Contributor", progress: 42, health: "bg-amber-500" },
]

export function EmployeeAssignedProjectsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="col-span-1 lg:col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> My Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((proj, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${proj.health}`} />
                      {proj.name}
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">{proj.role}</div>
                  </div>
                  <span className="text-xs font-semibold">{proj.progress}%</span>
                </div>
                <Progress value={proj.progress} className="h-1.5 ml-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
