import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
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
  const { name, description, price, stock, categoryId } = body;

  if (!name || !price) {
    return NextResponse.json({ error: "Nama dan harga wajib diisi" }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        stock: Number(stock) || 0,
        categoryId: categoryId || null,
      },
      include: { category: true },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: "Gagal menambahkan produk" }, { status: 500 });
  }
}
