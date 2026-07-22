"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, Check, MessageCircle } from "lucide-react";

const CONTACT_IMG = "https://images.unsplash.com/photo-1652809096869-55b40bd14ac1?w=1200&h=800&fit=crop&auto=format";

const topics = ["Custom Print Order", "Graphic Design", "Photography Booking", "Branding Package", "General Inquiry", "Other"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: topics[0], message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  return (
    <div className="bg-background min-h-screen text-white">
      {/* Banner */}
      <div className="relative h-64 overflow-hidden" data-aos="fade-up">
        <img src={CONTACT_IMG} alt="Contact" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16">
          <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
            Get In Touch
          </p>
          <h1 className="text-5xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
            Contact Us
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 py-16">
        <div className="grid lg:grid-cols-5 gap-14">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-white/[0.08] bg-card/90 p-8 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>
                Let's Create Together
              </h2>
              <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                Have a project in mind? Want to order a custom print? Just want to say hello? We respond to every message, usually within a few hours.
              </p>
            </div>

            {/* WhatsApp prominent CTA */}
            <a
              href="https://wa.me/213791938758?text=Hello%20Blacphics%2C%20I%27d%20like%20to%20chat%20about%20a%20project"
              className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-black hover:brightness-110 transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25d366]/20 flex items-center justify-center shrink-0">
                <MessageCircle size={24} className="text-[#25d366]" />
              </div>
              <div>
                <p className="text-white font-bold text-base" style={{ fontFamily: "Manrope, sans-serif" }}>
                  Chat on WhatsApp
                </p>
                <p className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                  Fastest response — usually under 1 hour
                </p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
              </div>
            </a>

            {/* Contact details */}
            <div className="space-y-5">
              {[
                { icon: Mail, label: "Email", value: "matikitibrighton6@gmail.com", href: "mailto:matikitibrighton6@gmail.com" },
                { icon: Phone, label: "Phone", value: "+213 791 938 758", href: "tel:+213791938758" },
                { icon: MapPin, label: "Location", value: "Algiers, Algeria", href: "#" },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-center gap-4 rounded-3xl border border-white/[0.08] bg-card/70 p-4 group transition-all hover:border-primary/30">
                  <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                    <Icon size={16} className="text-white/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-white/30 text-xs uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>{label}</p>
                    <p className="text-white/80 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-card/90 shadow-xl shadow-black/10">
              <h4 className="text-white/50 text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                Business Hours
              </h4>
              {[
                { day: "Saturday – Thursday", hours: "9:00 AM – 8:00 PM" },
                { day: "Friday", hours: "2:00 PM – 8:00 PM" },
              ].map(({ day, hours }) => (
                <div key={day} className="flex justify-between py-2 border-b border-white/[0.05] last:border-0">
                  <span className="text-white/60 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{day}</span>
                  <span className="text-white/80 text-sm font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-5">
                  <Check size={28} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                  Message Sent!
                </h3>
                <p className="text-white/50 text-base max-w-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                  We'll get back to you within a few hours. Check WhatsApp for the fastest reply.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 bg-card/90 p-8 rounded-3xl border border-white/[0.08] shadow-2xl">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>
                      Full Name *
                    </label>
                    <input
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-white/20"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-white/20"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>
                      WhatsApp / Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+213 XXX XXX XXX"
                      className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-white/20"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>
                      Topic
                    </label>
                    <select
                      name="topic"
                      value={form.topic}
                      onChange={handleChange}
                      className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us about your project..."
                    className="w-full bg-card border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-white/20 resize-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-2xl text-base hover:brightness-110 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
                <p className="text-white/30 text-xs text-center" style={{ fontFamily: "Inter, sans-serif" }}>
                  Or reach us directly on WhatsApp for the fastest response
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
