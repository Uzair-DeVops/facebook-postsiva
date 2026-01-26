"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Alex Thompson",
    role: "Digital Marketer",
    content: "Postsiva has completely transformed how we handle Facebook outreach. The automation is seamless and the safety features are top-notch.",
    avatar: "AT"
  },
  {
    name: "Sarah Chen",
    role: "SaaS Founder",
    content: "I've tried many tools, but Postsiva is the most intuitive. Our engagement rates have doubled since we started using it.",
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "Growth Lead",
    content: "The analytics provided by Postsiva are game-changing. We can finally see exactly what's working and what's not.",
    avatar: "MR"
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
      <div className="glow-effect top-0 -right-20 w-[600px] h-[600px] -z-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Trusted by Experts</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See what high-performing teams are saying about Postsiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 relative group hover:bg-white hover:shadow-2xl hover:shadow-[#1877F2]/10 transition-all duration-500"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-[#1877F2]/10 group-hover:text-[#1877F2]/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-slate-600 italic mb-8 relative z-10">
                &quot;{review.content}&quot;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white font-bold">
                  {review.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{review.name}</div>
                  <div className="text-sm text-slate-500">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

