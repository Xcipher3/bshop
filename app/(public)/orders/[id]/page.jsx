'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'

export default function OrderDetails() {
  const router = useRouter()
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      fetchOrder()
    }
  }, [user, id, router])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      // In a real implementation, this would fetch the specific order
      // For now, we'll use mock data
      const mockOrder = {
        id: id,
        total: 8998,
        status: 'DELIVERED',
        createdAt: '2025-10-12T14:30:00Z',
        updatedAt: '2025-10-15T09:15:00Z',
        isPaid: true,
        paymentMethod: 'COD',
        coupon: null,
        isCouponUsed: false,
        user: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        address: {
          name: 'John Doe',
          street: '123 Main St',
          city: 'Nairobi',
          state: 'Nairobi',
          zip: '00100',
          country: 'Kenya',
          phone: '+254700000000'
        },
        orderItems: [
          {
            product: {
              id: 'prod_1',
              name: 'Modern Table Lamp',
              images: ['/product-image-1.jpg'],
              category: 'Decoration'
            },
            quantity: 1,
            price: 2999
          },
          {
            product: {
              id: 'prod_2',
              name: 'Smart Speaker',
              images: ['/product-image-2.jpg'],
              category: 'Electronics'
            },
            quantity: 1,
            price: 5999
          }
        ]
      }
      setOrder(mockOrder)
    } catch (err) {
      setError('Failed to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'ORDER_PLACED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="mx-6 my-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-6 my-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-6 my-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-6 my-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Order not found</p>
            <button 
              onClick={() => router.push('/orders')}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 100
  const total = subtotal + shipping

  return (
    <div className="mx-6 my-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <button 
            onClick={() => router.push('/orders')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Back to Orders
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
                <p className="text-2xl font-bold mt-1">KSH {order.total}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 h-full w-full" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-medium">KSH {item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">KSH {subtotal}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">KSH {shipping}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax</p>
                  <p className="font-medium">KSH 0.00</p>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between">
                  <p className="text-lg font-bold">Total</p>
                  <p className="text-lg font-bold">KSH {total}</p>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mt-6 mb-4">Delivery Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{order.address.name}</p>
                <p className="text-gray-600">{order.address.street}</p>
                <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.zip}</p>
                <p className="text-gray-600">{order.address.country}</p>
                <p className="text-gray-600 mt-2">{order.address.phone}</p>
              </div>
              
              <h2 className="text-xl font-bold mt-6 mb-4">Payment</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">Payment Method</p>
                <p className="text-gray-600">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod === 'MPESA' ? 'M-Pesa STK Push' : 'Credit/Debit Card'}
                </p>
                <p className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.isPaid ? 'Paid' : 'Pending Payment'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}