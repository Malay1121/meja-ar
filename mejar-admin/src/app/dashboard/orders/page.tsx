'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Eye, Clock, CheckCircle, XCircle, AlertCircle, Package, Users, IndianRupee } from 'lucide-react'
import { Order, OrderStats } from '@/services/restaurantDataService'
import { restaurantDataService } from '@/services/restaurantDataService'
import { useAuth } from '@/app/providers'
import { OrderDetailsModal } from '@/components/OrderDetailsModal'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  ready: AlertCircle,
  delivered: CheckCircle,
  cancelled: XCircle
}

export default function OrdersPage() {
  console.log('OrdersPage component mounted')
  
  const { restaurantId: authRestaurantId, adminData, loading: authLoading } = useAuth()
  
  // Fallback to 'the-spice-garden' for development if no auth restaurant ID
  const restaurantId = authRestaurantId || 'the-spice-garden'
  
  console.log('Current state:', { restaurantId, authRestaurantId, authLoading, adminData })
  
  const [orders, setOrders] = useState<Order[]>([])
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    console.log('Orders useEffect:', { restaurantId, authLoading, adminData })
    if (restaurantId) {
      loadOrdersData()
    }
  }, [restaurantId])

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    if (!restaurantId) return
    
    const interval = setInterval(() => {
      loadOrdersData()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [restaurantId])

  const loadOrdersData = async () => {
    if (!restaurantId) return
    
    try {
      console.log('Starting to load orders for restaurant:', restaurantId)
      setLoading(true)
      setError(null)
      
      // Set restaurant ID for the data service
      restaurantDataService.setRestaurantId(restaurantId)
      console.log('Restaurant ID set in service')
      
      // Load orders and stats
      console.log('Fetching orders and stats...')
      const [ordersData, statsData] = await Promise.all([
        restaurantDataService.getOrders({ limit: 200 }),
        restaurantDataService.getOrderStats()
      ])
      
      console.log('Fetched orders:', ordersData.length)
      console.log('Fetched stats:', statsData)
      
      setOrders(ordersData)
      setOrderStats(statsData)
      
      console.log('Orders loaded successfully:', {
        totalOrders: ordersData.length,
        todayOrders: statsData.today.total,
        todayRevenue: statsData.today.revenue
      })
      
    } catch (err) {
      console.error('Error loading orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, status: Order['status'], estimatedTime?: number) => {
    try {
      await restaurantDataService.updateOrderStatus(orderId, status, { estimatedTime })
      console.log('Order status updated successfully')
      await loadOrdersData() // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status. Please try again.')
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.orderNumber?.toLowerCase() || order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.customer?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.customer?.phone || '').includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesOrderType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter
    
    return matchesSearch && matchesStatus && matchesOrderType
  })

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    })
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error Loading Orders</h3>
        <p className="text-red-600 mt-1">{error}</p>
        <button
          onClick={loadOrdersData}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders and track kitchen operations</p>
        </div>
        <button
          onClick={loadOrdersData}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Clock size={20} />
          Refresh Orders
        </button>
      </div>

      {/* Stats Cards */}
      {orderStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-blue-600">{orderStats.today.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.today.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{orderStats.today.revenue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <IndianRupee className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{orderStats.thisWeek.avgOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by order number, customer name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Types</option>
                <option value="dine-in">Dine In</option>
                <option value="takeout">Takeout</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="text-gray-500 mt-2">
                {searchTerm || statusFilter !== 'all' || orderTypeFilter !== 'all'
                  ? 'Try adjusting your search or filters' 
                  : 'New orders will appear here'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status]
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber || `#${order.id.slice(-8).toUpperCase()}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.phone}
                          </div>
                          {order.customer.tableNumber && (
                            <div className="text-sm text-blue-600">
                              Table: {order.customer.tableNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          <StatusIcon size={14} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {order.orderType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatTime(order.createdAt)}
                        </div>
                        {order.estimatedTime && (
                          <div className="text-sm text-orange-600">
                            ETA: {order.estimatedTime} min
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View order details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}