'use client'

import { useState } from 'react'

interface Product {
  id: number
  name: string
  slug: string
  price: string | number
  imageUrl: string | null
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: { id: number }) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        quantity,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center bg-charcoal-900 rounded-lg">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-3 text-charcoal-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="px-4 py-3 text-white font-semibold min-w-[3rem] text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-3 text-charcoal-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <button
        onClick={addToCart}
        className={`flex-1 py-4 px-8 rounded-lg font-semibold text-lg transition-all ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white hover:from-burgundy-600 hover:to-burgundy-700'
        }`}
      >
        {added ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added to Cart
          </span>
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  )
}





