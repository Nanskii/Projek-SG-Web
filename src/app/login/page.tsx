"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { ROLE_LABELS, ROLE_ICONS } from "@/types/user";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

export default function LoginPage() {
  const { currentUser, switchUser, allUsers } = useUser();
  const router = useRouter();

  const handleSelectUser = (userId: string) => {
    switchUser(userId);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#29496d] flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-[#29496d]/20 mb-4">
            W
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Masuk ke Warunge</h1>
          <p className="text-gray-500 mt-2">Pilih profil pengguna untuk simulasi</p>
        </div>

        {/* User Selection */}
        <div className="space-y-3 mb-6 animate-slide-up">
          {allUsers.map((user) => {
            const isActive = user.id === currentUser.id;
            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-[#29496d] bg-[#f5f7fb] shadow-lg shadow-[#29496d]/10"
                    : "border-gray-100 bg-white hover:border-[#a3b0cc] hover:shadow-md"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isActive ? "bg-[#e7eff7]" : "bg-gray-100"
                }`}>
                  {(() => {
                    const RoleIcon = ROLE_ICONS[user.role];
                    return <RoleIcon className={`w-6 h-6 ${isActive ? "text-[#29496d]" : "text-gray-500"}`} />;
                  })()}
                </div>
                <div className="text-left flex-1">
                  <p className={`font-bold ${isActive ? "text-[#203a59]" : "text-gray-800"}`}>
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">{ROLE_LABELS[user.role]}</p>
                  {user.company && <p className="text-xs text-gray-400">{user.company}</p>}
                </div>
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#F8FAFC] px-4 text-sm text-gray-400">atau</span>
          </div>
        </div>

        {/* Login Form (decorative) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] bg-gray-50"
              />
            </div>
            <button className="w-full py-3 bg-[#29496d] hover:bg-[#29496d] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#29496d]/20 cursor-pointer">
              Masuk
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1.5">
            <Info className="w-4 h-4" /> Form ini hanya untuk tampilan. Gunakan pilihan profil di atas untuk login simulasi.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#29496d] font-semibold hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}




