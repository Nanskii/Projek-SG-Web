"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { formatCurrency, generateDocumentNumber, getFallbackImage } from "@/lib/utils";
import { ROLE_LABELS } from "@/types/user";
import { DeliveryMethod } from "@/types/order";
import { ShoppingCart, Package, Trash2, ClipboardList, CheckCircle, Loader2, MapPin, Truck, Store, Printer } from "lucide-react";
import { categoryIconMap } from "@/data/categories";

interface RecProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  category: { name: string } | null;
}

export default function KeranjangPage() {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalAmount } = useCart();
  const { currentUser } = useUser();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState("Jl. Contoh No. 123, Jakarta");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("DELIVERY");
  const [docNumber] = useState(() => generateDocumentNumber(currentUser?.name?.substring(0, 3).toUpperCase() || "USR"));
  const printRef = useRef<HTMLDivElement>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<RecProduct[]>([]);
  const [finalOrderData, setFinalOrderData] = useState<any>(null);

  const shippingCost = deliveryMethod === "PICKUP" ? 0 : totalAmount > 500000 ? 0 : 15000;
  const grandTotal = totalAmount + shippingCost;

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: RecProduct[]) => {
        const filtered = data.filter((p) => !items.find((i) => i.productId === p.id)).slice(0, 4);
        setRecommendedProducts(filtered);
      })
      .catch(() => {});
  }, [items]);

  const handleCheckout = async () => {
    if (!currentUser) {
      setCheckoutError("Silakan login terlebih dahulu");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: grandTotal,
          shippingAddress: deliveryMethod === "DELIVERY" ? shippingAddress : null,
          deliveryMethod,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setCheckoutError(data.error);
        return;
      }

      setOrderId(data.orderId);
      setFinalOrderData({ items: [...items], totalAmount, shippingCost, grandTotal });
      setCheckoutDone(true);
      clearCart();
    } catch {
      setCheckoutError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setCheckoutLoading(false);
    }
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
                .header { border-bottom: 3px solid #29496d; padding-bottom: 16px; margin-bottom: 20px; }
                .total { font-size: 1.25rem; font-weight: 700; color: #29496d; }
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
          <CheckCircle className="w-10 h-10 text-[#29496d]" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Pesanan Berhasil!</h1>
        <p className="text-gray-500 mb-1">Pesanan Anda telah dibuat dengan status <span className="font-semibold text-red-600">Belum Bayar</span></p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-2">Order ID: <span className="font-mono text-gray-600">{orderId.slice(0, 8)}...</span></p>
        )}
        <p className="text-gray-500 mb-2">Nomor Dokumen:</p>
        <p className="text-lg font-bold text-[#29496d] mb-2 font-mono">{docNumber}</p>
        <p className="text-sm text-gray-400 mb-8">Admin akan memproses pesanan Anda. Cek status pesanan di Dashboard.</p>

        <div ref={printRef} className="hidden">
          <div className="header">
            <h1>Warunge — Ringkasan Pesanan</h1>
            <p>Dokumen: {docNumber}</p>
            <p>Pengguna: {currentUser?.name} ({ROLE_LABELS[currentUser?.role || "household"]})</p>
            <p>Tanggal: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p>Metode: {deliveryMethod === "PICKUP" ? "Ambil Sendiri" : "Pengiriman"}</p>
          </div>
          <table>
            <thead>
              <tr><th>Produk</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {finalOrderData?.items?.map((item: any) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Subtotal: {formatCurrency(finalOrderData?.totalAmount || 0)}</p>
          <p>Ongkir: {finalOrderData?.shippingCost === 0 ? "GRATIS" : formatCurrency(finalOrderData?.shippingCost || 0)}</p>
          <p className="total">Total: {formatCurrency(finalOrderData?.grandTotal || 0)}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-5 h-5" /> Cetak Invoice
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-[#29496d] text-white font-bold rounded-xl hover:bg-[#203a59] transition-colors shadow-lg shadow-[#29496d]/20 flex items-center justify-center gap-2"
          >
            Lihat Riwayat
          </Link>
          <Link
            href="/katalog"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            Lanjut Belanja
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
          className="inline-flex items-center px-6 py-3 bg-[#29496d] text-white font-bold rounded-xl hover:bg-[#203a59] transition-colors shadow-lg shadow-[#29496d]/20"
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
              <Link href={`/katalog/${item.productId}`} className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-20 h-20 rounded-xl bg-[#f8fafc] flex items-center justify-center text-gray-400 flex-shrink-0 overflow-hidden">
                  <img src={(item.image && item.image.startsWith("http")) ? item.image : getFallbackImage(item.productId, "product")} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate hover:text-[#29496d] transition-colors">{item.name}</h3>
                  <p className="text-sm text-gray-400">{formatCurrency(item.price)} / {item.unit}</p>
                </div>
              </Link>
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
                <Trash2 className="w-5 h-5" />
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
                {recommendedProducts.map((p) => {
                  const CatIcon = categoryIconMap[p.category?.name || ""] || Package;
                  return (
                    <div key={p.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-[#a3b0cc] hover:shadow-xl hover:shadow-[#29496d]/10 transition-all duration-300 overflow-hidden h-full flex flex-col">
                      <Link href={`/katalog/${p.id}`}>
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img src={(p.imageUrl && p.imageUrl.startsWith("http")) ? p.imageUrl : getFallbackImage(p.id, p.category?.name || "")} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{p.category?.name?.replace("-", " ")}</p>
                          <h3 className="font-semibold text-gray-900 text-sm mt-1 group-hover:text-[#29496d] transition-colors line-clamp-2">{p.name}</h3>
                          <div className="mt-auto pt-2">
                            <p className="text-base font-bold text-[#29496d]">{formatCurrency(p.price)}</p>
                            <p className="text-xs text-gray-400">Stok: {p.stock}</p>
                          </div>
                        </div>
                      </Link>
                      <div className="px-3 pb-3">
                        <button
                          onClick={() => {
                            addItem({
                              productId: p.id,
                              name: p.name,
                              price: p.price,
                              image: (p.imageUrl && p.imageUrl.startsWith("http")) ? p.imageUrl : getFallbackImage(p.id, p.category?.name || ""),
                              quantity: 1,
                              unit: "pcs",
                            });
                          }}
                          className="w-full py-2 bg-[#29496d] hover:bg-[#203a59] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-md shadow-[#29496d]/20"
                        >
                          + Keranjang
                        </button>
                      </div>
                    </div>
                  );
                })}
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
              <p className="text-gray-500">Pemesan: <span className="text-gray-700 font-medium">{currentUser?.name || "Guest"}</span></p>
              <p className="text-gray-500">Role: <span className="text-gray-700 font-medium">{ROLE_LABELS[currentUser?.role || "household"]}</span></p>
              <p className="text-gray-500">No. Dok: <span className="text-gray-700 font-mono font-medium text-xs">{docNumber}</span></p>
            </div>

            {checkoutError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
                {checkoutError}
              </div>
            )}

            {!showCheckout ? (
              <button
                onClick={() => {
                  if (!currentUser) {
                    setCheckoutError("Silakan login terlebih dahulu untuk checkout");
                    return;
                  }
                  setShowCheckout(true);
                }}
                className="w-full py-3.5 bg-[#29496d] hover:bg-[#203a59] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#29496d]/20 hover:shadow-[#29496d]/25 cursor-pointer"
              >
                Proses Pesanan
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in">
                {/* Delivery Method Selection */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Metode Pengiriman</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDeliveryMethod("DELIVERY")}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        deliveryMethod === "DELIVERY"
                          ? "border-[#29496d] bg-[#f5f7fb] text-[#29496d]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                      Pengiriman
                    </button>
                    <button
                      onClick={() => setDeliveryMethod("PICKUP")}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        deliveryMethod === "PICKUP"
                          ? "border-[#29496d] bg-[#f5f7fb] text-[#29496d]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <Store className="w-5 h-5" />
                      Ambil Sendiri
                    </button>
                  </div>
                </div>

                {deliveryMethod === "DELIVERY" && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><MapPin className="w-4 h-4 mr-1" /> Alamat Pengiriman</p>
                    <input
                      placeholder="Alamat Pengiriman"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d]"
                    />
                  </div>
                )}

                {deliveryMethod === "DELIVERY" && (
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] cursor-pointer">
                    <option>Pengiriman Reguler (3-5 hari)</option>
                    <option>Pengiriman Express (1-2 hari)</option>
                  </select>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-3.5 bg-[#29496d] hover:bg-[#203a59] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#29496d]/20 cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Konfirmasi Pesanan
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
