import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Warunge — Warung Ecommerce | Platform Pengadaan Barang Transparan",
  description:
    "Warunge memudahkan perusahaan besar, UMKM, dan rumah tangga dalam melakukan pengadaan barang secara transparan dan terdokumentasi. Belanja kebutuhan pokok dengan mudah.",
  keywords: ["warunge", "ecommerce", "pengadaan barang", "UMKM", "procurement", "barang pokok"],
  openGraph: {
    title: "Warunge — Warung Ecommerce",
    description: "Platform pengadaan barang transparan untuk semua.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
