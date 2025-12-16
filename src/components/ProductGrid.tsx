'use client'

import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string | number
  imageUrl: string | null
  abv: string | number | null
  origin: string | null
  category: {
    name: string
    slug: string
  }
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: { id: number }) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))

    // Show toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = `${product.name} added to cart`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="group glass rounded-xl overflow-hidden card-hover"
        >
          <div className="aspect-square relative overflow-hidden bg-charcoal-800">
            {product.imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${product.imageUrl}')` }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-charcoal-600 text-4xl">🍾</span>
              </div>
            )}
          </div>
          <div className="p-5">
            <span className="text-gold-500 text-xs font-medium uppercase tracking-wider">
              {product.category.name}
            </span>
            <h3 className="font-serif text-lg font-semibold text-white mt-1 mb-2 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-charcoal-400 text-sm line-clamp-2 mb-4 h-10">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">
                {formatPrice(Number(product.price))}
              </span>
              <button
                onClick={(e) => addToCart(product, e)}
                className="p-2 rounded-full bg-burgundy-700 text-white hover:bg-burgundy-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}




