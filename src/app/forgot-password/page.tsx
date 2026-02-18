"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import { useState } from "react";
import { forgotPasswordRequest } from "@/lib/hooks/auth/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPasswordRequest(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
        <div className="glow-effect top-1/4 -left-20 w-[500px] h-[500px] -z-10" />
        <div className="glow-effect bottom-1/4 -right-20 w-[500px] h-[500px] -z-10" />

        <div className="container max-w-md mx-auto px-6 relative z-10 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Postsiva</span>
            </Link>

            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900 mb-2">Forgot password?</h1>
              <p className="text-slate-500">Enter your email and we&apos;ll send you a reset link.</p>
            </div>

            {sent ? (
              <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-green-800 text-sm font-medium mb-6">
                Check your email for a link to reset your password.
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="h-12 pl-12 rounded-xl border-slate-200"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            )}

            <div className="mt-8">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-400 hover:text-primary gap-2 font-bold text-sm">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Back to login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
