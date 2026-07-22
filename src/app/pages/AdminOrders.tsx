"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import WhatsAppLink from "../components/WhatsAppLink";

const API = "/api";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = async () => {
    try {
      const res = await fetch(`${API}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      toast.success(`Order #${id} marked as ${status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>Orders</h1>
        <p className="text-white/50 mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Manage and update customer orders</p>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        {orders.length === 0 ? (
          <p className="text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o: any) => (
              <div key={o.id} className="rounded-2xl border border-white/[0.08] bg-card overflow-hidden">
                <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-white text-sm font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>Order #{o.id}</p>
                    <p className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                      {o.user?.name || "—"} · {o.user?.email || "—"} · {o.user?.phone || ""} · {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-white/50 text-xs">{o.items?.length || 0} items</span>
                    <span className="text-white font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>{(o.totalPrice || 0).toLocaleString()} DZD</span>
                    <select
                      value={o.status || "pending"}
                      disabled={updating === o.id}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold outline-none ${statusStyles[o.status || "pending"]} bg-white/5 border border-white/10`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="text-black">{s}</option>
                      ))}
                    </select>
                    <WhatsAppLink
                      phone={o.phone}
                      text={`Hello ${o.user?.name || ""}, regarding your order #${o.id}. Status: ${o.status || "pending"}.`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 text-xs font-semibold hover:bg-green-500/25 transition-all"
                    >
                      WhatsApp
                    </WhatsAppLink>
                    <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-all">
                      {expanded === o.id ? "Hide" : "Items"}
                    </button>
                  </div>
                </div>
                {expanded === o.id && (
                  <div className="border-t border-white/[0.06] p-5 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/60 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                      <div><span className="text-white/40">Address:</span> {o.address || "—"}</div>
                      <div><span className="text-white/40">City:</span> {o.city || "—"}</div>
                      <div><span className="text-white/40">Phone:</span> {o.phone || "—"}</div>
                      <div><span className="text-white/40">Date:</span> {new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    {o.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-background shrink-0">
                          <img src={item.product?.image || ""} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{item.product?.name || `Product #${item.productId}`}</p>
                          <p className="text-white/40 text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>
                            Qty: {item.quantity}{item.size ? ` · ${item.size}` : ""}{item.color ? ` · ${item.color}` : ""}
                          </p>
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
      </div>
    </div>
  );
}
