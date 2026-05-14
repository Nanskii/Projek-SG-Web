"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { formatCurrency, generateDocumentNumber } from "@/lib/utils";
import { ROLE_LABELS } from "@/types/user";
import { ShoppingCart, Package, Trash2, ClipboardList, CheckCircle } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/katalog/ProductCard";

export default function KeranjangPage() {
  const { items, removeItem, updateQuantity, clearCart, totalAmount } = useCart();
  const { currentUser } = useUser();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [docNumber] = useState(() => generateDocumentNumber(currentUser.name.substring(0, 3).toUpperCase()));
  const printRef = useRef<HTMLDivElement>(null);

  const shippingCost = totalAmount > 500000 ? 0 : 15000;
  const grandTotal = totalAmount + shippingCost;

  const recommendedProducts = products
    .filter((p) => !items.find((i) => i.productId === p.id) && (p.isBestSeller || p.isPromo))
    .slice(0, 4);

  const handleCheckout = () => {
    setCheckoutDone(true);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current.innerHTML;
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head><title>Ringkasan Pesanan - ${docNumber}</title>
              <style>
                body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                th { background: #f8fafc; font-weight: 600; }
                .header { border-bottom: 3px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; }
                .total { font-size: 1.25rem; font-weight: 700; color: #16a34a; }
              </style>
            </head>
            <body>${content}</body>
          </html>
        `);
        win.document.close();
        win.print();
      }
    }
  };

  if (checkoutDone) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#e7eff7] flex items-center justify-center">
          <svg className="w-10 h-10 text-[#29496d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Pesanan Berhasil! 🎉</h1>
        <p className="text-gray-500 mb-2">Nomor Dokumen:</p>
        <p className="text-lg font-bold text-[#29496d] mb-8 font-mono">{docNumber}</p>

        <div ref={printRef} className="hidden">
          <div className="header">
            <h1>Warunge — Ringkasan Pesanan</h1>
            <p>Dokumen: {docNumber}</p>
            <p>Pengguna: {currentUser.name} ({ROLE_LABELS[currentUser.role]})</p>
            <p>Tanggal: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <table>
            <thead>
              <tr><th>Produk</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Subtotal: {formatCurrency(totalAmount)}</p>
          <p>Ongkir: {shippingCost === 0 ? "GRATIS" : formatCurrency(shippingCost)}</p>
          <p className="total">Total: {formatCurrency(grandTotal)}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-[#29496d] text-white font-bold rounded-xl hover:bg-[#29496d] transition-colors shadow-lg shadow-[#29496d]/20 cursor-pointer"
          >
            🖨️ Cetak Bukti Pesanan
          </button>
          <Link
            href="/katalog"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Lanjut Belanja
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Lihat Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in flex flex-col items-center">
        <ShoppingCart className="w-20 h-20 text-gray-300 mb-6" />
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Keranjang Kosong</h1>
        <p className="text-gray-500 mb-8">Belum ada produk di keranjang. Yuk mulai belanja!</p>
        <Link
          href="/katalog"
          className="inline-flex items-center px-6 py-3 bg-[#29496d] text-white font-bold rounded-xl hover:bg-[#29496d] transition-colors shadow-lg shadow-[#29496d]/20"
        >
          Jelajahi Katalog
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 animate-fade-in">
        Keranjang <span className="gradient-text">Belanja</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 stagger-children">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-20 h-20 rounded-xl bg-[#f8fafc] flex items-center justify-center text-gray-400 flex-shrink-0">
                <Package className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-400">{formatCurrency(item.price)} / {item.unit}</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <p className="text-lg font-bold text-[#29496d] w-28 text-right">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Kosongkan Keranjang
          </button>

          {/* Rekomendasi Produk */}
          {recommendedProducts.length > 0 && !checkoutDone && (
            <div className="mt-12 pt-8 border-t border-gray-100 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Mungkin Anda <span className="gradient-text">Suka</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
                {recommendedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} viewMode="grid" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({items.length} produk)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimasi Ongkir</span>
                <span className={`font-semibold ${shippingCost === 0 ? "text-[#29496d]" : "text-gray-900"}`}>
                  {shippingCost === 0 ? "GRATIS" : formatCurrency(shippingCost)}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-gray-400">
                  Gratis ongkir untuk pesanan di atas Rp 500.000
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-extrabold text-[#29496d]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
              <p className="font-semibold text-gray-700 mb-2 flex items-center"><ClipboardList className="w-4 h-4 mr-2" /> Info Pemesanan</p>
              <p className="text-gray-500">Pemesan: <span className="text-gray-700 font-medium">{currentUser.name}</span></p>
              <p className="text-gray-500">Role: <span className="text-gray-700 font-medium">{ROLE_LABELS[currentUser.role]}</span></p>
              <p className="text-gray-500">No. Dok: <span className="text-gray-700 font-mono font-medium text-xs">{docNumber}</span></p>
            </div>

            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-3.5 bg-[#29496d] hover:bg-[#29496d] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#29496d]/20 hover:shadow-[#29496d]/25 cursor-pointer"
              >
                Proses Pesanan
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <input
                  placeholder="Alamat Pengiriman"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d]"
                  defaultValue="Jl. Contoh No. 123, Jakarta"
                />
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] cursor-pointer">
                  <option>Pengiriman Reguler (3-5 hari)</option>
                  <option>Pengiriman Express (1-2 hari)</option>
                  <option>Ambil Sendiri</option>
                </select>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-[#29496d] hover:bg-[#29496d] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#29496d]/20 cursor-pointer flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Konfirmasi Pesanan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}



