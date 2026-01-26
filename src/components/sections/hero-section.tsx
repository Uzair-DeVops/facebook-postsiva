"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const Particle = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "linear",
    }}
    style={{ left }}
    className="absolute top-0 w-1 h-1 bg-[#82C3FF]/60 rounded-full blur-[1px]"
  />
);

export default function HeroSection() {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 12,
      }))
    );
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Light Sprinkle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <Particle key={p.id} left={p.left} delay={p.delay} duration={p.duration} />
        ))}
      </div>

      {/* Floating Glow Effects */}
      <div className="glow-effect top-1/4 -left-20 w-[500px] h-[500px]" />
      <div className="glow-effect bottom-1/4 -right-20 w-[500px] h-[500px]" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#82C3FF]/10 border border-[#82C3FF]/30 text-primary text-xs font-bold mb-8 shadow-[0_0_20px_rgba(130,195,255,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#82C3FF]" />
          <span>Next-Generation Facebook Power</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight"
        >
          Facebook Automation for <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-[#82C3FF] to-primary">
            Faster Smarter Growth
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-base md:text-lg text-slate-600 mb-10 leading-relaxed"
        >
          Scale your reach, automate your engagement, and close more deals on Facebook. 
          The ultimate platform for modern founders and high-performing teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/signup">
          <Button size="md" className="group h-14 px-10 rounded-xl text-base bg-primary hover:bg-primary/90">
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          </Link>
          <Button variant="outline" size="md" className="h-14 px-10 rounded-xl text-base bg-white/50 backdrop-blur-sm border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
            Watch Video
          </Button>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto mb-20"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10" />
          <div className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-3 border border-white/60 shadow-xl overflow-hidden">
            <div className="bg-white rounded-4xl overflow-hidden border border-slate-200 shadow-lg relative aspect-16/10">
              <Image 
                src="/hero-section.png" 
                alt="Facebook Automation Dashboard" 
                fill 
                className="object-fill"
              />
            </div>
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20 border border-slate-100 p-3 sm:p-4"
          >
            <div className="w-full h-full bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary">
              <span className="text-[10px] sm:text-xs font-bold leading-none">Auto</span>
              <span className="text-[8px] sm:text-[10px] font-medium opacity-70">Pilot</span>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-4 sm:-bottom-10 sm:-left-10 bg-white rounded-2xl shadow-xl p-3 sm:p-4 z-20 border border-slate-100 scale-90 sm:scale-100"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#82C3FF]/20 flex items-center justify-center text-primary">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-[10px] sm:text-xs font-bold text-primary">Engagement Up</div>
                <div className="text-[8px] sm:text-[10px] text-[#82C3FF] font-semibold">Real-time automation</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Bottom - Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-x-12 gap-y-6"
        >
          <div className="flex items-center gap-3 group cursor-default bg-[#82C3FF]/5 px-5 py-2.5 rounded-2xl border border-[#82C3FF]/10 hover:bg-[#82C3FF]/10 transition-all duration-300">
            <div className="w-8 h-8 bg-[#82C3FF]/20 rounded-lg flex items-center justify-center text-[#82C3FF] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(130,195,255,0.3)]">
              <div className="w-3.5 h-3.5 bg-current rounded-sm" />
            </div>
            <span className="font-black text-[#4a99e2] tracking-[0.15em] text-[10px] uppercase transition-colors">FACEBOOK</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default bg-[#82C3FF]/5 px-5 py-2.5 rounded-2xl border border-[#82C3FF]/10 hover:bg-[#82C3FF]/10 transition-all duration-300">
            <div className="w-8 h-8 bg-[#82C3FF]/20 rounded-lg flex items-center justify-center text-[#82C3FF] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(130,195,255,0.3)]">
               <div className="w-3.5 h-3.5 bg-current rounded-sm" />
            </div>
            <span className="font-black text-[#4a99e2] tracking-[0.15em] text-[10px] uppercase transition-colors">AUTOMATION</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default bg-[#82C3FF]/5 px-5 py-2.5 rounded-2xl border border-[#82C3FF]/10 hover:bg-[#82C3FF]/10 transition-all duration-300">
            <div className="w-8 h-8 bg-[#82C3FF]/20 rounded-lg flex items-center justify-center text-[#82C3FF] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(130,195,255,0.3)]">
               <div className="w-3.5 h-3.5 bg-current rounded-sm" />
            </div>
            <span className="font-black text-[#4a99e2] tracking-[0.15em] text-[10px] uppercase transition-colors">GROWTH</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default bg-[#82C3FF]/5 px-5 py-2.5 rounded-2xl border border-[#82C3FF]/10 hover:bg-[#82C3FF]/10 transition-all duration-300">
            <div className="w-8 h-8 bg-[#82C3FF]/20 rounded-lg flex items-center justify-center text-[#82C3FF] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(130,195,255,0.3)]">
               <div className="w-3.5 h-3.5 bg-current rounded-sm" />
            </div>
            <span className="font-black text-[#82C3FF] tracking-[0.15em] text-[10px]  uppercase transition-colors">ANALYTICS</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

