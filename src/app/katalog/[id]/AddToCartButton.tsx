"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      unit: "pcs",
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
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
            ? "bg-green-600 shadow-green-600/20"
            : "bg-[#29496d] hover:bg-[#203a59] shadow-[#29496d]/20"
        }`}
      >
        {addedToCart ? "✓ Ditambahkan!" : `Tambah ke Keranjang — ${formatCurrency(product.price * quantity)}`}
      </button>
    </div>
  );
}
