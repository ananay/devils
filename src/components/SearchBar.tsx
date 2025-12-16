'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.push(`/menu?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for spirits, wines, cocktails..."
          className="w-full px-6 py-4 pl-12 bg-charcoal-900 border border-charcoal-700 rounded-full focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-burgundy-700 text-white rounded-full hover:bg-burgundy-600 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}





