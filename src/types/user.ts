export type UserRole = "enterprise" | "umkm" | "household" | "distributor";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  company?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  enterprise: "Admin Perusahaan",
  umkm: "Pemilik UMKM",
  household: "Ibu Rumah Tangga",
  distributor: "Distributor",
};

export const ROLE_ICONS: Record<UserRole, string> = {
  enterprise: "🏢",
  umkm: "🏪",
  household: "🏠",
  distributor: "🚚",
};
