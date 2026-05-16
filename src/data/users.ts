import { UserProfile } from "@/types/user";

export const users: UserProfile[] = [
  {
    id: "u001",
    name: "Budi Santoso",
    role: "enterprise",
    avatar: "/images/avatars/enterprise.png",
    email: "budi@ptmajucorp.co.id",
    company: "PT Maju Corporation",
  },
  {
    id: "u002",
    name: "Siti Aminah",
    role: "umkm",
    avatar: "/images/avatars/umkm.png",
    email: "siti@tokoaminah.com",
    company: "Toko Aminah",
  },
  {
    id: "u003",
    name: "Dewi Lestari",
    role: "household",
    avatar: "/images/avatars/household.png",
    email: "dewi.lestari@gmail.com",
  },
  {
    id: "u004",
    name: "Agus Pratama",
    role: "distributor",
    avatar: "/images/avatars/distributor.png",
    email: "agus@distributorpratama.co.id",
    company: "Distributor Pratama",
  },
];
