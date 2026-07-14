import Link from "next/link";
import { Palette, Printer, Camera, Award, ArrowRight, Check } from "lucide-react";

const DESIGN_IMG = "https://images.unsplash.com/photo-1650661926447-9efb2610f64c?w=900&h=600&fit=crop&auto=format";
const PRINT_IMG = "https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?w=900&h=600&fit=crop&auto=format";
const PHOTO_IMG = "https://images.unsplash.com/photo-1768818653161-0ad28dede131?w=900&h=600&fit=crop&auto=format";
const BRAND_IMG = "https://images.unsplash.com/photo-1652809096869-55b40bd14ac1?w=900&h=600&fit=crop&auto=format";

const services = [
  {
    id: "design",
    icon: Palette,
    color: "#39d353",
    title: "Graphic Design",
    subtitle: "Visual identity that speaks louder than words",
    desc: "From minimal logos to full brand systems — our designers craft visuals that capture your essence and convert attention into loyalty. We work in Arabic, French, and English.",
    features: [
      "Logo design & brand identity",
      "Social media graphics & templates",
      "Flyers, posters, and print materials",
      "Motion graphics & animations",
      "Presentation design",
    ],
    pricing: "From 5,000 DZD",
    image: DESIGN_IMG,
    cta: "Request Design",
    imgLeft: false,
  },
  {
    id: "printing",
    icon: Printer,
    color: "#d4a817",
    title: "Printing Services",
    subtitle: "Professional-grade printing at Algerian prices",
    desc: "DTF (Direct to Film), screen printing, sublimation, and embroidery — we use the latest technology to deliver prints that outlast trends. Minimum 1 piece, maximum unlimited.",
    features: [
      "DTF printing — no minimum order",
      "Screen printing for bulk orders",
      "Sublimation on polyester fabrics",
      "Embroidery for premium garments",
      "Nationwide delivery (58 wilayas)",
    ],
    pricing: "From 1,800 DZD/piece",
    image: PRINT_IMG,
    cta: "Start Printing",
    imgLeft: true,
  },
  {
    id: "photography",
    icon: Camera,
    color: "#6c8ef4",
    title: "Photography",
    subtitle: "Images that stop the scroll",
    desc: "Our photographers combine technical precision with artistic vision. Whether you need product shots for your e-commerce or portraits for your personal brand, we deliver images that convert.",
    features: [
      "Product & e-commerce photography",
      "Portrait & headshot sessions",
      "Event & corporate coverage",
      "Fashion & lookbook shoots",
      "Photo editing & retouching",
    ],
    pricing: "From 8,000 DZD/session",
    image: PHOTO_IMG,
    cta: "Book a Shoot",
    imgLeft: false,
  },
  {
    id: "branding",
    icon: Award,
    color: "#e05f5f",
    title: "Brand Identity",
    subtitle: "Built to compete. Designed to last.",
    desc: "A complete brand system that tells your story across every touchpoint — from your first impression online to the packaging in your customer's hands. Strategic, deliberate, and unmistakably yours.",
    features: [
      "Brand strategy & positioning",
      "Logo system (primary, secondary, icon)",
      "Color palette & typography guide",
      "Brand guidelines document",
      "Social media kit & templates",
    ],
    pricing: "From 25,000 DZD",
    image: BRAND_IMG,
    cta: "Start Your Brand",
    imgLeft: true,
  },
];

export default function Services() {
  return (
    <div className="bg-background min-h-screen text-white">
      {/* Header */}
      <div className="relative pt-32 pb-20 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-4 relative" style={{ fontFamily: "Inter, sans-serif" }}>
          What We Offer
        </p>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 relative" style={{ fontFamily: "Manrope, sans-serif" }}>
          Creative Services
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto relative" style={{ fontFamily: "Inter, sans-serif" }}>
          Everything a creative brand needs — under one roof, in one city, delivered across Algeria.
        </p>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-32">
        {services.map(({ id, icon: Icon, color, title, subtitle, desc, features, pricing, image, cta, imgLeft }) => (
          <section key={id} id={id} className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20">
            <div className={`grid lg:grid-cols-2 gap-16 items-center ${imgLeft ? "lg:grid-flow-col-dense" : ""}`}>
              {/* Image */}
              <div className={`relative ${imgLeft ? "lg:col-start-2" : ""}`}>
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                </div>
                {/* Floating price badge */}
                <div
                  className="absolute -bottom-5 left-6 px-5 py-3 rounded-2xl border text-sm font-bold shadow-2xl"
                  style={{ backgroundColor: `${color}18`, borderColor: `${color}40`, color, fontFamily: "Manrope, sans-serif" }}
                >
                  {pricing}
                </div>
              </div>

              {/* Content */}
              <div className={imgLeft ? "lg:col-start-1 lg:row-start-1" : ""}>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-semibold" style={{ color, fontFamily: "Inter, sans-serif" }}>
                    {title}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {subtitle}
                </h2>
                <p className="text-white/60 text-base leading-relaxed mb-7" style={{ fontFamily: "Inter, sans-serif" }}>
                  {desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                        <Check size={11} style={{ color }} />
                      </div>
                      <span className="text-white/70 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="group flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-2xl shadow-black/20"
                    style={{
                      backgroundColor: color,
                      color: "#080808",
                      boxShadow: `0 10px 30px ${color}30`,
                      fontFamily: "Manrope, sans-serif",
                    }}
                  >
                    {cta}
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-6 py-3.5 border border-white/10 text-white/60 rounded-xl font-semibold text-sm hover:border-white/25 hover:text-white transition-all"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
            Not Sure What You Need?
          </h2>
          <p className="text-white/50 text-lg mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
            Tell us about your project and we'll figure it out together. No pressure, no commitment.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-2xl text-base hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-xl shadow-primary/25"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Let's Talk <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
