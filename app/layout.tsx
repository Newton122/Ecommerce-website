import type { ReactNode } from "react";
import type { Metadata as NextMetadata } from "next";
import "../src/styles/index.css";
import { CartProvider } from "../src/app/context/CartContext";
import { ThemeProvider } from "../src/app/context/ThemeContext";
import { AuthProvider } from "../src/app/context/AuthContext";
import { PromoProvider } from "../src/app/context/PromoContext";
import { NotificationProvider } from "../src/app/context/NotificationContext";
import { AnalyticsProvider } from "../src/app/context/AnalyticsContext";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../src/app/components/Navbar";
import Footer from "../src/app/components/Footer";
import PromoModal from "../src/app/components/PromoModal";
import { Toaster } from "../src/app/components/ui/sonner";
import { ErrorBoundary } from "../src/app/components/ErrorBoundary";

export const metadata: NextMetadata = {
  title: {
    default: "Blackphics — Algeria's Premier Creative Studio",
    template: "%s | Blackphics",
  },
  description: "Custom apparel, graphic design, photography and branding from Algeria. DTF, screen print, sublimation — any design, any fabric, any quantity.",
  keywords: ["custom printing", "graphic design", "Algeria", "apparel", "branding", "photography", "DTF", "sublimation"],
  authors: [{ name: "Blackphics" }],
  creator: "Blackphics",
  openGraph: {
    type: "website",
    locale: "en_DZ",
    url: "https://blackphics.com",
    siteName: "Blackphics",
    title: "Blackphics — Algeria's Premier Creative Studio",
    description: "Custom apparel, graphic design, photography and branding from Algeria.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=1200&h=630&fit=crop&auto=format",
        width: 1200,
        height: 630,
        alt: "Blackphics Creative Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blackphics — Algeria's Premier Creative Studio",
    description: "Custom apparel, graphic design, photography and branding from Algeria.",
    images: ["https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=1200&h=630&fit=crop&auto=format"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                <AnalyticsProvider>
                  <PromoProvider>
                    <ErrorBoundary>
                      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
                        <Navbar />
                        <main className="flex-1">
                          {children}
                        </main>
                        <Footer />
                        <PromoModal />
                        <Toaster />
                      </div>
                    </ErrorBoundary>
                  </PromoProvider>
                </AnalyticsProvider>
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
