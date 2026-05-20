import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: "asc" }
    });

    const items = cartItems.map(item => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      image: item.product.imageUrl || "/images/products/placeholder.jpg",
      quantity: item.quantity,
      unit: "pcs", // Fallback since Product model currently lacks unit
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity, absolute } = await request.json();

    if (!productId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (quantity <= 0 && absolute) {
      // If absolute quantity is 0 or less, we should just delete the item.
      await prisma.cartItem.deleteMany({
        where: { userId: user.id, productId }
      });
      return NextResponse.json({ success: true, message: "Item removed" });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check existing cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    });

    if (existingItem) {
      const newQuantity = absolute ? quantity : existingItem.quantity + quantity;
      
      if (newQuantity <= 0) {
        await prisma.cartItem.delete({
          where: { id: existingItem.id }
        });
      } else {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity }
        });
      }
    } else if (quantity > 0) {
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity: absolute ? quantity : quantity
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (productId) {
      // Remove specific item
      await prisma.cartItem.deleteMany({
        where: { userId: user.id, productId }
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { userId: user.id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting from cart:", error);
    return NextResponse.json({ error: "Failed to delete from cart" }, { status: 500 });
  }
}
