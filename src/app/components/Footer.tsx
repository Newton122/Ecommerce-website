import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Linkedin, Zap, Mail, MapPin, Phone } from "lucide-react";
import WhatsAppLink from "./WhatsAppLink";

const socials = [
  { icon: Instagram, href: "https://www.instagram.com/mr_newton._/?hl=en", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/brighton-matikiti-1a48b2365/", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const shopLinks = [
  { label: "All Products", to: "/shop" },
  { label: "New Arrivals", to: "/shop?filter=new" },
  { label: "Sale", to: "/shop?filter=sale" },
  { label: "Custom Print", to: "/custom" },
  { label: "Collections", to: "/collections" },
  { label: "FAQ", to: "/faq" },
];

const serviceLinks = [
  { label: "Graphic Design", to: "/services#design" },
  { label: "Printing Services", to: "/services#printing" },
  { label: "Photography", to: "/services#photography" },
  { label: "Branding", to: "/services#branding" },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap size={18} className="text-black fill-black" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-200" style={{ fontFamily: "Manrope, sans-serif" }}>
                BLACKPHICS
              </span>
            </Link>
            <p className="text-foreground/70 text-sm leading-relaxed mb-6 font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
              Algeria's premier creative studio for custom apparel, graphic design, photography & branding.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                   className="w-9 h-9 rounded-lg border border-foreground/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/50 hover:scale-110 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-foreground font-extrabold text-sm uppercase tracking-widest mb-5" style={{ fontFamily: "Manrope, sans-serif" }}>
              Shop
            </h4>
            <ul className="space-y-3 list-disc list-inside">
              {shopLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    href={to}
                    className="text-foreground/70 hover:text-primary font-semibold text-sm transition-all duration-200 hover:translate-x-1"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-foreground font-extrabold text-sm uppercase tracking-widest mb-5" style={{ fontFamily: "Manrope, sans-serif" }}>
              Services
            </h4>
            <ul className="space-y-3 list-disc list-inside">
              {serviceLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    href={to}
                    className="text-foreground/70 hover:text-primary font-semibold text-sm transition-all duration-200 hover:translate-x-1"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground font-extrabold text-sm uppercase tracking-widest mb-5" style={{ fontFamily: "Manrope, sans-serif" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
                <span className="text-foreground/70 text-sm font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                  Algiers, Algeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-primary shrink-0" />
                <a href="mailto:matikitibrighton6@gmail.com" className="text-foreground/70 hover:text-primary font-semibold text-sm transition-all duration-200 hover:translate-x-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  matikitibrighton6@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-primary shrink-0" />
                <WhatsAppLink phone="213791938758" text="Hello Blackphics, I'd like to chat about a project" className="text-foreground/70 hover:text-primary font-semibold text-sm transition-all duration-200 hover:translate-x-1" ariaLabel="WhatsApp">
                  +213 791 938 758
                </WhatsAppLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground/60 text-xs font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
            © 2025 Blackphics. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Service", to: "/terms" },
              { label: "Returns & Refunds", to: "/returns" },
            ].map(({ label, to }) => (
              <Link key={label} href={to}               className="text-foreground/60 hover:text-primary font-semibold text-xs transition-all duration-200 hover:translate-x-1" style={{ fontFamily: "Inter, sans-serif" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
