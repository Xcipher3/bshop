import prisma from '@/lib/services/db'
import { NextResponse } from 'next/server'

// GET /api/orders - Get all orders
export async function GET(request) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST /api/orders - Create a new order
export async function POST(request) {
  try {
    const body = await request.json()
    
    const order = await prisma.order.create({
      data: {
        total: body.total,
        status: body.status || 'ORDER_PLACED',
        userId: body.userId,
        addressId: body.addressId,
        isPaid: body.isPaid || false,
        paymentMethod: body.paymentMethod,
        isCouponUsed: body.isCouponUsed || false,
        coupon: body.coupon || {},
        orderItems: {
          create: body.orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}