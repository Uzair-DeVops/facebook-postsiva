"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { PageSelectorHeader } from "@/components/dashboard/PageSelectorHeader";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/hooks/auth/AuthContext";
import { SelectedPageProvider } from "@/lib/hooks/facebook/selectedPage/SelectedPageContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isHydrated, isLoading } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Protect app routes - redirect to login if not authenticated
  useEffect(() => {
    if (isHydrated && !user && !isLoading) {
      router.push('/login');
    }
  }, [isHydrated, user, isLoading, router]);

  if (!isHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F4F9FF]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect above
  }

  return (
    <SelectedPageProvider>
      <div className="flex flex-col md:flex-row h-screen bg-[#F4F9FF] overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-[60]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
              P
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              Post<span className="text-primary">siva</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageSelectorHeader />
          <main className="flex-1 overflow-y-auto relative custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </SelectedPageProvider>
  );
}
