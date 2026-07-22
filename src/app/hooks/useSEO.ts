"use client";

import { useEffect } from "react";

const DEFAULT_TITLE = "Blacphics — Algeria's Premier Creative Studio";
const DEFAULT_DESCRIPTION = "Custom apparel, graphic design, photography and branding from Algeria. DTF, screen print, sublimation — any design, any fabric, any quantity.";
const SITE_URL = "https://ecommerce-blacphics-stigma.vercel.app";

export function useSEO({ title, description, pathname }: { title?: string; description?: string; pathname?: string }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const fullTitle = title ? `${title} — Blacphics` : DEFAULT_TITLE;
    const metaDescription = description || DEFAULT_DESCRIPTION;

    document.title = fullTitle;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute("content", metaDescription);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", metaDescription);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", `${SITE_URL}${pathname || ""}`);

    if (pathname) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", `${SITE_URL}${pathname}`);
    }
  }, [title, description, pathname]);
}
