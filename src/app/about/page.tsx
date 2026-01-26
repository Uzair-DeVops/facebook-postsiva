"use client";

import { Navbar } from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, TrendingUp, ArrowRight, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const values = [
  {
    icon: Users,
    title: "Customer Success",
    description:
      "We're committed to helping every customer achieve their Facebook goals and grow their professional network.",
  },
  {
    icon: Target,
    title: "Innovation",
    description: "We continuously innovate and improve our platform to stay ahead of Facebook's evolving landscape.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from product development to customer support.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "We believe in sustainable growth for our customers and our company, built on trust and results.",
  },
];

const stats = [
  { value: "2019", label: "Founded" },
  { value: "50,000+", label: "Daily Actions" },
  { value: "10,000+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
      <div className="glow-effect top-0 -left-20 w-[600px] h-[600px] -z-10" />
      <div className="glow-effect top-0 -right-20 w-[600px] h-[600px] -z-10" />
      
      <Navbar />
      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#82C3FF]/10 border border-[#82C3FF]/30 text-primary text-xs font-bold mb-4">
                <Facebook className="w-3.5 h-3.5 text-[#82C3FF]" />
                <span>OUR STORY</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                About <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#82C3FF]">Postsiva</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                We&apos;re on a mission to help professionals and businesses unlock the full potential of Facebook through
                intelligent automation and meaningful connections.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Our Story</h2>
                <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                  <p>
                    Postsiva was born from a simple frustration: spending countless hours manually managing Facebook
                    outreach while seeing minimal results. Our founder experienced this firsthand while
                    building a digital marketing agency.
                  </p>
                  <p>
                    After years of understanding Facebook&apos;s algorithms, we assembled a
                    team of experts in AI, automation, and social media marketing to create a solution that would change how
                    professionals approach Facebook growth.
                  </p>
                  <p>
                    Today, Postsiva helps over 10,000 professionals and businesses automate their Facebook activities
                    while maintaining authenticity and compliance with Facebook&apos;s safety guidelines.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl md:text-3xl font-black text-primary mb-1">{stat.value}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <Card className="p-2 bg-white/40 backdrop-blur-xl border-white/60 shadow-2xl rounded-4xl">
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-inner">
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                          <Facebook className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Mission Statement</h3>
                          <p className="text-sm text-slate-400 font-medium">Empowering professionals worldwide</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/[0.08] transition-colors">
                          <h4 className="font-black text-primary mb-2 uppercase text-xs tracking-widest">Our Mission</h4>
                          <p className="text-slate-600 leading-relaxed font-medium">
                            To democratize Facebook success by providing intelligent automation tools that help
                            professionals build meaningful connections and grow their businesses.
                          </p>
                        </div>

                        <div className="p-6 bg-[#82C3FF]/5 rounded-2xl border border-[#82C3FF]/10 hover:bg-[#82C3FF]/10 transition-colors">
                          <h4 className="font-black text-[#1877F2] mb-2 uppercase text-xs tracking-widest">Our Vision</h4>
                          <p className="text-slate-600 leading-relaxed font-medium">
                            A world where every professional can leverage the power of Facebook to achieve their career
                            and business goals through authentic networking.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
          <div className="glow-effect top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] -z-10" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Our Values</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                These core values guide everything we do and shape how we build products, serve customers, and grow as a
                company.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card
                  key={index}
                  delay={index * 0.1}
                  className="text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <value.icon className="h-8 w-8 transition-colors" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
          <div className="glow-effect bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] -z-10" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Join Our Growing <span className="text-primary">Community</span></h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Become part of a community of successful professionals who are transforming their Facebook presence and
                achieving their business goals with Postsiva.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="group h-14 px-10 rounded-2xl text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-bold">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-base bg-white/50 backdrop-blur-sm border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-bold">
                    Contact Our Team
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

