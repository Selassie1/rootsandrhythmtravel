'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  tourId: string;
  tourTitle: string;
  tourSlug: string;
  heroImageUrl: string;
  price: number;
  deposit: number;
  durationDays: number | string;
  location: string;
  passengers: number;
  travelDate: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'passengers' | 'travelDate'>) => void;
  removeItem: (tourId: string) => void;
  updateItem: (tourId: string, patch: Partial<Pick<CartItem, 'passengers' | 'travelDate'>>) => void;
  clearCart: () => void;
  isInCart: (tourId: string) => boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'rr_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((tour: Omit<CartItem, 'passengers' | 'travelDate'>) => {
    setItems(prev => {
      if (prev.find(i => i.tourId === tour.tourId)) return prev;
      return [...prev, { ...tour, passengers: 1, travelDate: '' }];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeItem = useCallback((tourId: string) => {
    setItems(prev => prev.filter(i => i.tourId !== tourId));
  }, []);

  const updateItem = useCallback((tourId: string, patch: Partial<Pick<CartItem, 'passengers' | 'travelDate'>>) => {
    setItems(prev => prev.map(i => i.tourId === tourId ? { ...i, ...patch } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try { localStorage.setItem(STORAGE_KEY, '[]'); } catch {}
  }, []);
  const isInCart = useCallback((tourId: string) => items.some(i => i.tourId === tourId), [items]);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateItem, clearCart, isInCart,
      isDrawerOpen, openDrawer: () => setIsDrawerOpen(true), closeDrawer: () => setIsDrawerOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
