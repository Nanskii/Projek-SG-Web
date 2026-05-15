import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { products } from "../src/data/products";

async function main() {
  console.log("Mulai seeding database...");

  // Ambil kategori unik
  const categories = [...new Set(products.map((p) => p.category))];

  // Buat kategori
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
    console.log(`✓ Kategori: ${catName}`);
  }

  // Buat produk
  for (const p of products) {
    const categoryId = categoryMap.get(p.category);
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        imageUrl: p.image,
        categoryId: categoryId,
      },
    });
    console.log(`✓ Produk: ${p.name}`);
  }

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
