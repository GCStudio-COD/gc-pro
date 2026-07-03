"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, MessagesSquare, CheckSquare, Clock, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const overviewFeatures = [
  {
    title: "Employee Management",
    description: "Onboard, track, and manage your entire workforce from a single, centralized directory.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Project Management",
    description: "Organize portfolios, assign teams, and monitor overall progress with rich visualizations.",
    icon: Briefcase,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Team Collaboration",
    description: "Break down silos. Enable cross-functional teams to communicate and work together seamlessly.",
    icon: MessagesSquare,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Task Management",
    description: "Granular control over daily tasks with Kanban boards, due dates, and priority tagging.",
    icon: CheckSquare,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Time Tracking",
    description: "Integrated stopwatches and timesheets ensure every billable minute is accurately logged.",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Advanced Reports",
    description: "Generate beautiful, interactive charts for attendance, productivity, and project health.",
    icon: BarChart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function HomeOverviewWidget() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to run your company</h2>
          <p className="text-lg text-muted-foreground">
            A unified suite of tools designed to replace your fragmented software stack. Built for speed, scale, and simplicity.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {overviewFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300 group overflow-hidden relative">
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
