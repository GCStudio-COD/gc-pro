"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "./project-header"
import { ProjectTeam } from "./project-team"
import { ProjectTasks } from "./project-tasks"
import { ProjectFiles } from "./project-files"
import { ProjectTimeline } from "./project-timeline"
import { usePathname } from "next/navigation"
import { useRoleStore } from "@/store/use-role-store"
import { fetchApi } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { AddProjectForm } from "../add-project-form"

export function ProjectDetailsFeature() {
  const pathname = usePathname()
  const { role } = useRoleStore()
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const projectId = pathname.split('/').pop()

  useEffect(() => {
    if (projectId && projectId !== 'new') {
      fetchProject()
    }
  }, [projectId, effectiveRole])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const res = await fetchApi(`/projects/${projectId}`, {}, effectiveRole)
      if (res.ok) {
        setProject(await res.json())
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center w-full"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">Project not found</div>
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Sticky Top Header Section (Overview + Progress) */}
      <ProjectHeader project={project} />

      {/* Tabbed Interface for Complex Data Sections */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto py-2">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          {effectiveRole !== 'employee' && (
            <TabsTrigger value="edit">Settings</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="tasks">
          <ProjectTasks project={project} onTaskUpdate={fetchProject} />
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeam project={project} />
        </TabsContent>
        
        <TabsContent value="files">
          <ProjectFiles project={project} onUpdate={fetchProject} effectiveRole={effectiveRole} />
        </TabsContent>
        
        <TabsContent value="timeline">
          <ProjectTimeline project={project} />
        </TabsContent>
        
        {effectiveRole !== 'employee' && (
          <TabsContent value="edit">
            <div className="max-w-3xl mx-auto">
              <AddProjectForm initialData={project} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
