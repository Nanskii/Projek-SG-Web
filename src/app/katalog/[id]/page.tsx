import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Frown, ArrowLeft, Flame, Package } from "lucide-react";
import { categoryIconMap } from "@/data/categories";
import AddToCartButton from "./AddToCartButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <Frown className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h1>
        <Link href="/katalog" className="flex items-center text-[#29496d] font-semibold hover:underline mt-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    include: { category: true },
    take: 4,
  });

  const catSlug = product.category?.name || "";
  const Icon = categoryIconMap[catSlug] || Package;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-fade-in">
        <Link href="/" className="hover:text-[#29496d] transition-colors">Beranda</Link>
        <span>/</span>
        <Link href="/katalog" className="hover:text-[#29496d] transition-colors">Katalog</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 animate-slide-up">
        {/* Image */}
        <div className="relative aspect-square bg-[#f8fafc] rounded-3xl overflow-hidden flex items-center justify-center text-gray-300">
          <Icon className="w-32 h-32 sm:w-48 sm:h-48" />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-sm text-[#29496d] font-semibold uppercase tracking-wider">
              {product.category?.name?.replace("-", " ") || "Warunge"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>

          {/* Price */}
          <div className="bg-[#f5f7fb] rounded-2xl p-5 mb-6">
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-[#29496d]">
                {formatCurrency(product.price)}
              </span>
            </div>
            <p className="text-sm text-[#203a59] mt-1">
              Stok tersedia: <span className="font-semibold">{product.stock}</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Add to Cart (Client Component) */}
          <AddToCartButton product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageUrl || "",
            stock: product.stock,
          }} />
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
              <Link key={p.id} href={`/katalog/${p.id}`} className="block">
                <div className="group bg-white rounded-2xl border border-gray-100 hover:border-[#a3b0cc] hover:shadow-xl hover:shadow-[#29496d]/10 transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-500">
                      {(() => {
                        const RIcon = categoryIconMap[p.category?.name || ""] || Package;
                        return <RIcon className="w-20 h-20" />;
                      })()}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{p.category?.name?.replace("-", " ")}</p>
                    <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#29496d] transition-colors line-clamp-2">{p.name}</h3>
                    <div className="mt-auto pt-3">
                      <p className="text-lg font-bold text-[#29496d]">{formatCurrency(p.price)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Stok: {p.stock}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
