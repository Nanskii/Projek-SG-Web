"use client";

import React from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUser();
  const footerRef = React.useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = React.useState(0);

  React.useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    
    setTimeout(updateHeight, 100); // Allow time for images/layout to settle
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <CartProvider userId={currentUser.id}>
      <div className="bg-gray-900">
        <div 
          className="relative z-10 bg-white flex flex-col min-h-screen shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-b-3xl" 
          style={{ marginBottom: footerHeight }}
        >
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
        <div ref={footerRef} className="fixed bottom-0 left-0 w-full z-0">
          <Footer />
        </div>
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
