'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'

interface Order {
  id: number
  tracking_code: string
  status: string
  total: number
  created_at: string
  shipping_name: string
  shipping_address: string
}

function TrackOrderForm() {
  const searchParams = useSearchParams()
  const initialCode = searchParams.get('code') || ''
  
  const [trackingCode, setTrackingCode] = useState(initialCode)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const response = await fetch(`/api/orders/lookup?code=${encodeURIComponent(trackingCode)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Order not found')
      }

      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialCode) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent)
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="tracking" className="block text-sm font-medium text-charcoal-300 mb-2">
              Tracking Code
            </label>
            <input
              type="text"
              id="tracking"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="e.g., DA-ABC123-XYZ"
              className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {order && (
          <div className="mt-8 pt-8 border-t border-charcoal-700">
            <h2 className="font-serif text-2xl font-semibold text-white mb-6">Order Found</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-charcoal-400">Tracking Code</span>
                <span className="text-white font-medium">{order.tracking_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                  order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gold-500/20 text-gold-400'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Total</span>
                <span className="text-gold-500 font-semibold">{formatPrice(Number(order.total))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Order Date</span>
                <span className="text-white">{formatDate(order.created_at)}</span>
              </div>
              <div className="pt-4 border-t border-charcoal-800">
                <span className="text-charcoal-400 text-sm">Shipping To:</span>
                <p className="text-white mt-1">{order.shipping_name}</p>
                <p className="text-charcoal-300">{order.shipping_address}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-white mb-4">Track Your Order</h1>
          <p className="text-charcoal-400">
            Enter your tracking code to check the status of your order
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-charcoal-400">Loading...</div>}>
          <TrackOrderForm />
        </Suspense>

        <div className="mt-12 text-center">
          <p className="text-charcoal-400 mb-4">
            Can&apos;t find your tracking code? Check your email confirmation or
          </p>
          <Link href="/contact" className="text-gold-500 hover:text-gold-400">
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  )
}




