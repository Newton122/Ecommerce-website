"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`${API}/products`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category).filter(Boolean))), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesBadge = !badgeFilter || p.badge === badgeFilter;
      return matchesSearch && matchesCategory && matchesBadge;
    });
  }, [products, search, categoryFilter, badgeFilter]);

  const handleDelete = async (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId || !token) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/admin/products/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
      setDeleteId(null);
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>Products</h1>
            <p className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>Create, edit and delete products</p>
          </div>
          <Link href="/admin/products/new" className="px-5 py-2.5 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">Add Product</Link>
        </div>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-sm outline-none focus:border-primary/50"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-sm outline-none focus:border-primary/50 dark:bg-white/5 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
            className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-sm outline-none focus:border-primary/50 dark:bg-white/5 dark:text-white"
          >
            <option value="">All Badges</option>
            <option value="new">New</option>
            <option value="sale">Sale</option>
            <option value="hot">Hot</option>
          </select>
          {(search || categoryFilter || badgeFilter) && (
            <button onClick={() => { setSearch(""); setCategoryFilter(""); setBadgeFilter(""); }} className="h-10 px-4 rounded-lg border border-white/10 text-white/70 text-sm hover:border-primary/40 hover:text-primary transition-all">Clear</button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>No products found.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
            <table className="w-full text-left text-sm">
              <thead className="text-white/40 uppercase text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                <tr className="border-b border-white/[0.08]">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Badge</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr key={p.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-12 object-cover rounded-md bg-background" />
                        <span className="text-white font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/60">{p.category}</td>
                    <td className="px-5 py-4">
                      {p.badge ? (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${p.badge === "new" ? "bg-primary text-black" : p.badge === "sale" ? "bg-accent text-black" : "bg-red-500 text-white"}`}>{p.badge}</span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>{p.price?.toLocaleString()} DZD</td>
                     <td className="px-5 py-4">
                       <span className={(p.stock ?? 0) <= 0 ? "text-red-400 font-semibold" : "text-white/60"}>
                         {p.stock ?? 0}
                       </span>
                       {(p.stock ?? 0) <= 0 && (
                         <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20">
                           Out
                         </span>
                       )}
                     </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${p.id}/edit`} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-all">Edit</Link>
                        <button onClick={() => setDeleteId(p.id)} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Product"
        message="This will permanently remove this product. This action cannot be undone."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => { if (!deleting) setDeleteId(null); }}
      />
    </div>
  );
}
