"use client";

import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePromo } from "../context/PromoContext";

export default function PromoModal() {
  const { activePromo, dismissPromo } = usePromo();

  if (!activePromo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={dismissPromo} />
      <div className="relative w-full max-w-lg bg-card border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={dismissPromo}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="relative aspect-video">
          <img src={activePromo.image} alt={activePromo.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <span className="px-3 py-1 rounded-full bg-primary text-black text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
              Limited Offer
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
            {activePromo.title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            {activePromo.description}
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={activePromo.link}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-xl text-sm hover:brightness-110 transition-all shadow-xl shadow-primary/30"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Shop Now <ArrowRight size={16} />
            </Link>
            <button
              onClick={dismissPromo}
              className="px-5 py-3 border border-white/15 text-white/70 rounded-xl text-sm font-semibold hover:border-white/25 hover:text-white transition-all"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
