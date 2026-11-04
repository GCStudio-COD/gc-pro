"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { useAuthStore } from "@/store/use-auth-store"
import { usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, ShieldCheck, UserCheck } from "lucide-react"

export function LeaveApplicationWidget() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [type, setType] = useState("Paid")
  const [isHalfDay, setIsHalfDay] = useState(false)
  const [halfDayPeriod, setHalfDayPeriod] = useState("First Half")

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const { userId } = useAuthStore()

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString()
  }

  useEffect(() => {
    fetchLeaves()
  }, [effectiveRole, userId])

  const fetchLeaves = async () => {
    if (!userId) return;
    try {
      const res = await fetchApi(`/leaves?employeeId=${userId}`, {}, effectiveRole)
      if (res.ok) {
        const data = await res.json()
        setLeaves(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return;
    try {
      const res = await fetchApi('/leaves', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: userId,
          startDate: new Date(startDate).toISOString(),
          endDate: isHalfDay ? new Date(startDate).toISOString() : new Date(endDate).toISOString(),
          reason,
          type,
          isHalfDay,
          halfDayPeriod: isHalfDay ? halfDayPeriod : null
        })
      }, effectiveRole)
      
      if (!res.ok) {
        let errMessage = "Failed to submit leave request."
        try {
          const data = await res.json()
          if (data && data.error) errMessage = data.error
        } catch {}
        alert(errMessage)
        return
      }
      
      setStartDate("")
      setEndDate("")
      setReason("")
      setIsHalfDay(false)
      setHalfDayPeriod("First Half")
      fetchLeaves()
    } catch (e) {
      console.error(e)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to request cancellation for this leave?")) return;
    try {
      await fetchApi(`/leaves/${id}/cancel`, { method: 'PUT' }, effectiveRole)
      fetchLeaves()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Time Off</CardTitle>
          <CardDescription>Submit a new leave request for approval.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Duration Type: Full Day vs Half Day */}
            <div className="space-y-2">
              <Label>Leave Duration</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={!isHalfDay ? "default" : "outline"}
                  onClick={() => setIsHalfDay(false)}
                  className="w-full"
                >
                  Full Day
                </Button>
                <Button
                  type="button"
                  variant={isHalfDay ? "default" : "outline"}
                  onClick={() => setIsHalfDay(true)}
                  className="w-full"
                >
                  Half Day (0.5 day)
                </Button>
              </div>
            </div>

            {isHalfDay ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Half Day Period</Label>
                  <Select value={halfDayPeriod} onValueChange={setHalfDayPeriod} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First Half">First Half (Morning)</SelectItem>
                      <SelectItem value="Second Half">Second Half (Afternoon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                </div>
              </div>
            )}

            {isHalfDay && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/40 p-2 rounded-md">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Half-day leave deducts 0.5 days from your monthly leave balance.
              </p>
            )}

            <div className="space-y-2">
              <Label>Reason</Label>
              <Input placeholder="E.g. Vacation, Sick leave, Personal appointment" value={reason} onChange={e => setReason(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid Time Off (Monthly 1)</SelectItem>
                  <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                  <SelectItem value="Work From Home">Work From Home (Monthly 4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Leave History</CardTitle>
          <CardDescription>Track the status of your past requests and manager feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          {!Array.isArray(leaves) || leaves.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leave history found.</p>
          ) : (
            <div className="space-y-4">
              {leaves.map((leave, i) => (
                <div key={leave.id || i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{leave.type || 'Leave'}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{leave.reason || 'No reason'}</span>
                        {leave.isHalfDay ? (
                          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300">
                            Half Day ({leave.halfDayPeriod || 'First Half'})
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Full Day</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {leave.isHalfDay 
                          ? formatDate(leave.startDate)
                          : `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={leave.status === 'Approved' ? 'default' : leave.status === 'Rejected' || leave.status === 'Cancelled' ? 'destructive' : leave.status === 'CancelPending' ? 'outline' : 'secondary'}>
                        {leave.status === 'CancelPending' ? 'Cancellation Pending' : (leave.status || 'Pending')}
                      </Badge>
                      {(leave.status === 'Pending' || leave.status === 'Approved') && (
                        <Button variant="outline" size="sm" onClick={() => handleCancel(leave.id)}>Cancel</Button>
                      )}
                    </div>
                  </div>

                  {/* Comments from Admin and Project Manager */}
                  {(leave.adminComment || leave.pmComment) && (
                    <div className="pt-2 border-t space-y-2">
                      {leave.adminComment && (
                        <div className="text-xs bg-muted/60 dark:bg-muted/30 rounded p-2.5 text-muted-foreground flex flex-col gap-0.5 border">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Admin Comment
                          </span>
                          <span className="text-foreground/90">{leave.adminComment}</span>
                        </div>
                      )}
                      {leave.pmComment && (
                        <div className="text-xs bg-muted/60 dark:bg-muted/30 rounded p-2.5 text-muted-foreground flex flex-col gap-0.5 border">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5 text-blue-500" /> Project Manager Comment
                          </span>
                          <span className="text-foreground/90">{leave.pmComment}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

