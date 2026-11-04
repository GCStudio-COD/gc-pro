"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, MessageSquare, ShieldCheck, UserCheck, Calendar as CalendarIcon, Clock } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function LeaveApprovalsWidget() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    leave: any | null
    actionStatus: string | null
    comment: string
  }>({
    isOpen: false,
    leave: null,
    actionStatus: null,
    comment: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString()
  }

  useEffect(() => {
    fetchLeaves()
  }, [effectiveRole])

  const fetchLeaves = async () => {
    try {
      const res = await fetchApi('/leaves', {}, effectiveRole)
      if (res.ok) {
        const data = await res.json()
        setLeaves(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openActionModal = (leave: any, actionStatus: string) => {
    const currentComment = effectiveRole === 'admin' 
      ? (leave.adminComment || '') 
      : (leave.pmComment || '')

    setReviewModal({
      isOpen: true,
      leave,
      actionStatus,
      comment: currentComment
    })
  }

  const openCommentModal = (leave: any) => {
    const currentComment = effectiveRole === 'admin' 
      ? (leave.adminComment || '') 
      : (leave.pmComment || '')

    setReviewModal({
      isOpen: true,
      leave,
      actionStatus: null,
      comment: currentComment
    })
  }

  const handleModalSubmit = async () => {
    if (!reviewModal.leave) return
    setIsSubmitting(true)
    try {
      const payload: any = {}
      if (reviewModal.actionStatus) {
        payload.status = reviewModal.actionStatus
      }
      const commentText = (reviewModal.comment || "").trim()
      // Send both generic comment and role-specific field so backend handles any role casing
      payload.comment = commentText
      if (effectiveRole === 'admin') {
        payload.adminComment = commentText
      } else {
        payload.pmComment = commentText
      }

      const res = await fetchApi(`/leaves/${reviewModal.leave.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }, effectiveRole)

      if (res.ok) {
        const updated = await res.json()
        // Immediately update state so comment appears right away
        setLeaves(prev => prev.map(item => item.id === updated.id ? { ...item, ...updated } : item))
        setReviewModal({ isOpen: false, leave: null, actionStatus: null, comment: "" })
        fetchLeaves()
      } else {
        let msg = "Failed to update leave request."
        try {
          const data = await res.json()
          if (data && data.error) msg = data.error
        } catch {}
        alert(msg)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Team Leave Approvals</CardTitle>
          <CardDescription>Review and manage full-day and half-day time-off requests with manager comments.</CardDescription>
        </CardHeader>
        <CardContent>
          {!Array.isArray(leaves) || leaves.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leave requests found.</p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Details</TableHead>
                    <TableHead>Duration / Dates</TableHead>
                    <TableHead>Comments & Remarks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">
                        {leave.employee ? `${leave.employee.firstName || ''} ${leave.employee.lastName || ''}`.trim() || 'Unknown Employee' : 'Unknown Employee'}
                        {leave.employee?.email && (
                          <div className="text-xs text-muted-foreground">{leave.employee.email}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{leave.type || 'Leave'}</div>
                        <div className="text-xs text-muted-foreground max-w-[200px] truncate" title={leave.reason}>
                          {leave.reason || 'No reason'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          {leave.isHalfDay ? (
                            <span>{formatDate(leave.startDate)}</span>
                          ) : (
                            <span>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span>
                          )}
                        </div>
                        <div className="mt-1">
                          {leave.isHalfDay ? (
                            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300">
                              <Clock className="h-3 w-3 mr-1" /> Half Day ({leave.halfDayPeriod || 'First Half'})
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Full Day
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[240px]">
                        <div className="space-y-1">
                          {leave.adminComment && (
                            <div className="text-xs bg-muted/60 dark:bg-muted/30 p-1.5 rounded border">
                              <span className="font-medium text-foreground flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3 text-primary" /> Admin:
                              </span>
                              <span className="text-foreground/90">{leave.adminComment}</span>
                            </div>
                          )}
                          {leave.pmComment && (
                            <div className="text-xs bg-muted/60 dark:bg-muted/30 p-1.5 rounded border">
                              <span className="font-medium text-foreground flex items-center gap-1">
                                <UserCheck className="h-3 w-3 text-blue-500" /> PM:
                              </span>
                              <span className="text-foreground/90">{leave.pmComment}</span>
                            </div>
                          )}
                          {!leave.adminComment && !leave.pmComment && (
                            <span className="text-xs text-muted-foreground italic">No comments yet</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={leave.status === 'Approved' ? 'default' : leave.status === 'Rejected' || leave.status === 'Cancelled' ? 'destructive' : leave.status === 'CancelPending' ? 'outline' : 'secondary'}>
                          {leave.status === 'CancelPending' ? 'Cancellation Pending' : (leave.status || 'Pending')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          {/* Add / Edit Comment Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs"
                            onClick={() => openCommentModal(leave)}
                            title="Add / Edit Comment"
                          >
                            <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                            Comment
                          </Button>

                          {leave.status === 'Pending' && (
                            <>
                              <Button size="sm" variant="outline" className="h-8 px-2 text-xs text-green-600 hover:text-green-700" onClick={() => openActionModal(leave, 'Approved')}>
                                <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 px-2 text-xs text-red-600 hover:text-red-700" onClick={() => openActionModal(leave, 'Rejected')}>
                                <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                Reject
                              </Button>
                            </>
                          )}
                          {leave.status === 'CancelPending' && (
                            <>
                              <Button size="sm" variant="outline" className="h-8 px-2 text-xs text-green-600" onClick={() => openActionModal(leave, 'Cancelled')}>
                                <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                Approve Cancel
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 px-2 text-xs text-red-600" onClick={() => openActionModal(leave, 'Approved')}>
                                <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                Keep Approved
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review / Comment Dialog */}
      <Dialog open={reviewModal.isOpen} onOpenChange={(open) => !open && setReviewModal(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {reviewModal.actionStatus === 'Approved' && "Approve Leave Request"}
              {reviewModal.actionStatus === 'Rejected' && "Reject Leave Request"}
              {reviewModal.actionStatus === 'Cancelled' && "Approve Leave Cancellation"}
              {!reviewModal.actionStatus && "Leave Comment & Remarks"}
            </DialogTitle>
            <DialogDescription>
              {reviewModal.actionStatus 
                ? `Update leave request status to "${reviewModal.actionStatus}" and optionally add a remark.`
                : "Add or update your feedback and notes for this leave request."}
            </DialogDescription>
          </DialogHeader>

          {reviewModal.leave && (
            <div className="space-y-4 py-2">
              <div className="bg-muted/40 p-3 rounded-lg text-sm space-y-1.5 border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee:</span>
                  <span className="font-medium">
                    {reviewModal.leave.employee 
                      ? `${reviewModal.leave.employee.firstName || ''} ${reviewModal.leave.employee.lastName || ''}`.trim() 
                      : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{reviewModal.leave.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {reviewModal.leave.isHalfDay 
                      ? `Half Day (${reviewModal.leave.halfDayPeriod || 'First Half'})` 
                      : 'Full Day'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {reviewModal.leave.isHalfDay 
                      ? formatDate(reviewModal.leave.startDate) 
                      : `${formatDate(reviewModal.leave.startDate)} - ${formatDate(reviewModal.leave.endDate)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span className="font-medium">{reviewModal.leave.reason}</span>
                </div>
              </div>

              {/* Display existing comments from other reviewer if present */}
              {effectiveRole === 'admin' && reviewModal.leave.pmComment && (
                <div className="text-xs bg-muted/60 p-2.5 rounded border">
                  <span className="font-semibold flex items-center gap-1 text-foreground">
                    <UserCheck className="h-3.5 w-3.5 text-blue-500" /> Project Manager Comment:
                  </span>
                  <span className="text-foreground/90">{reviewModal.leave.pmComment}</span>
                </div>
              )}
              {effectiveRole === 'project-manager' && reviewModal.leave.adminComment && (
                <div className="text-xs bg-muted/60 p-2.5 rounded border">
                  <span className="font-semibold flex items-center gap-1 text-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Admin Comment:
                  </span>
                  <span className="text-foreground/90">{reviewModal.leave.adminComment}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="leave-comment">
                  {effectiveRole === 'admin' ? "Admin Comment / Notes" : "Project Manager Comment / Notes"}
                </Label>
                <Textarea
                  id="leave-comment"
                  placeholder="Enter remarks (e.g. Approved, task handover confirmed, or reason for rejection)..."
                  value={reviewModal.comment}
                  onChange={(e) => setReviewModal(prev => ({ ...prev, comment: e.target.value }))}
                  className="min-h-[90px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReviewModal(prev => ({ ...prev, isOpen: false }))}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={reviewModal.actionStatus === 'Rejected' ? 'destructive' : 'default'}
              onClick={handleModalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (
                reviewModal.actionStatus === 'Approved' ? "Confirm Approval" :
                reviewModal.actionStatus === 'Rejected' ? "Confirm Rejection" :
                reviewModal.actionStatus === 'Cancelled' ? "Confirm Cancellation" :
                "Save Comment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
