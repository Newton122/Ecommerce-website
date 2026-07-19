"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface AnalyticsEvent {
  name: string;
  data?: Record<string, any>;
  timestamp: number;
}

interface AnalyticsContextType {
  track: (name: string, data?: Record<string, any>) => void;
  getEvents: () => AnalyticsEvent[];
}

const STORAGE_KEY = "blacphics_analytics";
const MAX_EVENTS = 200;

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

function loadEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: AnalyticsEvent[]) {
  if (typeof window === "undefined") return;
  const trimmed = events.slice(-MAX_EVENTS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AnalyticsEvent[]>(loadEvents);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const track = useCallback((name: string, data?: Record<string, any>) => {
    const evt: AnalyticsEvent = { name, data, timestamp: Date.now() };
    setEvents((prev) => [...prev, evt]);
  }, []);

  const getEvents = () => events;

  return (
    <AnalyticsContext.Provider value={{ track, getEvents }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error("useAnalytics must be used within AnalyticsProvider");
  return ctx;
}
