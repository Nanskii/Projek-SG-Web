"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import ProductCard from "@/components/katalog/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h1>
        <Link href="/katalog" className="text-emerald-600 font-semibold hover:underline">
          ← Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      unit: product.unit,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const categoryEmojis: Record<string, string> = {
    sembako: "🍚", atk: "📝", "rumah-tangga": "🧹",
    elektronik: "📱", fashion: "👕", bangunan: "🏗️",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-fade-in">
        <Link href="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
        <span>/</span>
        <Link href="/katalog" className="hover:text-emerald-600 transition-colors">Katalog</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 animate-slide-up">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl overflow-hidden flex items-center justify-center">
          <span className="text-[120px]">{categoryEmojis[product.category] || "📦"}</span>
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isPromo && discount > 0 && (
              <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg">
                -{discount}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-3 py-1.5 bg-amber-400 text-amber-900 text-sm font-bold rounded-xl shadow-lg">
                🔥 Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">
              {product.supplier}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviewCount} ulasan)</span>
          </div>

          {/* Price */}
          <div className="bg-emerald-50 rounded-2xl p-5 mb-6">
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-emerald-600">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through mb-0.5">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-emerald-700 mt-1">
              per {product.unit} · Stok tersedia: <span className="font-semibold">{product.stock}</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer text-xl"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                className="w-16 h-11 text-center text-sm font-semibold border-x border-gray-200 focus:outline-none"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer text-xl"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-lg cursor-pointer ${
                addedToCart
                  ? "bg-green-500 shadow-green-200"
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 hover:shadow-emerald-300"
              }`}
            >
              {addedToCart ? "✓ Ditambahkan!" : `Tambah ke Keranjang — ${formatCurrency(product.price * quantity)}`}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Produk <span className="gradient-text">Serupa</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
