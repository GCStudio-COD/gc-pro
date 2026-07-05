"use client"

import { ReactNode, useEffect } from "react"
import QueryProvider from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useAuthStore } from "@/store/use-auth-store"

export default function AppProvider({ children }: { children: ReactNode }) {
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        logout()
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login'
        }
      }
    }

    const handleFocus = () => {
      if (!localStorage.getItem('token')) {
        logout()
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login'
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [logout])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <QueryProvider>{children}</QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
