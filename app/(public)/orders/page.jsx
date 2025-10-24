'use client'

import { orderDummyData } from '@/assets/assets'
import OrderItem from '@/components/OrderItem'
import { useEffect, useState } from 'react'

export default function Orders() {

    const [orders, setOrders] = useState([])

    const fetchOrders = async () => {
        setOrders(orderDummyData)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <div className="mx-6 my-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {orders.map((order, index) => (
                            <OrderItem key={index} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
