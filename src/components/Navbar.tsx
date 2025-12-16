'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Check for user in localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Check cart
    const cart = localStorage.getItem('cart')
    if (cart) {
      const cartItems = JSON.parse(cart)
      setCartCount(cartItems.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0))
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
      
      const cart = localStorage.getItem('cart')
      if (cart) {
        const cartItems = JSON.parse(cart)
        setCartCount(cartItems.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0))
      } else {
        setCartCount(0)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleStorageChange)
    window.addEventListener('userUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
      window.removeEventListener('userUpdated', handleStorageChange)
    }
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-700 to-burgundy-900 flex items-center justify-center">
              <span className="text-gold-500 font-serif text-xl font-bold">D</span>
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight">
              <span className="text-white">Devil&apos;s</span>
              <span className="text-gold-500"> Advocate</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/menu" className="text-charcoal-300 hover:text-gold-500 transition-colors">
              Menu
            </Link>
            <Link href="/about" className="text-charcoal-300 hover:text-gold-500 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-charcoal-300 hover:text-gold-500 transition-colors">
              Contact
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-charcoal-300 hover:text-gold-500 transition-colors">
                  Dashboard
                </Link>
                <Link href="/cart" className="relative text-charcoal-300 hover:text-gold-500 transition-colors">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-burgundy-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-charcoal-400 text-sm">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-charcoal-300 hover:text-gold-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/cart" className="relative text-charcoal-300 hover:text-gold-500 transition-colors">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-burgundy-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 border border-gold-500 text-gold-500 rounded hover:bg-gold-500 hover:text-charcoal-950 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-charcoal-800">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/menu" className="text-charcoal-300 hover:text-gold-500 transition-colors">
                Menu
              </Link>
              <Link href="/about" className="text-charcoal-300 hover:text-gold-500 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-charcoal-300 hover:text-gold-500 transition-colors">
                Contact
              </Link>
              <Link href="/cart" className="text-charcoal-300 hover:text-gold-500 transition-colors">
                Cart ({cartCount})
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-charcoal-300 hover:text-gold-500 transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-charcoal-300 hover:text-gold-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-block px-5 py-2 border border-gold-500 text-gold-500 rounded hover:bg-gold-500 hover:text-charcoal-950 transition-all text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}





