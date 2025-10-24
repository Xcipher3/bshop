import prisma from '@/lib/services/db'
import { NextResponse } from 'next/server'

// GET /api/stores - Get all stores
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let where = {}
    
    if (status) {
      where.status = status
    }
    
    const stores = await prisma.store.findMany({
      where,
      include: {
        user: true,
        Product: true,
        Order: true
      }
    })
    
    return NextResponse.json(stores)
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
  }
}

// POST /api/stores - Create a new store
export async function POST(request) {
  try {
    const body = await request.json()
    
    const store = await prisma.store.create({
      data: {
        userId: body.userId,
        name: body.name,
        description: body.description,
        username: body.username,
        address: body.address,
        status: body.status || 'pending',
        isActive: body.isActive || false,
        logo: body.logo,
        email: body.email,
        contact: body.contact
      }
    })
    
    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json({ error: 'Failed to create store' }, { status: 500 })
  }
}