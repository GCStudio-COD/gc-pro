"use client"

import { ReactNode, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { MeetingPopup } from "./meeting-popup"
import { fetchApi } from "@/lib/api"

export function AppLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const interval = setInterval(() => {
      // The api.ts already handles redirecting to /login on 401
      fetchApi('/auth/check').catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-muted/40">
          {children}
        </main>
      </div>
      <MeetingPopup />
    </SidebarProvider>
  )
}
