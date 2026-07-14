"use client";

import { useEffect } from "react";

const DEFAULT_TITLE = "Blackphics — Algeria's Premier Creative Studio";
const DEFAULT_DESCRIPTION = "Custom apparel, graphic design, photography and branding from Algeria. DTF, screen print, sublimation — any design, any fabric, any quantity.";

export function useSEO({ title, description, pathname }: { title?: string; description?: string; pathname?: string }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const fullTitle = title ? `${title} — Blackphics` : DEFAULT_TITLE;
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

    if (pathname) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", `https://blackphics.com${pathname}`);
    }
  }, [title, description, pathname]);
}
