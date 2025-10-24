import prisma from '@/lib/services/db'
import { NextResponse } from 'next/server'

// GET /api/cart/[userId] - Get user's cart
export async function GET(request, { params }) {
  try {
    const { userId } = params
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json(user.cart || {})
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

// PUT /api/cart/[userId] - Update user's cart
export async function PUT(request, { params }) {
  try {
    const { userId } = params
    const body = await request.json()
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        cart: body.cart
      }
    })
    
    return NextResponse.json(user.cart)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}