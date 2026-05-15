import { Category } from "@/types/product";
import { Package, Paperclip, Home, Smartphone, Shirt, Hammer } from "lucide-react";

export const categories: Category[] = [
  { id: "sembako", name: "Sembako & Bahan Pokok", icon: Package, count: 8 },
  { id: "atk", name: "Alat Tulis & Kantor", icon: Paperclip, count: 4 },
  { id: "rumah-tangga", name: "Kebutuhan Rumah Tangga", icon: Home, count: 4 },
  { id: "elektronik", name: "Elektronik & Gadget", icon: Smartphone, count: 3 },
  { id: "fashion", name: "Fashion & Pakaian", icon: Shirt, count: 2 },
  { id: "bangunan", name: "Bahan Bangunan", icon: Hammer, count: 3 },
];

// Icon map by category slug for use in Server Components (no JSX)
export const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sembako: Package,
  atk: Paperclip,
  "rumah-tangga": Home,
  elektronik: Smartphone,
  fashion: Shirt,
  bangunan: Hammer,
};
