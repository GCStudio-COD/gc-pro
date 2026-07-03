"use client"

import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { MeetingPopup } from "./meeting-popup"

export function AppLayout({ children }: { children: ReactNode }) {
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
