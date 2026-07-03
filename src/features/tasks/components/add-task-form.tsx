"use client"

import { useState, useEffect, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

import { taskSchema, TaskFormValues } from "@/schemas/task"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"

export interface AddTaskFormProps {
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

function AddTaskFormContent({ projectId, onSuccess, onCancel, isModal }: AddTaskFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectIdFromUrl = projectId || searchParams.get('projectId') || ""
  const { role } = useRoleStore()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      project: projectIdFromUrl,
      assignee: "",
      dueDate: "",
      priority: "Medium",
      status: "To Do",
    },
  })

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [projectsRes, employeesRes] = await Promise.all([
          fetchApi("/projects", {}, role),
          fetchApi("/employees", {}, role)
        ])
        
        if (projectsRes.ok) {
          setProjects(await projectsRes.json())
        }
        if (employeesRes.ok) {
          setEmployees(await employeesRes.json())
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to load options")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [role])

  async function onSubmit(data: TaskFormValues) {
    setIsSubmitting(true)
    
    try {
      const payload = {
        title: data.title,
        description: data.description,
        projectId: data.project,
        assigneeId: data.assignee,
        dueDate: new Date(data.dueDate).toISOString(),
        priority: data.priority,
        status: data.status,
      }

      const res = await fetchApi("/tasks", {
        method: "POST",
        body: JSON.stringify(payload)
      }, role)

      if (res.ok) {
        toast.success("Task created successfully!")
        if (onSuccess) {
          onSuccess()
        } else {
          router.back()
        }
      } else {
        toast.error("Failed to create task")
      }
    } catch (e) {
      console.error(e)
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const formContent = (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Implement Login Flow" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed requirements for this ticket..." 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={`grid grid-cols-1 ${!projectId ? 'md:grid-cols-2' : ''} gap-6`}>
              {!projectId && (
                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Initial status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => {
                if (onCancel) onCancel()
                else router.back()
              }} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
    </Form>
  )

  if (isModal) {
    return <div className="py-4">{formContent}</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
        <CardDescription>Assign a new ticket to a project and team member.</CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  )
}

export function AddTaskForm(props: AddTaskFormProps) {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <AddTaskFormContent {...props} />
    </Suspense>
  )
}
