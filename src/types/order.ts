export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
}

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  documentNumber: string;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Menunggu",
  processing: "Diproses",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-[#e7eff7] text-[#29496d]",
  completed: "bg-[#e7eff7] text-[#29496d]",
  cancelled: "bg-red-100 text-red-800",
};


