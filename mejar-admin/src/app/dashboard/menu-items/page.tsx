'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreVertical, Package } from 'lucide-react'
import { MenuItem, Category } from '@/services/restaurantDataService'
import { restaurantDataService } from '@/services/restaurantDataService'
import { useAuth } from '@/app/providers'
import { MenuItemModal } from '@/components/MenuItemModal'

export default function MenuItemsPage() {
  console.log('MenuItemsPage component mounted')
  
  const { restaurantId: authRestaurantId, adminData, loading: authLoading } = useAuth()
  
  // Fallback to 'the-spice-garden' for development if no auth restaurant ID
  const restaurantId = authRestaurantId || 'the-spice-garden'
  
  console.log('Current state:', { restaurantId, authRestaurantId, authLoading, adminData })
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    console.log('MenuItems useEffect:', { restaurantId, authLoading, adminData })
    if (restaurantId) {
      loadMenuData()
    }
  }, [restaurantId])

  const loadMenuData = async () => {
    if (!restaurantId) return
    
    try {
      console.log('Starting to load menu data for restaurant:', restaurantId)
      setLoading(true)
      setError(null)
      
      // Set restaurant ID for the data service
      restaurantDataService.setRestaurantId(restaurantId)
      console.log('Restaurant ID set in service')
      
      // Load menu items and categories
      console.log('Fetching menu items and categories...')
      const [itemsData, categoriesData] = await Promise.all([
        restaurantDataService.getMenuItems(),
        restaurantDataService.getCategories()
      ])
      
      console.log('Data loaded:', { 
        items: itemsData.length, 
        categories: categoriesData.length,
        firstItem: itemsData[0],
        sampleItem: itemsData.length > 0 ? {
          id: itemsData[0]?.id,
          name: itemsData[0]?.name,
          price: itemsData[0]?.price,
          categoryId: itemsData[0]?.categoryId,
          isActive: itemsData[0]?.isActive
        } : null
      })
      setMenuItems(itemsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading menu data:', error)
      setError('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  // Filter menu items based on search and filters
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           item.categoryId === selectedCategory ||
                           item.categoryId?.toLowerCase() === selectedCategory.toLowerCase()
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && item.isActive) ||
                         (statusFilter === 'inactive' && !item.isActive)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleToggleStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      await restaurantDataService.toggleMenuItemStatus(itemId, !currentStatus)
      // Reload data to reflect changes
      await loadMenuData()
    } catch (error) {
      console.error('Error toggling item status:', error)
    }
  }

  const handleSaveItem = async (itemData: Partial<MenuItem>) => {
    try {
      if (editingItem) {
        // Update existing item
        await restaurantDataService.updateMenuItem(editingItem.id, itemData)
      } else {
        // Create new item
        await restaurantDataService.createMenuItem(itemData as Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>)
      }
      
      // Reload data after save
      await loadMenuData()
      
      // Close modal
      setShowAddModal(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving menu item:', error)
      throw error // Re-throw to let modal handle the error
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    
    try {
      await restaurantDataService.deleteMenuItem(itemId)
      await loadMenuData()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="text-gray-600">Loading menu items...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Menu Items</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadMenuData}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Items</h1>
          <p className="text-gray-600">Manage your restaurant's menu items and dishes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Menu Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Items</p>
              <p className="text-2xl font-bold text-green-600">{menuItems.filter(item => item.isActive).length}</p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
            <Filter className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{menuItems.length > 0 ? 
                  (menuItems.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : 0), 0) / menuItems.length).toFixed(2) : 
                  '0.00'
                }
              </p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Menu Items ({filteredItems.length})
          </h2>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all' 
                ? "Try adjusting your filters" 
                : "Get started by adding your first menu item"
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && statusFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  Add Menu Item
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AR Model
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const category = categories.find(cat => 
                    cat.id === item.categoryId || 
                    cat.name.toLowerCase() === item.categoryId?.toLowerCase()
                  )
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {item.imageUrl ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={item.imageUrl}
                                alt={item.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category?.name || item.categoryId || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(item.id, item.isActive)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            item.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.arModel?.enabled ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            AR Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No AR
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit item"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <MenuItemModal
        isOpen={showAddModal || !!editingItem}
        onClose={() => {
          setShowAddModal(false)
          setEditingItem(null)
        }}
        onSave={handleSaveItem}
        item={editingItem}
        categories={categories}
      />
    </div>
  )
}