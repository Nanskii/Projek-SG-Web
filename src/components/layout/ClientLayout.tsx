"use client";

import React from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUser();
  return (
    <CartProvider userId={currentUser.id}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <InnerLayout>{children}</InnerLayout>
    </UserProvider>
  );
}
