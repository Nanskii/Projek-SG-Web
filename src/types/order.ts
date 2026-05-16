export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
}

export type OrderStatus =
  | "BELUM_BAYAR"
  | "SUDAH_BAYAR"
  | "DIPROSES"
  | "DIANTAR"
  | "SIAP_DIAMBIL"
  | "SELESAI";

export type DeliveryMethod = "DELIVERY" | "PICKUP";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  shippingAddress: string | null;
  createdAt: string;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  BELUM_BAYAR: "Belum Bayar",
  SUDAH_BAYAR: "Sudah Bayar",
  DIPROSES: "Diproses",
  DIANTAR: "Diantar",
  SIAP_DIAMBIL: "Siap Diambil",
  SELESAI: "Selesai",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  BELUM_BAYAR: "bg-red-100 text-red-700",
  SUDAH_BAYAR: "bg-yellow-100 text-yellow-800",
  DIPROSES: "bg-blue-100 text-blue-700",
  DIANTAR: "bg-purple-100 text-purple-700",
  SIAP_DIAMBIL: "bg-teal-100 text-teal-700",
  SELESAI: "bg-green-100 text-green-700",
};

export const STATUS_ICONS: Record<OrderStatus, string> = {
  BELUM_BAYAR: "clock",
  SUDAH_BAYAR: "credit-card",
  DIPROSES: "loader",
  DIANTAR: "truck",
  SIAP_DIAMBIL: "package-check",
  SELESAI: "check-circle",
};

// Status flow for DELIVERY orders
export const DELIVERY_STATUS_FLOW: OrderStatus[] = [
  "BELUM_BAYAR",
  "SUDAH_BAYAR",
  "DIPROSES",
  "DIANTAR",
  "SELESAI",
];

// Status flow for PICKUP orders
export const PICKUP_STATUS_FLOW: OrderStatus[] = [
  "BELUM_BAYAR",
  "SUDAH_BAYAR",
  "DIPROSES",
  "SIAP_DIAMBIL",
  "SELESAI",
];

export function getStatusFlow(deliveryMethod: DeliveryMethod): OrderStatus[] {
  return deliveryMethod === "PICKUP" ? PICKUP_STATUS_FLOW : DELIVERY_STATUS_FLOW;
}

export function getNextStatus(currentStatus: OrderStatus, deliveryMethod: DeliveryMethod): OrderStatus | null {
  const flow = getStatusFlow(deliveryMethod);
  const currentIndex = flow.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= flow.length - 1) return null;
  return flow[currentIndex + 1];
}
