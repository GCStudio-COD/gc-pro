"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Square } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function CheckInWidget() {
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0)
  const [activeLogId, setActiveLogId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApi('/attendance/status', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        setAccumulatedSeconds(data.accumulatedShiftSeconds || 0)
        if (data.activeAttendanceLogId && data.checkInTime) {
          setIsCheckedIn(true)
          setActiveLogId(data.activeAttendanceLogId)
          const startTime = new Date(data.checkInTime)
          setCheckInTime(startTime)
          setElapsedSeconds(Math.floor((Date.now() - startTime.getTime()) / 1000))
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [effectiveRole])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - checkInTime.getTime()) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCheckedIn, checkInTime])

  const handleCheckIn = async () => {
    try {
      setIsLoading(true)
      const res = await fetchApi('/attendance/check-in', { method: 'POST' }, effectiveRole)
      const data = await res.json()
      
      setActiveLogId(data.attendanceLogId)
      setIsCheckedIn(true)
      setCheckInTime(new Date())
      setElapsedSeconds(0)
      window.dispatchEvent(new Event('attendanceUpdated'))
    } catch (error) {
      console.error("Failed to check in", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!activeLogId) return
    
    try {
      setIsLoading(true)
      await fetchApi('/attendance/check-out', { 
        method: 'POST',
        body: JSON.stringify({ attendanceLogId: activeLogId })
      }, effectiveRole)
      
      setAccumulatedSeconds(prev => prev + elapsedSeconds)
      setIsCheckedIn(false)
      setActiveLogId(null)
      setCheckInTime(null)
      setElapsedSeconds(0)
      window.dispatchEvent(new Event('attendanceUpdated'))
    } catch (error) {
      console.error("Failed to check out", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading && !isCheckedIn && accumulatedSeconds === 0) {
    return <div className="h-9 w-24 bg-muted animate-pulse rounded-md"></div>
  }

  return (
    <div className="flex items-center gap-3">
      {(isCheckedIn || accumulatedSeconds > 0) && (
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className={cn("text-sm font-mono tracking-tight", isCheckedIn ? "text-emerald-500 font-semibold" : "text-muted-foreground")}>
            {formatTime(isCheckedIn ? elapsedSeconds + accumulatedSeconds : accumulatedSeconds)}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {isCheckedIn ? "Active Shift" : "Total Today"}
          </span>
        </div>
      )}
      
      {isCheckedIn ? (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleCheckOut}
          disabled={isLoading}
          className="h-9"
        >
          <Square className="w-4 h-4 mr-2" />
          Check Out
        </Button>
      ) : (
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleCheckIn}
          disabled={isLoading}
          className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Check In
        </Button>
      )}
    </div>
  )
}
