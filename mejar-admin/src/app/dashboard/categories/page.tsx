'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, MoreVertical, Tag, Hash, Clock } from 'lucide-react'
import { Category } from '@/services/restaurantDataService'
import { restaurantDataService } from '@/services/restaurantDataService'
import { useAuth } from '@/app/providers'
import { CategoryModal } from '@/components/CategoryModal'

export default function CategoriesPage() {
  console.log('CategoriesPage component mounted')
  
  const { restaurantId: authRestaurantId, adminData, loading: authLoading } = useAuth()
  
  // Fallback to 'the-spice-garden' for development if no auth restaurant ID
  const restaurantId = authRestaurantId || 'the-spice-garden'
  
  console.log('Current state:', { restaurantId, authRestaurantId, authLoading, adminData })
  
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    console.log('Categories useEffect:', { restaurantId, authLoading, adminData })
    if (restaurantId) {
      loadCategories()
    }
  }, [restaurantId])

  const loadCategories = async () => {
    if (!restaurantId) return
    
    try {
      console.log('Starting to load categories for restaurant:', restaurantId)
      setLoading(true)
      setError(null)
      
      // Set restaurant ID for the data service
      restaurantDataService.setRestaurantId(restaurantId)
      console.log('Restaurant ID set in service')
      
      // Load categories
      console.log('Fetching categories...')
      const categoriesData = await restaurantDataService.getCategories()
      console.log('Fetched categories:', categoriesData)
      
      setCategories(categoriesData)
      
      console.log('Categories loaded successfully:', {
        totalCategories: categoriesData.length,
        activeCategories: categoriesData.filter(cat => cat.isActive).length
      })
      
    } catch (err) {
      console.error('Error loading categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      if (editingCategory) {
        // Update existing category
        await restaurantDataService.updateCategory(editingCategory.id, categoryData)
        console.log('Category updated successfully')
      } else {
        // Create new category
        const newCategoryId = await restaurantDataService.createCategory(categoryData as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>)
        console.log('Category created successfully with ID:', newCategoryId)
      }
      
      // Reload categories
      await loadCategories()
      setEditingCategory(null)
    } catch (error) {
      console.error('Error saving category:', error)
      throw error
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await restaurantDataService.deleteCategory(categoryId)
        console.log('Category deleted successfully')
        await loadCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Failed to delete category. Please try again.')
      }
    }
  }

  const handleToggleStatus = async (categoryId: string, isActive: boolean) => {
    try {
      await restaurantDataService.toggleCategoryStatus(categoryId, isActive)
      console.log('Category status updated successfully')
      await loadCategories()
    } catch (error) {
      console.error('Error updating category status:', error)
      alert('Failed to update category status. Please try again.')
    }
  }

  // Filter categories based on search and status
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.isActive) ||
                         (statusFilter === 'inactive' && !category.isActive)
    return matchesSearch && matchesStatus
  })

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
        <h3 className="text-red-800 font-medium">Error Loading Categories</h3>
        <p className="text-red-600 mt-1">{error}</p>
        <button
          onClick={loadCategories}
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
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Organize your menu items into categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Tag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-green-600">
                {categories.filter(cat => cat.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Hash className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Categories</p>
              <p className="text-2xl font-bold text-red-600">
                {categories.filter(cat => !cat.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Hash className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Items per Category</p>
              <p className="text-2xl font-bold text-purple-600">
                {categories.length > 0 ? 
                  Math.round(categories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0) / categories.length) : 
                  0
                }
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search categories by name or description..."
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
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading categories...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No categories found</h3>
              <p className="text-gray-500 mt-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first category'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add First Category
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3">
                          <Tag className="text-orange-600" size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {category.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.itemCount || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.order || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(category.id, !category.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          category.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category)
                            setShowAddModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit category"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingCategory(null)
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  )
}