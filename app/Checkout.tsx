"use client";

import { useState } from "react";
import { Check, Truck, ChevronDown } from "lucide-react";
import { useCart } from "../src/app/context/CartContext";
import { useAuth } from "../src/app/context/AuthContext";
import { useRequireAuth } from "../src/app/hooks/useRequireAuth";
import { useAnalytics } from "../src/app/context/AnalyticsContext";
import Link from "next/link";

const wilayas = [
  "Algiers", "Oran", "Constantine", "Annaba", "Blida", "Batna",
  "Djelfa", "Sétif", "Sidi Bel Abbès", "Biskra", "Tébessa", "El Oued",
  "Skikda", "Tiaret", "Béjaïa", "Tlemcen", "Ouargla", "Bordj Bou Arréridj",
  "Boumerdès", "El Tarf", "Tissemsilt", "Khenchela", "Souk Ahras", "Tipaza",
  "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane",
];

export default function Checkout() {
  useRequireAuth();
  const { user, token } = useAuth();
  const { items, total, clearCart } = useCart();
  const { track } = useAnalytics();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    address: "",
    wilaya: wilayas[0],
  });
  const [stockMap, setStockMap] = useState<Record<number, number>>({});

  const shipping = total > 5000 ? 0 : 500;
  const grandTotal = total + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const stockCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (stockCheck.ok) {
        const data = await stockCheck.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        const stockMap = new Map<number, number>(products.map((p: any) => [p.id, p.stock ?? 0]));
        const invalid = items.find((it) => (stockMap.get(it.id) ?? 0) < it.quantity);
        if (invalid) {
          throw new Error(`${invalid.name} is out of stock or no longer available`);
        }
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: form.address,
          city: form.wilaya,
          phone: form.phone,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to place order");
      }

      clearCart();
      setSubmitted(true);
      track("order_placed", { orderTotal: grandTotal, itemCount: items.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center">
              <Check size={32} className="text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>
            Order Confirmed!
          </h2>
          <p className="text-white/60 text-base mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
            Thank you for your order.
          </p>
          <p className="text-white/40 text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
            We'll send you a confirmation to <strong className="text-white/60">{form.email}</strong> and reach out via WhatsApp to confirm delivery details.
          </p>
           <div className="p-5 rounded-2xl border border-white/[0.08] bg-card mb-8 text-left space-y-2">
             <p className="text-white/50 text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Order Summary</p>
             <div className="flex justify-between text-sm">
               <span className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>Payment</span>
               <span className="text-white font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>Cash on Delivery</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>Delivery to</span>
               <span className="text-white font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>{form.wilaya}</span>
             </div>
             <div className="flex justify-between text-sm border-t border-white/[0.06] pt-2 mt-2">
               <span className="text-white font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Total Paid</span>
               <span className="text-primary font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>{grandTotal.toLocaleString()} DZD</span>
             </div>
           </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-bold text-sm"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-white mb-10" style={{ fontFamily: "Manrope, sans-serif" }}>
          Checkout
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/20 text-red-300 text-sm">{error}</div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Steps */}
            <div className="flex items-center gap-0 mb-8">
              {[{ n: 1, label: "Shipping" }, { n: 2, label: "Review" }].map(({ n, label }, i) => (
                <div key={n} className="flex items-center">
                  <button
                    onClick={() => step > n && setStep(n)}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${step >= n ? "bg-primary border-primary text-black" : "border-white/20 text-white/40"}`} style={{ fontFamily: "Manrope, sans-serif" }}>
                      {step > n ? <Check size={14} /> : n}
                    </div>
                    <span className={`text-sm font-medium ${step >= n ? "text-white" : "text-white/30"}`} style={{ fontFamily: "Inter, sans-serif" }}>{label}</span>
                  </button>
                  {i === 0 && <div className={`w-12 h-px mx-3 ${step > 1 ? "bg-primary" : "bg-white/10"}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "firstName", label: "First Name", placeholder: "Amine" },
                    { name: "lastName", label: "Last Name", placeholder: "Khalidi" },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>{label}</label>
                      <input name={name} value={(form as any)[name]} onChange={handleChange} placeholder={placeholder}
                        className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                        style={{ fontFamily: "Inter, sans-serif" }} />
                    </div>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                      className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                      style={{ fontFamily: "Inter, sans-serif" }} />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>WhatsApp / Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+213 XXX XXX XXX"
                      className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                      style={{ fontFamily: "Inter, sans-serif" }} />
                  </div>
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Street Address</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Rue de la Liberte, Apt 12"
                    className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                    style={{ fontFamily: "Inter, sans-serif" }} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Wilaya</label>
                    <div className="relative">
                      <select name="wilaya" value={form.wilaya} onChange={handleChange}
                        className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none"
                        style={{ fontFamily: "Inter, sans-serif" }}>
                        {wilayas.map((w) => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)}
                  className="w-full py-4 bg-primary text-black font-bold rounded-2xl text-base hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5"
                  style={{ fontFamily: "Manrope, sans-serif" }}>
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>Review Your Order</h2>
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-card space-y-3">
                  <p className="text-white/50 text-xs uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>Payment Method</p>
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="text-primary" />
                    <div>
                      <p className="text-white font-semibold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>Cash on Delivery</p>
                      <p className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Pay when your order arrives</p>
                    </div>
                  </div>
                </div>

                <button onClick={handlePlaceOrder} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-black font-bold rounded-2xl text-base hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5 disabled:opacity-70"
                  style={{ fontFamily: "Manrope, sans-serif" }}>
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>Confirm Order — {grandTotal.toLocaleString()} DZD</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border border-white/[0.08] bg-card space-y-5">
              <h2 className="text-white font-bold text-base" style={{ fontFamily: "Manrope, sans-serif" }}>Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#111] shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium leading-tight truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{item.name}</p>
                      <p className="text-white/40 text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>Size: {item.size}</p>
                    </div>
                    <span className="text-white text-xs font-semibold shrink-0" style={{ fontFamily: "Manrope, sans-serif" }}>
                      {(item.price * item.quantity).toLocaleString()} DZD
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-4 space-y-2">
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
                <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                  <span className="text-white font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Total</span>
                  <span className="text-primary font-extrabold" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {grandTotal.toLocaleString()} DZD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
