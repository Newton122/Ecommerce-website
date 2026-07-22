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

