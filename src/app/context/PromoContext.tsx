"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  startDate: string;
  endDate: string;
}

interface PromoContextValue {
  promotions: Promotion[];
  activePromo: Promotion | null;
  setActivePromo: (promo: Promotion | null) => void;
  dismissPromo: () => void;
}

const PromoContext = createContext<PromoContextValue | undefined>(undefined);

const DEMO_PROMOS: Promotion[] = [
  {
    id: "summer-sale-2026",
    title: "Summer Sale — 30% Off",
    description: "Get 30% off all graphic tees and oversized fits. Limited time only.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=500&fit=crop&auto=format",
    link: "/shop",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "free-shipping",
    title: "Free Shipping",
    description: "Free delivery across Algeria on all orders over 5,000 DZD this week.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&auto=format",
    link: "/shop",
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promotions] = useState<Promotion[]>(DEMO_PROMOS);
  const [activePromo, _setActivePromo] = useState<Promotion | null>(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("blacphics_dismissed_promos");
    if (stored) {
      try {
        setDismissedIds(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const eligible = promotions.filter(
      (p) => new Date(p.startDate) <= now && new Date(p.endDate) >= now && !dismissedIds.includes(p.id)
    );
    if (eligible.length > 0 && !activePromo) {
      _setActivePromo(eligible[0]);
    }
  }, [promotions, dismissedIds, activePromo]);

  const setActivePromo = (promo: Promotion | null) => {
    _setActivePromo(promo);
  };

  const dismissPromo = () => {
    if (activePromo) {
      const next = [...dismissedIds, activePromo.id];
      setDismissedIds(next);
      sessionStorage.setItem("blacphics_dismissed_promos", JSON.stringify(next));
      _setActivePromo(null);
    }
  };

  return (
    <PromoContext.Provider value={{ promotions, activePromo, setActivePromo, dismissPromo }}>
      {children}
    </PromoContext.Provider>
  );
}

export function usePromo() {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error("usePromo must be used within a PromoProvider");
  return ctx;
}
