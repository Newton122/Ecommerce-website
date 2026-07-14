"use client";

import { useState, useRef } from "react";
import { useEffect } from "react";
import { Upload, ArrowRight, Check, RefreshCw, Shirt, MapPin } from "lucide-react";
import Link from "next/link";

const shirtTypes = ["Classic Crew Neck", "Oversized Drop Shoulder", "Polo Shirt", "Hoodie", "Tote Bag"];
const placements = ["Front Center", "Back Center", "Left Chest", "Right Sleeve"];
const shirtColors = [
  { name: "Jet Black", value: "#080808" },
  { name: "Pure White", value: "#f5f5f5" },
  { name: "Forest Green", value: "#1a3d2b" },
  { name: "Navy Blue", value: "#0a1628" },
  { name: "Ash Gray", value: "#4a4a4a" },
  { name: "Sand Beige", value: "#c8b896" },
];

const PLACEMENT_CLASSES: Record<string, string> = {
  "Front Center": "inset-x-1/4 top-[28%] bottom-[30%]",
  "Back Center": "inset-x-1/4 top-[28%] bottom-[30%]",
  "Left Chest": "left-[18%] top-[22%] w-[28%] h-[22%]",
  "Right Sleeve": "right-[14%] top-[22%] w-[26%] h-[20%]",
};

