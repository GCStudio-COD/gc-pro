"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, PlayCircle, BarChart3, Users, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeHeroWidget() {
  return (
    <section className="relative overflow-hidden pt-[120px] pb-24 md:pt-[180px] md:pb-32 lg:pb-40 w-full min-h-screen flex items-center justify-center">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 w-full h-full bg-background -z-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 blur-[120px] bg-gradient-to-r from-primary via-indigo-500 to-purple-500 rounded-full mix-blend-screen pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-md font-medium"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          Nuvio v2.0 is now live
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-6"
        >
          The modern OS for your entire workforce.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed font-medium"
        >
          Unify employee management, project tracking, and time reporting in one beautiful, lightning-fast platform designed for the modern enterprise.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
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
        </motion.div>

        {/* Floating UI Elements / Dashboard Preview Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-20 relative w-full max-w-5xl aspect-video rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden flex items-center justify-center ring-1 ring-white/10"
        >
           {/* Grid Pattern inside the preview */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

           {/* Mock Floating Cards */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 bg-card border shadow-xl rounded-xl p-4 flex items-center gap-4 w-64"
           >
             <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
               <Users className="h-5 w-5 text-primary" />
             </div>
             <div>
               <div className="text-sm font-semibold">Team Growth</div>
               <div className="text-2xl font-bold">+24%</div>
             </div>
           </motion.div>

           <motion.div 
             animate={{ y: [0, 15, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-1/4 right-1/4 translate-x-1/4 translate-y-1/4 bg-card border shadow-xl rounded-xl p-4 flex items-center gap-4 w-64"
           >
             <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
               <CheckCircle2 className="h-5 w-5 text-emerald-500" />
             </div>
             <div>
               <div className="text-sm font-semibold">Tasks Completed</div>
               <div className="text-2xl font-bold">1,482</div>
             </div>
           </motion.div>

           {/* Center Play Button Graphic */}
           <div className="relative z-10 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-md border border-primary/30 cursor-pointer hover:bg-primary/20 transition-colors group">
             <PlayCircle className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
           </div>

        </motion.div>

      </div>
    </section>
  )
}
