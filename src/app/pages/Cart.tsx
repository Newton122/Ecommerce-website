"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, AlertTriangle, Lock, Truck, RefreshCcw } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart();
  const router = useRouter();
  const { user, token } = useAuth();
  const shipping = total > 5000 ? 0 : 500;
  const grandTotal = total + shipping;
  const [stockMap, setStockMap] = useState<Record<number, number>>({});
  const [stockLoading, setStockLoading] = useState(false);

  const validateStock = async () => {
    if (!token || items.length === 0) return;
    setStockLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        const map: Record<number, number> = {};
        for (const p of products) map[p.id] = p.stock ?? 0;
        setStockMap(map);
      }
    } catch {
      // ignore
    } finally {
      setStockLoading(false);
    }
  };

  useEffect(() => {
    validateStock();
  }, [items, token]);

  const handleCheckout = () => {
    if (user) {
      router.push("/checkout");
    } else {
      router.push("/login");
    }
  };

  const outOfStockItems = items.filter((it) => (stockMap[it.id] ?? -1) < it.quantity);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl border border-white/10 bg-card flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-white/20" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>
            Your cart is empty
          </h2>
          <p className="text-white/40 text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
            Add some products to get started
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-all"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Browse Shop <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
            Your Cart
          </h1>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
          </Link>
        </div>

        {outOfStockItems.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                Some items in your cart are no longer available in the requested quantity
              </p>
              <p className="text-red-400/70 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                Please remove or update them before checkout
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const stock = stockMap[item.id];
              const itemOOS = stock !== undefined && stock < item.quantity;
              return (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className={`flex gap-5 p-5 rounded-2xl border transition-all ${itemOOS ? "border-red-500/20 bg-red-500/5" : "border-white/[0.06] bg-card hover:border-white/10"}`}
                >
                  <div className="w-24 h-28 rounded-xl overflow-hidden bg-[#111] shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base leading-tight mb-1 truncate" style={{ fontFamily: "Manrope, sans-serif" }}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                        Size: {item.size}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                      </div>
                    </div>
                    {itemOOS && (
                      <p className="text-red-400 text-xs mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        Only {stock} left in stock
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {/* Qty */}
                      <div className="flex items-center gap-0 rounded-xl border border-white/10 overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.size, item.color, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-9 h-9 flex items-center justify-center text-white text-sm font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (stock !== undefined && item.quantity >= stock) return;
                            updateQty(item.id, item.size, item.color, item.quantity + 1);
                          }}
                          disabled={stock !== undefined && item.quantity >= stock}
                          className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold text-base" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {(item.price * item.quantity).toLocaleString()} DZD
                        </span>
                        <button
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border border-white/[0.08] bg-card space-y-5">
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: "Manrope, sans-serif" }}>
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>Subtotal</span>
                  <span className="text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{total.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>Shipping</span>
                  <span className="text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {shipping === 0 ? <span className="text-primary">Free</span> : `${shipping.toLocaleString()} DZD`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                    Free shipping on orders over 5,000 DZD
                  </p>
                )}
                <div className="border-t border-white/[0.08] pt-3 flex justify-between">
                  <span className="text-white font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Total</span>
                  <span className="text-white font-extrabold text-lg" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {grandTotal.toLocaleString()} DZD
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={outOfStockItems.length > 0}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-2xl text-base hover:brightness-110 transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {outOfStockItems.length > 0 ? "Remove Unavailable Items" : "Proceed to Checkout"} <ArrowRight size={18} />
              </button>

              {/* Promo code */}
              <div className="flex gap-2">
                <input
                  placeholder="Promo code"
                  className="flex-1 bg-card border border-white/[0.08] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 placeholder:text-white/20 transition-all"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
                <button
                  className="px-4 py-2.5 border border-white/10 text-white/50 rounded-xl text-sm hover:border-white/25 hover:text-white transition-all"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Apply
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-white/25 text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>
                <span className="inline-flex items-center gap-1"><Lock size={12} /> Secure</span>
                <span className="inline-flex items-center gap-1"><Truck size={12} /> Fast Delivery</span>
                <span className="inline-flex items-center gap-1"><RefreshCcw size={12} /> Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
