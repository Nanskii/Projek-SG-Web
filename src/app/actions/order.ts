'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { OrderStatus, DeliveryMethod } from '@/types/order'

interface CreateOrderInput {
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  shippingAddress: string | null;
  deliveryMethod: DeliveryMethod;
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Anda harus login terlebih dahulu' }
  }

  if (!input.items || input.items.length === 0) {
    return { error: 'Keranjang kosong' }
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'BELUM_BAYAR',
        totalAmount: input.totalAmount,
        shippingAddress: input.shippingAddress,
        deliveryMethod: input.deliveryMethod,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    return { success: true, orderId: order.id }
  } catch (err: unknown) {
    console.error('Error creating order:', err)
    return { error: 'Gagal membuat pesanan. Silakan coba lagi.' }
  }
}

export async function getMyOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders.map((order) => ({
    id: order.id,
    userId: order.userId,
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

export async function getOrderById(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
      user: true,
    },
  })

  if (!order) return null

  // Only allow the owner or admin to view
  const prismaUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (order.userId !== user.id && prismaUser?.role !== 'admin') {
    return null
  }

  return {
    id: order.id,
    userId: order.userId,
    userName: order.user.name || 'Pengguna',
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
  }
}
