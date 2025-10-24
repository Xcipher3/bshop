import prisma from '@/lib/services/db'
import { NextResponse } from 'next/server'

// GET /api/products/[id] - Get a single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        rating: {
          include: {
            user: true
          }
        }
      }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        mrp: body.mrp,
        price: body.price,
        images: body.images,
        category: body.category,
        inStock: body.inStock
      }
    })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.product.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}