'use client'

import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Dropdown } from './Dropdown'
import { ChevronRight, Droplets, LogOut } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  return (
    <nav className='
    border-b flex
    flex-col sm:flex-row
    items-start sm:items-center
    sm:pr-10
    '>
      <div
        className='py-3 px-8 flex flex-1 items-center p'
      >
        <Link href="/" className='mr-5 flex items-center'>
          <Droplets className="opacity-85" size={19} />
          <p className={`ml-2 mr-4 text-lg font-semibold`}>priceHub</p>
        </Link>
        <Link href="/" className={`mr-5 text-sm ${pathname !== '/' && 'opacity-50'}`}>
          <p>Home</p>
        </Link>
        <Link href="/search" className={`mr-5 text-sm ${pathname !== '/products' && 'opacity-60'}`}>
          <p>Products</p>
        </Link>
      </div>
      <div className='
        flex
        sm:items-center
        pl-8 pb-3 sm:p-0
      '>
        <Dropdown />
      </div>
    </nav>
  )
}