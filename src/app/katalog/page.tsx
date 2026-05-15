"use client";

import React, { Suspense } from "react";
import KatalogContent from "./KatalogContent";
import { Package } from "lucide-react";

export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
          <Package className="w-12 h-12 text-[#29496d] animate-pulse mb-4" />
          <p className="text-gray-400">Memuat katalog...</p>
        </div>
      }
    >
      <KatalogContent />
    </Suspense>
  );
}
