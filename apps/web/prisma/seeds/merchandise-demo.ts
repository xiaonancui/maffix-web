import { PrismaClient, MerchandiseCategory, ProductType } from '@prisma/client'

const prisma = new PrismaClient()

// Real product data based on Store & Bundles Add-On Spec
const realMerchandise = [
  // Main Items - sold individually in store
  {
    name: 'Beat Like Dat Tee',
    description: 'Premium quality t-shirt from the Beat Like Dat collection. Soft cotton fabric with exclusive Maffix artwork.',
    price: 100,
    category: 'CLOTHING' as MerchandiseCategory,
    type: 'MAIN' as ProductType,
    label: 'TS-01',
    sizes: ['S', 'M', 'L', 'XL'],
    material: '100% Premium Cotton',
    features: ['Exclusive artwork', 'Pre-shrunk', 'Machine washable', 'Unisex fit'],
    tags: ['beat-like-dat', 't-shirt', 'clothing', 'main'],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 1,
  },
  {
    name: 'Beat Like Dat Bag',
    description: 'Stylish tote bag from the Beat Like Dat collection. Durable canvas with reinforced handles.',
    price: 65,
    category: 'ACCESSORIES' as MerchandiseCategory,
    type: 'MAIN' as ProductType,
    label: 'BG-01',
    sizes: ['One Size'],
    material: 'Heavy-duty Canvas',
    features: ['Reinforced handles', 'Inner pocket', 'Eco-friendly', 'Screen printed'],
    tags: ['beat-like-dat', 'bag', 'accessories', 'main'],
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 2,
  },
  {
    name: 'SYBAU Hoodie',
    description: 'Cozy hoodie from the SYBAU collection. Fleece-lined for extra warmth.',
    price: 85,
    category: 'CLOTHING' as MerchandiseCategory,
    type: 'MAIN' as ProductType,
    label: 'HD-01',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: '80% Cotton, 20% Polyester',
    features: ['Fleece lined', 'Kangaroo pocket', 'Drawstring hood', 'Ribbed cuffs'],
    tags: ['sybau', 'hoodie', 'clothing', 'main'],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 3,
  },
  {
    name: 'Maffix Snapback Cap',
    description: 'Classic snapback with embroidered Maffix logo. Adjustable fit.',
    price: 35,
    category: 'ACCESSORIES' as MerchandiseCategory,
    type: 'MAIN' as ProductType,
    label: 'CP-01',
    sizes: ['One Size'],
    material: 'Cotton Twill',
    features: ['Embroidered logo', 'Adjustable strap', 'Curved brim', 'Structured crown'],
    tags: ['cap', 'hat', 'accessories', 'main'],
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 4,
  },

  // Accessory Items - not sold individually, used in bundles
  {
    name: 'Maffix Keychain',
    description: 'Metal keychain with Maffix logo charm.',
    price: 8,
    category: 'COLLECTIBLES' as MerchandiseCategory,
    type: 'ACCESSORY' as ProductType,
    label: 'KC-01',
    sizes: [],
    material: 'Metal alloy',
    features: ['Durable', 'Compact', 'Collectible'],
    tags: ['keychain', 'accessory', 'collectible'],
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 10,
  },
  {
    name: 'Maffix Magnet Set',
    description: 'Set of 3 fridge magnets with Maffix artwork.',
    price: 6,
    category: 'COLLECTIBLES' as MerchandiseCategory,
    type: 'ACCESSORY' as ProductType,
    label: 'MG-01',
    sizes: [],
    material: 'Metal with magnetic backing',
    features: ['Set of 3', 'Strong magnets', 'Collectible'],
    tags: ['magnet', 'accessory', 'collectible'],
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 11,
  },
  {
    name: 'Maffix Sticker Pack',
    description: 'Pack of 10 vinyl stickers with various Maffix designs.',
    price: 5,
    category: 'COLLECTIBLES' as MerchandiseCategory,
    type: 'ACCESSORY' as ProductType,
    label: 'ST-01',
    sizes: [],
    material: 'Vinyl',
    features: ['Waterproof', 'Pack of 10', 'Various designs'],
    tags: ['sticker', 'accessory', 'collectible'],
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 12,
  },
  {
    name: 'Maffix Wristband',
    description: 'Silicone wristband with embossed Maffix logo.',
    price: 4,
    category: 'ACCESSORIES' as MerchandiseCategory,
    type: 'ACCESSORY' as ProductType,
    label: 'WB-01',
    sizes: [],
    material: 'Silicone',
    features: ['Stretchable', 'Durable', 'One size fits all'],
    tags: ['wristband', 'accessory'],
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    inStock: true,
    featured: false,
    sortOrder: 13,
  },

  // Bundles - packaged sets of accessory items
  {
    name: 'Bundle A - Starter Pack',
    description: 'Perfect starter bundle! Contains keychain, magnet set, sticker pack, and wristband. Great value for new fans.',
    price: 30,
    category: 'COLLECTIBLES' as MerchandiseCategory,
    type: 'BUNDLE' as ProductType,
    label: 'BN-A',
    sizes: [],
    material: 'Mixed materials',
    features: ['4 items included', 'Keychain', 'Magnet set', 'Sticker pack', 'Wristband', 'Gift box'],
    tags: ['bundle', 'starter', 'value', 'gift'],
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 20,
  },
  {
    name: 'Bundle B - Collector Pack',
    description: 'Deluxe collector bundle with exclusive items. Includes keychain, magnet set, sticker pack, wristband, and exclusive poster.',
    price: 45,
    category: 'COLLECTIBLES' as MerchandiseCategory,
    type: 'BUNDLE' as ProductType,
    label: 'BN-B',
    sizes: [],
    material: 'Mixed materials',
    features: ['5 items included', 'Exclusive poster', 'Keychain', 'Magnet set', 'Sticker pack', 'Wristband', 'Collector box'],
    tags: ['bundle', 'collector', 'exclusive', 'gift'],
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 21,
  },
  {
    name: 'Bundle C - Ultimate Fan Pack',
    description: 'The ultimate fan experience! Everything in Bundle B plus exclusive signed photo and limited edition pin.',
    price: 75,
    category: 'COLLECTIBLES' as MerchandiseCategory,
    type: 'BUNDLE' as ProductType,
    label: 'BN-C',
    sizes: [],
    material: 'Mixed materials',
    features: ['7 items included', 'Signed photo', 'Limited edition pin', 'Exclusive poster', 'Keychain', 'Magnet set', 'Sticker pack', 'Wristband', 'Premium box'],
    tags: ['bundle', 'ultimate', 'limited', 'signed', 'gift'],
    imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80',
    inStock: true,
    featured: true,
    sortOrder: 22,
  },
]

export async function seedMerchandise() {
  console.log('🛍️ Seeding real merchandise data...')

  // Clear existing merchandise for clean seed
  const existingCount = await prisma.merchandise.count()
  if (existingCount > 0) {
    console.log(`🗑️  Clearing ${existingCount} existing merchandise items...`)
    await prisma.merchandise.deleteMany({})
  }

  // Insert all merchandise
  for (const item of realMerchandise) {
    await prisma.merchandise.create({
      data: item,
    })
    console.log(`✅ Created: ${item.label} - ${item.name} (${item.type})`)
  }

  // Summary
  const mainCount = realMerchandise.filter(m => m.type === 'MAIN').length
  const accessoryCount = realMerchandise.filter(m => m.type === 'ACCESSORY').length
  const bundleCount = realMerchandise.filter(m => m.type === 'BUNDLE').length

  console.log('')
  console.log('✅ Merchandise seeding complete!')
  console.log(`   📦 Main items: ${mainCount}`)
  console.log(`   🔧 Accessories: ${accessoryCount} (hidden from store)`)
  console.log(`   🎁 Bundles: ${bundleCount}`)
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
