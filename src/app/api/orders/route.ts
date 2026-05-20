import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  // Check if admin
  const prismaUser = await prisma.user.findUnique({ where: { id: user.id } });
  const isAdmin = prismaUser?.role === "admin";

  // Hanya return semua pesanan jika dipanggil dengan ?type=all dan user adalah admin
  const fetchAll = type === "all" && isAdmin;

  const orders = await prisma.order.findMany({
    where: fetchAll ? {} : { userId: user.id },
    include: {
      items: {
        include: { product: true },
      },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const result = orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    userName: order.user.name || "Pengguna",
    userEmail: order.user.email,
    totalAmount: order.totalAmount,
    status: order.status,
    deliveryMethod: order.deliveryMethod,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
    })),
  }));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { items, totalAmount, shippingAddress, deliveryMethod } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verifikasi dan kurangi stok untuk setiap item
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });
        
        if (!product) {
          throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Stok ${product.name} tidak mencukupi (sisa ${product.stock}, diminta ${item.quantity}).`);
        }
        
        // Kurangi stok
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 2. Buat pesanan
      const order = await tx.order.create({
        data: {
          userId: user.id,
          status: "BELUM_BAYAR",
          totalAmount,
          shippingAddress: shippingAddress || null,
          deliveryMethod: deliveryMethod || "DELIVERY",
          items: {
            create: items.map((item: { productId: string; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      // 3. Kosongkan keranjang belanja user di database (opsional tapi lebih aman di backend)
      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      });

      return order;
    });

    return NextResponse.json({ success: true, orderId: result.id });
  } catch (err: any) {
    console.error("Error creating order:", err);
    // Return specific error message if it's from our stock validation
    return NextResponse.json({ error: err.message || "Gagal membuat pesanan" }, { status: 400 });
  }
}
