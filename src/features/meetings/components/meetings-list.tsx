"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, Clock, Users, Video } from "lucide-react"

export function MeetingsList() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const { role } = useRoleStore()
  const pathname = usePathname()
  const router = useRouter()
  
  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/meetings', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMeetings(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch meetings", err)
        setLoading(false)
      })
  }, [effectiveRole])

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString)
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings & Events</h1>
          <p className="text-muted-foreground mt-1">View and manage your upcoming schedule.</p>
        </div>
        {effectiveRole === 'admin' && (
          <Button onClick={() => router.push('/admin/meetings/new')}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Schedule</CardTitle>
          <CardDescription>All your scheduled meetings and events.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground py-4 text-center">Loading meetings...</div>
          ) : meetings.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed rounded-lg">
              No upcoming meetings found.
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => {
                const start = formatDateTime(meeting.startTime)
                const end = formatDateTime(meeting.endTime)
                return (
                  <div key={meeting.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-lg p-2 min-w-[70px]">
                        <span className="text-xs font-semibold uppercase">{start.date.split(',')[0]}</span>
                        <span className="text-lg font-bold">{start.date.split(' ')[2] || start.date.split(' ')[1]}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">{meeting.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {start.time} - {end.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            {meeting.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {meeting.participants?.length || 0} participants
                          </span>
                        </div>
                        {meeting.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {meeting.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="self-start sm:self-center">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
