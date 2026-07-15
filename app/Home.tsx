"use client";

import type { Metadata } from "next";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, ChevronRight, Printer, Camera, Palette, Award } from "lucide-react";
import ProductCard from "../src/app/components/ProductCard";
import type { Product } from "../src/app/data/types";
import { reviews } from "../src/app/data/reviews";
import { usePromo } from "../src/app/context/PromoContext";
import { useSEO } from "../src/app/hooks/useSEO";

export const metadata: Metadata = {
  title: "Blackphics — Algeria's Premier Creative Studio",
  description: "Custom apparel, graphic design, photography and branding from Algeria. DTF, screen print, sublimation — any design, any fabric, any quantity.",
  openGraph: {
    title: "Blackphics — Algeria's Premier Creative Studio",
    description: "Custom apparel, graphic design, photography and branding from Algeria.",
    images: ["https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=1200&h=630&fit=crop&auto=format"],
  },
};

const HERO_IMG = "https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=1920&h=1080&fit=crop&auto=format";
const STORY_IMG = "https://images.unsplash.com/photo-1652809096869-55b40bd14ac1?w=1200&h=900&fit=crop&auto=format";
const PHOTO_IMG = "https://images.unsplash.com/photo-1768818653161-0ad28dede131?w=800&h=1000&fit=crop&auto=format";
const DESIGN_IMG = "https://images.unsplash.com/photo-1650661926447-9efb2610f64c?w=800&h=600&fit=crop&auto=format";

const services = [
  {
    icon: Palette,
    title: "Graphic Design",
    desc: "Logos, brand kits, social media graphics, and everything in between. We turn ideas into visuals.",
    color: "#39d353",
    to: "/services#design",
  },
  {
    icon: Printer,
    title: "Custom Printing",
    desc: "DTF, screen print, sublimation — any design, any fabric, any quantity. Delivered across Algeria.",
    color: "#d4a817",
    to: "/services#printing",
  },
  {
    icon: Camera,
    title: "Photography",
    desc: "Product shoots, portraits, event coverage. Studio-grade photography at competitive rates.",
    color: "#6c8ef4",
    to: "/services#photography",
  },
  {
    icon: Award,
    title: "Brand Identity",
    desc: "Full brand systems for startups and businesses. Strategy, visuals, and guidelines in one package.",
    color: "#e05f5f",
    to: "/services#branding",
  },
];

const stats = [
  { label: "Happy Clients", value: "1,200+" },
  { label: "Prints Delivered", value: "15,000+" },
  { label: "Design Projects", value: "800+" },
  { label: "Years Active", value: "6+" },
];

