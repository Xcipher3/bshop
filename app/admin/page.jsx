'use client'
import { dummyAdminDashboardData, productDummyData, orderDummyData, storesDummyData, dummyUserData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, UsersIcon, PackageIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminDashboard() {

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'KSH'

  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    revenue: 0,
    orders: 0,
    stores: 0,
    users: 0,
    allOrders: [],
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])

  const dashboardCardsData = [
    { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
    { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
    { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
    { title: 'Total Users', value: dashboardData.users, icon: UsersIcon },
    { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
  ]

  const quickLinks = [
    { title: 'Manage Products', href: '/admin/products', icon: ShoppingBasketIcon },
    { title: 'Manage Users', href: '/admin/users', icon: UsersIcon },
    { title: 'Manage Orders', href: '/admin/orders', icon: PackageIcon },
    { title: 'Manage Stores', href: '/admin/stores', icon: StoreIcon },
    { title: 'View Analytics', href: '/admin/analytics', icon: CircleDollarSignIcon },
    { title: 'Manage Coupons', href: '/admin/coupons', icon: TagsIcon },
  ]

  const fetchDashboardData = async () => {
    // In a real app, this would fetch from APIs
    const data = {
      ...dummyAdminDashboardData,
      products: productDummyData.length,
      users: 1, // Using dummy user data
    }
    
    setDashboardData(data)
    
    // Set recent orders (last 5 orders)
    const sortedOrders = [...orderDummyData].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
    setRecentOrders(sortedOrders.slice(0, 5))
    
    // Set top products (in a real app, this would be based on sales)
    setTopProducts(productDummyData.slice(0, 5))
    
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="text-slate-500">
      <h1 className="text-2xl">Admin <span className="text-slate-800 font-medium">Dashboard</span></h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 my-10 mt-4">
        {
          dashboardCardsData.map((card, index) => (
            <div key={index} className="flex items-center gap-4 border border-slate-200 p-4 rounded-lg">
              <card.icon size={40} className="w-10 h-10 p-2 text-slate-400 bg-slate-100 rounded-full" />
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-500">{card.title}</p>
                <b className="text-xl font-medium text-slate-700">{card.value}</b>
              </div>
            </div>
          ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-slate-800">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-blue-500 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500">
                      {currency}{order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <link.icon size={24} className="text-slate-600 mb-2" />
                <span className="text-sm text-slate-700 text-center">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Sales Overview</h3>
        <OrdersAreaChart allOrders={dashboardData.allOrders} />
      </div>

      {/* Top Products */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-800">Top Products</h3>
          <Link href="/admin/products" className="text-sm text-blue-500 hover:text-blue-700">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {topProducts.map((product) => (
            <div key={product.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex flex-col items-center text-center">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-16 h-16 object-contain mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center mb-2">
                    <ShoppingBasketIcon className="text-slate-500" size={24} />
                  </div>
                )}
                <h4 className="text-sm font-medium text-slate-900 truncate w-full">{product.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{currency}{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}