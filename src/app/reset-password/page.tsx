"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { resetPasswordRequest } from "@/lib/hooks/auth/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [noToken, setNoToken] = useState(false);

  useEffect(() => {
    if (!token && typeof window !== "undefined") setNoToken(true);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPasswordRequest(token, password);
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (noToken) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center pt-20">
          <div className="text-center max-w-md px-6">
            <p className="text-slate-600 mb-4">Missing or invalid reset link. Request a new one from the login page.</p>
            <Link href="/forgot-password">
              <Button className="rounded-xl">Request new link</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

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
              <h1 className="text-2xl font-black text-slate-900 mb-2">Set new password</h1>
              <p className="text-slate-500">Enter your new password below.</p>
            </div>

            {success ? (
              <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-green-800 text-sm font-medium mb-6">
                Password updated. Redirecting to login…
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 pl-12 rounded-xl border-slate-200"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      disabled={loading}
                      className="h-12 pl-12 rounded-xl border-slate-200"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold"
                >
                  {loading ? "Updating…" : "Update password"}
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
