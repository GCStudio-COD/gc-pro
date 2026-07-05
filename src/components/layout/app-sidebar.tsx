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
    <Sidebar collapsible="none" className="bg-[#2A2A2A] border-none text-white h-screen">
      <SidebarHeader className="h-20 flex items-center justify-center p-0">
        <div className="flex items-center justify-center w-full h-full gap-3 mt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0">
            <Hexagon className="h-6 w-6 fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap">
            Nexus<span className="text-primary opacity-80">SaaS</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4 overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2 group-data-[collapsible=icon]:hidden">
            {effectiveRole.replace('-', ' ')} Portal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="gap-2">
              {activeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title} 
                    isActive={pathname === item.url || (item.url !== '/' && pathname?.startsWith(item.url))}
                    className="rounded-none py-6 h-14 hover:bg-transparent hover:text-white data-[active=true]:!bg-[#E5E5E5] data-[active=true]:!text-black text-white transition-none"
                  >
                    <Link href={item.url} className="flex items-center gap-4 px-6 font-bold tracking-widest text-[12px] uppercase">
                      <item.icon className="h-5 w-5" strokeWidth={2.5} />
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
