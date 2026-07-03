"use client"

import { useState, useEffect } from "react"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"
import { fetchApi } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video } from "lucide-react"

export function MeetingPopup() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { role } = useRoleStore()
  const pathname = usePathname()

  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    // Fetch today's meetings
    const today = new Date().toISOString()
    fetchApi(`/meetings?date=${today}`, {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMeetings(data)
          setIsOpen(true) // Open on mount if there are meetings today
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  if (!isOpen || meetings.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card w-full max-w-md rounded-xl shadow-2xl border flex flex-col overflow-hidden"
          >
            <div className="bg-primary p-4 text-primary-foreground">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                You have {meetings.length} event{meetings.length > 1 ? 's' : ''} today
              </h2>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 bg-muted/20">
              {meetings.map((meeting) => {
                const start = new Date(meeting.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                const end = new Date(meeting.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={meeting.id} className="bg-background border rounded-lg p-3 shadow-sm flex flex-col gap-2">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {start} - {end}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        {meeting.type}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="p-4 border-t bg-card flex justify-end">
              <Button onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
