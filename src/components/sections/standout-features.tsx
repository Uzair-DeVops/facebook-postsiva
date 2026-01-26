"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Smart Automation",
    description: "Automate your Facebook outreach with intelligent workflows that mimic human behavior to stay safe.",
  },
  {
    title: "Precision Targeting",
    description: "Find your ideal prospects with advanced filters and AI-powered lead searching algorithms.",
  },
  {
    title: "Advanced Analytics",
    description: "Deep dive into your campaign performance with real-time data and actionable insights.",
  },
  {
    title: "Engagement Booster",
    description: "Automatically engage with your target audience's content to build meaningful relationships.",
  },
  {
    title: "Team Collaboration",
    description: "Manage multiple accounts and collaborate with your team in a unified enterprise dashboard.",
  },
  {
    title: "Safety First",
    description: "Cloud-based execution and built-in proxy support to keep your Facebook account secure.",
  }
];

export default function StandoutFeatures() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
      <div className="glow-effect top-0 -left-20 w-[500px] h-[500px] -z-10" />
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            Explore Our <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#82C3FF]">
              Standout Features
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Everything you need to <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#82C3FF]">dominate Facebook</span> and turn connections into customers.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group relative p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-12px_rgba(24,119,242,0.12)] transition-all duration-300"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
              
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-transparent to-[#82C3FF]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
