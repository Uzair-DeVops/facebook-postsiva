"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { FacebookPage } from "../../facebookoauth/types";

interface SelectedPageContextType {
  selectedPage: FacebookPage | null;
  setSelectedPage: (page: FacebookPage | null) => void;
  pages: FacebookPage[];
  setPages: (pages: FacebookPage[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SelectedPageContext = createContext<SelectedPageContextType | undefined>(undefined);

const STORAGE_KEY = "postsiva_selected_page";

export function SelectedPageProvider({ children }: { children: ReactNode }) {
  const [selectedPage, setSelectedPageState] = useState<FacebookPage | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load selected page from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedPageState(parsed);
      }
    } catch (error) {
      console.error("Error loading selected page from localStorage:", error);
    }
    setLoading(false);
  }, []);

  // Save selected page to localStorage whenever it changes (client-side only)
  const setSelectedPage = (page: FacebookPage | null) => {
    setSelectedPageState(page);
    if (mounted) {
      try {
        if (page) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(page));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error("Error saving selected page to localStorage:", error);
      }
    }
  };

  return (
    <SelectedPageContext.Provider
      value={{
        selectedPage,
        setSelectedPage,
        pages,
        setPages,
        loading,
        setLoading,
      }}
    >
      {children}
    </SelectedPageContext.Provider>
  );
}

export function useSelectedPage() {
  const context = useContext(SelectedPageContext);
  if (context === undefined) {
    throw new Error("useSelectedPage must be used within a SelectedPageProvider");
  }
  return context;
}
