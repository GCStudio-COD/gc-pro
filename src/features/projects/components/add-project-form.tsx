"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"

import { projectSchema, ProjectFormValues } from "@/schemas/project"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
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

export function AddProjectForm({ initialData }: { initialData?: Partial<ProjectFormValues> & { id?: string } } = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const { role } = useRoleStore()
  
  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
      priority: initialData?.priority || "Medium",
      status: initialData?.status || "Planning",
      clientName: initialData?.clientName || "",
      githubUrl: initialData?.githubUrl || "",
      liveUrl: initialData?.liveUrl || "",
    },
  })

  async function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true)
    
    try {
      const payload = {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        priority: data.priority,
        status: data.status,
        clientName: data.clientName,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl
      }

      let res;
      if (initialData?.id) {
        res = await fetchApi(`/projects/${initialData.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        }, effectiveRole)
      } else {
        res = await fetchApi('/projects', {
          method: 'POST',
          body: JSON.stringify(payload)
        }, effectiveRole)
      }

      if (res.ok) {
        toast.success("Project saved successfully!", {
          description: initialData ? `${data.name} has been updated.` : `${data.name} has been added.`,
        })
        
        const parentPath = pathname.endsWith('/new') 
          ? pathname.slice(0, -4) 
          : pathname
        router.push(parentPath || "/projects")
      } else {
        toast.error("Failed to save project")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to delete this project? This will permanently delete the project and ALL related tasks and notes. This action cannot be undone.")) return;
    
    setIsSubmitting(true)
    try {
      const res = await fetchApi(`/projects/${initialData.id}`, { method: 'DELETE' }, effectiveRole)
      if (res.ok) {
        toast.success("Project deleted successfully")
        router.push(pathname?.includes('/admin') ? '/admin/projects' : '/pm/projects')
      } else {
        toast.error("Failed to delete project")
      }
    } catch (e) {
      console.error(e)
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Project" : "Create New Project"}</CardTitle>
        <CardDescription>
          {initialData ? "Update project details and assignments." : "Fill out the details to initialize a new project workspace."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Website Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Corp" {...field} />
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
                      placeholder="Briefly describe the goals and scope of this project..." 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Repository</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t">
              <div>
                {initialData?.id && (effectiveRole === 'admin' || effectiveRole === 'project-manager') && (
                  <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                    Delete Project
                  </Button>
                )}
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? "Updating Project..." : "Creating Project..."}
                  </>
                ) : (
                  initialData ? "Update Project" : "Create Project"
                )}
              </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
