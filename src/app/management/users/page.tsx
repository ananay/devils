'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface User {
  id: number
  email: string
  name: string
  role: string
  createdAt: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/internal/users')
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      setUsers(users.filter(u => u.id !== id))
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <Link href="/management" className="text-charcoal-400 hover:text-gold-500 text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="font-serif text-4xl font-bold text-white">User Management</h1>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
          />
        </div>

        {/* Users Table */}
        <div className="glass rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-charcoal-700">
                  <th className="pb-4 text-charcoal-400 font-medium">ID</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Name</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Email</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Role</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Joined</th>
                  <th className="pb-4 text-charcoal-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-charcoal-800">
                    <td className="py-4 text-charcoal-400">{user.id}</td>
                    <td className="py-4 text-white">{user.name}</td>
                    <td className="py-4 text-charcoal-300">{user.email}</td>
                    <td className="py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-charcoal-800 border border-charcoal-700 text-white rounded px-2 py-1 text-sm"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 text-charcoal-400">{formatDate(user.createdAt)}</td>
                    <td className="py-4 space-x-2">
                      <Link
                        href={`/api/users/${user.id}`}
                        className="text-gold-500 hover:text-gold-400 text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </td>
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





