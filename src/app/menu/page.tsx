import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { ProductGrid } from '@/components/ProductGrid'
import { SearchBar } from '@/components/SearchBar'

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

async function getProducts(categorySlug?: string, search?: string) {
  const where: Record<string, unknown> = {}
  
  if (categorySlug) {
    where.category = { slug: categorySlug }
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { name: 'asc' },
  })
}

interface MenuPageProps {
  searchParams: Promise<{ category?: string; search?: string }>
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(params.category, params.search),
  ])

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="font-serif text-5xl font-bold text-white mb-4">Our Menu</h1>
          <p className="text-charcoal-400 max-w-2xl mx-auto">
            Browse our extensive collection of premium spirits, fine wines, and craft cocktails
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link
            href="/menu"
            className={`px-5 py-2 rounded-full transition-all ${
              !params.category
                ? 'bg-gold-500 text-charcoal-950'
                : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.slug}`}
              className={`px-5 py-2 rounded-full transition-all ${
                params.category === category.slug
                  ? 'bg-gold-500 text-charcoal-950'
                  : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Results info */}
        {params.search && (
          <div className="mb-6 text-charcoal-400">
            Showing results for: <span className="text-gold-500">&quot;{params.search}&quot;</span>
            <span className="ml-2">({products.length} products found)</span>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid products={products} />

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal-400 text-lg mb-4">No products found</p>
            <Link href="/menu" className="text-gold-500 hover:text-gold-400">
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}




