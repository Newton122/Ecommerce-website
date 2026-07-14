import React from "react";
import Link from "next/link";

export default function CollectionCTA({ to = "/shop", label = "Shop collection" }: { to?: string; label?: string }) {
  return (
    <Link
      href={to}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-xl hover:brightness-105 transition-all duration-200"
    >
      {label}
    </Link>
  );
}
