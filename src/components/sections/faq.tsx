"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Shield, Zap, BarChart } from "lucide-react";

const faqs = [
  {
    question: "How does the Facebook automation work?",
    answer: "Our platform uses proprietary AI-driven algorithms to mimic natural human browsing behavior. By controlling timing, click-patterns, and interaction sequences, we ensure your automation looks indistinguishable from manual activity to Facebook's safety systems.",
    icon: Zap,
    color: "text-amber-500"
  },
  {
    question: "Is my account safety guaranteed?",
    answer: "Safety is our #1 core value. We utilize residential proxy networks and cloud-based browsers that isolated from your local IP. We also enforce strict 'safety limits' based on your account's age and health score to prevent any flags.",
    icon: Shield,
    color: "text-[#1877F2]"
  },
  {
    question: "Can I manage multiple business profiles?",
    answer: "Absolutely. Our enterprise dashboard is designed for agencies and high-growth founders. You can switch between multiple profiles, pages, and ad accounts with zero risk of cross-contamination.",
    icon: MessageCircle,
    color: "text-emerald-500"
  },
  {
    question: "What kind of growth analytics will I see?",
    answer: "You'll get real-time dashboards tracking engagement rates, follower growth, lead conversion stats, and response times. All data can be exported into professional reports for your team or clients.",
    icon: BarChart,
    color: "text-purple-500"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
      <div className="glow-effect bottom-0 -left-20 w-[500px] h-[500px] -z-10" />
      {/* Subtle Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1877F2 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Side: Header */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-24"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
                <HelpCircle className="w-4 h-4" />
                <span>KNOWLEDGE BASE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Everything you <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#82C3FF]">need to know</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, our 24/7 support team is just a click away.
              </p>
              <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-slate-200">
                Contact Support
              </button>
            </motion.div>
          </div>

          {/* Right Side: Accordion */}
          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group rounded-4xl transition-all duration-300 border ${
                    isOpen 
                    ? "bg-white border-primary shadow-2xl shadow-primary/10" 
                    : "bg-slate-50 border-transparent hover:border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-8 py-7 text-left flex items-center gap-6"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:text-primary"
                    }`}>
                      <faq.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xl font-bold transition-colors ${isOpen ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                      {faq.question}
                    </span>
                    <div className={`ml-auto transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-slate-400"}`}>
                      <ChevronDown className="w-6 h-6" />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-24 pb-8 text-slate-600 text-lg leading-relaxed">
                          <div className="w-full h-px bg-slate-100 mb-6" />
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
