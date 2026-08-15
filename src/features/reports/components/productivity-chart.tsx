"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

interface EmployeeStat {
  id: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
  onTime: number;
  overdue: number;
  attendanceDays: number;
  activeProjects: number;
  score: number;
}

export function ProductivityChart() {
  const [data, setData] = useState<EmployeeStat[]>([])
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    Promise.all([
      fetchApi('/plaky/tasks', {}, effectiveRole).then(res => res.json()),
      fetchApi('/attendance', {}, effectiveRole).then(res => res.json()),
      fetchApi('/employees', {}, effectiveRole).then(res => res.json()),
      fetchApi('/plaky/boards', {}, effectiveRole).then(res => res.json())
    ]).then(([tasks, attendance, employees, boards]) => {
      if (Array.isArray(tasks) && Array.isArray(attendance) && Array.isArray(employees)) {
        
        const stats: EmployeeStat[] = employees.map(emp => {
          const empTasks = tasks.filter(t => t.assigneeId === emp.id || t.assignees?.includes(emp.id));
          const totalTasks = empTasks.length;
          
          let completedTasks = 0;
          let onTime = 0;
          let overdue = 0;
          
          empTasks.forEach(t => {
            const isCompleted = t.status === "Done" || t.status === "Completed";
            if (isCompleted) {
              completedTasks++;
            }
            
            if (t.dueDate) {
              const due = new Date(t.dueDate);
              const completedAt = t.updatedAt ? new Date(t.updatedAt) : new Date();
              
              if (isCompleted && completedAt <= due) {
                onTime++;
              } else if ((isCompleted && completedAt > due) || (!isCompleted && new Date() > due)) {
                overdue++;
              }
            } else if (isCompleted) {
              // If no due date, count it as on time if completed
              onTime++;
            }
          });
          
          // Calculate unique attendance days
          const uniqueDays = new Set();
          attendance.forEach(a => {
            if (a.employeeId === emp.id) {
              const dateStr = new Date(a.date || a.checkInTime).toDateString();
              uniqueDays.add(dateStr);
            }
          });
          const attendanceDays = uniqueDays.size;
          
          // Simple productivity score formula (0-100) based on task completion & on-time delivery
          let score = 0;
          if (totalTasks > 0) {
            const completionRate = completedTasks / totalTasks;
            const onTimeRate = completedTasks > 0 ? (onTime / completedTasks) : 0;
            score = Math.round((completionRate * 0.6 + onTimeRate * 0.4) * 100);
          } else {
            // If no tasks, productivity depends entirely on attendance (e.g., 1 day = 100% just for demo, usually it'd be expected days)
            score = attendanceDays > 0 ? 100 : 0;
          }
          
          // Calculate active projects based on boards
          const activeProjectsSet = new Set();
          if (Array.isArray(boards)) {
            boards.forEach((board: any) => {
              board.groups?.forEach((group: any) => {
                group.tasks?.forEach((task: any) => {
                  if ((task.assigneeId === emp.id || task.assignees?.includes(emp.id)) && task.status !== "Done" && task.status !== "Completed") {
                    activeProjectsSet.add(board.id);
                  }
                });
              });
            });
          }

          return {
            id: emp.id,
            name: emp.firstName + " " + (emp.lastName || ""),
            totalTasks,
            completedTasks,
            onTime,
            overdue,
            attendanceDays,
            activeProjects: activeProjectsSet.size,
            score
          };
        });
        
        // Sort by score descending
        stats.sort((a, b) => b.score - a.score);
        setData(stats);
      }
    }).catch(console.error)
  }, [effectiveRole])

  return (
    <Card className="flex flex-col h-full col-span-full">
      <CardHeader>
        <CardTitle>Employee Productivity Report</CardTitle>
        <CardDescription>Comprehensive overview of task completion, timeliness, and attendance.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead className="text-right">Total Tasks</TableHead>
                <TableHead className="text-right">Active Projects</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">On Time</TableHead>
                <TableHead className="text-right">Overdue</TableHead>
                <TableHead className="text-right">Days Attended</TableHead>
                <TableHead className="text-right">Productivity Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No productivity data found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell className="text-right">{emp.totalTasks}</TableCell>
                    <TableCell className="text-right">{emp.activeProjects}</TableCell>
                    <TableCell className="text-right text-emerald-500">{emp.completedTasks}</TableCell>
                    <TableCell className="text-right">{emp.onTime}</TableCell>
                    <TableCell className="text-right text-rose-500">{emp.overdue}</TableCell>
                    <TableCell className="text-right">{emp.attendanceDays}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={emp.score >= 80 ? "default" : emp.score >= 50 ? "secondary" : "destructive"}>
                        {emp.score}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
