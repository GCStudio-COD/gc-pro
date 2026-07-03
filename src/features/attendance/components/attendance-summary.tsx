"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Clock } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function AttendanceSummary() {
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, rate: 0 })
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/employees', {}, effectiveRole).then(res => res.json()),
      fetchApi('/attendance', {}, effectiveRole).then(res => res.json())
    ]).then(([employees, attendanceLogs]) => {
      if (Array.isArray(employees) && Array.isArray(attendanceLogs)) {
        const total = employees.length;
        const todayStr = new Date().toDateString();
        
        let present = 0;
        let late = 0;
        
        const presentIds = new Set();
        
        attendanceLogs.forEach(log => {
          const logDate = new Date(log.date || log.checkInTime);
          if (logDate.toDateString() === todayStr && !presentIds.has(log.employeeId)) {
            presentIds.add(log.employeeId);
            present++;
            if (logDate.getHours() >= 9 && logDate.getMinutes() > 0) { // Assuming 9:00 AM is the cutoff for late arrival
              late++;
            }
          }
        });
        
        const absent = Math.max(0, total - present);
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;
        
        setStats({ total, present, absent, late, rate });
      }
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Active staff members</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <UserCheck className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.present}</div>
          <p className="text-xs text-muted-foreground">{stats.rate}% attendance rate</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          <UserX className="w-4 h-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.absent}</div>
          <p className="text-xs text-muted-foreground">0 on planned leave</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
          <Clock className="w-4 h-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.late}</div>
          <p className="text-xs text-muted-foreground">Arrived after 9:00 AM</p>
        </CardContent>
      </Card>
    </div>
  )
}
