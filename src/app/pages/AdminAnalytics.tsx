"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useAnalytics } from "../context/AnalyticsContext";
import Link from "next/link";
import { Eye, Shirt, ShoppingCart, Package } from "lucide-react";

interface AnalyticsEvent {
  name: string;
  data?: Record<string, any>;
  timestamp: number;
}

export default function AdminAnalytics() {
  const { token } = useAuth();
  const { getEvents } = useAnalytics();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    setEvents(getEvents());
  }, [getEvents]);

  const pageViews = events.filter((e) => e.name === "page_view").length;
  const productViews = events.filter((e) => e.name === "product_view").length;
  const cartAdds = events.filter((e) => e.name === "cart_add").length;
  const orders = events.filter((e) => e.name === "order_placed").length;

  const recentEvents = [...events].reverse().slice(0, 50);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>Analytics</h1>
            <p className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>Lightweight client-side analytics overview</p>
          </div>
          <Link href="/admin" className="px-5 py-2.5 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/15 transition-all">Dashboard</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Page Views", value: pageViews, icon: Eye },
            { label: "Product Views", value: productViews, icon: Shirt },
            { label: "Add to Cart", value: cartAdds, icon: ShoppingCart },
            { label: "Orders Placed", value: orders, icon: Package },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-2xl border border-white/[0.08] bg-card">
              <div className="text-2xl mb-2 text-primary"><stat.icon size={24} /></div>
              <div className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>{stat.value}</div>
              <div className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-white font-bold text-base" style={{ fontFamily: "Manrope, sans-serif" }}>Recent Events</h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {recentEvents.length === 0 ? (
              <p className="text-white/40 text-sm p-6" style={{ fontFamily: "Inter, sans-serif" }}>No events tracked yet</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-white/40 uppercase text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-5 py-3">Event</th>
                    <th className="px-5 py-3">Details</th>
                    <th className="px-5 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((e, idx) => (
                    <tr key={idx} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-5 py-3">
                        <span className="text-white font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>{e.name}</span>
                      </td>
                      <td className="px-5 py-3 text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>
                        {e.data ? JSON.stringify(e.data) : "—"}
                      </td>
                      <td className="px-5 py-3 text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>
                        {formatTime(e.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
