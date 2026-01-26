"use client";

import { Navbar } from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  Target,
  BarChart3,
  Clock,
  Shield,
  Zap,
  Brain,
  Globe,
  CheckCircle,
  ArrowRight,
  Facebook,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: MessageSquare,
    title: "Smart Facebook Messaging",
    description:
      "Send personalized Facebook messages at scale with AI-powered templates that feel authentic and drive engagement.",
    benefits: [
      "AI-powered message personalization",
      "Template library with proven results",
      "A/B testing for message optimization",
      "Automatic follow-up sequences",
    ],
  },
  {
    icon: Users,
    title: "Facebook Group Automation",
    description:
      "Automatically engage with your target audience in Facebook groups with intelligent targeting and timing.",
    benefits: [
      "Smart group engagement automation",
      "Custom invitation messages",
      "Engagement acceptance tracking",
      "Daily limits and safety controls",
    ],
  },
  {
    icon: Target,
    title: "Advanced Lead Targeting",
    description:
      "Find and connect with decision-makers using advanced search filters and Facebook Ads Manager data insights.",
    benefits: [
      "Ads Manager data integration",
      "Advanced search filters",
      "Lead scoring and qualification",
      "CRM integration capabilities",
    ],
  },
  {
    icon: BarChart3,
    title: "Facebook Analytics Dashboard",
    description:
      "Track your Facebook performance with detailed analytics on engagement, messages, and lead generation.",
    benefits: [
      "Real-time performance metrics",
      "Engagement growth tracking",
      "Message response rates",
      "ROI and conversion analytics",
    ],
  },
  {
    icon: Clock,
    title: "Smart Facebook Scheduling",
    description: "Schedule your Facebook activities to run at optimal times when your prospects are most active.",
    benefits: [
      "Optimal timing recommendations",
      "Timezone-aware scheduling",
      "Activity queue management",
      "Weekend and holiday controls",
    ],
  },
  {
    icon: Shield,
    title: "Safety & Compliance",
    description: "Stay within Facebook's limits with built-in safety features and compliance monitoring.",
    benefits: [
      "Facebook limit compliance",
      "Account safety monitoring",
      "Risk assessment alerts",
      "Automatic pause features",
    ],
  },
];

export default function FeaturesPage() {
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
                <span>POWERFUL TOOLS</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                Powerful Features for <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#82C3FF]">Facebook Success</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Discover all the tools and features that make Postsiva the most comprehensive Facebook automation
                platform for professionals and businesses.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  delay={index * 0.1}
                  className="h-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group"
                >
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <feature.icon className="h-7 w-7 transition-colors" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 opacity-70" />
                          <span className="text-sm text-slate-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
          <div className="glow-effect bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] -z-10" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Even More Powerful Features</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our platform includes additional advanced features to help you maximize your Facebook success.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card delay={0} className="text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group">
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Brain className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight">AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Get intelligent recommendations on who to connect with and what messages to send based on AI
                    analysis of Facebook interactions.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card delay={0.1} className="text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group">
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Globe className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight">Multi-Account Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Manage multiple Facebook pages and profiles from one dashboard with team collaboration features and role-based
                    access.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card delay={0.2} className="text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group">
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Zap className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight">Real-time Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Get instant alerts for new engagements, messages, and important Facebook activities via email or
                    Slack.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
          <div className="glow-effect top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] -z-10" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Ready to Experience <br/><span className="text-primary">Facebook Automation?</span></h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Start your free trial today and discover how our comprehensive feature set can transform your Facebook
                strategy and drive real business results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="group h-14 px-10 rounded-2xl text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-bold">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-base bg-white/50 backdrop-blur-sm border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-bold">
                    Watch Demo
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

