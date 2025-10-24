'use client'

import { deleteItemFromCart, removeFromCart } from '@/lib/features/cart/cartSlice'
import { fetchProducts } from '@/lib/features/product/productSlice'
import { ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Cart() {

    const dispatch = useDispatch();
    const router = useRouter();

    const { list: products } = useSelector(state => state.product)
    const { cartItems, total } = useSelector(state => state.cart)

    const cartProducts = Object.keys(cartItems).map(productId => {
        const product = products.find(p => p.id === productId)
        return {
            ...product,
            quantity: cartItems[productId]
        }
    }).filter(item => item !== undefined)

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'KSH'

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart({ productId }))
    }

    const handleDeleteFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    const handleCheckout = () => {
        router.push('/checkout')
    }

    useEffect(() => {
        // Fetch products to have product details for cart items
        if (products.length === 0) {
            dispatch(fetchProducts())
        }
    }, [dispatch, products.length])

    const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal > 0 ? 100 : 0
    const totalAmount = subtotal + shipping

    if (cartProducts.length === 0) {
        return (
            <div className="mx-6 my-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
                    <div className="flex flex-col items-center justify-center py-20">
                        <ShoppingCart size={64} className="text-gray-300 mb-6" />
                        <p className="text-xl mb-6">Your cart is empty</p>
                        <Link href="/shop" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-6 my-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow">
                            {cartProducts.map((item) => (
                                <div key={item.id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                                        {item.images && item.images.length > 0 && (
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    <Link href={`/product/${item.id}`}>{item.name}</Link>
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                            </div>
                                            <p className="text-lg font-medium text-gray-900">{currency}{item.price}</p>
                                        </div>

                                        <div className="mt-4 flex items-center">
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => handleRemoveFromCart(item.id)}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 py-1">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch({ type: 'cart/addToCart', payload: { productId: item.id } })}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteFromCart(item.id)}
                                                className="ml-4 text-red-600 hover:text-red-800 flex items-center"
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className="text-gray-900">{currency}{subtotal.toFixed(2)}</p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-gray-600">Shipping</p>
                                    <p className="text-gray-900">{currency}{shipping.toFixed(2)}</p>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex justify-between">
                                    <p className="text-base font-medium text-gray-900">Total</p>
                                    <p className="text-base font-medium text-gray-900">{currency}{totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="mt-4 text-center">
                                <Link href="/shop" className="text-indigo-600 hover:text-indigo-500">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}