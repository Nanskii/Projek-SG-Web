import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { formatCurrency, getFallbackImage } from "@/lib/utils";
import { Search, FileText, Zap, Users, LayoutDashboard, ShoppingCart, Package, Paperclip, Home, Smartphone, Shirt, Hammer } from "lucide-react";
import { categoryIconMap } from "@/data/categories";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const products = await prisma.product.findMany({
    include: { category: true }
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });

  const bestSellers = products.slice(0, 4);
  const promoProducts = products.slice(4, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#29496d]">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#29496d]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#29496d]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#dc5c3e] animate-pulse" />
              Platform Pengadaan Barang #1 Indonesia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight animate-slide-up">
              Belanja Kebutuhan,{" "}
              <span className="text-[#a9bdda]">Transparan</span> &{" "}
              <span className="text-[#dc5c3e]">Terdokumentasi</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#dfe7f3] max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
              Warunge memudahkan perusahaan, UMKM, dan rumah tangga dalam pengadaan barang pokok dengan harga transparan dan dokumentasi lengkap.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#203a59] font-bold rounded-2xl hover:bg-[#f5f7fb] transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5"
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
          <StatItem value={`${products.length}+`} label="Produk Tersedia" />
          <StatItem value="4" label="Tipe Pengguna" />
          <StatItem value="100%" label="Terdokumentasi" />
          <StatItem value="< 3s" label="Load Time" />
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
          {categories.map((cat: { id: string; name: string; _count: { products: number } }) => {
            const Icon = categoryIconMap[cat.name] || Package;
            return (
              <Link
                key={cat.id}
                href={`/katalog?cat=${cat.name}`}
                className="group bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-[#a3b0cc] hover:shadow-lg hover:shadow-[#29496d]/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-[#29496d]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#29496d] transition-colors capitalize">
                  {cat.name.replace("-", " ")}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{cat._count.products} produk</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-[#f5f7fb] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Produk <span className="gradient-text">Terbaru</span>
              </h2>
              <p className="mt-2 text-gray-500">Paling banyak dicari minggu ini</p>
            </div>
            <Link
              href="/katalog"
              className="hidden sm:inline-flex items-center text-[#29496d] font-semibold hover:text-[#203a59] transition-colors"
            >
              Lihat Semua
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {bestSellers.map((product: { id: string; name: string; price: number; stock: number; imageUrl?: string | null; category: { name: string } | null }) => {
              const imgUrl = (product.imageUrl && product.imageUrl.startsWith("http")) ? product.imageUrl : getFallbackImage(product.id, product.category?.name || "");
              return (
                <Link key={product.id} href={`/katalog/${product.id}`} className="block">
                  <div className="group bg-white rounded-2xl border border-gray-100 hover:border-[#a3b0cc] hover:shadow-xl hover:shadow-[#29496d]/10 transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <img src={imgUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{product.category?.name?.replace("-", " ")}</p>
                      <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#29496d] transition-colors line-clamp-2">{product.name}</h3>
                      <div className="mt-auto pt-3">
                        <p className="text-lg font-bold text-[#29496d]">{formatCurrency(product.price)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Stok: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* More Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Produk <span className="text-red-500">Lainnya</span>
            </h2>
            <p className="mt-2 text-gray-500">Jelajahi lebih banyak pilihan</p>
          </div>
          <Link
            href="/katalog"
            className="hidden sm:inline-flex items-center text-[#29496d] font-semibold hover:text-[#203a59] transition-colors"
          >
            Lihat Semua
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {promoProducts.map((product: { id: string; name: string; price: number; stock: number; imageUrl?: string | null; category: { name: string } | null }) => {
            const imgUrl = (product.imageUrl && product.imageUrl.startsWith("http")) ? product.imageUrl : getFallbackImage(product.id, product.category?.name || "");
            return (
              <Link key={product.id} href={`/katalog/${product.id}`} className="block">
                <div className="group bg-white rounded-2xl border border-gray-100 hover:border-[#a3b0cc] hover:shadow-xl hover:shadow-[#29496d]/10 transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img src={imgUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{product.category?.name?.replace("-", " ")}</p>
                    <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#29496d] transition-colors line-clamp-2">{product.name}</h3>
                    <div className="mt-auto pt-3">
                      <p className="text-lg font-bold text-[#29496d]">{formatCurrency(product.price)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Stok: {product.stock}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#29496d] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Siap Memulai Pengadaan?
          </h2>
          <p className="text-[#dfe7f3] text-lg max-w-2xl mx-auto mb-8">
            Bergabung bersama ribuan perusahaan dan UMKM yang telah mempercayai Warunge untuk kebutuhan pengadaan mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#203a59] font-bold rounded-2xl hover:bg-[#f5f7fb] transition-all shadow-xl shadow-black/10"
              >
                Daftar Sekarang — Gratis
              </Link>
            )}
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
        <div className="flex flex-row flex-wrap justify-center items-start gap-4 max-w-5xl mx-auto stagger-children">
          <FeatureCard
            icon={<Search className="w-7 h-7 text-[#29496d]" />}
            title="Transparan"
            desc="Harga dan detail produk ditampilkan secara terbuka. Tidak ada biaya tersembunyi."
          />
          <FeatureCard
            icon={<FileText className="w-7 h-7 text-[#29496d]" />}
            title="Terdokumentasi"
            desc="Setiap transaksi tercatat dengan nomor dokumen resmi untuk keperluan audit."
          />
          <FeatureCard
            icon={<Zap className="w-7 h-7 text-[#29496d]" />}
            title="Cepat & Ringan"
            desc="Dioptimasi dengan Next.js agar tetap ringan bahkan di koneksi internet terbatas."
          />
          <FeatureCard
            icon={<Users className="w-7 h-7 text-[#29496d]" />}
            title="Multi Pengguna"
            desc="Mendukung berbagai tipe pengguna dari perusahaan besar hingga rumah tangga."
          />
          <FeatureCard
            icon={<LayoutDashboard className="w-7 h-7 text-[#29496d]" />}
            title="Dashboard Lengkap"
            desc="Pantau aktivitas belanja, riwayat pesanan, dan statistik pembelian dengan mudah."
          />
          <FeatureCard
            icon={<ShoppingCart className="w-7 h-7 text-[#29496d]" />}
            title="Keranjang Pintar"
            desc="Keranjang terpisah per pengguna dengan fitur export untuk dokumentasi."
          />
        </div>
      </section>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group relative bg-white border border-gray-100 hover:border-[#a3b0cc] hover:shadow-xl hover:shadow-[#29496d]/10 transition-all duration-500 ease-out cursor-pointer rounded-2xl w-16 hover:w-[340px] max-h-16 hover:max-h-[250px] overflow-hidden flex-shrink-0">
      <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center text-[#29496d] bg-white group-hover:bg-transparent z-10 transition-colors">
        {icon}
      </div>
      <div className="w-[340px] pl-16 pr-10 py-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
        <h3 className="text-lg font-bold text-gray-900 mb-1 whitespace-nowrap group-hover:whitespace-normal">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}


