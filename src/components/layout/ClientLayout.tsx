"use client";

import React, { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types/user";

function AuthListener() {
  const { setCurrentUser } = useUser();

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          // Fetch full user profile from our API
          try {
            const res = await fetch("/api/debug-auth");
            const data = await res.json();
            if (data.prismaUser) {
              const profile: UserProfile = {
                id: data.prismaUser.id,
                name: data.prismaUser.name || "Pengguna",
                email: data.prismaUser.email,
                role: data.prismaUser.role as any,
                avatar: data.prismaUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.prismaUser.name || "Pengguna")}&background=random`,
                company: data.prismaUser.company || undefined,
              };
              setCurrentUser(profile);
            }
          } catch {}
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setCurrentUser]);

  return null;
}

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
    
    setTimeout(updateHeight, 100);
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <CartProvider userId={currentUser?.id || "guest"}>
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

export default function ClientLayout({ 
  children,
  initialUser 
}: { 
  children: React.ReactNode;
  initialUser: any;
}) {
  return (
    <UserProvider initialUser={initialUser}>
      <AuthListener />
      <InnerLayout>{children}</InnerLayout>
    </UserProvider>
  );
}
