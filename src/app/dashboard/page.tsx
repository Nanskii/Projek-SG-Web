"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { ROLE_LABELS, ROLE_ICONS } from "@/types/user";
import { STATUS_LABELS, STATUS_COLORS, getStatusFlow, OrderStatus, DeliveryMethod } from "@/types/order";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Wallet, Package, CheckCircle, ShoppingCart, LayoutDashboard, BarChart3,
  Zap, Bell, Tag, Truck, ClipboardCheck, FileSpreadsheet, Download,
  RefreshCcw, DollarSign, LineChart, History, Smartphone, Wheat, Store, Info, ClipboardList, LogIn, Loader2, Clock, CreditCard, PackageCheck, ChevronDown, ChevronUp
} from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  shippingAddress: string | null;
  createdAt: string;
}

const STATUS_ICON_MAP: Record<OrderStatus, React.ComponentType<{ className?: string }>> = {
  BELUM_BAYAR: Clock,
  SUDAH_BAYAR: CreditCard,
  DIPROSES: Loader2,
  DIANTAR: Truck,
  SIAP_DIAMBIL: PackageCheck,
  SELESAI: CheckCircle,
};

export default function DashboardPage() {
  const { currentUser } = useUser();
  const { totalItems, totalAmount } = useCart();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f0f4fa] flex items-center justify-center">
            <LayoutDashboard className="w-10 h-10 text-[#29496d]" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Akses Dashboard</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Silakan masuk ke akun Anda untuk mengakses dashboard, melihat riwayat pesanan, dan mengelola profil Anda.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="w-full py-3.5 bg-[#29496d] hover:bg-[#203a59] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#29496d]/20 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" /> Masuk Sekarang
            </Link>
            <Link href="/register" className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              Belum punya akun? Daftar
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-1">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const completedOrders = orders.filter((o) => o.status === "SELESAI").length;

  const monthlyData = [
    { month: "Jan", amount: 1200000 },
    { month: "Feb", amount: 850000 },
    { month: "Mar", amount: 2100000 },
    { month: "Apr", amount: 1750000 },
    { month: "Mei", amount: totalSpent || 500000 },
  ];
  const maxMonthly = Math.max(...monthlyData.map((d) => d.amount));

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

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateString));
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
            {currentUser.company && <p className="text-[#a9bdda] text-sm mt-0.5">{currentUser.company}</p>}
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold">{orders.length}</p>
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
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${activeTab === tab ? "bg-white text-[#29496d] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab === "overview" ? "Ringkasan" : tab === "orders" ? "Riwayat Pesanan" : "Profil"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <StatCard icon={<Wallet className="w-8 h-8 text-[#29496d]" />} label="Total Belanja" value={formatCurrency(totalSpent)} color="blue" />
            <StatCard icon={<Package className="w-8 h-8 text-[#29496d]" />} label="Total Pesanan" value={String(orders.length)} color="blue" />
            <StatCard icon={<CheckCircle className="w-8 h-8 text-[#29496d]" />} label="Pesanan Selesai" value={String(completedOrders)} color="blue" />
            <StatCard icon={<ShoppingCart className="w-8 h-8 text-amber-600" />} label="Dalam Keranjang" value={formatCurrency(totalAmount)} color="amber" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-[#29496d]" /> Belanja Bulanan</h3>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">{formatCurrency(d.amount).replace("Rp", "").trim()}</span>
                  <div className="w-full bg-[#29496d] rounded-t-lg transition-all duration-700 hover:bg-[#203a59]" style={{ height: `${(d.amount / maxMonthly) * 100}%`, minHeight: "20px" }} />
                  <span className="text-xs font-medium text-gray-600">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{roleFeatures[currentUser.role]?.title}</h3>
              <div className="grid grid-cols-2 gap-3">
                {roleFeatures[currentUser.role]?.items.map((item, idx) => (
                  <div key={idx} className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#f5f7fb] hover:text-[#203a59] transition-colors cursor-pointer">{item}</div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Zap className="w-5 h-5 mr-2 text-[#29496d]" /> Aksi Cepat</h3>
              <div className="space-y-3">
                <Link href="/katalog" className="w-full px-4 py-3 bg-[#f5f7fb] text-[#203a59] rounded-xl text-sm font-semibold hover:bg-[#e7eff7] transition-colors flex items-center justify-center">
                  <Package className="w-4 h-4 mr-2" /> Buka Katalog
                </Link>
                <Link href="/keranjang" className="w-full px-4 py-3 bg-[#f5f7fb] text-[#203a59] rounded-xl text-sm font-semibold hover:bg-[#e7eff7] transition-colors flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Lihat Keranjang ({totalItems} item)
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="animate-fade-in">
          {loadingOrders ? (
            <div className="text-center py-16"><Loader2 className="w-8 h-8 text-[#29496d] animate-spin mx-auto mb-4" /><p className="text-gray-400">Memuat pesanan...</p></div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const StatusIcon = STATUS_ICON_MAP[order.status];
                const flow = getStatusFlow(order.deliveryMethod);
                const currentIdx = flow.indexOf(order.status);

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="w-full p-5 flex items-center justify-between cursor-pointer text-left">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${STATUS_COLORS[order.status]}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-[#29496d]">{formatCurrency(order.totalAmount)}</p>
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100 p-5 animate-fade-in">
                        {/* Status Progress */}
                        <div className="mb-6">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Progress Pesanan</p>
                          <div className="flex items-center gap-1">
                            {flow.map((status, idx) => {
                              const isActive = idx <= currentIdx;
                              const isCurrent = idx === currentIdx;
                              return (
                                <React.Fragment key={status}>
                                  <div className={`flex flex-col items-center flex-1 ${idx > 0 ? "" : ""}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCurrent ? "bg-[#29496d] text-white ring-4 ring-[#29496d]/20" : isActive ? "bg-[#29496d] text-white" : "bg-gray-200 text-gray-400"}`}>
                                      {idx + 1}
                                    </div>
                                    <span className={`text-[10px] mt-1 text-center leading-tight ${isActive ? "text-[#29496d] font-semibold" : "text-gray-400"}`}>
                                      {STATUS_LABELS[status]}
                                    </span>
                                  </div>
                                  {idx < flow.length - 1 && (
                                    <div className={`h-0.5 flex-1 mt-[-16px] ${idx < currentIdx ? "bg-[#29496d]" : "bg-gray-200"}`} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-3">
                          <div className="flex gap-4 text-sm">
                            <span className="text-gray-400 w-28 flex-shrink-0">Metode</span>
                            <span className="text-gray-700 font-medium">{order.deliveryMethod === "PICKUP" ? "Ambil Sendiri" : "Pengiriman"}</span>
                          </div>
                          {order.shippingAddress && (
                            <div className="flex gap-4 text-sm">
                              <span className="text-gray-400 w-28 flex-shrink-0">Alamat</span>
                              <span className="text-gray-700">{order.shippingAddress}</span>
                            </div>
                          )}
                        </div>

                        {/* Items */}
                        <div className="mt-4 bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Produk Dipesan</p>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.productName} <span className="text-gray-400">x{item.quantity}</span></span>
                                <span className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
              <p className="text-gray-500 mb-6">Mulai belanja untuk melihat riwayat pesanan Anda.</p>
              <Link href="/katalog" className="inline-flex px-6 py-3 bg-[#29496d] text-white font-bold rounded-xl hover:bg-[#203a59] transition-colors">Mulai Belanja</Link>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="max-w-2xl animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Profil Pengguna</h3>
            <div className="space-y-5">
              <ProfileField label="Nama Lengkap" value={currentUser.name} />
              <ProfileField label="Email" value={currentUser.email} />
              <ProfileField label="Role" value={
                <span className="flex items-center gap-2">
                  {(() => { const RoleIcon = ROLE_ICONS[currentUser.role]; return <RoleIcon className="w-4 h-4 text-gray-500" />; })()}
                  {ROLE_LABELS[currentUser.role]}
                </span>
              } />
              {currentUser.company && <ProfileField label="Perusahaan / Organisasi" value={currentUser.company} />}
              <ProfileField label="User ID" value={currentUser.id} />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-400">Data profil Anda tersimpan secara aman di database.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const bgMap: Record<string, string> = { blue: "bg-[#f5f7fb] border-[#a3b0cc]", amber: "bg-amber-50 border-amber-100" };
  return (
    <div className={`rounded-2xl border p-5 ${bgMap[color] || bgMap.blue}`}>
      <div className="mb-4">{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
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
