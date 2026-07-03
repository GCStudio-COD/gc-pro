"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeHeader } from "./employee-header"
import { EmployeeProjects } from "./employee-projects"
import { EmployeeTasks } from "./employee-tasks"
import { EmployeeAttendance } from "./employee-attendance"
import { EmployeeDocuments } from "./employee-documents"
import { EmployeeTimeline } from "./employee-timeline"

export function EmployeeDetailsFeature() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Sticky Top Header Section (Basic Info + Department) */}
      <EmployeeHeader />

      {/* Tabbed Interface for Complex Data Sections */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto py-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <EmployeeProjects />
        </TabsContent>
        
        <TabsContent value="tasks">
          <EmployeeTasks />
        </TabsContent>
        
        <TabsContent value="attendance">
          <EmployeeAttendance />
        </TabsContent>
        
        <TabsContent value="documents">
          <EmployeeDocuments />
        </TabsContent>
        
        <TabsContent value="timeline">
          <EmployeeTimeline />
        </TabsContent>
      </Tabs>
    </div>
  )
}
