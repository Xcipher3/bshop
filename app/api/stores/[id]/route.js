import prisma from '@/lib/services/db'
import { NextResponse } from 'next/server'

// GET /api/stores/[id] - Get a single store by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        user: true,
        Product: true,
        Order: {
          include: {
            orderItems: {
              include: {
                product: true
              }
            },
            address: true,
            user: true
          }
        }
      }
    })
    
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }
    
    return NextResponse.json(store)
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json({ error: 'Failed to fetch store' }, { status: 500 })
  }
}

// PUT /api/stores/[id] - Update a store
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const store = await prisma.store.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        username: body.username,
        address: body.address,
        status: body.status,
        isActive: body.isActive,
        logo: body.logo,
        email: body.email,
        contact: body.contact
      }
    })
    
    return NextResponse.json(store)
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json({ error: 'Failed to update store' }, { status: 500 })
  }
}

// DELETE /api/stores/[id] - Delete a store
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.store.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json({ error: 'Failed to delete store' }, { status: 500 })
  }
}