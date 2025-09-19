'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { Order } from '@/services/restaurantDataService'
import { restaurantDataService } from '@/services/restaurantDataService'
import { useAuth } from '@/app/providers'

interface OrderNotificationProps {
  onNotificationClick?: () => void
}

export function OrderNotification({ onNotificationClick }: OrderNotificationProps) {
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [lastChecked, setLastChecked] = useState(new Date())
  const { restaurantId } = useAuth()

  useEffect(() => {
    if (!restaurantId) return

    // Set restaurant ID for the data service
    restaurantDataService.setRestaurantId(restaurantId)

    // Check for new orders every 10 seconds
    const interval = setInterval(async () => {
      try {
        const orders = await restaurantDataService.getRecentOrders(30) // Last 30 minutes
        const newOrders = orders.filter(order => 
          order.createdAt.toDate() > lastChecked &&
          ['pending', 'confirmed'].includes(order.status)
        )
        
        if (newOrders.length > 0) {
          setRecentOrders(prev => [...newOrders, ...prev].slice(0, 10)) // Keep last 10
          setLastChecked(new Date())
          
          // Optional: Play notification sound
          // new Audio('/notification.mp3').play().catch(() => {})
        }
      } catch (error) {
        console.error('Error checking for new orders:', error)
      }
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [restaurantId, lastChecked])

  const unreadCount = recentOrders.filter(order => 
    ['pending', 'confirmed'].includes(order.status)
  ).length

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown)
    if (onNotificationClick) {
      onNotificationClick()
    }
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="relative">
      <button
        onClick={handleNotificationClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentOrders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell size={48} className="mx-auto text-gray-300 mb-2" />
                <p>No recent orders</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setShowDropdown(false)
                      // Navigate to orders page or open order details
                      window.location.href = '/dashboard/orders'
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {order.orderNumber}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {order.customer.name} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm font-medium text-green-600 mt-1">
                          ₹{order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(order.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {recentOrders.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowDropdown(false)
                  window.location.href = '/dashboard/orders'
                }}
                className="w-full text-center text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                View All Orders
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}