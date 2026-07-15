"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, Check, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "../src/app/context/CartContext";
import { useAuth } from "../src/app/context/AuthContext";
import ProductCard from "../src/app/components/ProductCard";
import type { Product } from "../src/app/data/types";
import { useSEO } from "../src/app/hooks/useSEO";

interface ReviewItem {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  author: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { addItem } = useCart();
  const { user, token } = useAuth();

  useSEO({ title: product?.name || "Product", description: product?.description?.slice(0, 160) || "Blackphics product", pathname: `/shop/${id}` });

  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        if (data.category) {
          const relatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/products?category=${data.category}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            const items = relatedData.products || relatedData;
            setRelated(items.filter((p: Product) => p.id !== data.id).slice(0, 3));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/reviews?productId=${id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setReviewSubmitting(true);
    setReviewError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(id),
          rating: reviewRating,
          comment: reviewComment,
          author: user?.name || "Anonymous",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to submit review");
      }
      const newReview = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      setReviewComment("");
      setReviewRating(5);
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>{error || "Product not found"}</h2>
          <Link href="/shop" className="text-primary hover:underline" style={{ fontFamily: "Inter, sans-serif" }}><ArrowLeft size={14} /> Back to Shop</Link>
        </div>
      </div>
    );
  }

  const outOfStock = (product.stock ?? 1) <= 0;

  const handleAdd = () => {
    if (!selectedSize || outOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor || product.colors[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const prevImg = () => setImgIdx((i) => (i === 0 ? product.images.length - 1 : i - 1));
  const nextImg = () => setImgIdx((i) => (i === product.images.length - 1 ? 0 : i + 1));

  return (
    <div className="bg-background min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors group"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 mb-24" data-aos="fade-up">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#111] group">
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    imgIdx === i ? "border-primary" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-card/90 p-8">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  {product.category}
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`p-2.5 rounded-xl border transition-all ${wishlist ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-white/10 text-white/40 hover:border-white/25 hover:text-white"}`}
              >
                <Heart size={18} className={wishlist ? "fill-current" : ""} />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-white/20"}
                  />
                ))}
              </div>
              <span className="text-white/50 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                {product.rating} ({product.reviewCount ?? 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-white/[0.08]">
              <span className="text-4xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                {product.price.toLocaleString()} DZD
              </span>
              {product.originalPrice && (
                <span className="text-white/30 text-xl line-through" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {product.originalPrice.toLocaleString()} DZD
                </span>
              )}
              {outOfStock && (
                <span className="px-3 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/20">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                Color {selectedColor && <span className="text-white/80 normal-case tracking-normal">— {selectedColor}</span>}
              </p>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-xl border-2 transition-all ${
                      selectedColor === c ? "border-primary scale-110" : "border-white/20 hover:border-white/40"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/50 text-xs uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
                  Size {selectedSize && <span className="text-white/80 normal-case tracking-normal">— {selectedSize}</span>}
                </p>
                <button className="text-primary text-xs hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-11 px-4 rounded-xl text-sm font-semibold transition-all ${
                      selectedSize
                        ? "bg-primary text-black"
                        : "border border-white/10 text-white/60 hover:border-white/25 hover:text-white"
                    }`}
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && !outOfStock && (
                <p className="text-red-400/70 text-xs mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Please select a size
                </p>
              )}
              {outOfStock && (
                <p className="text-red-400/70 text-xs mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  This item is currently out of stock
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAdd}
                disabled={!selectedSize || outOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                  added
                    ? "bg-primary/80 text-black shadow-xl shadow-primary/25"
                    : outOfStock
                    ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                    : selectedSize
                    ? "bg-primary text-black hover:bg-primary/90 shadow-xl shadow-primary/25 hover:shadow-primary/50 hover:-translate-y-0.5"
                    : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                }`}
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {added ? <><Check size={18} /> Added to Cart!</> : outOfStock ? <><ShoppingBag size={18} /> Sold Out</> : <><ShoppingBag size={18} /> Add to Cart</>}
              </button>
            </div>

            {/* Description */}
            <p className="text-white/60 text-sm leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              {product.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: "Free Delivery", sub: "Algiers & surrounds" },
                { icon: Shield, label: "Quality Guarantee", sub: "100% satisfaction" },
                { icon: RotateCcw, label: "Easy Returns", sub: "Within 7 days" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center p-3 rounded-xl border border-white/[0.06] bg-card">
                  <Icon size={16} className="text-primary mb-1.5" />
                  <span className="text-white text-xs font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>{label}</span>
                  <span className="text-white/40 text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "Manrope, sans-serif" }}>
            Customer Reviews
          </h2>

          {user && (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-6 rounded-2xl border border-white/[0.08] bg-card">
              <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Write a review</h3>
              <div className="flex items-center gap-3 mb-4">
                <label className="text-white/60 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts..."
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm mb-4 focus:outline-none focus:border-primary/50"
              />
              {reviewError && <p className="text-red-400 text-xs mb-3">{reviewError}</p>}
              <button
                type="submit"
                disabled={reviewSubmitting || !reviewComment.trim()}
                className="px-5 py-2.5 bg-primary text-black rounded-xl text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          <div className="grid md:grid-cols-3 gap-5">
            {reviewsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/[0.06] bg-card animate-pulse" />
              ))
            ) : reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl border border-white/[0.06] bg-card">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                    "{r.comment}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                      {r.author?.slice(0, 2).toUpperCase() || "AN"}
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>{r.author}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </section>

        {/* Related */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "Manrope, sans-serif" }}>
            You May Also Like
          </h2>
          {related.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-white/40 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>No related products found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
