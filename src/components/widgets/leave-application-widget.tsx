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

export function LeaveApplicationWidget() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const { userId } = useAuthStore()

  useEffect(() => {
    fetchLeaves()
  }, [effectiveRole, userId])

  const fetchLeaves = async () => {
    if (!userId) return;
    try {
      const res = await fetchApi(`/leaves?employeeId=${userId}`, {}, effectiveRole)
      if (res.ok) {
        setLeaves(await res.json())
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return;
    try {
      await fetchApi('/leaves', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: userId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          reason
        })
      }, effectiveRole)
      setStartDate("")
      setEndDate("")
      setReason("")
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
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input placeholder="E.g. Vacation, Sick leave" value={reason} onChange={e => setReason(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Leave History</CardTitle>
          <CardDescription>Track the status of your past requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leave history found.</p>
          ) : (
            <div className="space-y-4">
              {leaves.map((leave, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{leave.reason}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={leave.status === 'Approved' ? 'default' : leave.status === 'Rejected' ? 'destructive' : 'secondary'}>
                    {leave.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
