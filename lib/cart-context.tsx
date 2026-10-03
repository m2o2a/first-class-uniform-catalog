"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

// "ready"  = in-stock piece, no embroidery  -> full payment
// "custom" = embroidery / made-to-order     -> 50% deposit
export type OrderType = "ready" | "custom";

export type CartItem = {
  id: string; // photo src — unique per product photo
  src: string;
  categorySlug: string;
  name: string;
  qty: number;
  type: OrderType;
  logos: number; // embroidery count per piece (custom only)
};

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, "qty" | "logos"> & { qty?: number; logos?: number }) => void;
  update: (id: string, patch: Partial<CartItem>) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "fc_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      add: (item) =>
        setItems((prev) => {
          const existing = prev.find((p) => p.id === item.id && p.type === item.type);
          if (existing) {
            return prev.map((p) =>
              p === existing ? { ...p, qty: p.qty + (item.qty || 1) } : p
            );
          }
          return [...prev, { qty: 1, logos: item.type === "custom" ? 1 : 0, ...item } as CartItem];
        }),
      update: (id, patch) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([])
    }),
    [items]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
