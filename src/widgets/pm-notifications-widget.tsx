"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, MessageSquare, GitPullRequest, Briefcase, CheckSquare, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function PmNotificationsWidget() {
  const [notifications, setNotifications] = useState<any[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchNotifications()
  }, [effectiveRole])

  const fetchNotifications = async () => {
    try {
      const res = await fetchApi('/notifications', {}, effectiveRole)
      if (res.ok) {
        setNotifications(await res.json())
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await fetchApi(`/notifications/${id}/read`, { method: 'PUT' }, effectiveRole)
      if (res.ok) {
        fetchNotifications()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'project': return Briefcase;
      case 'task': return CheckSquare;
      case 'leave': return Clock;
      case 'mention': return MessageSquare;
      case 'pr': return GitPullRequest;
      default: return Bell;
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'task': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'leave': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'alert': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'warning': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-4 w-4" /> Inbox & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No new notifications.</p>
            ) : (
              notifications.map((notif) => {
                const Icon = getIcon(notif.type)
                return (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 rounded-lg border flex items-start gap-3 transition-colors cursor-pointer ${notif.read ? 'bg-card opacity-60' : getColor(notif.type)}`}
                  >
                    <Icon className="h-4 w-4 mt-0.5" />
                    <p className="text-sm font-medium">{notif.message}</p>
                    {!notif.read && <div className="h-2 w-2 rounded-full bg-current mt-1.5 ml-auto shrink-0" />}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
