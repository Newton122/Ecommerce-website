import { NextRequest, NextResponse } from "next/server";

const BASE = "https://ecommerce-blacphics-stigma.vercel.app";

const STATIC_PAGES = [
  "",
  "/shop",
  "/collections",
  "/about",
  "/contact",
  "/services",
  "/faq",
  "/terms",
  "/privacy",
  "/returns",
];

export async function GET(_req: NextRequest) {
  const now = new Date().toISOString();
  const urls = STATIC_PAGES.map((path) => {
    const loc = `${BASE}${path}`;
    return `<url>
  <loc>${loc}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>${path === "" ? "1.0" : "0.8"}</priority>
</url>`;
  }).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}