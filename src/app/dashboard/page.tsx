"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { sampleOrders } from "@/data/users";
import { ROLE_LABELS, ROLE_ICONS } from "@/types/user";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/order";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { 
  Wallet, Package, CheckCircle, ShoppingCart, LayoutDashboard, BarChart3, 
  Zap, Bell, Tag, Truck, ClipboardCheck, FileSpreadsheet, Download, 
  RefreshCcw, DollarSign, LineChart, History, Smartphone, Wheat, Store, Info, ClipboardList
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser } = useUser();
  const { totalItems, totalAmount } = useCart();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">("overview");

  const userOrders = sampleOrders.filter((o) => o.userId === currentUser.id);
  const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const completedOrders = userOrders.filter((o) => o.status === "completed").length;

  // Monthly spending data (mock)
  const monthlyData = [
    { month: "Jan", amount: 1200000 },
    { month: "Feb", amount: 850000 },
    { month: "Mar", amount: 2100000 },
    { month: "Apr", amount: 1750000 },
    { month: "Mei", amount: totalSpent || 500000 },
  ];
  const maxMonthly = Math.max(...monthlyData.map((d) => d.amount));

  // Role-specific features
  const roleFeatures: Record<string, { title: string; items: React.ReactNode[] }> = {
    enterprise: {
      title: "Fitur Perusahaan",
      items: [
        <span key="1" className="flex items-center"><ClipboardCheck className="w-4 h-4 mr-2" /> Approval Workflow</span>,
        <span key="2" className="flex items-center"><FileSpreadsheet className="w-4 h-4 mr-2" /> Laporan Pengadaan</span>,
        <span key="3" className="flex items-center"><Package className="w-4 h-4 mr-2" /> Bulk Order</span>,
        <span key="4" className="flex items-center"><Download className="w-4 h-4 mr-2" /> Export Dokumen</span>,
      ],
    },
    umkm: {
      title: "Fitur UMKM",
      items: [
        <span key="1" className="flex items-center"><RefreshCcw className="w-4 h-4 mr-2" /> Reorder Cepat</span>,
        <span key="2" className="flex items-center"><DollarSign className="w-4 h-4 mr-2" /> Harga Grosir</span>,
        <span key="3" className="flex items-center"><LineChart className="w-4 h-4 mr-2" /> Rekomendasi Stok</span>,
        <span key="4" className="flex items-center"><History className="w-4 h-4 mr-2" /> Riwayat Lengkap</span>,
      ],
    },
    household: {
      title: "Fitur Rumah Tangga",
      items: [
        <span key="1" className="flex items-center"><Tag className="w-4 h-4 mr-2" /> Promo Harian</span>,
        <span key="2" className="flex items-center"><Wheat className="w-4 h-4 mr-2" /> Kategori Pokok</span>,
        <span key="3" className="flex items-center"><Bell className="w-4 h-4 mr-2" /> Notifikasi Harga</span>,
        <span key="4" className="flex items-center"><Smartphone className="w-4 h-4 mr-2" /> UI Simpel</span>,
      ],
    },
    distributor: {
      title: "Fitur Distributor",
      items: [
        <span key="1" className="flex items-center"><Package className="w-4 h-4 mr-2" /> Pesanan Masuk</span>,
        <span key="2" className="flex items-center"><BarChart3 className="w-4 h-4 mr-2" /> Statistik Penjualan</span>,
        <span key="3" className="flex items-center"><Store className="w-4 h-4 mr-2" /> Manajemen Produk</span>,
        <span key="4" className="flex items-center"><LineChart className="w-4 h-4 mr-2" /> Analisis Trend</span>,
      ],
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Dashboard <span className="gradient-text">Pengguna</span>
        </h1>
        <p className="mt-2 text-gray-500">Selamat datang kembali, {currentUser.name}!</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#29496d] rounded-2xl p-6 sm:p-8 mb-8 text-white animate-slide-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
            {(() => {
              const RoleIcon = ROLE_ICONS[currentUser.role];
              return <RoleIcon className="w-8 h-8 text-white" />;
            })()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{currentUser.name}</h2>
            <p className="text-[#dfe7f3]">{ROLE_LABELS[currentUser.role]}</p>
            <p className="text-[#a9bdda] text-sm">{currentUser.email}</p>
            {currentUser.company && (
              <p className="text-[#a9bdda] text-sm mt-0.5">{currentUser.company}</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold">{userOrders.length}</p>
              <p className="text-[#a9bdda] text-sm">Pesanan</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{completedOrders}</p>
              <p className="text-[#a9bdda] text-sm">Selesai</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{totalItems}</p>
              <p className="text-[#a9bdda] text-sm">Keranjang</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
        {(["overview", "orders", "profile"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${activeTab === tab ? "bg-white text-[#29496d] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab === "overview" ? "Ringkasan" : tab === "orders" ? "Riwayat Pesanan" : "Profil"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <StatCard icon={<Wallet className="w-8 h-8 text-[#29496d]" />} label="Total Belanja" value={formatCurrency(totalSpent)} color="blue" />
            <StatCard icon={<Package className="w-8 h-8 text-[#29496d]" />} label="Total Pesanan" value={String(userOrders.length)} color="blue" />
            <StatCard icon={<CheckCircle className="w-8 h-8 text-[#29496d]" />} label="Pesanan Selesai" value={String(completedOrders)} color="blue" />
            <StatCard icon={<ShoppingCart className="w-8 h-8 text-amber-600" />} label="Dalam Keranjang" value={formatCurrency(totalAmount)} color="amber" />
          </div>

          {/* Chart - Monthly Spending */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-[#29496d]" /> Belanja Bulanan</h3>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">
                    {formatCurrency(d.amount).replace("Rp", "").trim()}
                  </span>
                  <div
                    className="w-full bg-[#29496d] rounded-t-lg transition-all duration-700 hover:bg-[#203a59]"
                    style={{ height: `${(d.amount / maxMonthly) * 100}%`, minHeight: "20px" }}
                  />
                  <span className="text-xs font-medium text-gray-600">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role Features + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {roleFeatures[currentUser.role]?.title}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {roleFeatures[currentUser.role]?.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#f5f7fb] hover:text-[#203a59] transition-colors cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Zap className="w-5 h-5 mr-2 text-[#29496d]" /> Aksi Cepat</h3>
              <div className="space-y-3">
                <Link
                  href="/katalog"
                  className="w-full px-4 py-3 bg-[#f5f7fb] text-[#203a59] rounded-xl text-sm font-semibold hover:bg-[#e7eff7] transition-colors flex items-center justify-center"
                >
                  <Package className="w-4 h-4 mr-2" /> Buka Katalog
                </Link>
                <Link
                  href="/keranjang"
                  className="w-full px-4 py-3 bg-[#f5f7fb] text-[#203a59] rounded-xl text-sm font-semibold hover:bg-[#e7eff7] transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" /> Lihat Keranjang ({totalItems} item)
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Bell className="w-5 h-5 mr-2 text-[#29496d]" /> Notifikasi</h3>
            <div className="space-y-3">
              <NotifItem
                icon={<Tag className="w-5 h-5 text-red-500" />}
                title="Promo Beras Premium"
                desc="Diskon 12% untuk Beras Premium 5kg. Berlaku hingga 15 Mei."
                time="2 jam lalu"
                color="bg-red-50"
              />
              <NotifItem
                icon={<Truck className="w-5 h-5 text-[#29496d]" />}
                title="Pesanan Dikirim"
                desc="Pesanan ORD-2026-002 sedang dalam pengiriman."
                time="5 jam lalu"
                color="bg-[#f5f7fb]"
              />
              <NotifItem
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                title="Pesanan Selesai"
                desc="Pesanan ORD-2026-001 telah diterima dan selesai."
                time="1 hari lalu"
                color="bg-[#f5f7fb]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {userOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Pesanan</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dokumen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.items.map((i) => i.name).join(", ")}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#29496d]">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-400">{order.documentNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4"><ClipboardList className="w-16 h-16 text-gray-300" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
                <p className="text-gray-500 mb-6">Mulai belanja untuk melihat riwayat pesanan Anda.</p>
                <Link
                  href="/katalog"
                  className="inline-flex px-6 py-3 bg-[#29496d] text-white font-bold rounded-xl hover:bg-[#29496d] transition-colors"
                >
                  Mulai Belanja
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="max-w-2xl animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Profil Pengguna</h3>
            <div className="space-y-5">
              <ProfileField label="Nama Lengkap" value={currentUser.name} />
              <ProfileField label="Email" value={currentUser.email} />
              <ProfileField label="Role" value={
                <span className="flex items-center gap-2">
                  {(() => {
                    const RoleIcon = ROLE_ICONS[currentUser.role];
                    return <RoleIcon className="w-4 h-4 text-gray-500" />;
                  })()}
                  {ROLE_LABELS[currentUser.role]}
                </span>
              } />
              {currentUser.company && (
                <ProfileField label="Perusahaan / Organisasi" value={currentUser.company} />
              )}
              <ProfileField label="User ID" value={currentUser.id} />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-400">
                Ini adalah profil simulasi. Data tersimpan secara lokal di browser Anda.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const bgMap: Record<string, string> = {
    blue: "bg-[#f5f7fb] border-[#a3b0cc]",
    amber: "bg-amber-50 border-amber-100",
  };
  return (
    <div className={`rounded-2xl border p-5 ${bgMap[color] || bgMap.blue}`}>
      <div className="mb-4">{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function NotifItem({ icon, title, desc, time, color }: { icon: React.ReactNode; title: string; desc: string; time: string; color: string }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${color}`}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <p className="mt-1 text-gray-900 font-medium">{value}</p>
    </div>
  );
}


