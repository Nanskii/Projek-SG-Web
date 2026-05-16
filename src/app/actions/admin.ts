'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { OrderStatus, DeliveryMethod } from '@/types/order'

// ──────────────── Auth Helper ────────────────

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Anda harus login terlebih dahulu', user: null }
  }

  const prismaUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!prismaUser || prismaUser.role !== 'admin') {
    return { error: 'Anda tidak memiliki akses admin', user: null }
  }

  return { error: null, user: prismaUser }
}

// ──────────────── Product CRUD ────────────────

export async function createProduct(formData: FormData) {
  const { error } = await requireAdmin()
  if (error) return { error }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const stock = Number(formData.get('stock'))
  const categoryId = formData.get('categoryId') as string | null

  if (!name || !price) {
    return { error: 'Nama dan harga produk wajib diisi' }
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        stock: stock || 0,
        categoryId: categoryId || null,
      },
    })
    revalidatePath('/katalog')
    revalidatePath('/admin')
    return { success: true, productId: product.id }
  } catch (err: unknown) {
    console.error('Error creating product:', err)
    return { error: 'Gagal menambahkan produk' }
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const { error } = await requireAdmin()
  if (error) return { error }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const stock = Number(formData.get('stock'))
  const categoryId = formData.get('categoryId') as string | null

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description: description || null,
        price,
        stock: stock || 0,
        categoryId: categoryId || null,
      },
    })
    revalidatePath('/katalog')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: unknown) {
    console.error('Error updating product:', err)
    return { error: 'Gagal mengupdate produk' }
  }
}

export async function deleteProduct(productId: string) {
  const { error } = await requireAdmin()
  if (error) return { error }

  try {
    await prisma.product.delete({ where: { id: productId } })
    revalidatePath('/katalog')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: unknown) {
    console.error('Error deleting product:', err)
    return { error: 'Gagal menghapus produk. Pastikan produk tidak memiliki pesanan aktif.' }
  }
}

// ──────────────── Order Management ────────────────

export async function getAllOrders() {
  const { error } = await requireAdmin()
  if (error) return []

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    userName: order.user.name || 'Pengguna',
    userEmail: order.user.email,
    totalAmount: order.totalAmount,
    status: order.status as OrderStatus,
    deliveryMethod: order.deliveryMethod as DeliveryMethod,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
    })),
  }))
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const { error } = await requireAdmin()
  if (error) return { error }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    })
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: unknown) {
    console.error('Error updating order status:', err)
    return { error: 'Gagal mengubah status pesanan' }
  }
}

// ──────────────── Category Helpers ────────────────

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  return categories
}

// ──────────────── Admin Stats ────────────────

export async function getAdminStats() {
  const { error } = await requireAdmin()
  if (error) return null

  const [totalProducts, totalOrders, totalUsers, revenueResult] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'SELESAI' },
    }),
  ])

  const pendingOrders = await prisma.order.count({
    where: { status: { in: ['BELUM_BAYAR', 'SUDAH_BAYAR', 'DIPROSES'] } },
  })

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenueResult._sum.totalAmount || 0,
    pendingOrders,
  }
}
