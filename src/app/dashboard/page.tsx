'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/utils'

interface Order {
  id: number
  total: number
  status: string
  trackingCode: string
  createdAt: string
  items: Array<{
    quantity: number
    product: {
      name: string
    }
  }>
}

interface User {
  id: number
  name: string
  email: string
  role: string
  bio: string | null
  avatarUrl: string | null
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const userData = localStorage.getItem('user')
      if (!userData) {
        router.push('/login?redirect=/dashboard')
        return
      }

      try {
        // Fetch user details
        const userResponse = await fetch('/api/auth/me')
        const userResult = await userResponse.json()
        
        if (userResponse.ok) {
          setUser(userResult.user)
        }

        // Fetch orders
        const ordersResponse = await fetch('/api/orders')
        const ordersResult = await ordersResponse.json()
        
        if (ordersResponse.ok) {
          setOrders(ordersResult.orders)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-charcoal-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-charcoal-400">Manage your orders and account settings</p>
          </div>
          <Link
            href="/profile"
            className="px-6 py-3 border border-charcoal-700 text-charcoal-300 rounded-lg hover:border-gold-500 hover:text-gold-500 transition-colors"
          >
            Edit Profile
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-xl p-6">
            <h3 className="text-charcoal-400 text-sm mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-charcoal-400 text-sm mb-1">Pending</h3>
            <p className="text-3xl font-bold text-gold-500">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-charcoal-400 text-sm mb-1">Shipped</h3>
            <p className="text-3xl font-bold text-purple-400">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-charcoal-400 text-sm mb-1">Total Spent</h3>
            <p className="text-3xl font-bold text-green-400">
              {formatPrice(orders.reduce((acc, o) => acc + Number(o.total), 0))}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-white">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-gold-500 hover:text-gold-400">
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal-400 mb-4">You haven&apos;t placed any orders yet</p>
              <Link
                href="/menu"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-charcoal-700">
                    <th className="pb-4 text-charcoal-400 font-medium">Order</th>
                    <th className="pb-4 text-charcoal-400 font-medium">Date</th>
                    <th className="pb-4 text-charcoal-400 font-medium">Items</th>
                    <th className="pb-4 text-charcoal-400 font-medium">Total</th>
                    <th className="pb-4 text-charcoal-400 font-medium">Status</th>
                    <th className="pb-4 text-charcoal-400 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-charcoal-800">
                      <td className="py-4 text-white font-medium">{order.trackingCode}</td>
                      <td className="py-4 text-charcoal-300">{formatDate(order.createdAt)}</td>
                      <td className="py-4 text-charcoal-300">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </td>
                      <td className="py-4 text-white">{formatPrice(Number(order.total))}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gold-500/20 text-gold-400'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-gold-500 hover:text-gold-400"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/profile" className="glass rounded-xl p-6 hover:border-gold-500/50 transition-colors group">
            <h3 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-gold-500">
              Profile Settings
            </h3>
            <p className="text-charcoal-400">Update your personal information</p>
          </Link>
          <Link href="/dashboard/addresses" className="glass rounded-xl p-6 hover:border-gold-500/50 transition-colors group">
            <h3 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-gold-500">
              Saved Addresses
            </h3>
            <p className="text-charcoal-400">Manage your delivery addresses</p>
          </Link>
          <Link href="/menu" className="glass rounded-xl p-6 hover:border-gold-500/50 transition-colors group">
            <h3 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-gold-500">
              Browse Menu
            </h3>
            <p className="text-charcoal-400">Discover new spirits</p>
          </Link>
        </div>
      </div>
    </div>
  )
}





