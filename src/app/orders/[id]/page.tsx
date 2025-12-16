'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/utils'

interface Order {
  id: number
  total: number
  status: string
  trackingCode: string
  shippingName: string
  shippingAddress: string
  notes: string | null
  createdAt: string
  items: Array<{
    id: number
    quantity: number
    price: number
    product: {
      id: number
      name: string
      slug: string
      imageUrl: string | null
    }
  }>
}

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default function OrderPage({ params }: OrderPageProps) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${resolvedParams.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order')
        }

        setOrder(data.order)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-charcoal-400">Loading order...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto pt-16 text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-charcoal-400 mb-8">{error || 'This order does not exist'}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        {isSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-6 py-4 rounded-xl mb-8 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-2">Order Placed Successfully!</h2>
            <p>Thank you for your order. You will receive a confirmation email shortly.</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">
              Order #{order.trackingCode}
            </h1>
            <p className="text-charcoal-400">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
            order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
            order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
            'bg-gold-500/20 text-gold-400'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-6">
              <h2 className="font-serif text-xl font-semibold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-charcoal-800 last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-lg bg-charcoal-800 overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${item.product.imageUrl}')` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍾
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-semibold text-white hover:text-gold-500"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-charcoal-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-white font-semibold">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 mb-6">
              <h2 className="font-serif text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Subtotal</span>
                  <span className="text-white">{formatPrice(Number(order.total))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Shipping</span>
                  <span className="text-white">Free</span>
                </div>
                <div className="border-t border-charcoal-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-gold-500">{formatPrice(Number(order.total))}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h2 className="font-serif text-xl font-semibold text-white mb-4">Shipping Address</h2>
              <p className="text-charcoal-300">{order.shippingName}</p>
              <p className="text-charcoal-400">{order.shippingAddress}</p>
              {order.notes && (
                <div className="mt-4 pt-4 border-t border-charcoal-700">
                  <p className="text-charcoal-500 text-sm">Notes:</p>
                  <p className="text-charcoal-300">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-charcoal-800 text-white rounded-lg hover:bg-charcoal-700 transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/menu"
            className="px-6 py-3 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg hover:from-burgundy-600 hover:to-burgundy-700 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}





