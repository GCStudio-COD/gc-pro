"use client"

import { ReactNode, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { MeetingPopup } from "./meeting-popup"
import { fetchApi } from "@/lib/api"
import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"

export function AppLayout({ children }: { children: ReactNode }) {
  const { token } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return;
    }
    
    // Immediate check
    fetchApi('/auth/check').catch(() => { });

    const interval = setInterval(() => {
      // The api.ts already handles redirecting to /login on 401
      fetchApi('/auth/check').catch(() => { });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <AppHeader />
        <main className="flex flex-col flex-1 p-4 sm:p-0 xl:p-8 bg-muted/40 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <MeetingPopup />
    </SidebarProvider>
  )
}
