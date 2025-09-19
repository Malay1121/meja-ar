'use client'

import { useState } from 'react'
import { X, Clock, CheckCircle, XCircle, AlertCircle, Package, Users, Phone, Mail, MapPin, IndianRupee, Hash } from 'lucide-react'
import { Order } from '@/services/restaurantDataService'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-orange-100 text-orange-800 border-orange-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  delivered: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  ready: AlertCircle,
  delivered: CheckCircle,
  cancelled: XCircle
}

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onStatusUpdate: (orderId: string, status: Order['status'], estimatedTime?: number) => Promise<void>
}

export function OrderDetailsModal({ isOpen, onClose, order, onStatusUpdate }: OrderDetailsModalProps) {
  const [updating, setUpdating] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState<number>(30)

  if (!isOpen || !order) return null

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    try {
      setUpdating(true)
      await onStatusUpdate(order.id, newStatus, estimatedTime)
      onClose()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow: Record<string, Order['status']> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivered'
    }

    return statusFlow[currentStatus] || null
  }

  const canCancel = ['pending', 'confirmed'].includes(order.status)
  const nextStatus = getNextStatus(order.status)
  const StatusIcon = statusIcons[order.status]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Order {order.orderNumber}
            </h2>
            <p className="text-gray-600 mt-1">
              Placed on {formatTime(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Order Info */}
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Status</h3>
                <div className={`flex items-center gap-3 p-3 rounded-lg border ${statusColors[order.status]}`}>
                  <StatusIcon size={24} />
                  <div>
                    <div className="font-medium capitalize">{order.status}</div>
                    <div className="text-sm opacity-75">
                      {order.status === 'pending' && 'Waiting for confirmation'}
                      {order.status === 'confirmed' && 'Order confirmed, preparing to cook'}
                      {order.status === 'preparing' && 'Being prepared in kitchen'}
                      {order.status === 'ready' && 'Ready for pickup/delivery'}
                      {order.status === 'delivered' && 'Order completed'}
                      {order.status === 'cancelled' && 'Order cancelled'}
                    </div>
                  </div>
                </div>

                {/* Status Update Actions */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="mt-4 space-y-3">
                    {nextStatus && (
                      <div>
                        {order.status === 'confirmed' && (
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estimated preparation time (minutes)
                            </label>
                            <input
                              type="number"
                              min="5"
                              max="120"
                              value={estimatedTime}
                              onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 30)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                        )}
                        <button
                          onClick={() => handleStatusUpdate(nextStatus)}
                          disabled={updating}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {updating ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              Move to {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => handleStatusUpdate('cancelled')}
                        disabled={updating}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} />
                        Cancel Order
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{order.customer.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <div>
                      <div className="text-gray-900">{order.customer.phone}</div>
                    </div>
                  </div>
                  {order.customer.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <div className="text-gray-900">{order.customer.email}</div>
                      </div>
                    </div>
                  )}
                  {order.customer.tableNumber && (
                    <div className="flex items-center gap-3">
                      <Hash size={16} className="text-gray-400" />
                      <div>
                        <div className="text-gray-900">Table {order.customer.tableNumber}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Type:</span>
                    <span className="capitalize font-medium">{order.orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                  {order.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="capitalize font-medium">{order.paymentMethod}</span>
                    </div>
                  )}
                  {order.estimatedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium text-orange-600">{order.estimatedTime} minutes</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatTime(order.createdAt)}</span>
                  </div>
                  {order.confirmedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confirmed:</span>
                      <span className="font-medium">{formatTime(order.confirmedAt)}</span>
                    </div>
                  )}
                  {order.readyAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ready:</span>
                      <span className="font-medium">{formatTime(order.readyAt)}</span>
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivered:</span>
                      <span className="font-medium">{formatTime(order.deliveredAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Items */}
            <div className="space-y-6">
              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Order Items ({order.items.length})
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <div className="text-sm text-gray-600 mt-1">
                                Quantity: {item.quantity}
                              </div>
                              {item.specialInstructions && (
                                <div className="text-sm text-orange-600 mt-1">
                                  <strong>Special:</strong> {item.specialInstructions}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ₹{item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              {order.specialNotes && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">Special Notes</h3>
                  <p className="text-yellow-700">{order.specialNotes}</p>
                </div>
              )}

              {/* Order Total */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <IndianRupee size={20} />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}