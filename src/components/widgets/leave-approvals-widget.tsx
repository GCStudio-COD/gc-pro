"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function LeaveApprovalsWidget() {
  const [leaves, setLeaves] = useState<any[]>([])

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchLeaves()
  }, [effectiveRole])

  const fetchLeaves = async () => {
    try {
      const res = await fetchApi('/leaves', {}, effectiveRole)
      if (res.ok) {
        setLeaves(await res.json())
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetchApi(`/leaves/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      }, effectiveRole)
      if (res.ok) {
        fetchLeaves()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Leave Approvals</CardTitle>
        <CardDescription>Review and manage time-off requests from employees.</CardDescription>
      </CardHeader>
      <CardContent>
        {leaves.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leave requests found.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">
                      {leave.employee ? `${leave.employee.firstName} ${leave.employee.lastName}` : 'Unknown Employee'}
                    </TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={leave.status === 'Approved' ? 'default' : leave.status === 'Rejected' ? 'destructive' : 'secondary'}>
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {leave.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(leave.id, 'Approved')}>
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(leave.id, 'Rejected')}>
                            <XCircle className="h-4 w-4 mr-1 text-red-500" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
