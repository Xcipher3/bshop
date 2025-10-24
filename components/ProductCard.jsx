'use client'
import { StarIcon, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'KSH'
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.cartItems)
  const [isAdding, setIsAdding] = useState(false)

  // calculate the average rating of the product
  let rating = 0
  if (product.rating && product.rating.length > 0) {
    rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    setIsAdding(true)
    dispatch(addToCart({ productId: product.id }))
    
    // Reset the adding state after animation
    setTimeout(() => setIsAdding(false), 300)
  }

  const quantityInCart = cartItems[product.id] || 0

  return (
    <Link href={`/product/${product.id}`} className='group max-xl:mx-auto relative'>
      <div className='bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center relative'>
        {product.images && product.images.length > 0 && (
          <Image 
            width={500} 
            height={500} 
            className='max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300' 
            src={product.images[0]} 
            alt={product.name} 
          />
        )}
        
        {/* Add to Cart Button - appears on hover */}
        <button 
          onClick={handleAddToCart}
          className={`absolute bottom-2 right-2 bg-slate-800 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform group-hover:opacity-100 group-hover:scale-100 opacity-0 scale-90 ${isAdding ? 'animate-pulse' : ''}`}
          aria-label="Add to cart"
        >
          <ShoppingCartIcon size={16} />
        </button>
        
        {/* Quantity Badge - shows quantity when item is in cart */}
        {quantityInCart > 0 && (
          <div className='absolute top-2 right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
            {quantityInCart}
          </div>
        )}
      </div>
      <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
        <div>
          <p>{product.name}</p>
          <div className='flex'>
            {Array(5).fill('').map((_, index) => (
              <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
            ))}
          </div>
        </div>
        <p>{currency}{product.price}</p>
      </div>
    </Link>
  )
}

export default ProductCard