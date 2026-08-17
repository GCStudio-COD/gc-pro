"use client"

import { useEffect, useState } from "react"
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
  Building,
  ChevronDown,
  ChevronRight,
  FolderOpen
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRoleStore } from "@/store/use-role-store"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Space } from "@/schemas/plaky"

const adminItems = [
  { title: "Admin Dashboard", url: "/admin/dashboard", icon: ShieldAlert },
  { title: "All Employees", url: "/admin/employees", icon: Users },
  { title: "Attendance Overview", url: "/admin/attendance", icon: CalendarDays },
  { title: "Company Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Company Leaves", url: "/admin/leaves", icon: Clock },
]

const pmItems = [
  { title: "PM Dashboard", url: "/pm/dashboard", icon: LayoutDashboard },
  { title: "All Employees", url: "/pm/employees", icon: Users },
  { title: "Attendance Overview", url: "/pm/attendance", icon: CalendarDays },
  { title: "Leave Requests", url: "/pm/leaves", icon: Clock },
  { title: "Company Reports", url: "/pm/reports", icon: BarChart3 },
]

const employeeItems = [
  { title: "My Dashboard", url: "/employee/dashboard", icon: UserCircle },
  { title: "My Tasks", url: "/employee/my-tasks", icon: CheckSquare },
  { title: "My Attendance", url: "/employee/attendance", icon: CalendarDays },
  { title: "My Leaves", url: "/employee/leaves", icon: Clock },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { role } = useRoleStore()
  
  const { getSpaces } = usePlakyApi()
  const [spaces, setSpaces] = useState<Space[]>([])
  const [expandedSpaces, setExpandedSpaces] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Only fetch spaces for PM/Admin or as needed
    getSpaces().then(setSpaces)
  }, [getSpaces])

  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const activeItems = effectiveRole === 'admin' ? adminItems : effectiveRole === 'project-manager' ? pmItems : employeeItems

  const toggleSpace = (spaceId: string) => {
    setExpandedSpaces(prev => ({
      ...prev,
      [spaceId]: !prev[spaceId]
    }))
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/40 p-0">
        <div className="flex items-center justify-center w-full h-full group-data-[state=expanded]:px-4 group-data-[state=expanded]:justify-start gap-3">
          <div className="flex h-8 w-8 group-data-[state=expanded]:h-10 group-data-[state=expanded]:w-10 items-center justify-center rounded-lg group-data-[state=expanded]:rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0 transition-all duration-200">
            <Hexagon className="h-5 w-5 group-data-[state=expanded]:h-6 group-data-[state=expanded]:w-6 fill-current transition-all duration-200" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground group-data-[collapsible=icon]:hidden whitespace-nowrap">
            Nuvio
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4 overflow-x-hidden overflow-y-auto">
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

        {/* Spaces Section */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2 group-data-[collapsible=icon]:hidden flex justify-between items-center pr-2">
            Spaces
            {effectiveRole !== 'employee' && (
              <Link href={`/${effectiveRole === 'admin' ? 'admin' : 'pm'}/spaces`} className="text-primary hover:underline ml-auto cursor-pointer">
                Manage
              </Link>
            )}
          </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {spaces.map(space => (
                  <div key={space.id} className="flex flex-col mb-1">
                    <div 
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                      onClick={() => toggleSpace(space.id)}
                    >
                      {expandedSpaces[space.id] ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                      <div className="w-4 h-4 rounded shrink-0 flex items-center justify-center text-[10px] text-white font-bold" style={{ backgroundColor: space.color || '#4f46e5' }}>
                        {space.name.substring(0,2).toUpperCase()}
                      </div>
                      <span className="truncate">{space.name}</span>
                    </div>
                    
                    {expandedSpaces[space.id] && space.boards && (
                      <div className="ml-6 pl-2 border-l border-border/50 flex flex-col gap-1 mt-1">
                        {space.boards.map((board: any) => {
                          const routePrefix = effectiveRole === 'project-manager' ? 'pm' : effectiveRole;
                          const spaceIdentifier = space.slug || space.id;
                          const boardIdentifier = board.slug || board.id;
                          return (
                          <SidebarMenuItem key={board.id} className="list-none">
                            <SidebarMenuButton 
                              asChild 
                              isActive={pathname === `/${routePrefix}/spaces/${spaceIdentifier}/boards/${boardIdentifier}`}
                              className="h-7 text-xs"
                            >
                              <Link href={`/${routePrefix}/spaces/${spaceIdentifier}/boards/${boardIdentifier}`}>
                                <FolderOpen className="h-3 w-3 mr-1" />
                                <span className="truncate">{board.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )})}
                      </div>
                    )}
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}
