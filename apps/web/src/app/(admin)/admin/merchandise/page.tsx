'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
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

  const getCategoryBadge = (category: string) => {
    const badgeStyles: Record<string, { color: string; borderColor: string; bgColor: string; shadowColor: string }> = {
      CLOTHING: {
        color: 'text-[#00F5FF]',
        borderColor: 'border-[#00F5FF]/40',
        bgColor: 'bg-[#00F5FF]/20',
        shadowColor: 'shadow-[#00F5FF]/20',
      },
      ACCESSORIES: {
        color: 'text-[#8B5CF6]',
        borderColor: 'border-[#8B5CF6]/40',
        bgColor: 'bg-[#8B5CF6]/20',
        shadowColor: 'shadow-[#8B5CF6]/20',
      },
      MUSIC: {
        color: 'text-[#FFC700]',
        borderColor: 'border-[#FFC700]/40',
        bgColor: 'bg-[#FFC700]/20',
        shadowColor: 'shadow-[#FFC700]/20',
      },
      COLLECTIBLES: {
        color: 'text-[#10B981]',
        borderColor: 'border-[#10B981]/40',
        bgColor: 'bg-[#10B981]/20',
        shadowColor: 'shadow-[#10B981]/20',
      },
      OTHER: {
        color: 'text-white/40',
        borderColor: 'border-white/20',
        bgColor: 'bg-white/10',
        shadowColor: 'shadow-white/10',
      },
    }
    return badgeStyles[category] || badgeStyles.OTHER
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
            className="h-16 w-16 rounded-lg border-2 border-white/10 object-cover"
          />
          <div>
            <div className="font-medium text-white">{item.name}</div>
            <div className="line-clamp-1 text-sm text-white/60">{item.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (item: Merchandise) => {
        const styles = getCategoryBadge(item.category)
        return (
          <span className={`inline-flex rounded-full border-2 ${styles.borderColor} ${styles.bgColor} px-3 py-1 font-display text-xs font-black uppercase tracking-wider ${styles.color} shadow-lg ${styles.shadowColor}`}>
            {item.category}
          </span>
        )
      },
    },
    {
      key: 'price',
      label: 'Price',
      render: (item: Merchandise) => (
        <span className="font-medium text-white">£{item.price.toFixed(2)}</span>
      ),
    },
    {
      key: 'variants',
      label: 'Variants',
      render: (item: Merchandise) => (
        <span className="text-white/60">{item.variants.length} variant(s)</span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (item: Merchandise) => {
        const totalStock = getTotalStock(item.variants)
        return (
          <span className={`font-medium ${totalStock > 0 ? 'text-[#10B981]' : 'text-[#FF1F7D]'}`}>
            {totalStock} units
          </span>
        )
      },
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (item: Merchandise) => (
        <span className="text-white/60">{item._count.orderItems}</span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (item: Merchandise) => (
        item.featured ? (
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#FFC700]/40 bg-[#FFC700]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#FFC700] shadow-lg shadow-[#FFC700]/20">
            <Star className="h-3 w-3" />
            Yes
          </span>
        ) : (
          <span className="inline-flex rounded-full border-2 border-white/20 bg-white/10 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-white/40">
            No
          </span>
        )
      ),
    },
    {
      key: 'inStock',
      label: 'Status',
      render: (item: Merchandise) => (
        item.inStock ? (
          <span className="inline-flex rounded-full border-2 border-[#10B981]/40 bg-[#10B981]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#10B981] shadow-lg shadow-[#10B981]/20">
            In Stock
          </span>
        ) : (
          <span className="inline-flex rounded-full border-2 border-[#FF1F7D]/40 bg-[#FF1F7D]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#FF1F7D] shadow-lg shadow-[#FF1F7D]/20">
            Out of Stock
          </span>
        )
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
        <AdminPageHeader
          title="Merchandise"
          description="Manage store products and inventory"
          actions={
            <Link
              href="/admin/merchandise/new"
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40"
            >
              <Plus className="h-5 w-5 text-[#FF1F7D]" />
              <span className="text-[#FF1F7D]">Add Product</span>
            </Link>
          }
        />

      {/* Filters */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl">
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

