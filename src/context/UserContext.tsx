"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { users } from "@/data/users";

interface UserContextType {
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  allUsers: UserProfile[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(users[0]);

  useEffect(() => {
    try {
      const savedId = localStorage.getItem("warunge_active_user");
      if (savedId) {
        const found = users.find((u) => u.id === savedId);
        if (found) setCurrentUser(found);
      }
    } catch {
      // ignore
    }
  }, []);

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("warunge_active_user", userId);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, switchUser, allUsers: users }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
