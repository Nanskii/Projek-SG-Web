"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { formatCurrency } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS, OrderStatus, getStatusFlow, getNextStatus, DeliveryMethod } from "@/types/order";
import Link from "next/link";
import {
  ShieldCheck, Package, ClipboardList, BarChart3, Plus, Pencil, Trash2,
  Users, DollarSign, Loader2, X, ChevronDown, ChevronUp, AlertTriangle, LogIn, Check
} from "lucide-react";

// ───── Types ─────

interface Category { id: string; name: string; }

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: string | null;
  category: Category | null;
}

interface OrderItemData {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  shippingAddress: string | null;
  createdAt: string;
  items: OrderItemData[];
}

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
}

// ───── Main Page ─────

export default function AdminPage() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Order state
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const isAdmin = currentUser?.role === "admin";

  const loadData = useCallback(async () => {
    try {
      const [prodRes, orderRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders?type=all"),
        fetch("/api/products").then(() => fetch("/api/products")), // categories via products
      ]);
      const prods = await prodRes.json();
      const ords = await orderRes.json();
      setProducts(Array.isArray(prods) ? prods : []);
      setOrders(Array.isArray(ords) ? ords : []);

      // Extract unique categories
      const catMap = new Map<string, Category>();
      if (Array.isArray(prods)) {
        prods.forEach((p: Product) => {
          if (p.category) catMap.set(p.category.id, p.category);
        });
      }
      setCategories(Array.from(catMap.values()));

      // Calculate stats
      const completedOrders = Array.isArray(ords) ? ords.filter((o: OrderData) => o.status === "SELESAI") : [];
      setStats({
        totalProducts: Array.isArray(prods) ? prods.length : 0,
        totalOrders: Array.isArray(ords) ? ords.length : 0,
        totalUsers: new Set(Array.isArray(ords) ? ords.map((o: OrderData) => o.userId) : []).size,
        totalRevenue: completedOrders.reduce((s: number, o: OrderData) => s + o.totalAmount, 0),
        pendingOrders: Array.isArray(ords) ? ords.filter((o: OrderData) => ["BELUM_BAYAR", "SUDAH_BAYAR", "DIPROSES"].includes(o.status)).length : 0,
      });
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) loadData();
    else setLoading(false);
  }, [isAdmin, loadData]);

  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm">
          <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-500 mb-8">Silakan login untuk mengakses panel admin.</p>
          <Link href="/login" className="inline-flex px-6 py-3 bg-[#29496d] text-white font-bold rounded-xl hover:bg-[#203a59] transition-colors items-center gap-2">
            <LogIn className="w-5 h-5" /> Masuk
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-500 mb-8">Anda tidak memiliki hak akses untuk halaman ini.</p>
          <Link href="/" className="inline-flex px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-10 h-10 text-[#29496d] animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Memuat data admin...</p>
      </div>
    );
  }

  // Product handlers
  const handleSaveProduct = async (formData: FormData) => {
    setProductSaving(true);
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      categoryId: formData.get("categoryId") || null,
    };

    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/products", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
      }
      setShowProductForm(false);
      setEditingProduct(null);
      loadData();
    } catch { /* ignore */ }
    setProductSaving(false);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      loadData();
    } catch { /* ignore */ }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch { /* ignore */ }
    setUpdatingStatus(null);
  };

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const formatDate = (s: string) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(s));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Admin <span className="gradient-text">Panel</span>
        </h1>
        <p className="mt-2 text-gray-500">Kelola produk, pesanan, dan pantau statistik toko.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
        {(["overview", "products", "orders"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${activeTab === tab ? "bg-white text-[#29496d] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {tab === "overview" ? "Ringkasan" : tab === "products" ? "Kelola Produk" : "Kelola Pesanan"}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={<Package className="w-7 h-7 text-[#29496d]" />} label="Total Produk" value={String(stats.totalProducts)} />
            <StatCard icon={<ClipboardList className="w-7 h-7 text-[#29496d]" />} label="Total Pesanan" value={String(stats.totalOrders)} />
            <StatCard icon={<Users className="w-7 h-7 text-[#29496d]" />} label="Pelanggan" value={String(stats.totalUsers)} />
            <StatCard icon={<DollarSign className="w-7 h-7 text-green-600" />} label="Revenue" value={formatCurrency(stats.totalRevenue)} />
            <StatCard icon={<BarChart3 className="w-7 h-7 text-amber-600" />} label="Perlu Diproses" value={String(stats.pendingOrders)} />
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{products.length} produk terdaftar</p>
            <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
              className="px-4 py-2.5 bg-[#29496d] text-white font-semibold text-sm rounded-xl hover:bg-[#203a59] transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-[#29496d]/20">
              <Plus className="w-4 h-4" /> Tambah Produk
            </button>
          </div>

          {/* Product Form Modal */}
          {showProductForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowProductForm(false)}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowProductForm(false)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"><X className="w-5 h-5" /></button>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h3>
                <form action={handleSaveProduct} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Nama Produk *</label>
                    <input name="name" defaultValue={editingProduct?.name || ""} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Deskripsi</label>
                    <textarea name="description" defaultValue={editingProduct?.description || ""} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Harga (Rp) *</label>
                      <input name="price" type="number" defaultValue={editingProduct?.price || ""} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Stok</label>
                      <input name="stock" type="number" defaultValue={editingProduct?.stock || 0} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Kategori</label>
                    <select name="categoryId" defaultValue={editingProduct?.categoryId || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] cursor-pointer">
                      <option value="">Tanpa Kategori</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={productSaving}
                    className="w-full py-3 bg-[#29496d] text-white font-bold rounded-xl hover:bg-[#203a59] transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                    {productSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Check className="w-4 h-4" /> {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}</>}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Produk</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Harga</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stok</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                        {p.description && <p className="text-xs text-gray-400 truncate max-w-xs">{p.description}</p>}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{p.category?.name || "-"}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-[#29496d] text-right">{formatCurrency(p.price)}</td>
                      <td className="px-5 py-3 text-sm text-right">
                        <span className={`font-semibold ${p.stock <= 5 ? "text-red-500" : "text-gray-700"}`}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                            className="p-2 text-gray-400 hover:text-[#29496d] hover:bg-[#f5f7fb] rounded-lg transition-colors cursor-pointer" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {deleteConfirm === p.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-600 bg-red-50 rounded-lg cursor-pointer text-xs font-semibold">Hapus</button>
                              <button onClick={() => setDeleteConfirm(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(p.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500 mr-2">Filter:</span>
            {["all", "BELUM_BAYAR", "SUDAH_BAYAR", "DIPROSES", "DIANTAR", "SIAP_DIAMBIL", "SELESAI"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${statusFilter === s ? "bg-[#29496d] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {s === "all" ? "Semua" : STATUS_LABELS[s as OrderStatus]}
                <span className="ml-1 opacity-70">({s === "all" ? orders.length : orders.filter((o) => o.status === s).length})</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 text-center py-12">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada pesanan dengan filter ini.</p>
              </div>
            ) : filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const nextStatus = getNextStatus(order.status, order.deliveryMethod);
              const flow = getStatusFlow(order.deliveryMethod);
              const currentIdx = flow.indexOf(order.status);

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-4 flex items-center justify-between cursor-pointer text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{order.userName}</p>
                        <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-[#29496d] text-sm">{formatCurrency(order.totalAmount)}</p>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div><span className="text-gray-400 block text-xs">Order ID</span><span className="font-mono text-xs text-gray-700">{order.id.slice(0, 8)}</span></div>
                        <div><span className="text-gray-400 block text-xs">Email</span><span className="text-gray-700">{order.userEmail}</span></div>
                        <div><span className="text-gray-400 block text-xs">Metode</span><span className="text-gray-700">{order.deliveryMethod === "PICKUP" ? "Ambil Sendiri" : "Pengiriman"}</span></div>
                        {order.shippingAddress && <div><span className="text-gray-400 block text-xs">Alamat</span><span className="text-gray-700">{order.shippingAddress}</span></div>}
                      </div>

                      {/* Progress */}
                      <div className="flex items-center gap-1">
                        {flow.map((status, idx) => (
                          <React.Fragment key={status}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx <= currentIdx ? "bg-[#29496d] text-white" : "bg-gray-200 text-gray-400"}`}>{idx + 1}</div>
                            {idx < flow.length - 1 && <div className={`h-0.5 flex-1 ${idx < currentIdx ? "bg-[#29496d]" : "bg-gray-200"}`} />}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Items */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm py-1">
                            <span className="text-gray-600">{item.productName} <span className="text-gray-400">x{item.quantity}</span></span>
                            <span className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Update */}
                      {nextStatus && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, nextStatus)}
                          disabled={updatingStatus === order.id}
                          className="w-full py-2.5 bg-[#29496d] text-white font-semibold text-sm rounded-xl hover:bg-[#203a59] transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {updatingStatus === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Ubah ke: {STATUS_LABELS[nextStatus]}
                        </button>
                      )}
                      {!nextStatus && order.status === "SELESAI" && (
                        <p className="text-center text-sm text-green-600 font-semibold py-2">✓ Pesanan telah selesai</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-3">{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
