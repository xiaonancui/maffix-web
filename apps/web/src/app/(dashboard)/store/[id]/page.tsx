import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { MerchandiseCategory } from '@prisma/client'
import ProductGallery from '@/components/dashboard/ProductGallery'
import ProductDetails from '@/components/dashboard/ProductDetails'

export default async function MerchandiseDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const merchandiseId = params.id

  // Check if test account
  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  type MerchandiseVariant = {
    id: string
    size?: string | null
    color?: string | null
    sku?: string | null
    stockQuantity?: number | null
    inStock?: boolean | null
    priceModifier?: number | null
  }

  type MerchandiseRecord = {
    id: string
    name: string
    description: string
    price: number
    currency?: string | null
    category: MerchandiseCategory
    material?: string | null
    features?: string[] | null
    tags?: string[] | null
    imageUrl: string
    images?: Array<{
      id?: string
      url: string
      altText?: string | null
      isPrimary?: boolean | null
      sortOrder?: number | null
    }> | null
    inStock: boolean
    featured?: boolean | null
    variants?: MerchandiseVariant[] | null
  }

  let merchandise: MerchandiseRecord | null = null
  let relatedProducts: MerchandiseRecord[] = []

  if (isTestAccount) {
    // Mock data for test accounts
    const mockMerchandise: Record<string, MerchandiseRecord> = {
      'merch-1': {
        id: 'merch-1',
        name: 'Classic Logo Hoodie',
        description: 'Premium heavyweight hoodie with embroidered logo. Perfect for concerts, casual wear, or showing your support for your favorite artist.',
        price: 65.0,
        currency: 'USD',
        category: MerchandiseCategory.CLOTHING,
        material: '80% Cotton, 20% Polyester',
        features: [
          'Premium heavyweight fabric (350gsm)',
          'Embroidered logo on chest',
          'Ribbed cuffs and waistband',
          'Kangaroo pocket',
          'Unisex fit',
          'Pre-shrunk for perfect fit',
        ],
        tags: ['bestseller', 'new', 'hoodie'],
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
        inStock: true,
        featured: true,
        variants: [
          { id: 'v1', size: 'S', color: 'Black', sku: 'HOODIE-BLK-S', stockQuantity: 10, inStock: true, priceModifier: 0 },
          { id: 'v2', size: 'M', color: 'Black', sku: 'HOODIE-BLK-M', stockQuantity: 15, inStock: true, priceModifier: 0 },
          { id: 'v3', size: 'L', color: 'Black', sku: 'HOODIE-BLK-L', stockQuantity: 20, inStock: true, priceModifier: 0 },
          { id: 'v4', size: 'XL', color: 'Black', sku: 'HOODIE-BLK-XL', stockQuantity: 12, inStock: true, priceModifier: 0 },
          { id: 'v5', size: 'S', color: 'White', sku: 'HOODIE-WHT-S', stockQuantity: 8, inStock: true, priceModifier: 0 },
          { id: 'v6', size: 'M', color: 'White', sku: 'HOODIE-WHT-M', stockQuantity: 10, inStock: true, priceModifier: 0 },
          { id: 'v7', size: 'L', color: 'White', sku: 'HOODIE-WHT-L', stockQuantity: 15, inStock: true, priceModifier: 0 },
        ],
        images: [
          { id: 'img1', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', altText: 'Front view', isPrimary: true, sortOrder: 0 },
          { id: 'img2', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', altText: 'Back view', isPrimary: false, sortOrder: 1 },
          { id: 'img3', url: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800', altText: 'Detail view', isPrimary: false, sortOrder: 2 },
        ],
      },
      'merch-2': {
        id: 'merch-2',
        name: 'Signature Snapback Cap',
        description: 'Adjustable snapback with 3D embroidered logo. High-quality construction with breathable design.',
        price: 35.0,
        currency: 'USD',
        category: MerchandiseCategory.ACCESSORIES,
        material: '100% Cotton',
        features: [
          'Adjustable snapback closure',
          '3D embroidered logo',
          'Structured 6-panel design',
          'Curved brim',
          'Breathable eyelets',
        ],
        tags: ['bestseller', 'hat', 'cap'],
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
        inStock: true,
        featured: true,
        variants: [
          { id: 'v8', size: 'One Size', color: 'Black', sku: 'CAP-BLK-OS', stockQuantity: 25, inStock: true, priceModifier: 0 },
          { id: 'v9', size: 'One Size', color: 'White', sku: 'CAP-WHT-OS', stockQuantity: 20, inStock: true, priceModifier: 0 },
          { id: 'v10', size: 'One Size', color: 'Red', sku: 'CAP-RED-OS', stockQuantity: 15, inStock: true, priceModifier: 0 },
        ],
        images: [
          { id: 'img4', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', altText: 'Front view', isPrimary: true, sortOrder: 0 },
          { id: 'img5', url: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800', altText: 'Side view', isPrimary: false, sortOrder: 1 },
        ],
      },
    }

    merchandise = mockMerchandise[merchandiseId] ?? null

    if (!merchandise) {
      notFound()
    }

    // Mock related products
    relatedProducts = (Object.values(mockMerchandise) as MerchandiseRecord[])
      .filter((m: any) => m.id !== merchandiseId)
      .slice(0, 3)
  } else {
    try {
      const { db } = await import('@/lib/db')

      merchandise = (await db.merchandise.findUnique({
        where: { id: merchandiseId },
        include: {
          variants: {
            where: { inStock: true },
            orderBy: [{ size: 'asc' }, { color: 'asc' }],
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      })) as MerchandiseRecord | null

      if (!merchandise) {
        notFound()
      }

      // Fetch related products from same category
      relatedProducts = (await db.merchandise.findMany({
        where: {
          category: merchandise.category,
          id: { not: merchandiseId },
          inStock: true,
        },
        take: 4,
        orderBy: { featured: 'desc' },
      })) as MerchandiseRecord[]
    } catch (error) {
      console.error('Database fetch failed:', error)
      notFound()
    }
  }

  if (!merchandise) {
    notFound()
  }

  // Get unique sizes and colors from variants
  const variants = Array.isArray(merchandise.variants) ? merchandise.variants : []

  const sizes = Array.from(
    new Set(
      variants
        .map((variant) => variant.size ?? null)
        .filter((size): size is string => typeof size === 'string' && size.length > 0)
    )
  )

  const colors = Array.from(
    new Set(
      variants
        .map((variant) => variant.color ?? null)
        .filter((color): color is string => typeof color === 'string' && color.length > 0)
    )
  )

  const galleryImages = (
    Array.isArray(merchandise.images) && merchandise.images.length > 0
      ? merchandise.images
      : [
          {
            url: merchandise.imageUrl,
            altText: merchandise.name,
            isPrimary: true,
          },
        ]
  ).map((image) => ({
    ...image,
    altText: image.altText ?? undefined,
    isPrimary: typeof image.isPrimary === 'boolean' ? image.isPrimary : undefined,
    sortOrder: typeof image.sortOrder === 'number' ? image.sortOrder : undefined,
  }))

  const productDetailsData = {
    ...merchandise,
    material: merchandise.material ?? undefined,
    currency: merchandise.currency ?? undefined,
    features: merchandise.features ?? [],
    tags: merchandise.tags ?? [],
    variants,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/store" className="text-gray-600 hover:text-gray-900">
                Store
              </a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{merchandise.name}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Product Gallery */}
          <ProductGallery images={galleryImages} />

          {/* Right: Product Details */}
          <div className="space-y-6">
            <ProductDetails
              merchandise={productDetailsData}
              sizes={sizes}
              colors={colors}
            />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">You May Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product: any) => (
                <a
                  key={product.id}
                  href={`/store/${product.id}`}
                  className="group rounded-lg bg-white p-4 shadow transition-all hover:shadow-lg"
                >
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-lg font-bold text-[#FF5656]">${product.price.toFixed(2)}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
