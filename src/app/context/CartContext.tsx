"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  _backendId?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number, size: string, color: string) => void;
  updateQty: (id: number, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "blacphics-cart";

function loadCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function getApiUrl() {
  return "/api";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, token } = useAuth();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (user && token && !syncing) {
      syncWithBackend();
    }
  }, [user]);

  const syncWithBackend = async () => {
    if (!token) return;
    setSyncing(true);
    try {
      const res = await fetch(`${getApiUrl()}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const backendItems: CartItem[] = data.map((ci: any) => ({
            id: ci.productId,
            name: ci.product?.name || "",
            price: ci.product?.price || 0,
            image: ci.product?.image || "",
            size: ci.size || "",
            color: ci.color || "",
            quantity: ci.quantity || 1,
            _backendId: ci.id,
          }));
          setItems((prev) => {
            const key = (it: CartItem) => `${it.id}-${it.size}-${it.color}`;
            const localMap = new Map(prev.map((it) => [key(it), it]));
            const merged: CartItem[] = [...backendItems];
            for (const local of prev) {
              if (!localMap.has(key(local))) {
                merged.push(local);
              }
            }
            return merged;
          });
        }
      }
    } catch {
      // keep local cart on sync failure
    } finally {
      setSyncing(false);
    }
  };

  const apiCall = async (path: string, method: string, body?: any) => {
    if (!token) return;
    const res = await fetch(`${getApiUrl()}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.message || "Cart operation failed. Please try again.");
    }
    return res;
  };

  const backendUpsert = async (item: Omit<CartItem, "quantity">, quantity: number) => {
    if (!token) return;
    try {
      const res = await apiCall("/cart", "POST", { productId: item.id, size: item.size, color: item.color, quantity });
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.id) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id && i.size === item.size && i.color === item.color
                ? { ...i, _backendId: data.id }
                : i
            )
          );
        }
      }
    } catch {
      // backend failure should not break local cart
    }
  };

  const addItem = async (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );
      if (existing) {
        const next = prev.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
        backendUpsert(item, existing.quantity + 1);
        return next;
      }
      const next = [...prev, { ...item, quantity: 1 }];
      backendUpsert(item, 1);
      return next;
    });
  };

  const removeItem = (id: number, size: string, color: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id && i.size === size && i.color === color);
      if (item && item._backendId) {
        apiCall(`/cart/${item._backendId}`, "DELETE");
      }
      return prev.filter((i) => !(i.id === id && i.size === size && i.color === color));
    });
  };

  const updateQty = (id: number, size: string, color: string, qty: number) => {
    if (qty < 1) return removeItem(id, size, color);
    setItems((prev) => {
      const item = prev.find((i) => i.id === id && i.size === size && i.color === color);
      if (item && item._backendId) {
        apiCall(`/cart/${item._backendId}`, "PATCH", { quantity: qty });
      }
      return prev.map((i) =>
        i.id === id && i.size === size && i.color === color ? { ...i, quantity: qty } : i
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
