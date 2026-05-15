import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { products } from "@/data/products";

export async function GET() {
  try {
    const categories = [...new Set(products.map((p) => p.category))];

    const categoryMap = new Map();
    for (const catName of categories) {
      const category = await prisma.category.upsert({
        where: { name: catName },
        update: {},
        create: {
          name: catName,
          description: `Kategori ${catName}`,
        },
      });
      categoryMap.set(catName, category.id);
    }

    for (const p of products) {
      const categoryId = categoryMap.get(p.category);
      
      const existing = await prisma.product.findFirst({
        where: { name: p.name }
      });

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            description: p.description,
            price: p.price,
            stock: p.stock,
            imageUrl: p.image,
            categoryId: categoryId,
          }
        });
      } else {
        await prisma.product.create({
          data: {
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            imageUrl: p.image,
            categoryId: categoryId,
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: "Seeding complete!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
