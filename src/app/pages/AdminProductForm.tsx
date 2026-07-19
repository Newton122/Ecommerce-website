"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

function getEditId(pathname: string): number | null {
  const match = pathname.match(/^\/admin\/products\/(\d+)\/edit$/);
  return match ? Number(match[1]) : null;
}

export default function AdminProductForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuth();
  const editId = getEditId(pathname);
  const isEdit = editId !== null;

  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    colors: "",
    sizes: "",
    description: "",
    stock: "",
    badge: "",
    collections: "",
    image: "",
    images: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API}/products/${editId}`);
        if (!res.ok) throw new Error("Failed to load product");
        const p = await res.json();
        if (cancelled) return;
        setForm({
          name: p.name || "",
          price: String(p.price ?? ""),
          originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
          category: p.category || "",
          colors: (p.colors || []).join(", "),
          sizes: (p.sizes || []).join(", "),
          description: p.description || "",
          stock: String(p.stock ?? ""),
          badge: p.badge || "",
          collections: (p.collections || []).map((c: any) => c.id).join(", "),
          image: p.image || "",
          images: (p.images || []).join("\n"),
        });
        setImagePreview(p.image || "");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isEdit, editId]);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      update("image", data.url);
      setImagePreview(data.url);
      const existing = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
      if (!existing.includes(data.url)) {
        update("images", [...existing, data.url].join("\n"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category: form.category,
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        description: form.description,
        stock: form.stock ? Number(form.stock) : 0,
        badge: form.badge ? form.badge : undefined,
        collectionSlugs: form.collections.split(",").map((s) => s.trim()).filter(Boolean),
        image: form.image,
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      };

      if (!payload.image) throw new Error("A main image is required (upload or paste a URL)");

      const res = await fetch(
        isEdit ? `${API}/admin/products/${editId}` : `${API}/admin/products`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data?.error === "string" ? data.error : JSON.stringify(data?.error || "Save failed");
        throw new Error(msg);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full h-11 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-sm outline-none focus:border-primary/50 dark:bg-white/5 dark:text-white";
  const labelClass = "block text-xs uppercase tracking-wide text-white/50 mb-1.5";

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
          {isEdit ? "Edit Product" : "New Product"}
        </h1>
        <p className="text-white/50 mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
          {isEdit ? `Editing product #${editId}` : "Create a new product"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="signature" required />
            </div>
            <div>
              <label className={labelClass}>Price (DZD)</label>
              <input className={inputClass} type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Original Price (DZD, optional)</label>
              <input className={inputClass} type="number" value={form.originalPrice} onChange={(e) => update("originalPrice", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input className={inputClass} type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Badge</label>
              <select className={inputClass} value={form.badge} onChange={(e) => update("badge", e.target.value)}>
                <option value="">None</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Colors (comma separated)</label>
              <input className={inputClass} value={form.colors} onChange={(e) => update("colors", e.target.value)} placeholder="#080808, #ffffff" />
            </div>
            <div>
              <label className={labelClass}>Sizes (comma separated)</label>
              <input className={inputClass} value={form.sizes} onChange={(e) => update("sizes", e.target.value)} placeholder="S, M, L, XL" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Collections (comma separated slugs)</label>
            <input className={inputClass} value={form.collections} onChange={(e) => update("collections", e.target.value)} placeholder="mens, unisex" />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea className="w-full min-h-[120px] rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-primary/50" value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>Main Image</label>
            <div className="flex items-center gap-4">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/15 transition-all disabled:opacity-50">
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
              <input className={inputClass} value={form.image} onChange={(e) => { update("image", e.target.value); setImagePreview(e.target.value); }} placeholder="https://..." />
            </div>
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="mt-3 w-24 h-28 object-cover rounded-lg bg-background border border-white/10" />
            )}
          </div>

          <div>
            <label className={labelClass}>Additional Image URLs (one per line)</label>
            <textarea className="w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-primary/50" value={form.images} onChange={(e) => update("images", e.target.value)} placeholder="https://..." />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-6 py-3 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50">
              {submitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </button>
            <button type="button" onClick={() => router.push("/admin/products")} className="px-6 py-3 border border-white/15 text-white rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
