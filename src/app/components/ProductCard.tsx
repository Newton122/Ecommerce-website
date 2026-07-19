"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAnalytics } from "../context/AnalyticsContext";
import type { Product } from "../data/types";

interface Props {
  product: Product;
  aosDelay?: number;
}

const badgeConfig = {
  new: { label: "NEW", classes: "bg-primary text-black" },
  sale: { label: "SALE", classes: "bg-accent text-black" },
  hot: { label: "HOT", classes: "bg-red-500 text-white" },
};

export default function ProductCard({ product, aosDelay = 0 }: Props) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { track } = useAnalytics();
  const outOfStock = (product.stock ?? 1) <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M",
      color: product.colors[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    track("cart_add", { productId: product.id, productName: product.name, price: product.price });
  };

  const handleView = () => {
    track("product_view", { productId: product.id, productName: product.name, category: product.category });
  };

  return (
    <motion.div
      layout
      data-aos="zoom-in-up"
      data-aos-delay={aosDelay}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-white/[0.06] hover:border-primary/30 transition-all duration-400 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
      onClick={() => {
        handleView();
        window.location.href = `/shop/${product.id}`;
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleView();
          window.location.href = `/shop/${product.id}`;
        }
      }}
    >
      {/* Image */}
      <motion.div className="relative aspect-[3/4] bg-background overflow-hidden" whileHover={{ scale: 1.01 }} transition={{ duration: 0.35 }}>
          <motion.img
            src={product.image}
            alt={product.name}
            animate={{ scale: hovered ? 1.12 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full h-full object-cover ${outOfStock ? "opacity-60" : ""}`}
          />
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-background/80"
            animate={{ opacity: hovered ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badge */}
          {product.badge && (
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-widest rounded-lg ${badgeConfig[product.badge].classes}`}
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {badgeConfig[product.badge].label}
            </motion.span>
          )}

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-4 py-2 rounded-xl bg-foreground/20 text-white text-xs font-bold uppercase tracking-widest border border-white/10">
                Out of Stock
              </span>
            </div>
          )}

          {/* Collection thumbnail if present */}
          {product.collections && product.collections.length > 0 && (() => {
            const col = product.collections[0];
            if (!col) return null;
            return (
              <div className="absolute top-3 right-3 w-10 h-10 rounded-md overflow-hidden border border-white/[0.06]">
                <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
              </div>
            );
          })()}

          {/* Quick actions */}
          <motion.div
            className="absolute bottom-3 left-3 right-3 flex gap-2"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={handleAdd}
              disabled={outOfStock || added}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                added
                  ? "bg-primary/90 text-black"
                  : outOfStock
                  ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-primary hover:text-black border border-white/20 hover:border-primary"
              }`}
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              <ShoppingBag size={13} />
              {added ? "Added!" : outOfStock ? "Sold Out" : "Quick Add"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/shop/${product.id}`;
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black border border-white/20 hover:border-white transition-all duration-200"
            >
              <Eye size={14} />
            </button>
          </motion.div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="p-4"
        >
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
            {product.category}
          </p>
          <h3 className="text-white font-semibold text-sm leading-tight mb-3 group-hover:text-primary transition-colors duration-200" style={{ fontFamily: "Manrope, sans-serif" }}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-base" style={{ fontFamily: "Manrope, sans-serif" }}>
                {product.price.toLocaleString()} DZD
              </span>
              {product.originalPrice && (
                <span className="text-white/30 text-sm line-through" style={{ fontFamily: "Inter, sans-serif" }}>
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star size={11} className="text-accent fill-accent" />
              <span className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                {product.rating}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            {product.colors.map((c) => (
              <div
                key={c}
                className="w-4 h-4 rounded-full border border-white/20 hover:border-primary transition-colors duration-150 cursor-pointer"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          {outOfStock && (
            <p className="text-red-400/80 text-[11px] mt-2 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
              Currently unavailable — check back soon
            </p>
          )}
        </motion.div>
    </motion.div>
  );
}
