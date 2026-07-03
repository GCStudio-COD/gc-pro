"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function PmTodaysMeetingsWidget() {
  const [meetings, setMeetings] = useState<any[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    const today = new Date().toISOString();
    fetchApi(`/meetings?date=${encodeURIComponent(today)}`, {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMeetings(data.map(m => {
            const start = new Date(m.startTime);
            const end = new Date(m.endTime);
            const durationMs = end.getTime() - start.getTime();
            const durationMins = Math.round(durationMs / 60000);
            const durationStr = durationMins >= 60 ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m` : `${durationMins}m`;

            return {
              title: m.title,
              time: start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              duration: durationStr,
              type: m.type === 'Internal' ? 'video' : 'in-person'
            }
          }))
        }
      }).catch(console.error)
  }, [effectiveRole])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="col-span-1 lg:col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="h-5 w-5" /> Today's Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-muted ml-3 space-y-6">
            {meetings.length > 0 ? meetings.map((m, i) => (
              <div key={i} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{m.title}</span>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{m.time} ({m.duration})</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {m.type === 'video' ? <Video className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                      {m.type === 'video' ? 'Zoom' : 'Room A'}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground pl-4 py-4">No meetings scheduled for today.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
