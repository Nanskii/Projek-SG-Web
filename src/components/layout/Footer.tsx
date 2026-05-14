import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex -mt-12 -mb-10">
              <img src="/Logo3.png" alt="Logo Warunge" className="w-48 h-auto object-contain bg-transparent" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform e-procurement yang memudahkan pengadaan barang secara transparan dan terdokumentasi.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigasi</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/">Beranda</FooterLink>
              <FooterLink href="/katalog">Katalog Produk</FooterLink>
              <FooterLink href="/keranjang">Keranjang</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Kategori</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/katalog?cat=sembako">Sembako</FooterLink>
              <FooterLink href="/katalog?cat=atk">Alat Tulis Kantor</FooterLink>
              <FooterLink href="/katalog?cat=elektronik">Elektronik</FooterLink>
              <FooterLink href="/katalog?cat=bangunan">Bahan Bangunan</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hubungi Kami</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span className="text-gray-400">info@warunge.id</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span className="text-gray-400">(021) 1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span className="text-gray-400">Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Warunge. Warung Ecommerce — Semua Hak Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Dibuat dengan ❤️ untuk UMKM Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-gray-400 hover:text-[#29496d] transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}


