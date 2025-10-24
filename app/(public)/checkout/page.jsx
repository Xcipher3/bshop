'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { clearCart } from '@/lib/features/cart/cartSlice'
import { fetchAddresses } from '@/lib/features/address/addressSlice'

export default function Checkout() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useAuth()
  const { list: addresses } = useSelector(state => state.address)
  const { cartItems, total } = useSelector(state => state.cart)
  const { list: products } = useSelector(state => state.product)
  
  const [selectedAddress, setSelectedAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('MPESA')
  const [orderNote, setOrderNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'KSH'

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      // Fetch user addresses
      dispatch(fetchAddresses(user.id))
    }
  }, [user, dispatch, router])

  useEffect(() => {
    // Set default address if available
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0].id)
    }
  }, [addresses, selectedAddress])

  const cartProducts = Object.keys(cartItems).map(productId => {
    const product = products.find(p => p.id === productId)
    return {
      ...product,
      quantity: cartItems[productId]
    }
  }).filter(item => item !== undefined)

  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 0 ? 100 : 0
  const totalAmount = subtotal + shipping

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Prepare order data
      const orderData = {
        total: totalAmount,
        userId: user.id,
        addressId: selectedAddress,
        isPaid: false,
        paymentMethod,
        isCouponUsed: false,
        coupon: {},
        orderItems: cartProducts.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      // Check if response is OK
      if (!response.ok) {
        // Try to parse error response, but handle if it's not JSON
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json()
            setError(errorData.error || `Failed to place order: HTTP error ${response.status}`)
          } else {
            setError(`Failed to place order: HTTP error ${response.status}`)
          }
        } catch (parseError) {
          setError(`Failed to place order: HTTP error ${response.status}`)
        }
        setLoading(false)
        return
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setError('Invalid response format from server')
        setLoading(false)
        return
      }

      const order = await response.json()
      
      // Clear cart
      dispatch(clearCart())
      
      // Redirect to order confirmation page
      router.push(`/orders/${order.id}`)
    } catch (err) {
      setError('An unexpected error occurred while placing your order: ' + err.message)
    } finally {
      setLoading(false)
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

  return (
    <div className="mx-6 my-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Delivery Address</h2>
              
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <p className="font-medium">{address.name}</p>
                          <p className="text-gray-600">{address.street}, {address.city}, {address.state} {address.zip}</p>
                          <p className="text-gray-600">{address.phone}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No addresses found. Please add an address in your account settings.</p>
              )}
              
              <button className="mt-4 text-indigo-600 hover:text-indigo-500">
                + Add New Address
              </button>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="ml-3">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-gray-600">Pay when your order is delivered</p>
                    </div>
                  </label>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="MPESA"
                      checked={paymentMethod === 'MPESA'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="ml-3">
                      <p className="font-medium">M-Pesa STK Push</p>
                      <p className="text-gray-600">Pay with M-Pesa STK Push securely</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Order Note */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Order Note (Optional)</h2>
              
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-3"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>
          
          <div className="lg:w-1/3">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartProducts.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{currency}{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-900">{currency}{subtotal.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="text-gray-900">{currency}{shipping.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax</p>
                  <p className="text-gray-900">{currency}0.00</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-lg font-medium text-gray-900">{currency}{totalAmount.toFixed(2)}</p>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`mt-6 w-full py-3 px-4 rounded-md text-white transition ${
                  loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}