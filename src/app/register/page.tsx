"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { ROLE_LABELS, ROLE_ICONS, UserRole } from "@/types/user";
import { signup } from "@/app/actions/auth";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("household");
  const [state, formAction, isPending] = useActionState(signup, undefined);

  const roles: UserRole[] = ["enterprise", "umkm", "household", "distributor"];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">

          <h1 className="text-2xl font-extrabold text-gray-900">Daftar di Warunge</h1>
          <p className="text-gray-500 mt-2">Buat akun untuk mulai pengadaan barang</p>
        </div>

        {/* Form */}
        <form action={formAction} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5 animate-slide-up">
          {state?.error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{state.error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Nama Anda"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="Minimal 8 karakter"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Nama Perusahaan / Organisasi</label>
            <input
              type="text"
              name="company"
              placeholder="Opsional (Isi jika UMKM/Distributor)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] bg-gray-50"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Tipe Pengguna</label>
            <input type="hidden" name="role" value={selectedRole} />
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedRole === role
                      ? "border-[#29496d] bg-[#f5f7fb]"
                      : "border-gray-100 hover:border-[#a3b0cc]"
                  }`}
                >
                  <span className="text-xl">
                    {(() => {
                      const RoleIcon = ROLE_ICONS[role];
                      return <RoleIcon className="w-5 h-5" />;
                    })()}
                  </span>
                  <span className={`text-sm font-semibold ${selectedRole === role ? "text-[#203a59]" : "text-gray-600"}`}>
                    {ROLE_LABELS[role]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3.5 text-white font-bold rounded-xl transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
              isPending ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-[#29496d] hover:bg-[#203a59] shadow-[#29496d]/20"
            }`}
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#29496d] font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
