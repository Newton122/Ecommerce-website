import Link from "next/link";
import { ArrowRight, Zap, Target, Heart, Globe } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1652809096869-55b40bd14ac1?w=1200&h=800&fit=crop&auto=format";
const FOUNDER_IMG = "https://images.unsplash.com/photo-1774897778836-3b13763e71b3?w=600&h=700&fit=crop&auto=format";
const TEAM_IMG = "https://images.unsplash.com/photo-1766149756155-4a8122ad0732?w=800&h=600&fit=crop&auto=format";

const values = [
  {
    icon: Zap,
    title: "Quality First",
    desc: "We never ship work we're not proud of. Every print, every design, every photo is held to the same standard: excellence.",
    color: "#39d353",
  },
  {
    icon: Target,
    title: "Creator-Centric",
    desc: "We built Blacphics for creators — people who have something to say and need the tools to say it loudly.",
    color: "#d4a817",
  },
  {
    icon: Heart,
    title: "Algerian Roots",
    desc: "Proudly built in Algeria, for Algeria and beyond. We're not just a business — we're part of the creative movement.",
    color: "#e05f5f",
  },
  {
    icon: Globe,
    title: "Always Accessible",
    desc: "World-class creative services shouldn't be reserved for Casablanca or Dubai. We bring them to every wilaya.",
    color: "#6c8ef4",
  },
];

const milestones = [
  { year: "2023", event: "Blacphics founded in Algiers with one DTF printer and a vision." },
  { year: "2024", event: "First 500 clients. Expanded to graphic design and photography services." },
  { year: "2025", event: "Launched online platform. 5,000+ prints delivered, 200+ design projects." },
  { year: "2026", event: "8,000+ prints, 300+ design projects, 500+ happy clients — and counting." },
];

export default function About() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-96 overflow-hidden" data-aos="fade-up">
        <img src={HERO_IMG} alt="Blacphics studio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 text-center px-6">
          <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
            Our Story
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
            About Blacphics
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Mission statement */}
        <div className="py-20 border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto text-center bg-card/90 border border-white/[0.08] rounded-3xl p-12">
            <p className="text-white/70 text-xl sm:text-2xl leading-relaxed font-light" style={{ fontFamily: "Inter, sans-serif" }}>
              "We believe that{" "}
              <span className="text-white font-semibold">every Algerian creator deserves access</span>{" "}
              to world-class tools. Blacphics exists to close that gap — one print, one brand, one photo at a time."
            </p>
          </div>
        </div>

        {/* Brand Story */}
        <section className="py-20" data-aos="fade-up">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                Where It Began
              </p>
              <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
                Born in Algiers,<br />Built for the World
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                In 2023, Blacphics was a dream and a single DTF printer in a small Algiers apartment. The founder, seeing a gap in quality creative services accessible to everyday Algerian entrepreneurs and creators, set out to build something different.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                What started as a print-on-demand side project became a full-service creative studio. We added graphic design, then photography, then branding — each service driven by what our clients actually needed.
              </p>
              <p className="text-white/60 text-base leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                Today, Blacphics serves clients across all 58 wilayas, from solo creators to small businesses, startups, and NGOs. The mission hasn't changed: make great creative work accessible in Algeria.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img src={TEAM_IMG} alt="Blacphics team" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 border-y border-white/[0.06]">
          <h2 className="text-3xl font-extrabold text-white mb-14 text-center" style={{ fontFamily: "Manrope, sans-serif" }}>
            Our Journey
          </h2>
          <div className="relative max-w-2xl mx-auto bg-card/70 rounded-3xl p-10 border border-white/[0.08]">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
            <div className="space-y-10">
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex gap-8 items-start">
                  <div className="w-16 shrink-0 text-right">
                    <span className="text-primary font-bold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>{year}</span>
                  </div>
                  <div className="relative mt-1">
                    <div className="absolute -left-[27px] w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed pt-0.5 pl-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    {event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                The Founder
              </p>
              <h2 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                The Face Behind the Brand
              </h2>
              <p className="text-white/40 text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                Creative Director & Founder — Algiers, Algeria
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                A self-taught designer and entrepreneur, our founder built Blacphics from scratch — learning printing, design, photography, and business in parallel. His philosophy: don't wait for permission to create something great.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                When not running the studio, he mentors young Algerian designers and advocates for building a sustainable creative economy in North Africa.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-black rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-primary/25"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Get in Touch <ArrowRight size={15} />
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4]">
                <img src={FOUNDER_IMG} alt="Founder" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 border-t border-white/[0.06]">
          <div className="text-center mb-14">
            <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              What We Stand For
            </p>
            <h2 className="text-4xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
              Our Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-6 rounded-2xl border border-white/[0.06] bg-card hover:border-white/15 transition-all duration-300 hover:-translate-y-1">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
