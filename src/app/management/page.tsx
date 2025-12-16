'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'

interface Stats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  recentOrders: Array<{
    id: number
    trackingCode: string
    total: number
    status: string
    createdAt: string
    user: { name: string; email: string }
  }>
}

export default function ManagementDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/internal/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-charcoal-950">
        <div className="text-charcoal-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-charcoal-950">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">
              Management Dashboard
            </h1>
            <p className="text-charcoal-400">System administration and monitoring</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-xl p-6">
            <h3 className="text-charcoal-400 text-sm mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-charcoal-400 text-sm mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-gold-500">{stats?.totalOrders || 0}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-charcoal-400 text-sm mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-400">
              {formatPrice(stats?.totalRevenue || 0)}
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-charcoal-400 text-sm mb-1">Products</h3>
            <p className="text-3xl font-bold text-purple-400">{stats?.totalProducts || 0}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Link href="/management/users" className="glass rounded-xl p-6 hover:border-gold-500/50 transition-colors group">
            <h3 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-gold-500">
              User Management
            </h3>
            <p className="text-charcoal-400">View and manage user accounts</p>
          </Link>
          <Link href="/management/orders" className="glass rounded-xl p-6 hover:border-gold-500/50 transition-colors group">
            <h3 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-gold-500">
              Order Management
            </h3>
            <p className="text-charcoal-400">Process and track orders</p>
          </Link>
          <Link href="/management/products" className="glass rounded-xl p-6 hover:border-gold-500/50 transition-colors group">
            <h3 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-gold-500">
              Product Catalog
            </h3>
            <p className="text-charcoal-400">Manage inventory and pricing</p>
          </Link>
          <Link href="/management/system" className="glass rounded-xl p-6 hover:border-gold-500/50 transition-colors group">
            <h3 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-gold-500">
              System Tools
            </h3>
            <p className="text-charcoal-400">Server diagnostics and logs</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-serif text-2xl font-semibold text-white mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-charcoal-700">
                  <th className="pb-4 text-charcoal-400 font-medium">Order</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Customer</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Email</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Total</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Status</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order.id} className="border-b border-charcoal-800">
                    <td className="py-4">
                      <Link href={`/management/orders/${order.id}`} className="text-gold-500 hover:text-gold-400">
                        {order.trackingCode}
                      </Link>
                    </td>
                    <td className="py-4 text-white">{order.user.name}</td>
                    <td className="py-4 text-charcoal-400">{order.user.email}</td>
                    <td className="py-4 text-white">{formatPrice(Number(order.total))}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gold-500/20 text-gold-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-charcoal-400">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}




