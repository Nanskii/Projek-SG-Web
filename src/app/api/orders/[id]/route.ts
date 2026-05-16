import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const prismaUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (order.userId !== user.id && prismaUser?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: order.id,
    userId: order.userId,
    userName: order.user.name || "Pengguna",
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
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prismaUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!prismaUser || prismaUser.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { status } = body;

  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json({ error: "Gagal mengubah status" }, { status: 500 });
  }
}
