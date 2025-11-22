'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import FilterDropdown from '@/components/admin/FilterDropdown'
import SearchBar from '@/components/admin/SearchBar'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ActionMenu from '@/components/admin/ActionMenu'
import { Plus, Star, Edit, Trash2 } from 'lucide-react'

interface MerchandiseVariant {
  id: string
  size: string | null
  color: string | null
  sku: string
  priceModifier: number
  stockQuantity: number
  inStock: boolean
}

interface Merchandise {
  id: string
  name: string
  description: string
  price: number
  category: string
  material: string | null
  features: string[]
  tags: string[]
  inStock: boolean
  featured: boolean
  sortOrder: number
  imageUrl: string
  createdAt: string
  updatedAt: string
  variants: MerchandiseVariant[]
  _count: {
    cartItems: number
    orderItems: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function MerchandisePage() {
  const router = useRouter()
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [featuredFilter, setFeaturedFilter] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const fetchMerchandise = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (categoryFilter) params.append('category', categoryFilter)
      if (statusFilter) params.append('inStock', statusFilter)
      if (featuredFilter) params.append('featured', featuredFilter)

      const response = await fetch(`/api/admin/merchandise?${params}`)
      const data = await response.json()

      if (data.success) {
        let items = data.merchandise || []
        
        // Client-side search filtering
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          items = items.filter((item: Merchandise) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query))
          )
        }

        setMerchandise(items)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch merchandise:', data.error)
        setMerchandise([])
      }
    } catch (error) {
      console.error('Failed to fetch merchandise:', error)
      setMerchandise([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMerchandise()
  }, [pagination.page, categoryFilter, statusFilter, featuredFilter, searchQuery])

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/merchandise/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentStatus }),
      })

      if (response.ok) {
        fetchMerchandise()
      }
    } catch (error) {
      console.error('Failed to toggle featured status:', error)
    }
  }

  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/merchandise/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !currentStatus }),
      })

      if (response.ok) {
        fetchMerchandise()
      }
    } catch (error) {
      console.error('Failed to toggle stock status:', error)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`/api/admin/merchandise/${itemToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMerchandise()
        setDeleteDialogOpen(false)
        setItemToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete merchandise:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      CLOTHING: 'blue',
      ACCESSORIES: 'purple',
      MUSIC: 'yellow',
      COLLECTIBLES: 'green',
      OTHER: 'gray',
    }
    return colors[category] || 'gray'
  }

  const getTotalStock = (variants: MerchandiseVariant[]) => {
    return variants.reduce((sum, v) => sum + v.stockQuantity, 0)
  }

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (item: Merchandise) => (
        <div className="flex items-center gap-3">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-16 h-16 rounded-lg object-cover border border-border"
          />
          <div>
            <div className="font-medium text-foreground">{item.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">{item.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (item: Merchandise) => (
        <StatusBadge variant={getCategoryColor(item.category)}>
          {item.category}
        </StatusBadge>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (item: Merchandise) => (
        <span className="text-foreground font-medium">${item.price.toFixed(2)}</span>
      ),
    },
    {
      key: 'variants',
      label: 'Variants',
      render: (item: Merchandise) => (
        <span className="text-muted-foreground">{item.variants.length} variant(s)</span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (item: Merchandise) => {
        const totalStock = getTotalStock(item.variants)
        return (
          <span className={`font-medium ${totalStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalStock} units
          </span>
        )
      },
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (item: Merchandise) => (
        <span className="text-muted-foreground">{item._count.orderItems}</span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (item: Merchandise) => (
        <StatusBadge variant={item.featured ? 'warning' : 'gray'}>
          {item.featured ? (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Yes
            </span>
          ) : (
            'No'
          )}
        </StatusBadge>
      ),
    },
    {
      key: 'inStock',
      label: 'Status',
      render: (item: Merchandise) => (
        <StatusBadge variant={item.inStock ? 'success' : 'error'}>
          {item.inStock ? 'In Stock' : 'Out of Stock'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: Merchandise) => (
        <ActionMenu
          items={[
            {
              label: 'Edit',
              icon: <Edit className="h-4 w-4" />,
              onClick: () => router.push(`/admin/merchandise/${item.id}/edit`),
            },
            {
              label: 'Manage Variants',
              icon: <Plus className="h-4 w-4" />,
              onClick: () => router.push(`/admin/merchandise/${item.id}/variants`),
            },
            {
              label: item.featured ? 'Unfeature' : 'Feature',
              icon: <Star className="h-4 w-4" />,
              onClick: () => handleToggleFeatured(item.id, item.featured),
            },
            {
              label: item.inStock ? 'Mark Out of Stock' : 'Mark In Stock',
              onClick: () => handleToggleStock(item.id, item.inStock),
            },
            {
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => {
                setItemToDelete(item.id)
                setDeleteDialogOpen(true)
              },
              variant: 'danger',
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Merchandise</h1>
            <p className="text-muted-foreground mt-1">Manage store products and inventory</p>
          </div>
          <Link
            href="/admin/merchandise/new"
            className="px-4 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
          >
            + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search products..."
          />
          <FilterDropdown
            label="Category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { label: 'All Categories', value: '' },
              { label: 'Clothing', value: 'CLOTHING' },
              { label: 'Accessories', value: 'ACCESSORIES' },
              { label: 'Music', value: 'MUSIC' },
              { label: 'Collectibles', value: 'COLLECTIBLES' },
              { label: 'Other', value: 'OTHER' },
            ]}
          />
          <FilterDropdown
            label="Stock Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All Status', value: '' },
              { label: 'In Stock', value: 'true' },
              { label: 'Out of Stock', value: 'false' },
            ]}
          />
          <FilterDropdown
            label="Featured"
            value={featuredFilter}
            onChange={setFeaturedFilter}
            options={[
              { label: 'All Products', value: '' },
              { label: 'Featured Only', value: 'true' },
              { label: 'Not Featured', value: 'false' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg dark:shadow-lg dark:shadow-red-500/10">
        <DataTable
          columns={columns}
          data={merchandise}
          keyExtractor={(item) => item.id}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setItemToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete Merchandise"
        message="Are you sure you want to delete this product? This action cannot be undone and will remove all variants and images."
        confirmText="Delete"
        variant="danger"
      />
      </div>
    </div>
  )
}

