"use client"

import { ThemeToggle } from "./theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell, Search, ShieldAlert, LayoutDashboard, UserCircle, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useRoleStore } from "@/store/use-role-store"
import { useAuthStore } from "@/store/use-auth-store"
import { fetchApi } from "@/lib/api"
import { motion } from "framer-motion"

export function AppHeader() {
  const { role } = useRoleStore()
  const logout = useAuthStore((state) => state.logout)
  const pathname = usePathname()
  const router = useRouter()
  
  let effectiveRole = role
  if (pathname.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname.startsWith('/employee')) effectiveRole = 'employee'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [hasUnread, setHasUnread] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    fetchApi('/notifications', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data)
          const unread = data.some(n => !n.read)
          if (unread) {
            setHasUnread(true)
            setIsShaking(true)
          }
        }
      })
      .catch(err => console.error("Failed to fetch notifications", err))

    fetchApi('/auth/me', {}, effectiveRole)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Failed to fetch user", err))
  }, [effectiveRole])

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsShaking(false)
      if (hasUnread) {
        setHasUnread(false)
        notifications.filter(n => !n.read).forEach(n => {
          fetchApi(`/notifications/${n.id}/read`, { method: 'PUT' }, effectiveRole).catch(() => {})
        })
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }
    }
  }

  const profilePath = effectiveRole === 'project-manager' ? '/pm/profile' : `/${effectiveRole}/profile`

  return (
    <header className="h-14 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sticky top-0 z-10 w-full transition-all">
      <div className="flex items-center gap-4">
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <DropdownMenu onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <motion.div
                animate={isShaking ? { rotate: [-15, 15, -15, 15, 0] } : {}}
                transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.5 }}
              >
                <Bell className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Notifications</p>
                <p className="text-xs leading-none text-muted-foreground">
                  You have {notifications.length} alerts
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  No new notifications.
                </div>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-3 gap-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${notif.type === 'alert' || notif.type === 'overdue' ? 'bg-destructive' : 'bg-primary'}`} />
                      <span className="text-sm font-medium capitalize">{notif.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-4">{notif.message}</span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2 border border-border/50">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : (effectiveRole === 'admin' ? 'AD' : effectiveRole === 'project-manager' ? 'PM' : 'EM')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                </p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {user?.role || role.replace('-', ' ')}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={profilePath}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
