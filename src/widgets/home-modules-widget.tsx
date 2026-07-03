"use client"

import { motion } from "framer-motion"
import { 
  LayoutDashboard, UsersRound, Building, Users, 
  Briefcase, CheckCircle2, CalendarCheck, BarChart3, Settings
} from "lucide-react"

const modules = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Employees", icon: UsersRound },
  { name: "Departments", icon: Building },
  { name: "Teams", icon: Users },
  { name: "Projects", icon: Briefcase },
  { name: "Tasks", icon: CheckCircle2 },
  { name: "Attendance", icon: CalendarCheck },
  { name: "Reports", icon: BarChart3 },
  { name: "Settings", icon: Settings },
]

export function HomeModulesWidget() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">A module for every need</h2>
          <p className="text-lg text-muted-foreground">
            Everything is built-in. No more stitching together expensive third-party tools.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center">
          {modules.map((mod, i) => {
            const Icon = mod.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-medium text-sm md:text-base">{mod.name}</h3>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
