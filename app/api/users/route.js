import prisma from '@/lib/services/db'
import { NextResponse } from 'next/server'

// GET /api/users - Get all users
export async function GET(request) {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request) {
  try {
    const body = await request.json()
    
    const user = await prisma.user.create({
      data: {
        id: body.id,
        name: body.name,
        email: body.email,
        image: body.image,
        cart: body.cart || {}
      }
    })
    
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}