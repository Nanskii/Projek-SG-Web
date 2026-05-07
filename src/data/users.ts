import { UserProfile } from "@/types/user";
import { Order } from "@/types/order";

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

export const sampleOrders: Order[] = [
  {
    id: "ORD-2026-001",
    userId: "u001",
    items: [
      { productId: "p001", name: "Beras Premium 5kg", price: 75000, image: "/images/products/beras.jpg", quantity: 50, unit: "karung" },
      { productId: "p009", name: "Kertas HVS A4 (500 lembar)", price: 48000, image: "/images/products/kertas.jpg", quantity: 100, unit: "rim" },
    ],
    totalAmount: 8550000,
    status: "completed",
    createdAt: "2026-04-28T10:30:00Z",
    documentNumber: "DOC/MJC/04/2026/001",
  },
  {
    id: "ORD-2026-002",
    userId: "u001",
    items: [
      { productId: "p006", name: "Mie Instan Box (40 pcs)", price: 95000, image: "/images/products/mie.jpg", quantity: 20, unit: "box" },
    ],
    totalAmount: 1900000,
    status: "processing",
    createdAt: "2026-05-05T14:15:00Z",
    documentNumber: "DOC/MJC/05/2026/002",
  },
  {
    id: "ORD-2026-003",
    userId: "u002",
    items: [
      { productId: "p003", name: "Gula Pasir 1kg", price: 15000, image: "/images/products/gula.jpg", quantity: 10, unit: "kg" },
      { productId: "p002", name: "Minyak Goreng 2L", price: 32000, image: "/images/products/minyak.jpg", quantity: 5, unit: "botol" },
    ],
    totalAmount: 310000,
    status: "completed",
    createdAt: "2026-05-01T08:00:00Z",
    documentNumber: "DOC/TA/05/2026/001",
  },
  {
    id: "ORD-2026-004",
    userId: "u003",
    items: [
      { productId: "p001", name: "Beras Premium 5kg", price: 75000, image: "/images/products/beras.jpg", quantity: 2, unit: "karung" },
      { productId: "p008", name: "Telur Ayam 1 Tray (30 butir)", price: 55000, image: "/images/products/telur.jpg", quantity: 1, unit: "tray" },
      { productId: "p013", name: "Sabun Cuci Piring 800ml", price: 18000, image: "/images/products/sabun-piring.jpg", quantity: 2, unit: "botol" },
    ],
    totalAmount: 241000,
    status: "pending",
    createdAt: "2026-05-06T16:45:00Z",
    documentNumber: "DOC/DL/05/2026/001",
  },
  {
    id: "ORD-2026-005",
    userId: "u004",
    items: [
      { productId: "p022", name: "Semen Portland 50kg", price: 62000, image: "/images/products/semen.jpg", quantity: 200, unit: "sak" },
      { productId: "p024", name: "Paku Beton 5cm (1kg)", price: 22000, image: "/images/products/paku.jpg", quantity: 50, unit: "kg" },
    ],
    totalAmount: 13500000,
    status: "completed",
    createdAt: "2026-04-20T09:00:00Z",
    documentNumber: "DOC/DP/04/2026/003",
  },
  {
    id: "ORD-2026-006",
    userId: "u002",
    items: [
      { productId: "p005", name: "Kopi Bubuk Arabika 250g", price: 45000, image: "/images/products/kopi.jpg", quantity: 8, unit: "pack" },
    ],
    totalAmount: 360000,
    status: "processing",
    createdAt: "2026-05-06T11:20:00Z",
    documentNumber: "DOC/TA/05/2026/002",
  },
];