function ShirtSvg({ color, type, className }: { color: string; type: string; className?: string }) {
  const stroke = "rgba(255,255,255,0.15)";
  const highlight = "rgba(255,255,255,0.12)";

  if (type === "Tote Bag") {
    return (
      <svg viewBox="0 0 400 420" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M120 80 L120 360 Q120 390 150 390 L250 390 Q280 390 280 360 L280 80 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M120 80 Q200 40 280 80" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M120 110 Q200 70 280 110" fill="none" stroke={highlight} strokeWidth="2" />
        <rect x="140" y="140" width="120" height="160" rx="4" fill="none" stroke={stroke} strokeWidth="1.5" />
        <line x1="200" y1="140" x2="200" y2="300" stroke={stroke} strokeWidth="1" />
        <line x1="140" y1="220" x2="260" y2="220" stroke={stroke} strokeWidth="1" />
      </svg>
    );
  }

  if (type === "Hoodie") {
    return (
      <svg viewBox="0 0 400 460" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M110 90 L110 380 Q110 410 140 410 L260 410 Q290 410 290 380 L290 90 Q290 60 260 60 L240 60 L220 90 L180 90 L160 60 L140 60 Q110 60 110 90 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M160 60 L180 90 L220 90 L240 60" fill={highlight} />
        <path d="M190 90 L190 140 M210 90 L210 140" stroke={stroke} strokeWidth="1.5" />
        <path d="M130 140 Q200 180 270 140" fill="none" stroke={stroke} strokeWidth="1.5" />
        <path d="M110 90 L80 110 L80 150 L110 130 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M290 90 L320 110 L320 150 L290 130 Z" fill={color} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  if (type === "Polo Shirt") {
    return (
      <svg viewBox="0 0 400 440" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M120 80 L120 370 Q120 400 150 400 L250 400 Q280 400 280 370 L280 80 Q280 60 250 60 L230 80 L200 110 L170 80 L150 60 Q120 60 120 80 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M200 110 L200 180 L170 160" fill="none" stroke={stroke} strokeWidth="1.5" />
        <path d="M200 110 L200 180 L230 160" fill="none" stroke={stroke} strokeWidth="1.5" />
        <path d="M170 130 L200 160 L230 130" fill="none" stroke={highlight} strokeWidth="1.5" />
        <line x1="200" y1="160" x2="200" y2="260" stroke={stroke} strokeWidth="1" />
        <line x1="170" y1="220" x2="230" y2="220" stroke={stroke} strokeWidth="1" />
        <line x1="170" y1="260" x2="230" y2="260" stroke={stroke} strokeWidth="1" />
      </svg>
    );
  }

  if (type === "Oversized Drop Shoulder") {
    return (
      <svg viewBox="0 0 420 440" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M100 90 L100 370 Q100 400 130 400 L290 400 Q320 400 320 370 L320 90 Q320 50 280 50 L250 80 L170 80 L140 50 Q100 50 100 90 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M100 90 L60 110 L60 160 L100 140 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M320 90 L360 110 L360 160 L320 140 Z" fill={color} stroke={stroke} strokeWidth="2" />
        <path d="M170 80 L200 130 L250 80" fill={highlight} />
        <line x1="200" y1="130" x2="200" y2="280" stroke={stroke} strokeWidth="1" />
        <line x1="140" y1="220" x2="260" y2="220" stroke={stroke} strokeWidth="1" />
        <line x1="140" y1="260" x2="260" y2="260" stroke={stroke} strokeWidth="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 440" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M120 80 L120 370 Q120 400 150 400 L250 400 Q280 400 280 370 L280 80 Q280 60 250 60 L230 80 L200 110 L170 80 L150 60 Q120 60 120 80 Z" fill={color} stroke={stroke} strokeWidth="2" />
      <path d="M170 80 L200 110 L230 80" fill={highlight} />
      <line x1="200" y1="110" x2="200" y2="300" stroke={stroke} strokeWidth="1" />
      <line x1="140" y1="200" x2="260" y2="200" stroke={stroke} strokeWidth="1" />
      <line x1="140" y1="240" x2="260" y2="240" stroke={stroke} strokeWidth="1" />
      <line x1="140" y1="280" x2="260" y2="280" stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

export default function CustomDesign() {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shirtType, setShirtType] = useState(shirtTypes[0]);
  const [shirtColor, setShirtColor] = useState(shirtColors[0]);
  const [placement, setPlacement] = useState(placements[0]);
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep(2);
  };

  useEffect(() => {
    try {
      const dataUrl = sessionStorage.getItem("mockupImage");
      const name = sessionStorage.getItem("mockupFileName") || "upload.png";
      const type = sessionStorage.getItem("mockupFileType") || "image/png";
      if (dataUrl) {
        fetch(dataUrl)
          .then((r) => r.blob())
          .then((blob) => {
            const f = new File([blob], name, { type });
            setUploadedFile(f);
            setPreviewUrl(dataUrl);
            setStep(2);
            sessionStorage.removeItem("mockupImage");
            sessionStorage.removeItem("mockupFileName");
            sessionStorage.removeItem("mockupFileType");
            sessionStorage.removeItem("mockupFileSize");
          })
          .catch(() => {
            setPreviewUrl(dataUrl);
            setStep(2);
          });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>
            Order Submitted!
          </h2>
          <p className="text-white/60 text-base mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
            We&apos;ve received your custom design request.
          </p>
          <p className="text-white/40 text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
            Our team will reach out via WhatsApp within 24 hours to confirm details and pricing.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="https://wa.me/213791938758?text=Hello%20Blackphics%2C%20I%27m%20interested%20in%20a%20custom%20design"
              className="px-5 py-3 bg-[#25d366] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#20bd5a] transition-colors"
              style={{ fontFamily: "Manrope, sans-serif" }}
              onClick={(e) => {
                e.preventDefault();
                const appUrl = `whatsapp://send?phone=213791938758&text=${encodeURIComponent("Hello Blackphics, I'm interested in a custom design")}`;
                const webUrl = `https://wa.me/213791938758?text=${encodeURIComponent("Hello Blackphics, I'm interested in a custom design")}`;
                try {
                  window.location.href = appUrl;
                  setTimeout(() => (window.location.href = webUrl), 600);
                } catch (err) {
                  window.location.href = webUrl;
                }
              }}
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/"
              className="px-5 py-3 border border-white/15 text-white rounded-xl font-semibold text-sm hover:border-white/30 transition-colors"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-20 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center py-14">
          <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
            Custom Print Studio
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
            Design Your Shirt
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Upload your artwork, configure your order, and we&apos;ll handle the rest. Premium quality, delivered across Algeria.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-0 mb-14">
          {[
            { n: 1, label: "Upload Design" },
            { n: 2, label: "Configure" },
            { n: 3, label: "Preview & Order" },
          ].map(({ n, label }, i, arr) => (
            <div key={n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    step >= n ? "bg-primary border-primary text-black" : "border-white/20 text-white/40"
                  }`}
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {step > n ? <Check size={16} /> : n}
                </div>
                <span className={`text-xs mt-2 whitespace-nowrap ${step >= n ? "text-white/70" : "text-white/30"}`} style={{ fontFamily: "Inter, sans-serif" }}>
                  {label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-all ${step > n ? "bg-primary" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: controls */}
          <div className="space-y-8">
            {/* Step 1: Upload */}
            <div className={`transition-opacity duration-300 ${step >= 1 ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                <span className="w-6 h-6 rounded-full bg-primary text-black text-xs flex items-center justify-center font-bold">1</span>
                Upload Your Design
              </h3>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative rounded-3xl border border-white/[0.08] bg-card/80 p-10 text-center cursor-pointer transition-all duration-200 shadow-2xl ${
                  dragging
                    ? "border-primary bg-primary/10"
                    : uploadedFile
                    ? "border-primary/50 bg-primary/5"
                    : "hover:border-white/30 hover:bg-white/[0.02]"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf,.ai,.svg"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {uploadedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Check size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>{uploadedFile.name}</p>
                      <p className="text-white/40 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB — Click to change
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center">
                      <Upload size={24} className="text-white/40" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>
                        Drop your file here or click to browse
                      </p>
                      <p className="text-white/40 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        PNG, JPG, SVG, PDF, AI — Up to 50MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Configure */}
            <div className={`space-y-6 transition-opacity duration-300 ${step >= 2 ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                <span className="w-6 h-6 rounded-full bg-primary text-black text-xs flex items-center justify-center font-bold">2</span>
                Configure Your Order
              </h3>

              {/* Shirt type */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Shirt Type</p>
                <div className="flex flex-wrap gap-2">
                  {shirtTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setShirtType(t); if (step < 2) setStep(2); }}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        shirtType === t ? "bg-primary text-black" : "border border-white/10 text-white/60 hover:border-white/25 hover:text-white"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                  Shirt Color — <span className="text-white/70 normal-case tracking-normal">{shirtColor.name}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {shirtColors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setShirtColor(c)}
                      title={c.name}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${
                        shirtColor.value === c.value ? "border-primary scale-110" : "border-white/20 hover:border-white/40"
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>

              {/* Placement */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Print Placement</p>
                <div className="grid grid-cols-2 gap-2">
                  {placements.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlacement(p)}
                      className={`py-2.5 px-4 rounded-xl text-sm font-medium text-left transition-all ${
                        placement === p ? "bg-primary/15 border border-primary/50 text-primary" : "border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {step < 3 && uploadedFile && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-4 bg-primary text-black font-bold rounded-2xl text-base hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Preview My Design <ArrowRight size={18} />
                </button>
              )}
            </div>

            {/* Step 3: Order */}
            {step >= 3 && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                  <span className="w-6 h-6 rounded-full bg-primary text-black text-xs flex items-center justify-center font-bold">3</span>
                  Ready to Order
                </h3>
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-card space-y-3">
                  {[
                    { label: "Shirt Type", value: shirtType },
                    { label: "Color", value: shirtColor.name },
                    { label: "Placement", value: placement },
                    { label: "File", value: uploadedFile?.name || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>{label}</span>
                      <span className="text-white font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-primary text-black font-bold rounded-2xl text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Request Print <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => { setStep(1); setUploadedFile(null); setPreviewUrl(null); }}
                    className="p-4 border border-white/10 text-white/50 rounded-2xl hover:border-white/20 hover:text-white transition-all"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Preview */}
          <div className="sticky top-24 self-start">
            <h3 className="text-white/50 text-xs uppercase tracking-widest mb-5 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
              Live Preview
            </h3>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#111] border border-white/[0.08] flex items-center justify-center p-6">
              <div className="relative w-full max-w-[360px]">
                <ShirtSvg color={shirtColor.value} type={shirtType} className="w-full h-auto drop-shadow-2xl" />

                {previewUrl && (
                  <div
                    className={`absolute flex items-center justify-center ${PLACEMENT_CLASSES[placement] || PLACEMENT_CLASSES["Front Center"]}`}
                  >
                    <img
                      src={previewUrl}
                      alt="Your design"
                      className="max-w-full max-h-full object-contain"
                      style={{
                        transform: "rotate(-2deg) scale(0.92)",
                        filter: "contrast(1.05) saturate(0.9)",
                        opacity: 0.92,
                      }}
                    />
                  </div>
                )}

                {!previewUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                    <Shirt size={64} className="text-white/10" />
                    <p className="text-white/20 text-sm text-center max-w-32" style={{ fontFamily: "Inter, sans-serif" }}>
                      Upload a design to see preview
                    </p>
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>{shirtType}</span>
                    <span className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>{placement}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl border border-white/[0.06] bg-card/50 text-center">
              <p className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> Delivered across all 58 wilayas of Algeria</span>
              </p>
              <p className="text-white/30 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                Starting from 2,500 DZD · 3-5 business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
