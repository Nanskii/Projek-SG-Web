"use client";

import React, { Suspense } from "react";
import KatalogContent from "./KatalogContent";

export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-pulse text-4xl mb-4">📦</div>
          <p className="text-gray-400">Memuat katalog...</p>
        </div>
      }
    >
      <KatalogContent />
    </Suspense>
  );
}
