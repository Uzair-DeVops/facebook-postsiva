"use client";

import { motion } from "framer-motion";
import { Check, Shield, Crown, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const pricingPlans = [
  {
    id: 2,
    display_name: "Small Plan",
    description: "Perfect for individuals and small creators",
    price_pkr: 500,
    features: [
      "20 AI-Generated Content items / monthly",
      "15 AI-Generated Images / monthly",
      "10 scheduled posts / monthly",
      "Standard Email Support",
      "Personal Branding Support",
      "Testing AI Features"
    ],
    icon: Shield,
    popular: false,
  },
  {
    id: 3,
    display_name: "Basic Plan",
    description: "Great for growing creators and small businesses",
    price_pkr: 1000,
    features: [
      "40 AI-Generated Content items / monthly",
      "30 AI-Generated Images / monthly",
      "20 scheduled posts / monthly",
      "Priority Email Support",
      "Content Creators",
      "Small Business",
      "Active Social Media Pages"
    ],
    icon: Crown,
    popular: true,
  },
  {
    id: 4,
    display_name: "Advanced Plan",
    description: "For professionals and agencies",
    price_pkr: 2000,
    features: [
      "250 posts per monthly",
      "75 scheduled posts monthly",
      "Unlimited AI generation items / monthly",
      "Advanced analytics",
      "Bulk scheduling",
      "Premium support"
    ],
    icon: Sparkles,
    popular: false,
  }
];

// Main Pricing component for the landing page
export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
      <div className="glow-effect top-1/4 -left-20 w-[500px] h-[500px] -z-10" />
      <div className="glow-effect bottom-1/4 -right-20 w-[500px] h-[500px] -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black mb-6 tracking-widest uppercase shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>PRICING PLANS</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tight px-4"
          >
            Choose Your <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#82C3FF]">Perfect Plan</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-medium px-6"
          >
            Everything you need to automate your Facebook growth at an affordable price.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-6 xl:gap-8 max-w-7xl mx-auto items-stretch mt-10 px-4 sm:px-6 justify-center">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.3 } 
              }}
              className={`group flex flex-col relative transition-all duration-500 rounded-[2.5rem] p-6 sm:p-7 border ${
                plan.popular 
                  ? "bg-primary text-white border-primary shadow-2xl shadow-primary/40 lg:-mt-4 lg:mb-4 lg:scale-105 z-20 md:col-span-1 lg:col-span-1" 
                  : "bg-white text-slate-900 border-slate-100 shadow-xl shadow-slate-200/50 z-10 hover:shadow-2xl hover:shadow-primary/10"
              } ${index === 2 ? "md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto lg:max-w-none lg:mx-0 w-full" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl z-30 border-2 border-primary/20 whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className="mb-4 pt-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                  plan.popular 
                    ? "bg-white/20 text-white" 
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                }`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className={`text-xl font-black mb-2 uppercase tracking-tight ${
                  plan.popular ? "text-white" : "text-slate-900 group-hover:text-primary transition-colors"
                }`}>
                  {plan.display_name}
                </h3>
                <p className={`text-xs font-medium leading-relaxed ${
                  plan.popular ? "text-white/80" : "text-slate-500"
                }`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className={`pt-4 pb-1 border-t border-dashed ${
                  plan.popular ? "border-white/20" : "border-slate-200"
                }`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl sm:text-4xl animate-pulse font-black ${
                      plan.popular ? "text-white" : "text-slate-900"
                    }`}>
                      {plan.price_pkr.toLocaleString()}
                    </span>
                    <span className={`text-sm sm:text-base font-bold uppercase tracking-tighter ${
                      plan.popular ? "text-white/80" : "text-slate-500"
                    }`}>
                      PKR
                    </span>
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 ${
                    plan.popular ? "text-white/60" : "text-slate-400"
                  }`}>
                    Per Month / Full Access
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      plan.popular ? "bg-white/20" : "bg-primary/10"
                    }`}>
                      <Check className={`w-3 h-3 stroke-3 ${
                        plan.popular ? "text-white" : "text-primary"
                      }`} />
                    </div>
                    <span className={`text-xs font-bold tracking-tight ${
                      plan.popular ? "text-white/90" : "text-slate-600"
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <Link 
                href="/login"
                className="mt-auto"
              >
                <Button 
                  className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    plan.popular 
                      ? "bg-white text-primary hover:bg-white/90 shadow-black/10" 
                      : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                  }`}
                >
                  Upgrade Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
