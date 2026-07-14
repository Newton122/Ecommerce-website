import type { ReactNode } from "react";
import type { Metadata as NextMetadata } from "next";
import "../src/styles/index.css";
import App from "../src/app/App";
import Layout from "../src/app/Layout";

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
        <App>
          <Layout>{children}</Layout>
        </App>
      </body>
    </html>
  );
}
