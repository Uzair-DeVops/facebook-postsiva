"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Card({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-8 pb-0", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h3 className={cn("text-2xl font-bold text-slate-900 mb-2", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={cn("text-slate-500 leading-relaxed", className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-8", className)}>{children}</div>;
}

