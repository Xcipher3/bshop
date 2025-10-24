'use client'
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"
import { ArrowLeft } from "lucide-react"

export default function AdminStoreDetails() {
    const { id } = useParams()
    const router = useRouter()
    const [store, setStore] = useState(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])

    const fetchStore = async () => {
        try {
            const response = await fetch(`/api/stores/${id}`)
            if (response.ok) {
                const data = await response.json()
                setStore(data)
                setProducts(data.Product || [])
                setOrders(data.Order || [])
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Failed to fetch store')
                router.push('/admin/stores')
            }
        } catch (error) {
            console.error('Error fetching store:', error)
            toast.error('Failed to fetch store')
            router.push('/admin/stores')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (status) => {
        try {
            const response = await fetch(`/api/stores/${id}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    status: status, 
                    isActive: status === 'approved' 
                }),
            })

            if (response.ok) {
                toast.success(`Store ${status} successfully`)
                fetchStore() // Refresh the store data
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || `Failed to ${status} store`)
            }
        } catch (error) {
            console.error(`Error ${status} store:`, error)
            toast.error(`Failed to ${status} store`)
        }
    }

    useEffect(() => {
        if (id) {
            fetchStore()
        }
    }, [id])

    if (loading) return <Loading />

    if (!store) {
        return (
            <div className="flex items-center justify-center h-80">
                <h1 className="text-3xl text-slate-400 font-medium">Store not found</h1>
            </div>
        )
    }

    return (
        <div className="text-slate-500 mb-28">
            <button 
                onClick={() => router.push('/admin/stores')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
            >
                <ArrowLeft size={16} />
                Back to Stores
            </button>

            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl">Store <span className="text-slate-800 font-medium">Details</span></h1>
                <div className="flex gap-3">
                    {store.status === 'pending' && (
                        <>
                            <button 
                                onClick={() => toast.promise(handleApprove('approved'), { loading: "approving" })}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                                Approve
                            </button>
                            <button 
                                onClick={() => toast.promise(handleApprove('rejected'), { loading: 'rejecting' })}
                                className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                                Reject
                            </button>
                        </>
                    )}
                    {store.status === 'approved' && (
                        <button 
                            onClick={() => toast.promise(handleApprove('rejected'), { loading: 'rejecting' })}
                            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                            Reject
                        </button>
                    )}
                    {store.status === 'rejected' && (
                        <button 
                            onClick={() => toast.promise(handleApprove('approved'), { loading: "approving" })}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                            Approve
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-6 max-w-4xl mb-8">
                <StoreInfo store={store} />
            </div>

            {/* Store Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Store Metrics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Total Products</span>
                            <span className="font-medium">{products.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Orders</span>
                            <span className="font-medium">{orders.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                                store.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                store.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {store.status}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Active</span>
                            <span className={`font-medium ${store.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                {store.isActive ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Recent Orders</h3>
                    {orders.length > 0 ? (
                        <div className="space-y-3">
                            {orders.slice(0, 3).map((order) => (
                                <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-medium">KSH {order.total}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">No orders yet</p>
                    )}
                </div>

                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Top Products</h3>
                    {products.length > 0 ? (
                        <div className="space-y-3">
                            {products.slice(0, 3).map((product) => (
                                <div key={product.id} className="flex items-center gap-3">
                                    {product.images && product.images.length > 0 && (
                                        <img 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-sm text-slate-500">KSH {product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">No products yet</p>
                    )}
                </div>
            </div>

            {/* Products List */}
            <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Store Products ({products.length})</h3>
                {products.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {product.images && product.images.length > 0 && (
                                                    <img 
                                                        src={product.images[0]} 
                                                        alt={product.name} 
                                                        className="h-10 w-10 object-cover rounded"
                                                    />
                                                )}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            KSH {product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {product.category}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-500">No products found for this store</p>
                )}
            </div>

            {/* Orders List */}
            <div className="bg-white border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Store Orders ({orders.length})</h3>
                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                            #{order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {order.user?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            KSH {order.total}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                'bg-purple-100 text-purple-800'
                                            }`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-500">No orders found for this store</p>
                )}
            </div>
        </div>
    )
}