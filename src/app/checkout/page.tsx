'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [shippingName, setShippingName] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [notes, setNotes] = useState('')
  const [couponCode, setCouponCode] = useState('')

  useEffect(() => {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      setCart(JSON.parse(cartData))
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      setShippingName(parsed.name || '')
    }
  }, [])

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }

    setLoading(true)
    setError('')

    try {
      const fullAddress = `${shippingAddress}, ${city}, ${state} ${zipCode}`
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingName,
          shippingAddress: fullAddress,
          notes,
          couponCode,
          total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      // Clear cart
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))

      // Redirect to order confirmation
      router.push(`/orders/${data.order.id}?success=true`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto pt-16 text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">No Items to Checkout</h1>
          <p className="text-charcoal-400 mb-8">Add some spirits to your cart first</p>
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
        <h1 className="font-serif text-4xl font-bold text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {!user && (
                <div className="glass rounded-xl p-6">
                  <p className="text-charcoal-300 mb-4">
                    Please sign in to complete your order
                  </p>
                  <Link
                    href="/login?redirect=/checkout"
                    className="inline-flex items-center px-6 py-3 bg-gold-500 text-charcoal-950 rounded-lg font-semibold hover:bg-gold-400 transition-all"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Shipping Information */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-serif text-xl font-semibold text-white mb-6">
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-serif text-xl font-semibold text-white mb-6">
                  Additional Options
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Any special instructions for delivery..."
                      className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Age Verification */}
              <div className="glass rounded-xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded border-charcoal-600 bg-charcoal-900 text-gold-500 focus:ring-gold-500"
                  />
                  <span className="text-charcoal-300 text-sm">
                    I confirm that I am 21 years of age or older and that a valid ID will be
                    presented upon delivery. I understand that the delivery person may refuse
                    to complete the delivery if valid ID cannot be provided.
                  </span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-6 sticky top-24">
                <h2 className="font-serif text-xl font-semibold text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-charcoal-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 border-t border-charcoal-700 pt-4">
                  <div className="flex justify-between text-charcoal-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-400">
                    <span>Shipping</span>
                    <span className="text-white">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="border-t border-charcoal-700 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-gold-500">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !user}
                  className="block w-full py-4 px-8 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold text-center hover:from-burgundy-600 hover:to-burgundy-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>

                <p className="text-charcoal-500 text-xs text-center mt-4">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}





