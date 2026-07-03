"use client"

import { useState } from "react"
import { ProfileSettings } from "./profile-settings"
import { AppearanceSettings } from "./appearance-settings"
import { NotificationSettings } from "./notification-settings"
import { CompanySettings } from "./company-settings"
import { SecuritySettings } from "./security-settings"

import { User, Palette, Bell, Building2, ShieldCheck } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRoleStore } from "@/store/use-role-store"

const sidebarNavItems = [
  { id: "profile", title: "Profile", icon: User },
  { id: "appearance", title: "Appearance", icon: Palette },
  { id: "notifications", title: "Notifications", icon: Bell },
  { id: "company", title: "Company", icon: Building2 },
  { id: "security", title: "Security", icon: ShieldCheck },
]

export function ProfileFeature() {
  const [activeTab, setActiveTab] = useState("profile")
  const pathname = usePathname()
  const { role } = useRoleStore()
  
  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  const activeNavItems = effectiveRole === 'admin' 
    ? sidebarNavItems 
    : sidebarNavItems.filter(item => item.id === 'profile')

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-4">
        
        {/* Settings Sidebar */}
        <aside className="lg:w-1/4">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-4 lg:pb-0">
            {activeNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 w-full max-w-3xl">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "company" && <CompanySettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  )
}
