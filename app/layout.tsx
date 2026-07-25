import type { ReactNode } from "react";
import type { Metadata as NextMetadata } from "next";
import "../src/styles/index.css";
import App from "../src/app/App";
import Layout from "../src/app/Layout";

export const metadata: NextMetadata = {
  metadataBase: new URL("https://ecommerce-blacphics-stigma.vercel.app"),
  title: {
    default: "Blacphics — Algeria's Premier Creative Studio",
    template: "%s | Blacphics",
  },
  description: "Custom apparel, graphic design, photography and branding from Algeria. DTF, screen print, sublimation — any design, any fabric, any quantity.",
  keywords: ["custom printing", "graphic design", "Algeria", "apparel", "branding", "photography", "DTF", "sublimation", "Blacphics", "streetwear"],
  authors: [{ name: "Blacphics" }],
  creator: "Blacphics",
  openGraph: {
    type: "website",
    locale: "en_DZ",
    url: "https://ecommerce-blacphics-stigma.vercel.app",
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
  alternates: {
    canonical: "https://ecommerce-blacphics-stigma.vercel.app",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Blacphics",
    url: "https://ecommerce-blacphics-stigma.vercel.app",
    logo: "https://ecommerce-blacphics-stigma.vercel.app/logo.png",
    description: "Custom apparel, graphic design, photography and branding from Algeria.",
    sameAs: [],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <App>
          <Layout>{children}</Layout>
        </App>
      </body>
    </html>
  );
}
