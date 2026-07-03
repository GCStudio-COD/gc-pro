"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Square, History, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

interface TimeEntry {
  id: string
  taskName: string
  duration: number // in seconds
  date: string
}

export function TimeTrackingFeature() {
  const [history, setHistory] = useState<TimeEntry[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState("")
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  // Timer State
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [activeLogId, setActiveLogId] = useState<string | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchApi('/time-logs', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data.map(log => ({
            id: log.id,
            taskName: log.task?.title || 'Unknown Task',
            duration: log.durationSeconds || 0,
            date: new Date(log.startTime).toISOString().split("T")[0]
          })))
        }
      })
      .catch(console.error)

    fetchApi('/tasks', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data)
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])

  const handleStart = async () => {
    if (!selectedTaskId) {
      alert("Please select a task before starting the timer.")
      return
    }
    try {
      const res = await fetchApi('/time-logs/start', {
        method: 'POST',
        body: JSON.stringify({ taskId: selectedTaskId })
      }, effectiveRole)
      const data = await res.json()
      if (data.timeLogId) {
        setActiveLogId(data.timeLogId)
        setIsRunning(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleStop = async () => {
    if (!activeLogId) return
    setIsRunning(false)
    
    try {
      const res = await fetchApi('/time-logs/stop', {
        method: 'POST',
        body: JSON.stringify({ timeLogId: activeLogId })
      }, effectiveRole)
      
      const updatedLog = await res.json()
      
      if (updatedLog.id) {
        const newEntry: TimeEntry = {
          id: updatedLog.id,
          taskName: updatedLog.task?.title || 'Unknown Task',
          duration: updatedLog.durationSeconds || 0,
          date: new Date(updatedLog.startTime).toISOString().split("T")[0]
        }
        setHistory([newEntry, ...history])
      }
    } catch (err) {
      console.error(err)
    }

    setTime(0)
    setActiveLogId(null)
    setSelectedTaskId("")
  }

  const formatTime = (seconds: number) => {
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2)
    const minutes = `${Math.floor(seconds / 60)}`
    const getMinutes = `0${Number(minutes) % 60}`.slice(-2)
    const getSeconds = `0${seconds % 60}`.slice(-2)
    
    return `${getHours}:${getMinutes}:${getSeconds}`
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
        <p className="text-muted-foreground mt-1">Track time spent on tasks and projects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Card */}
        <Card className="lg:col-span-1 shadow-md border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Current Timer
            </CardTitle>
            <CardDescription>Start tracking your active task.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-full">
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                disabled={isRunning}
                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Select a task...</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
            
            <div className="text-6xl font-mono tracking-wider font-semibold py-4 text-primary">
              {formatTime(time)}
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
              {!isRunning ? (
                <Button onClick={handleStart} className="w-full" size="lg">
                  <Play className="mr-2 h-4 w-4" /> Start
                </Button>
              ) : (
                <Button onClick={handleStop} variant="destructive" className="w-full" size="lg">
                  <Square className="mr-2 h-4 w-4" /> Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* History Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Time Entries
            </CardTitle>
            <CardDescription>Your logged history.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length > 0 ? (
                  history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.taskName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{entry.date}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatTime(entry.duration)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No time entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
