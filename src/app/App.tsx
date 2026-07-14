"use client";

import { useEffect, ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { PromoProvider } from "./context/PromoContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import AOS from "aos";
import "aos/dist/aos.css";

export default function App({ children }: { children: ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 120,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <AnalyticsProvider>
                <PromoProvider>
                  {children}
                </PromoProvider>
              </AnalyticsProvider>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}
