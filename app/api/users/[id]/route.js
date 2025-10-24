import prisma from '@/lib/services/db'
import { NextResponse } from 'next/server'

// GET /api/users/[id] - Get a single user by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Address: true,
        buyerOrders: {
          include: {
            orderItems: {
              include: {
                product: true
              }
            },
            address: true
          }
        },
        ratings: true
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        image: body.image,
        cart: body.cart
      }
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}