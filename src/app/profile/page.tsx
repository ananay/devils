'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
  bio: string | null
  avatarUrl: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const userData = localStorage.getItem('user')
      if (!userData) {
        router.push('/login?redirect=/profile')
        return
      }

      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (response.ok) {
          setUser(data.user)
          setName(data.user.name)
          setEmail(data.user.email)
          setBio(data.user.bio || '')
          setAvatarUrl(data.user.avatarUrl || '')
        }
      } catch {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, bio, avatarUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem('user', JSON.stringify({ ...currentUser, name, email }))
      window.dispatchEvent(new Event('userUpdated'))

      setMessage('Profile updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setMessage('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'avatar')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload avatar')
      }

      setAvatarUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const handleImportAvatar = async () => {
    if (!avatarUrl) return

    try {
      const response = await fetch('/api/users/import-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: avatarUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import avatar')
      }

      setAvatarUrl(data.url)
      setMessage('Avatar imported successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-charcoal-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="font-serif text-4xl font-bold text-white mb-8">Profile Settings</h1>

        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Form */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-serif text-xl font-semibold text-white mb-6">Personal Information</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-charcoal-300 mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-charcoal-800 overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="inline-block px-4 py-2 bg-charcoal-800 text-charcoal-300 rounded-lg cursor-pointer hover:bg-charcoal-700 transition-colors"
                    >
                      Upload Image
                    </label>
                    <p className="text-charcoal-500 text-xs mt-2">Or import from URL:</p>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="flex-1 px-3 py-2 bg-charcoal-900 border border-charcoal-700 rounded-lg text-white placeholder-charcoal-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleImportAvatar}
                        className="px-4 py-2 bg-charcoal-700 text-white rounded-lg hover:bg-charcoal-600 transition-colors text-sm"
                      >
                        Import
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-300 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Password Change */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-serif text-xl font-semibold text-white mb-6">Change Password</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-charcoal-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all disabled:opacity-50"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}





