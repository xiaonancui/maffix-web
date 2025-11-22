import { PrismaClient, MerchandiseCategory } from '@prisma/client'

const prisma = new PrismaClient()

const demoMerchandise = [
  {
    name: 'Limited Edition Tour T-Shirt',
    description: 'Exclusive tour merchandise featuring the iconic Maffix logo. Made from premium 100% cotton for ultimate comfort. This limited edition design is only available for a short time!',
    price: 29.99,
    category: 'CLOTHING' as MerchandiseCategory,
    material: '100% Cotton',
    features: ['Soft fabric', 'Machine washable', 'Unisex fit', 'Pre-shrunk', 'Tagless label'],
    tags: ['bestseller', 'tour', 'limited-edition', 't-shirt', 'cotton'],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 1,
  },
  {
    name: 'Vintage Logo Hoodie',
    description: 'Stay warm and stylish with our vintage-inspired hoodie. Features a fleece-lined interior, kangaroo pocket, and adjustable drawstring hood. Perfect for concerts and everyday wear.',
    price: 54.99,
    category: 'CLOTHING' as MerchandiseCategory,
    material: '80% Cotton, 20% Polyester',
    features: ['Fleece lined', 'Kangaroo pocket', 'Drawstring hood', 'Ribbed cuffs', 'Durable construction'],
    tags: ['hoodie', 'vintage', 'warm', 'bestseller'],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 2,
  },
  {
    name: 'Signature Snapback Cap',
    description: 'Classic snapback cap with embroidered Maffix logo. Adjustable strap ensures perfect fit. Made from durable cotton twill that holds its shape.',
    price: 24.99,
    category: 'ACCESSORIES' as MerchandiseCategory,
    material: 'Cotton twill',
    features: ['Adjustable strap', 'Embroidered logo', 'Curved brim', 'Structured crown', 'Breathable'],
    tags: ['cap', 'hat', 'snapback', 'accessories'],
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 3,
  },
  {
    name: 'Exclusive Vinyl Record',
    description: 'Limited pressing of our latest album on 180g vinyl. Includes gatefold sleeve with exclusive artwork and liner notes. A must-have for collectors!',
    price: 34.99,
    category: 'MUSIC' as MerchandiseCategory,
    material: '180g vinyl',
    features: ['180g vinyl', 'Gatefold sleeve', 'Limited pressing', 'Exclusive artwork', 'High quality audio'],
    tags: ['vinyl', 'music', 'album', 'limited-edition', 'collectible'],
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 4,
  },
  {
    name: 'Concert Poster Set',
    description: 'Set of 3 high-quality concert posters featuring stunning artwork from our recent tour. Each poster is 18x24 inches, perfect for framing.',
    price: 19.99,
    category: 'COLLECTIBLES' as MerchandiseCategory,
    material: 'High-quality paper',
    features: ['Set of 3', 'High quality print', '18x24 inches', 'Matte finish', 'Ready to frame'],
    tags: ['poster', 'art', 'collectible', 'tour', 'wall-art'],
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 5,
  },
  {
    name: 'Enamel Pin Collection',
    description: 'Collectible set of 5 enamel pins featuring iconic Maffix symbols and logos. Each pin has a secure metal backing. Perfect for jackets, bags, and hats!',
    price: 12.99,
    category: 'COLLECTIBLES' as MerchandiseCategory,
    material: 'Metal enamel',
    features: ['Set of 5 pins', 'Metal backing', 'Collectible', 'Vibrant colors', 'Durable finish'],
    tags: ['pins', 'enamel', 'collectible', 'accessories', 'set'],
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 6,
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Eco-friendly canvas tote bag with screen-printed Maffix logo. Large capacity with reinforced handles. Perfect for shopping, beach trips, or everyday use.',
    price: 16.99,
    category: 'ACCESSORIES' as MerchandiseCategory,
    material: 'Canvas',
    features: ['Eco-friendly', 'Large capacity', 'Reinforced handles', 'Screen printed', 'Durable'],
    tags: ['tote', 'bag', 'eco-friendly', 'canvas', 'accessories'],
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 7,
  },
  {
    name: 'Premium Phone Case',
    description: 'Protect your phone in style with our premium phone case featuring exclusive Maffix artwork. Shock absorbent, wireless charging compatible, and slim design.',
    price: 22.99,
    category: 'ACCESSORIES' as MerchandiseCategory,
    material: 'TPU and Polycarbonate',
    features: ['Shock absorbent', 'Wireless charging compatible', 'Slim design', 'Raised edges', 'Easy grip'],
    tags: ['phone-case', 'accessories', 'tech', 'protection'],
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 8,
  },
]

export async function seedMerchandise() {
  console.log('🛍️ Seeding demo merchandise...')

  for (const item of demoMerchandise) {
    const existing = await prisma.merchandise.findFirst({
      where: { name: item.name },
    })

    if (!existing) {
      await prisma.merchandise.create({
        data: item,
      })
      console.log(`✅ Created: ${item.name}`)
    } else {
      console.log(`⏭️  Skipped (already exists): ${item.name}`)
    }
  }

  console.log('✅ Demo merchandise seeding complete!')
}

// Run if called directly
if (require.main === module) {
  seedMerchandise()
    .catch((e) => {
      console.error('❌ Error seeding merchandise:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

