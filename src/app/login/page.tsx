"use client";

import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/app/actions/auth";
import { useUser } from "@/context/UserContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [state, formAction, isPending] = useActionState(login, undefined);
  const { setCurrentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      // Login berhasil di server, sekarang fetch profil user
      fetch("/api/debug-auth")
        .then((res) => res.json())
        .then((data) => {
          if (data.prismaUser) {
            setCurrentUser({
              id: data.prismaUser.id,
              name: data.prismaUser.name || "Pengguna",
              email: data.prismaUser.email,
              role: data.prismaUser.role as any,
              avatar: data.prismaUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.prismaUser.name || "Pengguna")}&background=random`,
              company: data.prismaUser.company || undefined,
            });
          }
          
          if (data.prismaUser && data.prismaUser.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [state, setCurrentUser, router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">

          <h1 className="text-2xl font-extrabold text-gray-900">Masuk ke Warunge</h1>
          <p className="text-gray-500 mt-2">Selamat datang kembali!</p>
        </div>

        {registered && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 text-sm font-medium animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p>Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.</p>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5 animate-slide-up shadow-sm">
          {state?.error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{state.error}</p>
            </div>
          )}

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
          
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29496d] bg-gray-50"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isPending}
            className={`w-full py-3.5 mt-2 text-white font-bold rounded-xl transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
              isPending ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-[#29496d] hover:bg-[#203a59] shadow-[#29496d]/20"
            }`}
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Masuk...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#29496d] font-semibold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
