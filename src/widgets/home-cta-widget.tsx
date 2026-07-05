"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeCTAWidget() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-primary/5 -z-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] opacity-40 blur-[100px] bg-gradient-to-r from-primary to-purple-500 rounded-full mix-blend-screen pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center p-8 md:p-16 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to simplify employee and project management?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of modern enterprises using Nuvio to scale their workforce without the friction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="rounded-full h-14 px-8 text-base shadow-lg shadow-primary/20 w-full sm:w-auto hover:scale-105 transition-transform">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-8 text-base w-full sm:w-auto bg-background/50 backdrop-blur-md hover:bg-muted">
              <Link href="/login">
                Login to Dashboard
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
