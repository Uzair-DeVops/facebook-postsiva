"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchFacebookPages, disconnectFacebook } from "@/lib/hooks/facebookoauth/api";
import type { FacebookPage } from "@/lib/hooks/facebookoauth/types";
import { useSelectedPage } from "@/lib/hooks/facebook/selectedPage/SelectedPageContext";
import { useAuthContext } from "@/lib/hooks/auth/AuthContext";
import { useFacebookUserProfile } from "@/lib/hooks/facebook/userProfile/useFacebookUserProfile";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function PageSelectorHeader() {
  const { selectedPage, setSelectedPage, pages, setPages, loading, setLoading } = useSelectedPage();
  const { user } = useAuthContext();
  const { profile } = useFacebookUserProfile({ autoLoad: true });
  const router = useRouter();
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Set mounted state on client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset image error when user or profile changes
  useEffect(() => {
    setImageError(false);
  }, [user, profile]);

  // Load pages on mount if not already loaded
  useEffect(() => {
    if (mounted && pages.length === 0 && !loading) {
      loadPages();
    }
  }, [mounted]);

  // Auto-select first page if none selected but pages are available
  useEffect(() => {
    if (!selectedPage && pages.length > 0 && !loading) {
      setSelectedPage(pages[0]);
    }
  }, [pages, selectedPage, loading, setSelectedPage]);
  
  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-center px-6">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await fetchFacebookPages();
      console.log("Pages response:", response); // Debug log
      
      // The fetchFacebookPages function already normalizes the response
      // and exposes pages at response.pages
      let pagesArray: FacebookPage[] = [];
      
      if (response.success) {
        // Use the normalized pages array from the API function
        if (response.pages && Array.isArray(response.pages)) {
          pagesArray = response.pages.filter(page => page != null && page.page_id);
        } else if (response.pages && !Array.isArray(response.pages)) {
          // Handle single page object
          pagesArray = [response.pages].filter(page => page != null && page.page_id);
        }
        
        console.log("Extracted pages array:", pagesArray); // Debug log
        console.log("Pages count:", pagesArray.length); // Debug log
        
        if (pagesArray.length > 0) {
          setPages(pagesArray);
          
          // If no page is selected, select the first one
          if (!selectedPage) {
            setSelectedPage(pagesArray[0]);
          }
        } else {
          console.warn("No valid pages found in response");
          setPages([]);
        }
      } else {
        console.warn("Response not successful:", response.message);
        setPages([]);
      }
    } catch (err) {
      console.error("Failed to load Facebook pages:", err);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (disconnecting) return;
    
    // Confirm with user
    if (!window.confirm("Are you sure you want to disconnect your Facebook account? You can link another account later.")) {
      return;
    }
    
    try {
      setDisconnecting(true);
      await disconnectFacebook();
      
      // Clear selected page from localStorage
      localStorage.removeItem("postsiva_selected_page");
      
      // Clear pages from context
      setPages([]);
      setSelectedPage(null);
      
      // Close the dropdown
      setShowProfileDropdown(false);
      
      // Use window.location.href to force a full page reload
      // This ensures AuthContext re-checks the Facebook token status
      window.location.href = '/facebook-connect';
    } catch (err) {
      console.error("Failed to disconnect Facebook:", err);
      alert("Failed to disconnect Facebook account. Please try again.");
      setDisconnecting(false);
    }
  };

  // Get user initials for profile image fallback
  const getUserInitials = () => {
    // Use Facebook profile data if available, otherwise fall back to auth user
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.name) {
      const names = profile.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return profile.name.substring(0, 2).toUpperCase();
    }
    if (user) {
      const name = user.full_name || user.username || user.email || "User";
      return name
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  // Get user profile image URL (if available)
  const getProfileImageUrl = () => {
    // Prioritize Facebook profile picture URL
    if (profile?.profile_picture_url) {
      return profile.profile_picture_url;
    }
    // Fallback to user object fields
    if (user) {
      const userAny = user as any;
      return userAny?.profile_picture || 
             userAny?.profile_picture_url || 
             userAny?.profile_image || 
             userAny?.avatar || 
             null;
    }
    return null;
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.name) return profile.name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (user?.full_name) return user.full_name;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-center px-6">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  // Render profile section component to avoid duplication
  const renderProfileSection = () => {
    if (!user) return null;
    
    return (
      <div className="relative flex items-center">
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="flex items-center gap-2 focus:outline-none"
        >
          {getProfileImageUrl() && !imageError ? (
            <div className="relative w-10 h-10 rounded-full border-2 border-slate-200 overflow-hidden hover:border-primary transition-colors flex-shrink-0">
              <Image
                src={getProfileImageUrl()}
                alt={user.full_name || user.username || "User"}
                fill
                className="object-cover"
                sizes="40px"
                unoptimized
                onError={() => {
                  setImageError(true);
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-slate-200 flex items-center justify-center hover:border-primary transition-colors flex-shrink-0">
              <span className="text-xs font-black text-primary">
                {getUserInitials()}
              </span>
            </div>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-400 transition-transform flex-shrink-0",
              showProfileDropdown && "rotate-180"
            )}
          />
        </button>
        <AnimatePresence>
          {showProfileDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileDropdown(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-black text-slate-900 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {profile?.email || user?.email || ""}
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className={cn(
                    "w-full px-4 py-3 text-left flex items-center gap-3 transition-colors hover:bg-red-50 text-red-600",
                    disconnecting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    {disconnecting ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">
                      {disconnecting ? "Disconnecting..." : "Disconnect Facebook"}
                    </p>
                    <p className="text-xs text-red-400">Remove Facebook connection</p>
                  </div>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-50">
      <div className="flex items-center gap-4">
        {pages.length > 0 ? (
          <>
            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Active Page:</h2>
            <div className="relative">
              <button
                onClick={() => setShowPageDropdown(!showPageDropdown)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all min-w-[200px]",
                  showPageDropdown && "bg-slate-100 border-primary/30"
                )}
              >
                {selectedPage ? (
                  <>
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-black text-primary">
                        {(selectedPage.page_name || 'FB')
                          .split(' ')
                          .map((word: string) => word[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 truncate text-left flex-1">
                      {selectedPage.page_name}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-slate-400">Select Page</span>
                )}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-400 transition-transform flex-shrink-0",
                    showPageDropdown && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {showPageDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowPageDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden max-h-80 overflow-y-auto"
                    >
                      {pages.map((page) => (
                        <button
                          key={page.page_id}
                          onClick={() => {
                            setSelectedPage(page);
                            setShowPageDropdown(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left flex items-center gap-3 transition-colors hover:bg-primary/5",
                            selectedPage?.page_id === page.page_id && "bg-primary/10"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            selectedPage?.page_id === page.page_id
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-600"
                          )}>
                            <span className={cn(
                              "text-xs font-black",
                              selectedPage?.page_id === page.page_id ? "text-white" : "text-slate-600"
                            )}>
                              {(page.page_name || 'FB')
                                .split(' ')
                                .map((word: string) => word[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-bold truncate",
                              selectedPage?.page_id === page.page_id ? "text-primary" : "text-slate-900"
                            )}>
                              {page.page_name}
                            </p>
                            {page.page_category && (
                              <p className="text-xs text-slate-400 truncate">{page.page_category}</p>
                            )}
                          </div>
                          {selectedPage?.page_id === page.page_id && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-sm font-bold text-red-600">
              No pages available. Please create a Facebook page to continue.
            </span>
          </div>
        )}
      </div>

      {/* Profile Image with Dropdown */}
      {renderProfileSection()}
    </div>
  );
}
