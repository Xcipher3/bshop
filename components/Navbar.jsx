'use client'
import { Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/components/AuthContext";
import { logout } from "@/lib/services/auth";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [search, setSearch] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const cartCount = useSelector(state => state.cart.total)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
      setIsSearchOpen(false)
      setSearch('')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <Link href="/" className="relative text-4xl font-semibold text-slate-700">
            <span className="text-green-600">Bij</span>ema<span className="text-green-600 text-5xl leading-0">.</span>
            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
              plus
            </p>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/shop">Products</Link>
            <Link href="/">Contact</Link>
          
            {/* Desktop Search - visible on xl and larger screens */}
            <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
              <Search size={18} className="text-slate-600" />
              <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
            </form>

            {/* Mobile Search Button - visible on smaller screens */}
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="xl:hidden flex items-center gap-2 text-slate-600"
            >
              <Search size={18} />
              Search
            </button>

            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
              <ShoppingCart size={18} />
              Cart
              <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <User size={18} />
                  {user.name}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition text-slate-700 rounded-full text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Search and User Button */}
          <div className="sm:hidden flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="flex items-center gap-2 text-slate-600"
            >
              <Search size={18} />
            </button>
            
            {user ? (
              <button 
                onClick={handleLogout}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 transition text-slate-700 rounded-full text-sm"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Modal for Mobile and Tablet */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-slate-700">Search Products</h3>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearch} className="p-4">
              <div className="flex items-center w-full text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                <Search size={18} className="text-slate-600" />
                <input 
                  className="w-full bg-transparent outline-none placeholder-slate-600" 
                  type="text" 
                  placeholder="Search products" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  autoFocus
                  required 
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-500 text-white py-2 rounded-full hover:bg-indigo-600 transition"
                >
                  Search
                </button>
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="flex-1 bg-gray-200 text-slate-700 py-2 rounded-full hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <hr className="border-gray-300" />
    </nav>
  )
}

export default Navbar