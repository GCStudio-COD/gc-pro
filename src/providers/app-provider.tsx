"use client"

import { ReactNode } from "react"
import QueryProvider from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function AppProvider({ children }: { children: ReactNode }) {
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
