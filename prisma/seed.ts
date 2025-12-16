import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'whiskey' },
      update: {},
      create: {
        name: 'Whiskey',
        slug: 'whiskey',
        description: 'Premium whiskeys from around the world',
        imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'vodka' },
      update: {},
      create: {
        name: 'Vodka',
        slug: 'vodka',
        description: 'Crystal clear premium vodkas',
        imageUrl: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=800',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'rum' },
      update: {},
      create: {
        name: 'Rum',
        slug: 'rum',
        description: 'Caribbean and aged rums',
        imageUrl: 'https://images.unsplash.com/photo-1598018553943-8d24f2a38c96?w=800',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'gin' },
      update: {},
      create: {
        name: 'Gin',
        slug: 'gin',
        description: 'Botanical gins and London dry',
        imageUrl: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=800',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tequila' },
      update: {},
      create: {
        name: 'Tequila',
        slug: 'tequila',
        description: 'Authentic Mexican tequilas',
        imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=800',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'wine' },
      update: {},
      create: {
        name: 'Wine',
        slug: 'wine',
        description: 'Fine wines from renowned vineyards',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cognac' },
      update: {},
      create: {
        name: 'Cognac & Brandy',
        slug: 'cognac',
        description: 'Refined cognacs and brandies',
        imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
      },
    }),
  ])

  // Create products
  const products = [
    // Whiskey
    { name: 'Highland Reserve 18 Year', slug: 'highland-reserve-18', description: 'A magnificent single malt Scotch whisky aged for 18 years in oak casks. Notes of honey, vanilla, and subtle smoke.', price: 189.99, categoryId: categories[0].id, featured: true, abv: 43.0, origin: 'Scotland', imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800' },
    { name: 'Bourbon Heritage Gold', slug: 'bourbon-heritage-gold', description: 'Small batch Kentucky straight bourbon with rich caramel and oak flavors.', price: 75.99, categoryId: categories[0].id, featured: true, abv: 45.0, origin: 'Kentucky, USA', imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800' },
    { name: 'Irish Velvet 12 Year', slug: 'irish-velvet-12', description: 'Triple-distilled Irish whiskey with smooth, honeyed character.', price: 65.99, categoryId: categories[0].id, abv: 40.0, origin: 'Ireland', imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800' },
    { name: 'Japanese Harmony Blend', slug: 'japanese-harmony', description: 'Artfully blended Japanese whisky with delicate floral notes.', price: 125.99, categoryId: categories[0].id, featured: true, abv: 43.0, origin: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800' },
    { name: 'Rye Frontier Reserve', slug: 'rye-frontier', description: 'Bold American rye with spicy character and long finish.', price: 55.99, categoryId: categories[0].id, abv: 45.0, origin: 'USA', imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800' },
    
    // Vodka
    { name: 'Crystal Siberian', slug: 'crystal-siberian', description: 'Six times distilled premium vodka from Siberian winter wheat.', price: 45.99, categoryId: categories[1].id, abv: 40.0, origin: 'Russia', imageUrl: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=800' },
    { name: 'Potato Craft Reserve', slug: 'potato-craft', description: 'Small batch potato vodka with creamy texture and clean finish.', price: 38.99, categoryId: categories[1].id, abv: 40.0, origin: 'Poland', imageUrl: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=800' },
    { name: 'French Grape Vodka', slug: 'french-grape', description: 'Elegant vodka distilled from fine French grapes.', price: 52.99, categoryId: categories[1].id, featured: true, abv: 40.0, origin: 'France', imageUrl: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=800' },
    
    // Rum
    { name: 'Caribbean Dark 15 Year', slug: 'caribbean-dark-15', description: 'Rich, aged Caribbean rum with notes of molasses and tropical fruit.', price: 89.99, categoryId: categories[2].id, featured: true, abv: 43.0, origin: 'Jamaica', imageUrl: 'https://images.unsplash.com/photo-1598018553943-8d24f2a38c96?w=800' },
    { name: 'Spiced Island Gold', slug: 'spiced-island', description: 'Smooth spiced rum with vanilla and warm spices.', price: 32.99, categoryId: categories[2].id, abv: 35.0, origin: 'Caribbean', imageUrl: 'https://images.unsplash.com/photo-1598018553943-8d24f2a38c96?w=800' },
    { name: 'White Beach Rum', slug: 'white-beach', description: 'Light and crisp white rum perfect for cocktails.', price: 28.99, categoryId: categories[2].id, abv: 40.0, origin: 'Puerto Rico', imageUrl: 'https://images.unsplash.com/photo-1598018553943-8d24f2a38c96?w=800' },
    
    // Gin
    { name: 'London Botanical Dry', slug: 'london-botanical', description: 'Classic London dry gin with juniper and citrus botanicals.', price: 42.99, categoryId: categories[3].id, abv: 44.0, origin: 'England', imageUrl: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=800' },
    { name: 'Navy Strength Reserve', slug: 'navy-strength', description: 'Bold, high-proof gin with intense botanical character.', price: 55.99, categoryId: categories[3].id, featured: true, abv: 57.0, origin: 'England', imageUrl: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=800' },
    { name: 'Floral Garden Gin', slug: 'floral-garden', description: 'Contemporary gin with rose, elderflower, and cucumber notes.', price: 48.99, categoryId: categories[3].id, abv: 42.0, origin: 'Scotland', imageUrl: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=800' },
    
    // Tequila
    { name: 'Añejo Reserva de Casa', slug: 'anejo-reserva', description: 'Premium añejo tequila aged 3 years in oak barrels.', price: 95.99, categoryId: categories[4].id, featured: true, abv: 40.0, origin: 'Jalisco, Mexico', imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=800' },
    { name: 'Blanco Puro Agave', slug: 'blanco-puro', description: 'Crystal clear blanco tequila with pure agave flavor.', price: 45.99, categoryId: categories[4].id, abv: 40.0, origin: 'Jalisco, Mexico', imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=800' },
    { name: 'Reposado Oaxacan', slug: 'reposado-oaxacan', description: 'Smooth reposado with hints of agave and oak.', price: 65.99, categoryId: categories[4].id, abv: 40.0, origin: 'Oaxaca, Mexico', imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=800' },
    
    // Wine
    { name: 'Napa Valley Cabernet 2018', slug: 'napa-cabernet-2018', description: 'Full-bodied cabernet sauvignon with dark fruit and oak.', price: 78.99, categoryId: categories[5].id, abv: 14.5, origin: 'California, USA', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800' },
    { name: 'Burgundy Pinot Noir Reserve', slug: 'burgundy-pinot', description: 'Elegant French pinot noir with cherry and earthy notes.', price: 125.99, categoryId: categories[5].id, featured: true, abv: 13.5, origin: 'Burgundy, France', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800' },
    { name: 'Champagne Brut Imperial', slug: 'champagne-brut', description: 'Prestigious French champagne with fine bubbles and toasty notes.', price: 145.99, categoryId: categories[5].id, featured: true, abv: 12.0, origin: 'Champagne, France', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800' },
    
    // Cognac
    { name: 'VSOP Prestige Cognac', slug: 'vsop-prestige', description: 'Refined VSOP cognac with dried fruit and vanilla notes.', price: 85.99, categoryId: categories[6].id, abv: 40.0, origin: 'Cognac, France', imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800' },
    { name: 'XO Royal Reserve', slug: 'xo-royal', description: 'Exceptional XO cognac aged 20+ years with complex character.', price: 225.99, categoryId: categories[6].id, featured: true, abv: 40.0, origin: 'Cognac, France', imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800' },
    { name: 'Apple Calvados Select', slug: 'apple-calvados', description: 'Premium apple brandy from Normandy with orchard fruit notes.', price: 68.99, categoryId: categories[6].id, abv: 42.0, origin: 'Normandy, France', imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800' },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  // Create users with weak password hashing
  const adminPassword = await bcrypt.hash('admin123', 4)
  const userPassword = await bcrypt.hash('password', 4)
  
  await prisma.user.upsert({
    where: { email: 'admin@devilsadvocate.bar' },
    update: {},
    create: {
      email: 'admin@devilsadvocate.bar',
      password: adminPassword,
      name: 'Administrator',
      role: 'admin',
      bio: 'System administrator',
    },
  })

  await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: userPassword,
      name: 'John Doe',
      role: 'customer',
      bio: 'Whiskey enthusiast and regular customer.',
    },
  })

  await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: userPassword,
      name: 'Jane Smith',
      role: 'customer',
      bio: 'Wine lover exploring new spirits.',
    },
  })

  // Create some coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discount: 10.00,
      type: 'percentage',
      maxUses: 100,
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'VIP25' },
    update: {},
    create: {
      code: 'VIP25',
      discount: 25.00,
      type: 'percentage',
      maxUses: 10,
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'FLAT20' },
    update: {},
    create: {
      code: 'FLAT20',
      discount: 20.00,
      type: 'fixed',
      maxUses: 50,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })




