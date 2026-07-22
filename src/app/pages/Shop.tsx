"use client";

import type { Metadata } from "next";
import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X, ShoppingCart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../data/types";
import { useSEO } from "../hooks/useSEO";

export const metadata: Metadata = {
  title: "Shop All — Blacphics",
  description: "Browse the full Blacphics collection. Signature, oversized, graphic and essential apparel printed in Algeria.",
  openGraph: {
    title: "Shop All — Blacphics",
    description: "Browse the full Blacphics collection. Signature, oversized, graphic and essential apparel printed in Algeria.",
    images: ["https://images.unsplash.com/photo-1760126130290-bbbc9b41292a?w=1200&h=630&fit=crop&auto=format"],
  },
};

export default function Shop() {
  useSEO({ title: "Shop All", description: "Browse the full Blacphics collection. Signature, oversized, graphic and essential apparel printed in Algeria.", pathname: "/shop" });

  const BANNER = "https://images.unsplash.com/photo-1760126130290-bbbc9b41292a?w=1920&h=500&fit=crop&auto=format";
  const categories = ["All", "signature", "oversized", "graphic", "essential", "limited"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const priceRanges = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "Under 3,000 DZD", min: 0, max: 3000 },
    { label: "3,000 – 4,000 DZD", min: 3000, max: 4000 },
    { label: "4,000+ DZD", min: 4000, max: Infinity },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceIdx, setPriceIdx] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${"/api"}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (selectedSizes.length > 0)
      list = list.filter((p) => selectedSizes.some((s) => p.sizes.includes(s)));
    const { min, max } = priceRanges[priceIdx];
    list = list.filter((p) => p.price >= min && p.price <= max);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, selectedSizes, priceIdx, sortBy]);

  const [visible, setVisible] = useState(12);
  const hasMore = filtered.length > visible;

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

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
          <button onClick={() => setLoading(true)} className="px-5 py-2 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden" data-aos="zoom-in-down">
        <img src={BANNER} alt="Shop" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16">
          <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
            The Collection
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
            Shop All
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Toolbar */}
        <div className="flex items-center justify-between py-6 border-b border-white/[0.06]" data-aos="fade-right">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:-translate-y-0.5 hover:shadow-sm text-sm transition-all duration-200"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <SlidersHorizontal size={15} />
              Filters
              {(selectedSizes.length > 0 || priceIdx !== 0) && (
                <span className="w-4 h-4 bg-primary text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {selectedSizes.length + (priceIdx !== 0 ? 1 : 0)}
                </span>
              )}
            </button>
            <span className="text-white/30 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              {filtered.length} products
            </span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-card border border-white/10 text-white/70 text-sm rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-white/20 transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 py-5" data-aos="fade-up" data-aos-delay="120">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                category === c
                  ? "bg-primary text-black shadow-sm"
                  : "border border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:-translate-y-0.5 hover:shadow-sm"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mb-8 p-6 rounded-2xl border border-white/[0.08] bg-card" data-aos="fade-left">
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Sizes */}
              <div>
                <h4 className="text-white/50 text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`w-12 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSizes.includes(s)
                          ? "bg-primary text-black border-primary shadow-sm"
                          : "border border-white/10 text-white/50 hover:border-white/25 hover:text-white hover:-translate-y-0.5 hover:shadow-sm"
                      }`}
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <h4 className="text-white/50 text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  Price Range
                </h4>
                <div className="flex flex-col gap-2">
                  {priceRanges.map(({ label }, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          priceIdx === i ? "border-primary" : "border-white/20 group-hover:border-white/40"
                        }`}
                      >
                        {priceIdx === i && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span
                        className={`text-sm transition-colors ${priceIdx === i ? "text-white" : "text-white/50 group-hover:text-white/70"}`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {(selectedSizes.length > 0 || priceIdx !== 0) && (
              <button
                onClick={() => { setSelectedSizes([]); setPriceIdx(0); }}
                className="mt-5 flex items-center gap-1.5 text-white/40 hover:text-white hover:-translate-y-0.5 transition-all duration-200 text-xs"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <X size={12} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" data-aos="fade-up" data-aos-delay="80">
              {filtered.slice(0, visible).map((p, idx) => (
                <ProductCard key={p.id} product={p} aosDelay={idx * 80} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisible((v) => v + 12)}
                  className="px-6 py-3 bg-white/6 text-white rounded-xl shadow-sm hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-5xl mb-4 text-primary"><ShoppingCart size={48} /></div>
            <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>No products found</h3>
            <p className="text-white/40 text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Try adjusting your filters</p>
            <button
              onClick={() => { setCategory("All"); setSelectedSizes([]); setPriceIdx(0); }}
              className="px-5 py-2.5 bg-primary text-black rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all duration-200"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
