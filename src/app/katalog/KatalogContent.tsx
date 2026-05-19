"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { categories, categoryIconMap } from "@/data/categories";
import { CategoryType } from "@/types/product";
import { LayoutGrid, Search, Package } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

type SortOption = "default" | "price-asc" | "price-desc" | "newest";

interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  stock: number;
  categoryId: string | null;
  category: { id: string; name: string } | null;
}

export default function KatalogContent() {
  const searchParams = useSearchParams();
  const catFromUrl = searchParams.get("cat") as CategoryType | null;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "all">(catFromUrl || "all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (catFromUrl) setSelectedCategory(catFromUrl);
  }, [catFromUrl]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.name === selectedCategory);
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return result;
  }, [search, selectedCategory, sortBy, priceRange, products]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <Package className="w-12 h-12 text-[#29496d] animate-pulse mb-4" />
        <p className="text-gray-400">Memuat katalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Katalog <span className="gradient-text">Produk</span>
        </h1>
        <p className="mt-2 text-gray-500">
          Temukan {products.length}+ produk berkualitas dari berbagai kategori
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Cari Produk</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Ketik nama produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Kategori</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${selectedCategory === "all"
                    ? "bg-[#f5f7fb] text-[#203a59]"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="flex items-center"><LayoutGrid className="w-4 h-4 mr-2" /> Semua Kategori</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${selectedCategory === cat.id
                      ? "bg-[#f5f7fb] text-[#203a59]"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="flex items-center"><cat.icon className="w-4 h-4 mr-2" /> {cat.name}</span>
                    <span className="text-xs text-gray-400">
                      {products.filter((p) => p.category?.name === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Rentang Harga</label>
              <input
                type="range"
                min={0}
                max={200000}
                step={5000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-[#29496d]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Rp 0</span>
                <span>Rp {priceRange[1].toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSortBy("default");
                setPriceRange([0, 200000]);
              }}
              className="w-full py-2 text-sm font-medium text-gray-500 hover:text-[#29496d] hover:bg-[#f5f7fb] rounded-xl transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold text-gray-900">{filtered.length}</span> produk
            </p>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#29496d] cursor-pointer"
              >
                <option value="default">Urutkan: Default</option>
                <option value="price-asc">Harga: Rendah → Tinggi</option>
                <option value="price-desc">Harga: Tinggi → Rendah</option>
                <option value="newest">Terbaru</option>
              </select>

              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#29496d] text-white" : "bg-white text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#29496d] text-white" : "bg-white text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {filtered.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children"
                  : "space-y-4 stagger-children"
              }
            >
              {filtered.map((product) => (
                <CatalogProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Search className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
              <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian Anda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogProductCard({ product, viewMode }: { product: DbProduct; viewMode: "grid" | "list" }) {
  const { addItem } = useCart();
  const catSlug = product.category?.name || "";
  const Icon = categoryIconMap[catSlug] || Package;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || "",
      quantity: 1,
      unit: "pcs",
    });
  };

  if (viewMode === "list") {
    return (
      <Link href={`/katalog/${product.id}`} className="block">
        <div className="group bg-white rounded-2xl border border-gray-100 hover:border-[#a3b0cc] hover:shadow-lg hover:shadow-[#29496d]/10 transition-all duration-300 p-4 flex gap-4">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center text-gray-300">
              <Icon className="w-10 h-10 sm:w-16 sm:h-16" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#29496d] transition-colors truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-lg font-bold text-[#29496d]">{formatCurrency(product.price)}</p>
                <p className="text-xs text-gray-400">Stok: {product.stock}</p>
              </div>
              <button onClick={handleAddToCart} className="px-4 py-2 bg-[#29496d] hover:bg-[#203a59] text-white text-sm font-medium rounded-xl transition-colors shadow-md cursor-pointer">
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
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-20 h-20" />
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={handleAddToCart} className="w-10 h-10 bg-[#29496d] hover:bg-[#203a59] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{catSlug.replace("-", " ")}</p>
          <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#29496d] transition-colors line-clamp-2">{product.name}</h3>
          <div className="mt-auto pt-3">
            <p className="text-lg font-bold text-[#29496d]">{formatCurrency(product.price)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Stok: {product.stock}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
