"use client"

import { motion } from "framer-motion"
import { Zap, ShieldCheck, Repeat, Users, Smartphone, PaintBucket } from "lucide-react"

const features = [
  { title: "Fast Performance", desc: "Built on Next.js Turbopack for lightning-fast interactions.", icon: Zap },
  { title: "Secure", desc: "Enterprise-grade security and role-based access controls built-in.", icon: ShieldCheck },
  { title: "Real-Time Updates", desc: "Websockets ensure you see changes the second they happen.", icon: Repeat },
  { title: "Easy Collaboration", desc: "Shared boards, mentions, and seamless team communication.", icon: Users },
  { title: "Responsive Design", desc: "Works perfectly on desktop, tablet, and mobile browsers.", icon: Smartphone },
  { title: "Modern UI", desc: "Beautiful typography, clean spacing, and dark mode support.", icon: PaintBucket },
]

export function HomeFeaturesWidget() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why choose NexusPlatform?</h2>
          <p className="text-lg text-muted-foreground">
            We obsessed over the details so you don't have to.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
