"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Phone, Send, CheckCircle2, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://n8n.engrsquad.com/webhook/8b719698-6d50-4946-8343-11858460d30d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source: "Contact Form",
          date: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setShowPopup(true);
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
      <div className="glow-effect top-1/4 -left-20 w-[500px] h-[500px] -z-10" />
      <div className="glow-effect bottom-1/4 -right-20 w-[500px] h-[500px] -z-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Side: Info */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black mb-6 tracking-widest uppercase">
                  <Mail className="w-3.5 h-3.5" />
                  <span>CONTACT SUPPORT</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                  Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#82C3FF]">Touch</span>
                </h2>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                  Ready to amplify your Facebook presence? Our team is here to help you get started with Postsiva. Reach out for a custom demo or 24/7 support.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center gap-5 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Us</div>
                      <a href="mailto:support@postsiva.com" className="text-slate-900 font-bold text-lg hover:text-primary transition-colors">support@postsiva.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Chat</div>
                      <div className="text-slate-900 font-bold text-lg">Available 24/7 for you</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Call Us</div>
                      <div className="text-slate-900 font-bold text-lg">+92 323 6891550</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                      <Input 
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder="John" 
                        className="h-14 rounded-xl px-4 border-slate-200 font-bold focus:ring-1 focus:ring-primary transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                      <Input 
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Doe" 
                        className="h-14 rounded-xl px-4 border-slate-200 font-bold focus:ring-1 focus:ring-primary transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <Input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@company.com" 
                      className="h-14 rounded-xl px-4 border-slate-200 font-bold focus:ring-1 focus:ring-primary transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                    <Textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="How can we help you grow?" 
                      className="min-h-[150px] rounded-xl px-4 py-4 border-slate-200 font-bold focus:ring-1 focus:ring-primary transition-all resize-none" 
                    />
                  </div>
                  <Button 
                    disabled={isSubmitting}
                    className="w-full h-16 text-sm font-black uppercase tracking-widest rounded-2xl group relative overflow-hidden bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setShowPopup(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl text-center max-w-md w-full border border-slate-100"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Message Sent!</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-bold mb-6">
                Thanks for reaching out! Our team will get back to you within <span className="text-primary">24 hours</span>.
              </p>
              
              <Button 
                onClick={() => setShowPopup(false)}
                className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                Got it, Thanks!
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

