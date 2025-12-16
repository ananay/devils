'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      
      // Dispatch event for navbar update
      window.dispatchEvent(new Event('userUpdated'))

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Join Us</h1>
          <p className="text-charcoal-400">Create your account to start ordering</p>
        </div>

        <div className="glass rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="age"
                className="mt-1 rounded border-charcoal-600 bg-charcoal-900 text-gold-500 focus:ring-gold-500"
                required
              />
              <label htmlFor="age" className="ml-2 text-sm text-charcoal-400">
                I confirm that I am 21 years of age or older and agree to the{' '}
                <Link href="/terms" className="text-gold-500 hover:text-gold-400">
                  Terms of Service
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 focus:ring-offset-charcoal-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-charcoal-400">
              Already have an account?{' '}
              <Link href="/login" className="text-gold-500 hover:text-gold-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}





