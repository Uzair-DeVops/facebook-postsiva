"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Search, ListChecks, Send, LineChart } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    title: "Define Your Audience",
    description: "Use our advanced filters to find exactly who you want to reach out to on Facebook based on interests, demographics, and behavior.",
    icon: Search,
    image: "/define-your-audience.png",
  },
  {
    title: "Create Your Campaign",
    description: "Write personalized messages and set up automated follow-up sequences for your Facebook groups and messenger.",
    icon: ListChecks,
    image: "/create-your-campaign.png",
  },
  {
    title: "Launch & Automate",
    description: "Let Postsiva handle the outreach while you focus on closing deals. Our intelligent algorithms mimic human behavior to stay safe.",
    icon: Send,
    image: "/launch-automate.png",
  },
  {
    title: "Analyze & Optimize",
    description: "Track performance and refine your approach with real-time data from your Facebook campaigns.",
    icon: LineChart,
    image: "/analyze-optimize.png",
  },
];

export const HowItWorks = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
      <div className="glow-effect top-1/2 -left-20 w-[500px] h-[500px] -z-10" />
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get your Facebook automation up and running in four simple steps.
          </p>
        </div>

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 rounded-full hidden md:block" />
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-0.5 bg-primary -translate-x-1/2 rounded-full z-10 hidden md:block"
          />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-12 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Step Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className={`md:flex flex-col ${index % 2 === 1 ? "md:items-end md:text-right" : ""}`}>
                    <div className="text-primary font-black text-5xl mb-4 opacity-10">0{index + 1}</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step Circle */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-14 h-14 bg-white border-4 border-primary rounded-full z-20 hidden md:flex items-center justify-center text-primary shadow-xl">
                   <step.icon className="w-6 h-6" />
                </div>

                {/* Step Visual */}
                <div className="flex-1 w-full">
                  <div className="bg-white rounded-4xl overflow-hidden border border-slate-200 shadow-sm aspect-16/10 group hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative">
                    <Image 
                      src={step.image} 
                      alt={step.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
