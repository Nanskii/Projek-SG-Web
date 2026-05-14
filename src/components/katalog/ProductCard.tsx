"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/categories";
import { Flame, Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      unit: product.unit,
    });
  };

  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  if (viewMode === "list") {
    return (
      <Link href={`/katalog/${product.id}`} className="block">
        <div className="group bg-white rounded-2xl border border-gray-100 hover:border-[#a3b0cc] hover:shadow-lg hover:shadow-[#29496d]/10 transition-all duration-300 p-4 flex gap-4">
          {/* Image */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center text-gray-300">
              {(() => {
                const cat = categories.find(c => c.id === product.category);
                const Icon = cat?.icon || Package;
                return <Icon className="w-10 h-10 sm:w-16 sm:h-16" />;
              })()}
            </div>
            {product.isPromo && discount > 0 && (
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-lg">
                -{discount}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {product.isBestSeller && (
                  <span className="flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full"><Flame className="w-3.5 h-3.5 mr-1" /> Best Seller</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#29496d] transition-colors truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-amber-400 text-sm">★</span>
                <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount})</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-lg font-bold text-[#29496d]">{formatCurrency(product.price)}</p>
                {product.originalPrice && (
                  <p className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</p>
                )}
                <p className="text-xs text-gray-400">per {product.unit}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-[#29496d] hover:bg-[#29496d] text-white text-sm font-medium rounded-xl transition-colors shadow-md shadow-[#29496d]/20 hover:shadow-[#29496d]/25 cursor-pointer"
              >
                + Keranjang
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/katalog/${product.id}`} className="block">
      <div className="group bg-white rounded-2xl border border-gray-100 hover:border-[#a3b0cc] hover:shadow-xl hover:shadow-[#29496d]/10 transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-500">
            {(() => {
              const cat = categories.find(c => c.id === product.category);
              const Icon = cat?.icon || Package;
              return <Icon className="w-20 h-20" />;
            })()}
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isPromo && discount > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-md">
                -{discount}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="flex items-center px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-lg shadow-md">
                <Flame className="w-3.5 h-3.5 mr-1" /> Laris
              </span>
            )}
          </div>
          {/* Quick add button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-[#29496d] hover:bg-[#29496d] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#29496d]/25 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{product.supplier}</p>
          <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#29496d] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-amber-400 text-sm">★</span>
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
          <div className="mt-auto pt-3">
            <div className="flex items-end gap-2">
              <p className="text-lg font-bold text-[#29496d]">{formatCurrency(product.price)}</p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through mb-0.5">{formatCurrency(product.originalPrice)}</p>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">per {product.unit} · Stok: {product.stock}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}



