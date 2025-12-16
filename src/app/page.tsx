import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 6,
  })
}

async function getCategories() {
  return prisma.category.findMany({
    take: 4,
  })
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-950/90 to-charcoal-950 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1920')" }}
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Raise Your</span>
            <br />
            <span className="gold-shimmer">Spirits</span>
          </h1>
          <p className="text-xl md:text-2xl text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Experience the finest selection of premium spirits, aged whiskeys, and craft cocktails 
            delivered straight to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="px-8 py-4 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold text-lg hover:from-burgundy-600 hover:to-burgundy-700 transition-all shadow-lg shadow-burgundy-900/50"
            >
              Explore Our Collection
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border-2 border-gold-500 text-gold-500 rounded-lg font-semibold text-lg hover:bg-gold-500 hover:text-charcoal-950 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-charcoal-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Our Collection</h2>
            <p className="text-charcoal-400 max-w-2xl mx-auto">
              From aged whiskeys to premium vodkas, explore our carefully curated selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/menu?category=${category.slug}`}
                className="group relative h-64 rounded-xl overflow-hidden card-hover"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${category.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-charcoal-300 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Featured Spirits</h2>
            <p className="text-charcoal-400 max-w-2xl mx-auto">
              Hand-picked selections from our master sommelier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group glass rounded-xl overflow-hidden card-hover"
              >
                <div className="aspect-square relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${product.imageUrl}')` }}
                  />
                </div>
                <div className="p-6">
                  <span className="text-gold-500 text-sm font-medium">{product.category.name}</span>
                  <h3 className="font-serif text-xl font-semibold text-white mt-1 mb-2">{product.name}</h3>
                  <p className="text-charcoal-400 text-sm line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">{formatPrice(Number(product.price))}</span>
                    {product.abv && (
                      <span className="text-charcoal-500 text-sm">{Number(product.abv)}% ABV</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-4 border-2 border-gold-500 text-gold-500 rounded-lg font-semibold hover:bg-gold-500 hover:text-charcoal-950 transition-all"
            >
              View All Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-charcoal-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Why Devil&apos;s Advocate</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-burgundy-700 to-burgundy-900 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-2">Authenticity Guaranteed</h3>
              <p className="text-charcoal-400">Every bottle verified for authenticity direct from distilleries</p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-burgundy-700 to-burgundy-900 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-charcoal-400">Same-day delivery available in select areas</p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-burgundy-700 to-burgundy-900 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-2">Expert Curation</h3>
              <p className="text-charcoal-400">Selections handpicked by certified sommeliers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Join the Inner Circle</h2>
          <p className="text-charcoal-400 mb-8">
            Subscribe for exclusive offers, early access to rare bottles, and expert cocktail recipes
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 max-w-md px-6 py-4 bg-charcoal-900 border border-charcoal-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-charcoal-500"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white rounded-lg font-semibold hover:from-burgundy-600 hover:to-burgundy-700 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}





