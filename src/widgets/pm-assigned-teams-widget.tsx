"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function PmAssignedTeamsWidget() {
  const [teams, setTeams] = useState<any[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/departments', {}, effectiveRole)
      .then(res => res.json())
      .then(depts => {
        if (Array.isArray(depts)) {
          const mapped = depts.map((d, i) => ({
            team: d.name,
            members: d.employees?.length || 0,
            capacity: Math.min(100, Math.max(40, (d.employees?.length || 0) * 15)), // Mock capacity
            color: i % 3 === 0 ? "bg-emerald-500" : i % 3 === 1 ? "bg-amber-500" : "bg-blue-500"
          }))
          setTeams(mapped.slice(0, 4))
        }
      }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="col-span-1 lg:col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Assigned Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {teams.length > 0 ? teams.map((t, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`/avatars/0${(i % 5) + 1}.png`} />
                      <AvatarFallback>{t.team.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{t.team}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.members} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${t.color}`} style={{ width: `${t.capacity}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{t.capacity}%</span>
                </div>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No teams assigned.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
