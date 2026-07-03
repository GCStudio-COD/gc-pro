"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const team = [
  { name: "Alice Johnson", role: "Frontend", workload: 95, color: "bg-destructive" },
  { name: "Bob Smith", role: "Backend", workload: 60, color: "bg-emerald-500" },
  { name: "Charlie Davis", role: "Designer", workload: 40, color: "bg-emerald-500" },
  { name: "Diana Prince", role: "DevOps", workload: 85, color: "bg-amber-500" },
]

export function PmTeamWorkloadWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Team Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {team.map((member, i) => (
              <div key={i} className="flex items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/avatars/0${i + 1}.png`} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-16 rounded-full bg-muted overflow-hidden`}>
                    <div className={`h-full ${member.color}`} style={{ width: `${member.workload}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{member.workload}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
