"use client"

import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useRoleStore } from "@/store/use-role-store"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export function TaskList() {
  const pathname = usePathname()
  const { role } = useRoleStore()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")

  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [effectiveRole, pathname])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      // Note: for /pm/my-tasks or employee, we might need to filter by current user's ID
      // but without the ID easily accessible in this scope, we will fetch all and rely on 
      // the backend (if we pass an assigneeId) or just show all for now since it's a demo.
      const res = await fetchApi("/tasks", {}, effectiveRole)
      if (res.ok) {
        setTasks(await res.json())
      } else {
        toast.error("Failed to fetch tasks")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const projectName = task.project?.name || ""
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          projectName.toLowerCase().includes(searchTerm.toLowerCase())
                          
    const matchesStatus = filterStatus === "All" || task.status === filterStatus
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track your assigned tickets.</p>
        </div>
        {effectiveRole !== 'employee' && pathname !== '/pm/my-tasks' && (
          <Button asChild>
            <Link href={`/${effectiveRole === 'project-manager' ? 'pm' : effectiveRole}/tasks/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-md border">
        <div className="w-full flex-1">
          <Search 
            placeholder="Search tasks or projects..." 
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
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48 flex-shrink-0">
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task details</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const assigneeName = task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : "Unassigned"
                const avatarUrl = task.assignee?.profileImage || ""

                let displayStatus = task.status;
                if (displayStatus !== "Done" && displayStatus !== "Completed" && task.dueDate) {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const due = new Date(task.dueDate);
                  due.setHours(0, 0, 0, 0);
                  if (due < today) {
                    displayStatus = "Delayed";
                  }
                }

                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={`font-medium text-foreground ${task.status === "Done" || task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                        <span className="text-xs text-muted-foreground">{task.id.substring(0,8)} • {task.project?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={avatarUrl} alt={assigneeName} />
                          <AvatarFallback className="text-[10px]">{assigneeName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assigneeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          displayStatus === "Done" || displayStatus === "Completed"
                            ? "default" 
                            : displayStatus === "In Progress" 
                              ? "outline" 
                              : "outline"
                        }
                        className={
                          displayStatus === "Done" || displayStatus === "Completed"
                            ? "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white"
                            : displayStatus === "In Progress"
                              ? "text-orange-600 border-orange-500 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30"
                              : displayStatus === "Delayed"
                                ? "text-destructive border-destructive bg-destructive/10"
                                : ""
                        }
                      >
                        {displayStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.priority === "Critical" 
                            ? "destructive" 
                            : task.priority === "High" 
                              ? "default" 
                              : "secondary"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
