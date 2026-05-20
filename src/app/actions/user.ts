"use server";

import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { UserProfile } from "@/types/user";

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Coba ambil dari Prisma
  const prismaUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (prismaUser) {
    return {
      id: prismaUser.id,
      name: prismaUser.name || "Pengguna",
      email: prismaUser.email,
      role: prismaUser.role as any,
      avatar: prismaUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(prismaUser.name || "Pengguna")}&background=random`,
      company: prismaUser.company || undefined,
      createdAt: prismaUser.createdAt.toISOString(),
    };
  }

  return null;
}
