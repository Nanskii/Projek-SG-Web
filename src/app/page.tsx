"use client";

import React from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/katalog/ProductCard";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const promoProducts = products.filter((p) => p.isPromo).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Platform Pengadaan Barang #1 Indonesia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight animate-slide-up">
              Belanja Kebutuhan,{" "}
              <span className="text-emerald-200">Transparan</span> &{" "}
              <span className="text-yellow-300">Terdokumentasi</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-emerald-100 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
              Warunge memudahkan perusahaan, UMKM, dan rumah tangga dalam pengadaan barang pokok dengan harga transparan dan dokumentasi lengkap.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Mulai Belanja
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                Lihat Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
          <StatItem icon="📦" value="24+" label="Produk Tersedia" />
          <StatItem icon="👥" value="4" label="Tipe Pengguna" />
          <StatItem icon="📋" value="100%" label="Terdokumentasi" />
          <StatItem icon="⚡" value="< 3s" label="Load Time" />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Kategori <span className="gradient-text">Produk</span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Temukan berbagai kebutuhan Anda dalam kategori yang lengkap
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/katalog?cat=${cat.id}`}
              className="group bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{cat.count} produk</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-gradient-to-b from-white to-emerald-50/30 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                🔥 Produk <span className="gradient-text">Terlaris</span>
              </h2>
              <p className="mt-2 text-gray-500">Paling banyak dipesan minggu ini</p>
            </div>
            <Link
              href="/katalog"
              className="hidden sm:inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              Lihat Semua
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              🏷️ Promo <span className="text-red-500">Spesial</span>
            </h2>
            <p className="mt-2 text-gray-500">Hemat lebih banyak dengan promo terbaik</p>
          </div>
          <Link
            href="/katalog"
            className="hidden sm:inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            Lihat Semua
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {promoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Siap Memulai Pengadaan?
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">
            Bergabung bersama ribuan perusahaan dan UMKM yang telah mempercayai Warunge untuk kebutuhan pengadaan mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-xl shadow-black/10"
            >
              Daftar Sekarang — Gratis
            </Link>
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              Jelajahi Katalog
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Kenapa Pilih <span className="gradient-text">Warunge</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          <FeatureCard
            icon="🔍"
            title="Transparan"
            desc="Harga dan detail produk ditampilkan secara terbuka. Tidak ada biaya tersembunyi."
          />
          <FeatureCard
            icon="📄"
            title="Terdokumentasi"
            desc="Setiap transaksi tercatat dengan nomor dokumen resmi untuk keperluan audit."
          />
          <FeatureCard
            icon="⚡"
            title="Cepat & Ringan"
            desc="Dioptimasi dengan Next.js agar tetap ringan bahkan di koneksi internet terbatas."
          />
          <FeatureCard
            icon="👥"
            title="Multi Pengguna"
            desc="Mendukung berbagai tipe pengguna dari perusahaan besar hingga rumah tangga."
          />
          <FeatureCard
            icon="📊"
            title="Dashboard Lengkap"
            desc="Pantau aktivitas belanja, riwayat pesanan, dan statistik pembelian dengan mudah."
          />
          <FeatureCard
            icon="🛒"
            title="Keranjang Pintar"
            desc="Keranjang terpisah per pengguna dengan fitur export untuk dokumentasi."
          />
        </div>
      </section>
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
