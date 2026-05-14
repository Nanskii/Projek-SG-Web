"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { ROLE_LABELS, ROLE_ICONS } from "@/types/user";
import UserSwitcher from "./UserSwitcher";
import { Home, Package, ShoppingCart, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { totalItems } = useCart();
  const { currentUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md rounded-b-3xl border-b border-gray-100' : 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src="/Logo3.png" alt="Logo Warunge" className="w-35 h-35 object-contain bg-transparent" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/">Beranda</NavLink>
              <NavLink href="/katalog">Katalog</NavLink>
              <NavLink href="/keranjang">
                Keranjang
                {totalItems > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs font-bold bg-[#29496d] text-white rounded-full animate-pulse">
                    {totalItems}
                  </span>
                )}
              </NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </div>

            {/* User Profile & Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setSwitcherOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
              >
                {(() => {
                  const Icon = ROLE_ICONS[currentUser.role];
                  return <Icon className="w-5 h-5 text-[#29496d]" />;
                })()}
                <div className="text-left">
                  <p className="text-xs font-semibold text-gray-800 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-500">{ROLE_LABELS[currentUser.role]}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/keranjang" className="relative p-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-[#29496d] text-white rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {menuOpen ? (
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <div className="px-4 py-3 space-y-1">
              <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>
                <Home className="w-5 h-5" /> Beranda
              </MobileNavLink>
              <MobileNavLink href="/katalog" onClick={() => setMenuOpen(false)}>
                <Package className="w-5 h-5" /> Katalog
              </MobileNavLink>
              <MobileNavLink href="/keranjang" onClick={() => setMenuOpen(false)}>
                <ShoppingCart className="w-5 h-5" /> Keranjang {totalItems > 0 && `(${totalItems})`}
              </MobileNavLink>
              <MobileNavLink href="/dashboard" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </MobileNavLink>
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => { setSwitcherOpen(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {(() => {
                    const Icon = ROLE_ICONS[currentUser.role];
                    return <Icon className="w-6 h-6 text-[#29496d]" />;
                  })()}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{ROLE_LABELS[currentUser.role]}</p>
                  </div>
                  <span className="ml-auto text-xs text-[#29496d] font-medium">Ganti →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {switcherOpen && <UserSwitcher onClose={() => setSwitcherOpen(false)} />}
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#29496d] hover:bg-[#f5f7fb] transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-[#29496d] hover:bg-[#f5f7fb] transition-colors"
    >
      {children}
    </Link>
  );
}


