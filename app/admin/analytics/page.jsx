'use client'
import { storesDummyData, productDummyData, orderDummyData, dummyUserData } from "@/assets/assets"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import { useEffect, useState } from "react"

export default function AdminAnalytics() {
    const [stores, setStores] = useState([])
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const [storePerformance, setStorePerformance] = useState([])
    const [storeDistribution, setStoreDistribution] = useState([])
    const [salesData, setSalesData] = useState([])
    const [categoryData, setCategoryData] = useState([])

    useEffect(() => {
        setStores(storesDummyData)
        setProducts(productDummyData)
        setOrders(orderDummyData)
        setUsers([dummyUserData]) // In a real app, this would come from an API
        
        // Generate store performance data
        const performanceData = storesDummyData.map(store => ({
            name: store.name,
            orders: store.Order ? store.Order.length : 0,
            revenue: store.Order ? store.Order.reduce((sum, order) => sum + order.total, 0) : 0,
            products: store.Product ? store.Product.length : 0
        }))
        setStorePerformance(performanceData)
        
        // Generate store distribution data
        const statusCounts = storesDummyData.reduce((acc, store) => {
            acc[store.status] = (acc[store.status] || 0) + 1
            return acc
        }, {})
        
        const distributionData = Object.entries(statusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count
        }))
        setStoreDistribution(distributionData)
        
        // Generate sales data by date
        const salesByDate = {}
        orderDummyData.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString()
            if (!salesByDate[date]) {
                salesByDate[date] = 0
            }
            salesByDate[date] += order.total
        })
        
        const salesDataArray = Object.entries(salesByDate).map(([date, total]) => ({
            date,
            sales: total
        })).sort((a, b) => new Date(a.date) - new Date(b.date))
        
        setSalesData(salesDataArray)
        
        // Generate category data
        const categoryCounts = {}
        productDummyData.forEach(product => {
            if (!categoryCounts[product.category]) {
                categoryCounts[product.category] = 0
            }
            categoryCounts[product.category]++
        })
        
        const categoryDataArray = Object.entries(categoryCounts).map(([category, count]) => ({
            name: category,
            products: count
        }))
        
        setCategoryData(categoryDataArray)
    }, [])

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl mb-6">Business <span className="text-slate-800 font-medium">Analytics</span></h1>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Total Revenue</h3>
                    <p className="text-3xl font-bold text-slate-700">KSH {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</p>
                </div>
                
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Total Orders</h3>
                    <p className="text-3xl font-bold text-slate-700">{orders.length}</p>
                </div>
                
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Total Products</h3>
                    <p className="text-3xl font-bold text-slate-700">{products.length}</p>
                </div>
                
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Total Users</h3>
                    <p className="text-3xl font-bold text-slate-700">{users.length}</p>
                </div>
            </div>
            
            {/* Store Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Total Stores</h3>
                    <p className="text-3xl font-bold text-slate-700">{stores.length}</p>
                </div>
                
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Active Stores</h3>
                    <p className="text-3xl font-bold text-slate-700">
                        {stores.filter(store => store.isActive).length}
                    </p>
                </div>
                
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Pending Applications</h3>
                    <p className="text-3xl font-bold text-slate-700">
                        {stores.filter(store => store.status === 'pending').length}
                    </p>
                </div>
            </div>
            
            {/* Store Distribution */}
            <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Store Distribution by Status</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={storeDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {storeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, 'Stores']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Sales Trend */}
            <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Sales Trend</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={salesData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`KSH ${value.toLocaleString()}`, 'Sales']} />
                            <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Product Categories */}
            <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Products by Category</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={categoryData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="products" fill="#82ca9d" name="Products" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Store Performance */}
            <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Store Performance</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={storePerformance}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value, name) => {
                                if (name === 'revenue') return [`KSH ${value}`, 'Revenue']
                                return [value, name.charAt(0).toUpperCase() + name.slice(1)]
                            }} />
                            <Legend />
                            <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                            <Bar dataKey="products" fill="#ffc658" name="Products" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Top Performing Stores */}
            <div className="bg-white border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Top Performing Stores</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Store</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {storePerformance
                                .sort((a, b) => b.revenue - a.revenue)
                                .map((store, index) => {
                                    const storeData = stores.find(s => s.name === store.name)
                                    return (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900">{store.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {store.orders}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                KSH {store.revenue.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {store.products}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    storeData?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    storeData?.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {storeData?.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}