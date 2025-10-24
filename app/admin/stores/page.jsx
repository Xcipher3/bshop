'use client'
import { useEffect, useState } from "react"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"

export default function AdminStores() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, pending, approved, rejected

    const fetchStores = async () => {
        try {
            let url = '/api/stores'
            if (filter !== 'all') {
                url += `?status=${filter}`
            }
            
            const response = await fetch(url)
            if (response.ok) {
                const data = await response.json()
                setStores(data)
            } else {
                toast.error('Failed to fetch stores')
            }
        } catch (error) {
            console.error('Error fetching stores:', error)
            toast.error('Failed to fetch stores')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async ({ storeId, status }) => {
        try {
            const response = await fetch(`/api/stores/${storeId}/approve`, {
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
                fetchStores() // Refresh the list
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
        fetchStores()
    }, [filter])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500 mb-28">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">Manage <span className="text-slate-800 font-medium">Stores</span></h1>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
                    >
                        Pending
                    </button>
                    <button 
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
                    >
                        Approved
                    </button>
                    <button 
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-slate-700 text-white' : 'bg-slate-200'}`}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 flex-wrap">
                                {store.status === 'pending' && (
                                    <>
                                        <button 
                                            onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "approving" })}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'rejecting' })}
                                            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {store.status === 'approved' && (
                                    <button 
                                        onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'rejecting' })}
                                        className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                                        Reject
                                    </button>
                                )}
                                {store.status === 'rejected' && (
                                    <button 
                                        onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "approving" })}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                                        Approve
                                    </button>
                                )}
                                <button 
                                    onClick={() => {
                                        // View store details
                                        window.location.href = `/admin/stores/${store.id}`
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">
                        {filter === 'all' ? 'No stores found' : `No ${filter} stores found`}
                    </h1>
                </div>
            )}
        </div>
    )
}