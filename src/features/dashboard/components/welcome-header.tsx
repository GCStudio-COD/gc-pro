import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

export function WelcomeHeader() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good Morning, Team! 👋</h1>
        <p className="text-muted-foreground mt-1">Here is your dashboard for {currentDate}.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  )
}
