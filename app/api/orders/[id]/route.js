import prisma from '@/lib/services/db'
import { NextResponse } from 'next/server'

// GET /api/orders/[id] - Get a single order by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const order = await prisma.order.findUnique({
      where: { id },
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
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        isPaid: body.isPaid,
        paymentMethod: body.paymentMethod
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
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.order.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}