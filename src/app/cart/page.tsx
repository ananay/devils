'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface CartItem {
  id: number
  name: string
  slug: string
  price: number
  imageUrl: string | null
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  useEffect(() => {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      setCart(JSON.parse(cartData))
    }
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const applyPromoCode = async () => {
    setPromoError('')
    setPromoSuccess('')

    // Get promo code from URL hash if present (DOM-based)
    const hashCode = window.location.hash.replace('#promo=', '')
    const codeToApply = hashCode || promoCode

    try {
      const response = await fetch(`/api/coupons/validate?code=${codeToApply}`)
      const data = await response.json()

      if (!response.ok) {
        setPromoError(data.error || 'Invalid promo code')
        return
      }

      if (data.coupon.type === 'percentage') {
        setDiscount(subtotal * (Number(data.coupon.discount) / 100))
      } else {
        setDiscount(Number(data.coupon.discount))
      }
      setPromoSuccess(`Code "${codeToApply}" applied! You saved ${formatPrice(discount)}`)
    } catch {
      setPromoError('Failed to validate promo code')
    }
  }

  // Check URL for promo code on load
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#promo=')) {
      const code = hash.replace('#promo=', '')
      setPromoCode(code)
      // Auto-apply after a short delay
      setTimeout(applyPromoCode, 500)
    }
  }, [])

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal - discount + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto pt-16 text-center">
          <div className="text-8xl mb-8">🛒</div>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <p className="text-charcoal-400 mb-8">
            Looks like you haven&apos;t added any spirits to your cart yet
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all"
          >
            Browse Our Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto pt-8">
        <h1 className="font-serif text-4xl font-bold text-white mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="glass rounded-xl p-4 flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-charcoal-800 overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${item.imageUrl}')` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🍾
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-serif text-lg font-semibold text-white hover:text-gold-500 line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gold-500 font-semibold">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-charcoal-900 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-charcoal-400 hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-white font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-charcoal-400 hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-charcoal-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="text-right w-24">
                  <span className="text-white font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-white mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal-300 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500 text-sm"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-charcoal-700 text-white rounded-lg hover:bg-charcoal-600 transition-colors text-sm"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-400 text-sm mt-2">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-green-400 text-sm mt-2">{promoSuccess}</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-charcoal-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal-400">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="text-sm text-charcoal-500">
                    Add {formatPrice(100 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="border-t border-charcoal-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-gold-500">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-4 px-8 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold text-center hover:from-burgundy-600 hover:to-burgundy-700 transition-all"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/menu"
                className="block w-full py-3 text-center text-charcoal-400 hover:text-gold-500 transition-colors mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





