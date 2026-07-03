"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Clock, Trash2, Calendar } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRoleStore } from "@/store/use-role-store"
import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddTaskForm } from "@/features/tasks/components/add-task-form"

function TaskTimeDisplay({ taskId }: { taskId: string }) {
  const [timeStr, setTimeStr] = useState("0h 0m 0s");
  const { role } = useRoleStore();

  useEffect(() => {
    fetchApi(`/time-logs/task/${taskId}`, {}, role)
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(data => {
        // Assume backend returns array of logs
        const total = data.reduce((acc: number, log: any) => acc + (log.durationSeconds || 0), 0);
        const hours = Math.floor(total / 3600);
        const mins = Math.floor((total % 3600) / 60);
        const secs = total % 60;
        setTimeStr(`${hours}h ${mins}m ${secs}s`);
      })
      .catch(() => setTimeStr("Error"));
  }, [taskId, role]);

  return (
    <div className="flex items-center text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md ml-2">
      <Clock className="w-3 h-3 mr-1" />
      {timeStr}
    </div>
  );
}

export function ProjectTasks({ project, onTaskUpdate }: { project: any, onTaskUpdate: () => void }) {
  const pathname = usePathname()
  const { role } = useRoleStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const tasks = project.tasks || []

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      const res = await fetchApi(`/tasks/${taskId}`, { method: 'DELETE' }, effectiveRole)
      if (res.ok) {
        toast.success("Task deleted successfully")
        onTaskUpdate()
      } else {
        toast.error("Failed to delete task")
      }
    } catch (error) {
      toast.error("Error deleting task")
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Project Tasks</CardTitle>
          <CardDescription>To-do list for this project.</CardDescription>
        </div>
        {effectiveRole !== 'employee' && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border-border/50">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <AddTaskForm 
                projectId={project.id} 
                isModal={true}
                onSuccess={() => {
                  setIsModalOpen(false)
                  onTaskUpdate()
                }}
                onCancel={() => setIsModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length > 0 ? tasks.map((task: any) => {
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
              <div key={task.id} className="flex items-center justify-between rounded-lg border p-4 group">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium leading-none ${task.status === "Done" || task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </span>
                    <TaskTimeDisplay taskId={task.id} />
                  </div>
                  <div className="flex gap-2 pt-1 items-center">
                    <Badge variant={task.priority === "Critical" ? "destructive" : task.priority === "High" ? "default" : "secondary"} className="text-[10px]">
                      {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  {task.assignee && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{task.assignee.firstName} {task.assignee.lastName}</span>
                    </div>
                  )}
                  <Badge 
                    variant={displayStatus === "Done" || displayStatus === "Completed" ? "default" : "outline"}
                    className={`text-xs ${
                      displayStatus === "Done" || displayStatus === "Completed"
                        ? "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white"
                        : displayStatus === "In Progress"
                          ? "text-orange-600 border-orange-500 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30"
                          : displayStatus === "Delayed"
                            ? "text-destructive border-destructive bg-destructive/10"
                            : ""
                    }`}
                  >
                    {displayStatus}
                  </Badge>
                  {effectiveRole !== 'employee' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )
          }) : (
            <div className="text-sm text-muted-foreground">No tasks for this project.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
