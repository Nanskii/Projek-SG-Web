export type CategoryType =
  | "sembako"
  | "atk"
  | "rumah-tangga"
  | "elektronik"
  | "fashion"
  | "bangunan";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: CategoryType;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  unit: string;
  isPromo: boolean;
  isBestSeller: boolean;
  supplier: string;
  tags: string[];
}

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
  count: number;
}
