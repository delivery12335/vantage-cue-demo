"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartLine, Product } from "@/lib/types";
import { products as baseProducts } from "@/data/products";

export type DeliveryMethod = "courier" | "pickup";
export type Order = { id: string; createdAt: string; lines: CartLine[]; subtotal: number; delivery: DeliveryMethod; customer: { name: string; email: string; phone: string; address: string; comment: string }; status: "new" | "confirmed" };
export type StoreSettings = { email: string; phone: string; telegram: string; instagram: string; city: string; courierFee: number; freeDeliveryFrom: number };
export const defaultSettings: StoreSettings = { email: "studio@vantagecue.example", phone: "+373 00 000 000", telegram: "", instagram: "", city: "Кишинёв", courierFee: 120, freeDeliveryFrom: 300 };

type Store = {
  cart: CartLine[]; cartOpen: boolean; searchOpen: boolean;
  setCartOpen: (value: boolean) => void; setSearchOpen: (value: boolean) => void;
  add: (product: Product, options?: Partial<Pick<CartLine, "weight" | "shaft" | "tip">>) => void;
  quantity: (index: number, amount: number) => void; remove: (index: number) => void;
  clearCart: () => void; orders: Order[]; placeOrder: (order: Omit<Order, "id" | "createdAt" | "lines" | "subtotal" | "status">) => Order;
  settings: StoreSettings; saveSettings: (settings: StoreSettings) => void;
  customProducts: Product[]; saveProduct: (product: Product) => void; deleteProduct: (id: number) => void; catalog: Product[];
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vantage-cart");
    if (saved) queueMicrotask(() => setCart(JSON.parse(saved)));
    const savedOrders = localStorage.getItem("vantage-orders");
    const savedSettings = localStorage.getItem("vantage-settings");
    const savedProducts = localStorage.getItem("vantage-custom-products");
    if (savedOrders) queueMicrotask(() => setOrders(JSON.parse(savedOrders)));
    if (savedSettings) queueMicrotask(() => setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) }));
    if (savedProducts) queueMicrotask(() => setCustomProducts(JSON.parse(savedProducts)));
  }, []);
  useEffect(() => { localStorage.setItem("vantage-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("vantage-orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("vantage-settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("vantage-custom-products", JSON.stringify(customProducts)); }, [customProducts]);

  const catalog = useMemo(() => [...baseProducts, ...customProducts], [customProducts]);

  const value = useMemo<Store>(() => ({
    cart, cartOpen, searchOpen, setCartOpen, setSearchOpen,
    add(product, options = {}) {
      const cue = product.category.endsWith("Cues");
      const line = { product, quantity: 1, weight: cue ? options.weight ?? (product.weight === "9 oz" ? "9 oz" : "19 oz") : "", shaft: cue ? options.shaft ?? product.tipDiameter : "", tip: cue ? options.tip ?? product.tip : "" };
      setCart((current) => [...current, line]); setCartOpen(true);
    },
    quantity(index, amount) { setCart((current) => current.map((line, i) => i === index ? { ...line, quantity: Math.max(1, line.quantity + amount) } : line)); },
    remove(index) { setCart((current) => current.filter((_, i) => i !== index)); },
    clearCart() { setCart([]); },
    orders,
    placeOrder(order) {
      const created: Order = { ...order, id: `VC-${Date.now().toString().slice(-7)}`, createdAt: new Date().toISOString(), lines: cart, subtotal: cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0), status: "new" };
      setOrders((current) => [created, ...current]); setCart([]); setCartOpen(false); return created;
    },
    settings, saveSettings(next) { setSettings(next); },
    customProducts,
    saveProduct(product) { setCustomProducts((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? product : item) : [...current, product]); },
    deleteProduct(id) { setCustomProducts((current) => current.filter((item) => item.id !== id)); },
    catalog,
  }), [cart, cartOpen, searchOpen, orders, settings, customProducts, catalog]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
