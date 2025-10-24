'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { couponDummyData } from '@/assets/assets'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    forNewUser: false,
    forMember: false,
    isPublic: false,
    expiresAt: ''
  })

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      // In a real app, this would fetch from an API
      setCoupons(couponDummyData)
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error('Failed to fetch coupons')
    } finally {
      setLoading(false)
    }
  }

  // Create a new coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    try {
      // In a real app, this would make an API call
      const newCoupon = {
        ...formData,
        discount: parseFloat(formData.discount),
        expiresAt: new Date(formData.expiresAt).toISOString(),
        createdAt: new Date().toISOString()
      }
      
      setCoupons([...coupons, newCoupon])
      toast.success('Coupon created successfully')
      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating coupon:', error)
      toast.error('Failed to create coupon')
    }
  }

  // Update an existing coupon
  const handleUpdateCoupon = async (e) => {
    e.preventDefault()
    try {
      // In a real app, this would make an API call
      const updatedCoupons = coupons.map(coupon => 
        coupon.code === editingCoupon.code 
          ? { 
              ...coupon, 
              ...formData,
              discount: parseFloat(formData.discount),
              expiresAt: new Date(formData.expiresAt).toISOString()
            } 
          : coupon
      )
      
      setCoupons(updatedCoupons)
      toast.success('Coupon updated successfully')
      resetForm()
      setEditingCoupon(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error updating coupon:', error)
      toast.error('Failed to update coupon')
    }
  }

  // Delete a coupon
  const handleDeleteCoupon = async (couponCode) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        // In a real app, this would make an API call
        setCoupons(coupons.filter(coupon => coupon.code !== couponCode))
        toast.success('Coupon deleted successfully')
      } catch (error) {
        console.error('Error deleting coupon:', error)
        toast.error('Failed to delete coupon')
      }
    }
  }

  // Edit a coupon
  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount: coupon.discount.toString(),
      forNewUser: coupon.forNewUser,
      forMember: coupon.forMember,
      isPublic: coupon.isPublic,
      expiresAt: coupon.expiresAt.split('T')[0] // Format date for input
    })
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount: '',
      forNewUser: false,
      forMember: false,
      isPublic: false,
      expiresAt: ''
    })
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCoupon) {
      handleUpdateCoupon(e)
    } else {
      handleCreateCoupon(e)
    }
  }

  useEffect(() => {
    fetchCoupons()
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
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <button
          onClick={() => {
            resetForm()
            setEditingCoupon(null)
            setShowForm(true)
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  disabled={editingCoupon}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discount">
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="1"
                  max="100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiresAt">
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="expiresAt"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="forNewUser"
                  checked={formData.forNewUser}
                  onChange={(e) => setFormData({ ...formData, forNewUser: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-bold" htmlFor="forNewUser">
                  For New Users Only
                </label>
              </div>
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="forMember"
                  checked={formData.forMember}
                  onChange={(e) => setFormData({ ...formData, forMember: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-bold" htmlFor="forMember">
                  For Members Only
                </label>
              </div>
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-bold" htmlFor="isPublic">
                  Public Coupon
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                  setEditingCoupon(null)
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restrictions
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.code}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{coupon.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{coupon.discount}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(coupon.expiresAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {coupon.forNewUser && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">New Users</span>}
                    {coupon.forMember && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-1">Members</span>}
                    {coupon.isPublic && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Public</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditCoupon(coupon)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.code)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No coupons found</p>
          </div>
        )}
      </div>
    </div>
  )
}