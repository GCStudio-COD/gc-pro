"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, MessageSquare, GitPullRequest, Briefcase, CheckSquare, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { useRoleStore } from "@/store/use-role-store"
import { useAuthStore } from "@/store/use-auth-store"
import { fetchApi } from "@/lib/api"

export function EmployeeNotificationsWidget() {
  const [notifications, setNotifications] = useState<any[]>([])
  
  const { userId } = useAuthStore()
  const role = 'employee'

  useEffect(() => {
    if (!userId) return;
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetchApi(`/notifications?employeeId=${userId}&role=${role}`, {}, role)
      if (res.ok) {
        setNotifications(await res.json())
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await fetchApi(`/notifications/${id}/read`, { method: 'PUT' }, role)
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
      case 'project': return 'bg-blue-500/10 text-blue-500';
      case 'task': return 'bg-emerald-500/10 text-emerald-500';
      case 'leave': return 'bg-orange-500/10 text-orange-500';
      case 'mention': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-primary/10 text-primary';
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
            <Bell className="h-4 w-4" /> Personal Alerts
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
                    className={`p-3 rounded-lg border flex items-start gap-3 transition-colors cursor-pointer ${notif.read ? 'bg-card opacity-60' : 'bg-muted/30 hover:bg-muted/50 border-primary/20'}`}
                  >
                    <div className={`mt-0.5 rounded-md p-1.5 ${getColor(notif.type)}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <p className="text-sm font-medium">{notif.message}</p>
                    {!notif.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 ml-auto shrink-0" />}
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
