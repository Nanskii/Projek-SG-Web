"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import { ROLE_LABELS, ROLE_ICONS } from "@/types/user";

interface UserSwitcherProps {
  onClose: () => void;
}

export default function UserSwitcher({ onClose }: UserSwitcherProps) {
  const { currentUser, switchUser, allUsers } = useUser();

  const handleSwitch = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Ganti Pengguna</h2>
              <p className="text-sm text-gray-500 mt-0.5">Simulasi multi-user untuk demo</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {allUsers.map((user) => {
            const isActive = user.id === currentUser.id;
            return (
              <button
                key={user.id}
                onClick={() => handleSwitch(user.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                    : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  isActive ? "bg-emerald-100" : "bg-gray-100"
                }`}>
                  {ROLE_ICONS[user.role]}
                </div>
                <div className="text-left flex-1">
                  <p className={`font-semibold ${isActive ? "text-emerald-700" : "text-gray-800"}`}>
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">{ROLE_LABELS[user.role]}</p>
                  {user.company && (
                    <p className="text-xs text-gray-400 mt-0.5">{user.company}</p>
                  )}
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">
            Setiap pengguna memiliki keranjang & riwayat pesanan terpisah
          </p>
        </div>
      </div>
    </div>
  );
}
