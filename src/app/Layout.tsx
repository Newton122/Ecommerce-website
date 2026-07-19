"use client";

import { useEffect, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AOS from "aos";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PromoModal from "./components/PromoModal";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <PromoModal />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export const metadata = {
  metadataBase: new URL("https://blacphics.com"),
  title: {
    default: "Blacphics — Algeria's Premier Creative Studio",
    template: "%s — Blacphics",
  },
  description: "Custom apparel, graphic design, photography and branding from Algeria. DTF, screen print, sublimation — any design, any fabric, any quantity.",
  keywords: ["Blacphics", "custom apparel", "graphic design", "photography", "Algeria", "DTF printing", "streetwear", "branding"],
  authors: [{ name: "Blacphics" }],
  openGraph: {
    type: "website",
    locale: "en_DZ",
    url: "https://blacphics.com",
    siteName: "Blacphics",
    title: "Blacphics — Algeria's Premier Creative Studio",
    description: "Custom apparel, graphic design, photography and branding from Algeria.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=1200&h=630&fit=crop&auto=format",
        width: 1200,
        height: 630,
        alt: "Blacphics Creative Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blacphics — Algeria's Premier Creative Studio",
    description: "Custom apparel, graphic design, photography and branding from Algeria.",
    images: ["https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=1200&h=630&fit=crop&auto=format"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

