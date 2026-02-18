"use client";

import { Button } from "@/components/ui/button";
import { Facebook, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { verifyEmailRequest } from "@/lib/hooks/auth/api";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    verifyEmailRequest(token)
      .then((res) => {
        if (!cancelled) {
          setStatus("success");
          setMessage(res.message ?? "Email verified successfully.");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setMessage(err instanceof Error ? err.message : "Verification failed.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 grid-bg opacity-40 -z-10" />
        <div className="glow-effect top-1/4 -left-20 w-[500px] h-[500px] -z-10" />
        <div className="glow-effect bottom-1/4 -right-20 w-[500px] h-[500px] -z-10" />

        <div className="container max-w-md mx-auto px-6 relative z-10 py-12">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Postsiva</span>
            </Link>

            <h1 className="text-2xl font-black text-slate-900 mb-4">Email verification</h1>

            {status === "loading" && (
              <div className="py-8">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-slate-500 mt-4">Verifying your email…</p>
              </div>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-slate-700 font-medium mb-6">{message}</p>
                <Link href="/login">
                  <Button className="rounded-xl bg-primary hover:bg-primary/90 font-bold">Go to login</Button>
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-slate-700 font-medium mb-6">{message}</p>
                <Link href="/login">
                  <Button variant="outline" className="rounded-xl">Back to login</Button>
                </Link>
              </>
            )}

            {status === "idle" && !token && (
              <p className="text-slate-500">Open the verification link from your email.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
