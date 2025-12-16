import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ReviewSection } from '@/components/ReviewSection'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

async function getRelatedProducts(categoryId: number, currentSlug: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      slug: { not: currentSlug },
    },
    take: 4,
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, slug)
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-charcoal-400">
            <li><Link href="/" className="hover:text-gold-500">Home</Link></li>
            <li>/</li>
            <li><Link href="/menu" className="hover:text-gold-500">Menu</Link></li>
            <li>/</li>
            <li>
              <Link href={`/menu?category=${product.category.slug}`} className="hover:text-gold-500">
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-charcoal-900">
            {product.imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${product.imageUrl}')` }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-charcoal-600 text-8xl">🍾</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-gold-500 text-sm font-medium uppercase tracking-wider mb-2">
              {product.category.name}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= avgRating ? 'text-gold-500' : 'text-charcoal-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-charcoal-400">
                  ({product.reviews.length} reviews)
                </span>
              </div>
            )}

            <p className="text-charcoal-300 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.abv && (
                <div className="bg-charcoal-900 rounded-lg p-4">
                  <span className="text-charcoal-500 text-sm">ABV</span>
                  <p className="text-white font-semibold">{Number(product.abv)}%</p>
                </div>
              )}
              {product.origin && (
                <div className="bg-charcoal-900 rounded-lg p-4">
                  <span className="text-charcoal-500 text-sm">Origin</span>
                  <p className="text-white font-semibold">{product.origin}</p>
                </div>
              )}
              <div className="bg-charcoal-900 rounded-lg p-4">
                <span className="text-charcoal-500 text-sm">In Stock</span>
                <p className="text-white font-semibold">{product.stock} bottles</p>
              </div>
              <div className="bg-charcoal-900 rounded-lg p-4">
                <span className="text-charcoal-500 text-sm">Category</span>
                <p className="text-white font-semibold">{product.category.name}</p>
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(Number(product.price))}
                </span>
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product.id} reviews={product.reviews} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/product/${related.slug}`}
                  className="group glass rounded-xl overflow-hidden card-hover"
                >
                  <div className="aspect-square relative overflow-hidden bg-charcoal-800">
                    {related.imageUrl ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url('${related.imageUrl}')` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-charcoal-600 text-4xl">🍾</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold text-white mb-1 line-clamp-1">
                      {related.name}
                    </h3>
                    <span className="text-xl font-bold text-gold-500">
                      {formatPrice(Number(related.price))}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}





