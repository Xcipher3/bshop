'use client'

import { usePathname } from "next/navigation"
import { HomeIcon, TicketPercentIcon, ShoppingBasketIcon, StoreIcon, BarChartIcon, UsersIcon, PackageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"

const AdminSidebar = () => {

  const pathname = usePathname()

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: ShoppingBasketIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Orders', href: '/admin/orders', icon: PackageIcon },
    { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChartIcon },
    { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon },
  ]

  return (
    <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
      <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
        <Image className="w-14 h-14 rounded-full" src={assets.gs_logo} alt="" width={80} height={80} />
        <p className="text-slate-700">Hi, GreatStack</p>
      </div>

      <div className="max-sm:mt-6">
        {
          sidebarLinks.map((link, index) => (
            <Link key={index} href={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
              <link.icon size={18} className="sm:ml-5" />
              <p className="max-sm:hidden">{link.name}</p>
              {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default AdminSidebar