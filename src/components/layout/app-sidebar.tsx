"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  Settings, 
  Users, 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  KanbanSquare,
  CalendarDays,
  Clock,
  BarChart3,
  ShieldAlert,
  UserCircle,
  User,
  Hexagon,
  Building
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRoleStore } from "@/store/use-role-store"

const adminItems = [
  { title: "Admin Dashboard", url: "/admin/dashboard", icon: ShieldAlert },
  { title: "Departments", url: "/admin/departments", icon: Building },
  { title: "All Employees", url: "/admin/employees", icon: Users },
  { title: "All Projects", url: "/admin/projects", icon: Briefcase },
  { title: "Attendance Overview", url: "/admin/attendance", icon: CalendarDays },
  { title: "Company Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Company Leaves", url: "/admin/leaves", icon: Clock },
]

const pmItems = [
  { title: "PM Dashboard", url: "/pm/dashboard", icon: LayoutDashboard },
  { title: "Departments", url: "/pm/departments", icon: Building },
  { title: "All Employees", url: "/pm/employees", icon: Users },
  { title: "All Projects", url: "/pm/projects", icon: Briefcase },
  { title: "Attendance Overview", url: "/pm/attendance", icon: CalendarDays },
  { title: "My Tasks", url: "/pm/my-tasks", icon: CheckSquare },
  { title: "Leave Requests", url: "/pm/leaves", icon: Clock },
  { title: "Company Reports", url: "/pm/reports", icon: BarChart3 },
]

const employeeItems = [
  { title: "My Dashboard", url: "/employee/dashboard", icon: UserCircle },
  { title: "My Projects", url: "/employee/projects", icon: Briefcase },
  { title: "My Tasks", url: "/employee/tasks", icon: CheckSquare },
  { title: "My Attendance", url: "/employee/attendance", icon: CalendarDays },
  { title: "My Leaves", url: "/employee/leaves", icon: Clock },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { role } = useRoleStore()

  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const activeItems = effectiveRole === 'admin' ? adminItems : effectiveRole === 'project-manager' ? pmItems : employeeItems

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/40 p-0">
        <div className="flex items-center justify-center w-full h-full group-data-[collapsible=none]:px-4 group-data-[collapsible=none]:justify-start gap-3">
          <div className="flex h-8 w-8 group-data-[collapsible=none]:h-10 group-data-[collapsible=none]:w-10 items-center justify-center rounded-lg group-data-[collapsible=none]:rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0 transition-all duration-200">
            <Hexagon className="h-5 w-5 group-data-[collapsible=none]:h-6 group-data-[collapsible=none]:w-6 fill-current transition-all duration-200" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground group-data-[collapsible=icon]:hidden whitespace-nowrap">
            Nexus<span className="text-primary opacity-80">SaaS</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4 overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2 group-data-[collapsible=icon]:hidden">
            {effectiveRole.replace('-', ' ')} Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url || (item.url !== '/' && pathname?.startsWith(item.url))}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
