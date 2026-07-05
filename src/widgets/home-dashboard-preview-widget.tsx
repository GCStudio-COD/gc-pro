"use client"

import { motion } from "framer-motion"
import { 
  Users, CheckCircle2, TrendingUp, Clock, 
  LayoutDashboard, UsersRound, Briefcase, Settings, ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function HomeDashboardPreviewWidget() {
  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
          >
            A workspace your team will love
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Stop wrestling with clunky interfaces. Our dashboard is meticulously crafted for speed, readability, and joy.
          </motion.p>
        </div>

        {/* The Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden flex flex-col md:flex-row h-[700px] ring-1 ring-white/10"
        >
          {/* Mock Sidebar */}
          <div className="hidden md:flex w-64 flex-col border-r bg-muted/20 p-4">
            <div className="flex items-center gap-2 px-2 mb-8 mt-2">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-bold tracking-tight">Nuvio</span>
            </div>
            <nav className="space-y-2 flex-1">
              <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary font-medium">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </div>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted">
                <UsersRound className="h-4 w-4" /> Employees
              </div>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted">
                <Briefcase className="h-4 w-4" /> Projects
              </div>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted">
                <CheckCircle2 className="h-4 w-4" /> Tasks
              </div>
            </nav>
            <div className="mt-auto">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted">
                <Settings className="h-4 w-4" /> Settings
              </div>
            </div>
          </div>

          {/* Mock Main Content */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-muted/10 relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold">Overview</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Mock Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { title: "Total Employees", val: "142", icon: Users, color: "text-blue-500" },
                { title: "Active Projects", val: "12", icon: Briefcase, color: "text-indigo-500" },
                { title: "Tasks Completed", val: "847", icon: CheckCircle2, color: "text-emerald-500" },
                { title: "Productivity", val: "94%", icon: TrendingUp, color: "text-rose-500" },
              ].map((stat, i) => {
                const Icon = stat.icon
                return (
                  <Card key={i} className="shadow-sm border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{stat.val}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mock Project Cards */}
              <Card className="lg:col-span-2 shadow-sm border-border/50">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <div className="font-medium">Website Redesign</div>
                      <div className="text-xs text-muted-foreground">Due in 3 days</div>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <div className="font-medium">Database Migration</div>
                      <div className="text-xs text-muted-foreground">Due next week</div>
                    </div>
                    <Badge variant="outline">Review</Badge>
                  </div>
                  <div className="p-4 text-center text-sm text-primary font-medium flex items-center justify-center cursor-pointer hover:underline">
                    View all projects <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Mock Activity Feed */}
              <Card className="shadow-sm border-border/50">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-base font-semibold">Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm">Alice finished <span className="font-medium">Homepage UI</span></div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> 2 hours ago
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm">Bob deployed <span className="font-medium">v2.0.1</span></div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> 4 hours ago
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm">Charlie added to <span className="font-medium">Design Team</span></div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> 1 day ago
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Fade out overlay at bottom to look like a preview */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted/10 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
