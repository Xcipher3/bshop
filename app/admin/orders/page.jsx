'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  // Update order status
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order))
        toast.success('Order status updated successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  // Delete an order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setOrders(orders.filter(order => order.id !== orderId))
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(null)
          }
          toast.success('Order deleted successfully')
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || 'Failed to delete order')
        }
      } catch (error) {
        console.error('Error deleting order:', error)
        toast.error('Failed to delete order')
      }
    }
  }

  // Filter orders by status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded ${statusFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setStatusFilter('ORDER_PLACED')}
            className={`px-4 py-2 rounded ${statusFilter === 'ORDER_PLACED' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
          >
            Placed
          </button>
          <button 
            onClick={() => setStatusFilter('PROCESSING')}
            className={`px-4 py-2 rounded ${statusFilter === 'PROCESSING' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
          >
            Processing
          </button>
          <button 
            onClick={() => setStatusFilter('SHIPPED')}
            className={`px-4 py-2 rounded ${statusFilter === 'SHIPPED' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
          >
            Shipped
          </button>
          <button 
            onClick={() => setStatusFilter('DELIVERED')}
            className={`px-4 py-2 rounded ${statusFilter === 'DELIVERED' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
          >
            Delivered
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`cursor-pointer ${selectedOrder && selectedOrder.id === order.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KSH {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'ORDER_PLACED' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteOrder(order.id)
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">Order ID: {selectedOrder.id}</h3>
                <p className="text-sm text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">Customer</h3>
                <p className="text-sm text-gray-500">{selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">Shipping Address</h3>
                <p className="text-sm text-gray-500">{selectedOrder.address?.name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.address?.street}</p>
                <p className="text-sm text-gray-500">{selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.zip}</p>
                <p className="text-sm text-gray-500">{selectedOrder.address?.country}</p>
                <p className="text-sm text-gray-500">{selectedOrder.address?.phone}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">Order Status</h3>
                <div className="mt-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="ORDER_PLACED">Order Placed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">Payment</h3>
                <p className="text-sm text-gray-500">Method: {selectedOrder.paymentMethod}</p>
                <p className="text-sm text-gray-500">Status: {selectedOrder.isPaid ? 'Paid' : 'Pending'}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">Items</h3>
                <div className="mt-2 space-y-2">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">KSH {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">KSH {selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-500">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}