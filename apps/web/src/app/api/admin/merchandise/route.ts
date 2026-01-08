import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

// Validation schema for creating merchandise
const createMerchandiseSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(['CLOTHING', 'ACCESSORIES', 'MUSIC', 'COLLECTIBLES', 'OTHER']),
  type: z.enum(['MAIN', 'ACCESSORY', 'BUNDLE']).optional().default('MAIN'),
  label: z.string().max(50).optional(),
  sizes: z.array(z.string()).optional(),
  material: z.string().optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  variants: z.array(z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    sku: z.string(),
    priceModifier: z.number().optional(),
    stockQuantity: z.number().int().min(0),
    inStock: z.boolean().optional(),
  })).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
    sortOrder: z.number().int().optional(),
    isPrimary: z.boolean().optional(),
  })).optional(),
})

/**
 * POST /api/admin/merchandise
 * Create a new merchandise product
 */
export async function POST(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const validationResult = createMerchandiseSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Use mock data (database not connected)
    const merchandise = {
      id: `merch-${Date.now()}`,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      type: data.type || 'MAIN',
      label: data.label || null,
      sizes: data.sizes || [],
      material: data.material,
      features: data.features || [],
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      inStock: data.inStock ?? true,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      variants: data.variants?.map((variant, index) => ({
        id: `var-${Date.now()}-${index}`,
        merchandiseId: `merch-${Date.now()}`,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        priceModifier: variant.priceModifier ?? 0,
        stockQuantity: variant.stockQuantity,
        inStock: variant.inStock ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) || [],
      images: data.images?.map((image, index) => ({
        id: `img-${Date.now()}-${index}`,
        merchandiseId: `merch-${Date.now()}`,
        url: image.url,
        altText: image.altText,
        sortOrder: image.sortOrder ?? 0,
        isPrimary: image.isPrimary ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) || [],
    }

    return NextResponse.json({
      success: true,
      merchandise,
    })
  } catch (error: any) {
    console.error('Error creating merchandise:', error)
    return NextResponse.json(
      {
        error: 'Failed to create merchandise',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/merchandise
 * List all merchandise products with filtering
 */
export async function GET(request: Request) {
  try {
    // Require admin authentication
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Use mock data (database not connected)
    const mockMerchandise = [
      {
        id: 'merch-1',
        name: 'Premium Hoodie',
        description: 'Limited edition premium quality hoodie with exclusive design',
        price: 79.99,
        category: 'CLOTHING',
        type: 'MAIN',
        label: 'HD-01',
        sizes: ['S', 'M', 'L', 'XL'],
        material: '80% Cotton, 20% Polyester',
        features: ['Premium quality', 'Limited edition', 'Exclusive design'],
        tags: ['hoodie', 'clothing', 'premium'],
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
        inStock: true,
        featured: true,
        sortOrder: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        variants: [
          {
            id: 'var-1',
            merchandiseId: 'merch-1',
            size: 'S',
            color: 'Black',
            sku: 'HOODIE-BLK-S',
            priceModifier: 0,
            stockQuantity: 25,
            inStock: true,
          },
          {
            id: 'var-2',
            merchandiseId: 'merch-1',
            size: 'M',
            color: 'Black',
            sku: 'HOODIE-BLK-M',
            priceModifier: 0,
            stockQuantity: 30,
            inStock: true,
          },
        ],
        images: [
          {
            id: 'img-1',
            merchandiseId: 'merch-1',
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
            altText: 'Premium Hoodie Front',
            sortOrder: 0,
            isPrimary: true,
          },
        ],
        _count: {
          cartItems: 12,
          orderItems: 45,
        },
      },
      {
        id: 'merch-2',
        name: 'Snapback Cap',
        description: 'Classic snapback cap with embroidered logo',
        price: 29.99,
        category: 'ACCESSORIES',
        type: 'MAIN',
        label: 'CAP-01',
        sizes: ['ONE SIZE'],
        material: '100% Cotton',
        features: ['Adjustable', 'Embroidered logo', 'One size fits all'],
        tags: ['cap', 'hat', 'accessories'],
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
        inStock: true,
        featured: true,
        sortOrder: 2,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        variants: [
          {
            id: 'var-3',
            merchandiseId: 'merch-2',
            size: 'One Size',
            color: 'Black',
            sku: 'CAP-BLK-OS',
            priceModifier: 0,
            stockQuantity: 50,
            inStock: true,
          },
        ],
        images: [],
        _count: {
          cartItems: 8,
          orderItems: 32,
        },
      },
      {
        id: 'merch-3',
        name: 'Graphic T-Shirt',
        description: 'Comfortable cotton t-shirt with exclusive tour artwork',
        price: 34.99,
        category: 'CLOTHING',
        type: 'MAIN',
        label: 'TS-01',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        material: '100% Cotton',
        features: ['Soft cotton', 'Tour exclusive', 'Screen printed'],
        tags: ['tshirt', 'clothing', 'tour'],
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        inStock: true,
        featured: false,
        sortOrder: 3,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        variants: [
          {
            id: 'var-4',
            merchandiseId: 'merch-3',
            size: 'S',
            color: 'White',
            sku: 'TSHIRT-WHT-S',
            priceModifier: 0,
            stockQuantity: 20,
            inStock: true,
          },
          {
            id: 'var-5',
            merchandiseId: 'merch-3',
            size: 'M',
            color: 'White',
            sku: 'TSHIRT-WHT-M',
            priceModifier: 0,
            stockQuantity: 35,
            inStock: true,
          },
        ],
        images: [],
        _count: {
          cartItems: 15,
          orderItems: 67,
        },
      },
    ]

    // Apply filters
    let filteredMerchandise = mockMerchandise

    if (category) {
      filteredMerchandise = filteredMerchandise.filter((m) => m.category === category)
    }

    if (featured !== null && featured !== undefined) {
      const featuredFilter = featured === 'true'
      filteredMerchandise = filteredMerchandise.filter((m) => m.featured === featuredFilter)
    }

    if (inStock !== null && inStock !== undefined) {
      const inStockFilter = inStock === 'true'
      filteredMerchandise = filteredMerchandise.filter((m) => m.inStock === inStockFilter)
    }

    const total = filteredMerchandise.length
    const start = (page - 1) * limit
    const paginatedMerchandise = filteredMerchandise.slice(start, start + limit)

    return NextResponse.json({
      success: true,
      merchandise: paginatedMerchandise,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error listing merchandise:', error)
    return NextResponse.json(
      {
        error: 'Failed to list merchandise',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

