import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Check if test account
  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  let orders: any[] = []

  if (isTestAccount) {
    // Mock data for test accounts
    orders = [
      {
        id: 'order-1',
        orderNumber: 'ORD-1234567890-ABC123',
        status: 'DELIVERED',
        totalAmount: 100.0,
        currency: 'USD',
        createdAt: new Date('2024-01-15'),
        paidAt: new Date('2024-01-15'),
        shippedAt: new Date('2024-01-16'),
        deliveredAt: new Date('2024-01-20'),
        trackingNumber: '1Z999AA10123456784',
        items: [
          {
            id: 'item-1',
            name: 'Classic Logo Hoodie',
            price: 65.0,
            quantity: 1,
            size: 'L',
            color: 'Black',
            imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200',
          },
          {
            id: 'item-2',
            name: 'Signature Snapback Cap',
            price: 35.0,
            quantity: 1,
            size: 'One Size',
            color: 'Black',
            imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200',
          },
        ],
      },
      {
        id: 'order-2',
        orderNumber: 'ORD-1234567891-DEF456',
        status: 'SHIPPED',
        totalAmount: 35.0,
        currency: 'USD',
        createdAt: new Date('2024-01-18'),
        paidAt: new Date('2024-01-18'),
        shippedAt: new Date('2024-01-19'),
        trackingNumber: '1Z999AA10123456785',
        items: [
          {
            id: 'item-3',
            name: 'Tour 2024 T-Shirt',
            price: 35.0,
            quantity: 1,
            size: 'M',
            color: 'Black',
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
          },
        ],
      },
      {
        id: 'order-3',
        orderNumber: 'ORD-1234567892-GHI789',
        status: 'PROCESSING',
        totalAmount: 130.0,
        currency: 'USD',
        createdAt: new Date('2024-01-20'),
        paidAt: new Date('2024-01-20'),
        items: [
          {
            id: 'item-4',
            name: 'Classic Logo Hoodie',
            price: 65.0,
            quantity: 2,
            size: 'M',
            color: 'White',
            imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200',
          },
        ],
      },
    ]
  } else {
    try {
      const { db } = await import('@/lib/db')

      orders = await db.order.findMany({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              merchandise: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (error) {
      console.error('Database fetch failed:', error)
      orders = []
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
      case 'PAID':
        return 'bg-yellow-100 text-yellow-800'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return '✓'
      case 'SHIPPED':
        return '📦'
      case 'PROCESSING':
      case 'PAID':
        return '⏳'
      case 'PENDING':
        return '⏱️'
      case 'CANCELLED':
        return '✗'
      case 'REFUNDED':
        return '↩️'
      default:
        return '•'
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
          <p className="mt-2 text-muted-foreground">View and track your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-12 text-center shadow">
            <div className="mb-4 text-6xl">📦</div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">No orders yet</h2>
            <p className="mb-6 text-muted-foreground">Start shopping to see your orders here</p>
            <Link
              href="/store"
              className="inline-block rounded-lg border-2 border-blue-600 bg-transparent px-6 py-3 font-semibold text-blue-600 transition-all hover:scale-105 hover:bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 dark:text-primary-foreground dark:border-transparent"
            >
              Browse Store
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg bg-white p-6 shadow-lg">
                {/* Order Header */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4 space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image
                        src={
                          item.imageUrl ||
                          item.merchandise?.imageUrl ||
                          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200'
                        }
                        alt={item.name}
                        width={64}
                        height={64}
                        sizes="64px"
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                          {' • '}
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mb-4 rounded-lg bg-blue-50 p-3">
                    <p className="text-sm font-semibold text-blue-900">
                      Tracking Number: {order.trackingNumber}
                    </p>
                  </div>
                )}

                {/* Order Actions */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/orders/${order.id}`}
                    className="rounded-lg border-2 border-border bg-white px-4 py-2 font-semibold text-gray-700 transition-all hover:border-gray-400"
                  >
                    View Details
                  </Link>
                  {order.status === 'DELIVERED' && (
                    <button className="rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-2 font-semibold text-blue-700 transition-all hover:bg-blue-100">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
