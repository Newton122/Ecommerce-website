"use client";

import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function OrdersPage() {
  useRequireAuth();
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = async () => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      if (!cancelled) {
        setOrders(Array.isArray(data) ? data : data.orders || []);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  const cancelOrder = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API}/orders/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel order");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelivery = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API}/orders/${id}/confirm-delivery`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to confirm delivery");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "delivered" } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm delivery");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!lastUpdated) return;
    const t = setInterval(() => {
      load();
    }, 30000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={load} className="px-5 py-2 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>My Orders</h1>
        <p className="text-white/50 mb-10" style={{ fontFamily: "Inter, sans-serif" }}>View and track your order history</p>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 text-primary"><Package size={48} /></div>
            <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>No orders yet</h3>
            <p className="text-white/40 text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Start shopping to see your orders here.
            </p>
            <a href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">Continue Shopping</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="rounded-2xl border border-white/[0.08] bg-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white text-sm font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>Order #{order.id}</p>
                      <p className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{new Date(order.createdAt || order.date).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status || "pending"] || "bg-yellow-500/20 text-yellow-400"}`}>{order.status || "pending"}</span>
                      <span className="text-white font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>{typeof order.totalPrice === "number" ? `${order.totalPrice.toLocaleString()} DZD` : order.total}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(order.status === "pending" || order.status === "paid") && (
                      <button onClick={() => cancelOrder(order.id)} disabled={actionLoading === order.id} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all disabled:opacity-60">
                        {actionLoading === order.id ? "Cancelling…" : "Cancel Order"}
                      </button>
                    )}
                    {order.status === "shipped" && (
                      <button onClick={() => confirmDelivery(order.id)} disabled={actionLoading === order.id} className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-semibold hover:bg-green-500/25 transition-all disabled:opacity-60">
                        {actionLoading === order.id ? "Confirming…" : "Confirm Delivery"}
                      </button>
                    )}
                  </div>
                <div className="text-white/50 text-xs mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  {order.items?.length || order.itemCount || 0} item{(order.items?.length || order.itemCount || 0) !== 1 ? "s" : ""}
                </div>
                {order.items && order.items.length > 0 && (
                  <div className="border-t border-white/[0.06] pt-4 mt-4 space-y-3">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#111] shrink-0">
                          <img src={item.product?.image || item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{item.product?.name || item.name}</p>
                          <p className="text-white/40 text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>Qty: {item.quantity}</p>
                        </div>
                        <span className="text-white text-xs font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {((item.product?.price || item.price) * item.quantity).toLocaleString()} DZD
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-10">
          <a href="/shop" className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all">Continue Shopping</a>
        </div>
      </div>
    </div>
  );
}