export default function Home() {
  useSEO({ title: "Home", description: "Blackphics is Algeria's premier creative studio for custom apparel, graphic design, photography and branding.", pathname: "/" });
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/products`);
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

  const featured = products.slice(0, 3);
  const { promotions } = usePromo();
  const activePromos = promotions.filter((p) => {
    const now = new Date();
    return new Date(p.startDate) <= now && new Date(p.endDate) >= now;
  });

  return (
    <div className="bg-background text-foreground">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Blackphics hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <motion.div
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
            }}
            className="max-w-3xl"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
                Algeria's Premier Creative Studio
              </span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tight text-white mb-6"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Design.
              <br />
              <span className="text-primary">Print.</span>
              <br />
              Create.
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.05 } } }}
              className="text-white/60 text-lg sm:text-xl max-w-xl leading-relaxed mb-10"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Custom apparel, graphic design, photography and branding — all under one roof. Built for creators who demand more.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="group flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-2xl text-base hover:bg-primary/90 transition-all duration-200 shadow-xl shadow-primary/25 hover:shadow-primary/50 hover:-translate-y-0.5"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Shop Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/custom"
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-black font-semibold rounded-2xl text-base hover:brightness-110 transition-all duration-200 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                <Play size={16} className="fill-black" />
                Start Designing
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-white text-xs tracking-widest uppercase" style={{ fontFamily: "Inter, sans-serif" }}>Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-white/[0.06] bg-black/60 backdrop-blur-sm" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value }, idx) => (
              <div key={label} className="text-center" data-aos="zoom-in-up" data-aos-delay={`${idx * 80}`}>
                <div className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {value}
                </div>
                <div className="text-white/40 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMOTIONS ─── */}
      {activePromos.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-transparent to-black/40" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Limited Offers
            </p>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {activePromos.map((p) => (
                <Link
                  key={p.id}
                  href={p.link}
                  className="group flex-shrink-0 w-80 rounded-2xl border border-white/[0.08] bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-[16/9]">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-base mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>{p.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{p.description}</p>
                    <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-3 group-hover:gap-2 transition-all" style={{ fontFamily: "Inter, sans-serif" }}>
                      Shop Now <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              Featured Collection
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
              Wear the Vision
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-white/50 hover:text-primary text-sm font-semibold transition-colors group"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            View All
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="zoom-in" data-aos-delay="100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full aspect-[3/4] bg-card animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => setLoading(true)} className="px-5 py-2 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90">Retry</button>
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="zoom-in" data-aos-delay="100">
            {featured.map((p, idx) => (
              <ProductCard key={p.id} product={p} aosDelay={idx * 80} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/40">No products available right now.</p>
          </div>
        )}
        <div className="flex justify-center mt-10 sm:hidden">
          <Link
            href="/shop"
            className="flex items-center gap-2 px-6 py-3 border border-white/15 text-white rounded-xl text-sm font-semibold hover:border-primary/40 hover:text-primary transition-all"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            View All Products <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-24 bg-gradient-to-b from-transparent to-black/40" data-aos="fade-up" data-aos-delay="120">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              What We Do
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
              Full Creative Suite
            </h2>
            <p className="text-white/50 text-lg mt-4 max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
              From a single logo to a complete brand system — we handle every layer of your creative identity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map(({ icon: Icon, title, desc, color, to }, idx) => (
              <Link
                key={title}
                href={to}
                data-aos="zoom-out-up"
                data-aos-delay={`${idx * 80}`}
                className="group relative p-6 rounded-2xl border border-white/[0.06] bg-card hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at 30% 20%, ${color}12 0%, transparent 70%)` }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  {desc}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200" style={{ color, fontFamily: "Inter, sans-serif" }}>
                  Learn more <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRAND STORY PREVIEW ─── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative" data-aos="fade-right" data-aos-delay="100">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img
                src={STORY_IMG}
                alt="Blackphics studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Award size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
                    #1 in Algiers
                  </div>
                  <div className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                    Custom Print Studio
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="160">
            <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Our Story
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
              Born in Algeria,<br />Built for Creators
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
              Blackphics started in a small studio in Algiers with a single printer and a big vision: to give Algerian creatives access to world-class print quality and design services without leaving the country.
            </p>
            <p className="text-white/60 text-base leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              Six years later, we've printed over 15,000 pieces, designed hundreds of brand identities, and built a community of creators who refuse to compromise on quality.
            </p>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white rounded-xl font-semibold text-sm hover:border-primary/50 hover:text-primary transition-all duration-200"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Read Our Story
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CUSTOM DESIGN CTA ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden" data-aos="zoom-in" data-aos-delay="120">
            <img
              src="https://images.unsplash.com/photo-1774897778836-3b13763e71b3?w=1600&h=600&fit=crop&auto=format"
              alt="Custom design"
              className="w-full h-80 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8 sm:px-16">
              <div className="max-w-lg">
                <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                  Your Vision. Your Shirt.
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
                  Design Your Custom Tee — It Takes 2 Minutes
                </h2>
                <p className="text-white/60 text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                  Upload your artwork, pick your shirt and color, and we handle the rest.
                </p>
                <Link
                  href="/custom"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-xl text-sm hover:brightness-110 transition-all shadow-xl shadow-primary/30 hover:-translate-y-0.5"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Start Designing <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-gradient-to-b from-transparent via-black/30 to-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14" data-aos="fade-up" data-aos-delay="120">
            <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              Testimonials
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
              What Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, idx) => (
              <div
                key={r.id}
                data-aos="zoom-in-up"
                data-aos-delay={`${idx * 80}`}
                className="p-6 rounded-2xl border border-white/[0.06] bg-card hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {r.avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>
                      {r.name}
                    </div>
                    <div className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                      {r.location} · {r.product}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHOTO SHOWCASE ─── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up" data-aos-delay="120">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { src: "https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=600&h=800&fit=crop&auto=format", span: "lg:row-span-2 aspect-[3/4] sm:aspect-auto" },
            { src: "https://images.unsplash.com/photo-1650661926447-9efb2610f64c?w=600&h=400&fit=crop&auto=format", span: "aspect-[4/3]" },
            { src: "https://images.unsplash.com/photo-1768818653161-0ad28dede131?w=600&h=400&fit=crop&auto=format", span: "aspect-[4/3]" },
            { src: "https://images.unsplash.com/photo-1774897778836-3b13763e71b3?w=600&h=400&fit=crop&auto=format", span: "aspect-[4/3]" },
            { src: "https://images.unsplash.com/photo-1766149756155-4a8122ad0732?w=600&h=400&fit=crop&auto=format", span: "aspect-[4/3]" },
          ].map(({ src, span }, i) => (
            <div key={i} data-aos="zoom-in" data-aos-delay={`${i * 80}`} className={`relative rounded-2xl overflow-hidden group bg-[#111] ${span}`}>
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
