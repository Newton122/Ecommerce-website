"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ShareButtons from "../components/ShareButtons";

interface ProductItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  colors: string[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  products?: ProductItem[];
}

export default function CollectionDetail() {
  const { id } = useParams();
  const [collection, setCollection] = React.useState<Collection | null>(null);

  React.useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/collections/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCollection(data);
        }
      } catch {
        setCollection(null);
      }
    };
    fetchCollection();
  }, [id]);

  React.useEffect(() => {
    if (collection) {
      document.title = `${collection.name} — Blacphics`;
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = collection.description;
      let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = document.title;

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
      ogImage.content = collection.image || "";
    }
  }, [collection]);

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Collection not found</h2>
          <Link href="/collections" className="text-primary hover:underline">Back to Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-white mb-4">{collection.name}</h1>
      <p className="text-white/60 mb-8">{collection.description}</p>
      <ShareButtons title={collection.name} text={collection.description} url={typeof window !== 'undefined' ? window.location.href : undefined} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(collection.products || []).map((p: ProductItem) => (
          <div key={p.id} className="rounded-2xl p-6 bg-card border border-white/[0.06]">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-md mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{p.name}</h3>
            <p className="text-white/60 mb-3">{p.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">{p.price.toLocaleString()} DZD</div>
              <Link href={`/shop/${p.id}`} className="text-primary hover:underline">View</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/collections" className="inline-flex items-center gap-1 text-primary hover:underline"><ArrowLeft size={14} /> Back to Collections</Link>
      </div>
    </div>
  );
}
