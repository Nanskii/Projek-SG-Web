"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROLE_LABELS, ROLE_ICONS, UserRole } from "@/types/user";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("household");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi - langsung redirect ke login
    router.push("/login");
  };

  const roles: UserRole[] = ["enterprise", "umkm", "household", "distributor"];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-emerald-200 mb-4">
            W
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Daftar di Warunge</h1>
          <p className="text-gray-500 mt-2">Buat akun untuk mulai pengadaan barang</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Nama Anda"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="Minimal 8 karakter"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Nama Perusahaan / Organisasi</label>
            <input
              type="text"
              placeholder="Opsional"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Tipe Pengguna</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedRole === role
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-100 hover:border-emerald-200"
                  }`}
                >
                  <span className="text-xl">{ROLE_ICONS[role]}</span>
                  <span className={`text-sm font-semibold ${selectedRole === role ? "text-emerald-700" : "text-gray-600"}`}>
                    {ROLE_LABELS[role]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200 cursor-pointer"
          >
            Daftar Sekarang
          </button>

          <p className="text-xs text-gray-400 text-center">
            ℹ️ Ini adalah form simulasi. Tidak ada data yang disimpan ke server.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
