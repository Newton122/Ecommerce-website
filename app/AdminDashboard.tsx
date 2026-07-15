"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { useAuth } from "../src/app/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number; reviews: number };
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [outOfStockCount, setOutOfStockCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    const load = async () => {
      try {
        const [prodRes, ordRes, usersRes] = await Promise.all([
          fetch(`${API}/products`),
          fetch(`${API}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!prodRes.ok) throw new Error("Failed to load products");
        if (!ordRes.ok) throw new Error("Failed to load admin data");
        if (!usersRes.ok) throw new Error("Failed to load users");
        const products = await prodRes.json();
        const orderData = await ordRes.json();
        const usersData = await usersRes.json();
        if (!cancelled) {
          const productList = Array.isArray(products) ? products : (products.products || []);
          setProductCount(productList.length);
          setOutOfStockCount(productList.filter((p: any) => (p.stock ?? 0) <= 0).length);
          setOrders(Array.isArray(orderData) ? orderData : []);
          setUsers(Array.isArray(usersData) ? usersData : []);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
  const recent = orders.slice(0, 5);

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>Admin Dashboard</h1>
            <p className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>Manage products and orders</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/products" className="px-5 py-2.5 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">Products</Link>
            <Link href="/admin/users" className="px-5 py-2.5 border border-white/15 text-white rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all">Users</Link>
            <Link href="/admin/orders" className="px-5 py-2.5 border border-white/15 text-white rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all">Orders</Link>
          </div>
        </div>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-12">
          <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Products</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{productCount ?? "—"}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Users</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{users.length}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Orders</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Revenue</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{totalRevenue.toLocaleString()} DZD</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Out of Stock</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{outOfStockCount ?? "—"}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Avg Order</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString() : 0} DZD</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Pending</p>
            <p className="text-3xl font-extrabold text-yellow-400" style={{ fontFamily: "Manrope, sans-serif" }}>{orders.filter((o: any) => o.status === "pending").length}</p>
          </div>
          <Link href="/admin/analytics" className="rounded-2xl border border-white/[0.08] bg-card p-6 hover:border-primary/40 transition-all flex items-center justify-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            <span className="text-white font-bold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>View Analytics</span>
          </Link>
          </div>

        <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Recent Orders</h2>
        {recent.length === 0 ? (
          <p className="text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((o: any) => (
              <Link key={o.id} href="/admin/orders" className="block rounded-2xl border border-white/[0.08] bg-card p-5 hover:border-primary/40 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-white text-sm font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>Order #{o.id}</p>
                    <p className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{o.user?.email || "—"} · {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">{o.status || "pending"}</span>
                    <span className="text-white font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>{(o.totalPrice || 0).toLocaleString()} DZD</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
