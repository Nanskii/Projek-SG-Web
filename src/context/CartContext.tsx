"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/order";
import { ShoppingCart, LogIn, X } from "lucide-react";
import Link from "next/link";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#f0f4fa] flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-[#29496d]" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-extrabold text-gray-900 mb-2">
          Login Diperlukan
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Silakan masuk ke akun Anda terlebih dahulu untuk menambahkan produk ke keranjang belanja.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full py-3.5 bg-[#29496d] hover:bg-[#203a59] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#29496d]/20 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Masuk Sekarang
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Belum punya akun? Daftar
          </Link>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-1"
          >
            Lanjut melihat-lihat
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isGuest = userId === "guest";

  // Load cart from localStorage on mount / userId change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cart_${userId}`);
      if (saved) setItems(JSON.parse(saved));
      else setItems([]);
    } catch {
      setItems([]);
    }
  }, [userId]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
  }, [items, userId]);

  const addItem = useCallback((item: CartItem) => {
    if (isGuest) {
      setShowLoginModal(true);
      return;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  }, [isGuest]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount }}>
      {children}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
