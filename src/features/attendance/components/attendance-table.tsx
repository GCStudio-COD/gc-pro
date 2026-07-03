"use client"

import { useState, useEffect } from "react"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"
import { Search } from "@/components/ui/search"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"

export function AttendanceTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [attendance, setAttendance] = useState<any[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  const effectiveRole = pathname?.startsWith('/employee') ? 'employee' : role

  useEffect(() => {
    fetchApi('/attendance', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map(log => {
            const formatTime = (d: string | null) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"
            
            return {
              id: log.id,
              empId: log.employee?.id?.substring(0, 8),
              name: `${log.employee?.firstName} ${log.employee?.lastName}`,
              avatar: log.employee?.profileImage || "/avatars/01.png",
              department: log.employee?.department?.name || "Unknown",
              status: log.checkOutTime ? "Completed" : "Present",
              clockIn: formatTime(log.checkInTime),
              clockOut: formatTime(log.checkOutTime)
            }
          })
          setAttendance(mapped)
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.department.toLowerCase().includes(searchTerm.toLowerCase())
                          
    const matchesStatus = filterStatus === "All" || record.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Daily Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-muted/30 p-2 rounded-md border mb-4">
          <div className="w-full flex-1">
            <Search 
              placeholder="Search employee..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48 flex-shrink-0">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={record.avatar} alt={record.name} />
                          <AvatarFallback className="text-[10px]">{record.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{record.name}</span>
                          <span className="text-xs text-muted-foreground">{record.empId} • {record.department}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "Present" 
                            ? "default" 
                            : record.status === "Completed" 
                              ? "secondary" 
                              : "outline"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {record.clockIn}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {record.clockOut}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
