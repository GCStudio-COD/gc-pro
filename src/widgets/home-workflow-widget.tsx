"use client"

import { motion } from "framer-motion"
import { Users, Building2, Briefcase, CheckSquare, Activity, BarChart } from "lucide-react"

const steps = [
  { title: "Create Employees", desc: "Easily onboard staff into the system.", icon: Users },
  { title: "Create Teams", desc: "Group employees into logical departments.", icon: Building2 },
  { title: "Create Projects", desc: "Setup initiatives and assign your teams.", icon: Briefcase },
  { title: "Assign Tasks", desc: "Distribute actionable items via Kanban.", icon: CheckSquare },
  { title: "Track Progress", desc: "Monitor time and velocity in real-time.", icon: Activity },
  { title: "Generate Reports", desc: "Export rich data for stakeholders.", icon: BarChart },
]

export function HomeWorkflowWidget() {
  return (
    <section className="py-24 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">A logical, frictionless workflow</h2>
          <p className="text-lg text-muted-foreground">
            From Day 1 onboarding to Q4 performance reports, our platform handles the entire employee lifecycle perfectly.
          </p>
        </div>

        <div className="max-w-2xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent -translate-x-1/2" />

          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${isEven ? "md:flex-row-reverse" : ""} md:justify-between`}
              >
                {/* Mobile view padding helper */}
                <div className="hidden md:block w-[45%]" />
                
                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary shadow-lg z-10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                
                {/* Content Card */}
                <div className="ml-20 md:ml-0 w-full md:w-[45%]">
                  <div className={`bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-primary/50 transition-colors ${isEven ? "md:text-right" : "md:text-left"}`}>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
