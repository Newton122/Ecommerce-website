"use client";

import React from "react";
import Link from "next/link";

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
  products?: any[];
}

export default function Collections() {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [visible, setVisible] = React.useState(6);

  React.useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/collections`);
        if (res.ok) {
          const data = await res.json();
          setCollections(data);
        }
      } catch {
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  React.useEffect(() => {
    document.title = "Collections — Blackphics";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Browse Blackphics collections: men's, women's, unisex, kids, and brand collabs.";
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = "Collections — Blackphics";

    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = meta.content;

    let ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
    if (!ogImage) {
      ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      document.head.appendChild(ogImage);
    }
    ogImage.content = collections[0]?.image || "";
  }, [collections]);

  const hasMore = collections.length > visible;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-6">Collections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full aspect-[3/4] bg-card animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-white mb-6">Collections</h1>
      <p className="text-white/60 mb-8">Browse curated collections and categories to find what fits you.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.slice(0, visible).map((c) => (
          <div key={c.id} className="rounded-2xl overflow-hidden bg-card border border-white/[0.06] hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <Link href={`/collections/${c.id}`} className="block">
              <img src={c.image} alt={c.name} className="w-full h-40 object-cover" />
            </Link>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                <Link href={`/collections/${c.id}`} className="hover:underline">{c.name}</Link>
              </h3>
              <p className="text-white/60 mb-4">{c.description}</p>
              <div>
                <Link href={`/collections/${c.id}`} className="text-sm text-primary hover:underline">Explore {c.name}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => v + 6)}
            className="px-6 py-3 bg-white/6 text-white rounded-xl shadow-sm hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
