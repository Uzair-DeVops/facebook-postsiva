"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  {
    title: "Global Reach",
    description: "Connect with thousands of potential customers daily through our automated network.",
    color: "bg-primary/5",
    image: "/global-reach.png"
  },
  {
    title: "Growth Acceleration",
    description: "Experience explosive growth in your engagement and follower count with AI-optimized timing.",
    color: "bg-primary/5",
    image: "/growth-acceleration.png"
  },
  {
    title: "Advanced Safety",
    description: "Your account is protected by enterprise-grade proxy rotation and human-like behavior patterns.",
    color: "bg-primary/5",
    image: "/advanced-safety.png"
  }
];

export default function PerformanceStats() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
      <div className="glow-effect bottom-0 -right-20 w-[500px] h-[500px] -z-10" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            <span className="font-black text-slate-900">
              Best Performance Stats <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#82C3FF]">
                See Results for Yourself
              </span>
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Explore how our platform delivers top results and helps your business grow faster, safer, and broader.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_-15px_rgba(24,119,242,0.15)] transition-all duration-500 overflow-hidden"
            >
              {/* Card Top: Image Visual */}
              <div className={`aspect-4/3 w-full overflow-hidden relative ${stat.color} p-6`}>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-inner">
                  <Image 
                    src={stat.image} 
                    alt={stat.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Card Bottom: Content */}
              <div className="p-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  {stat.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium opacity-80">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
