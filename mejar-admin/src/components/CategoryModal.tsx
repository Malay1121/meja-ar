'use client'

import { useState, useEffect } from 'react'
import { X, Tag, Hash, AlignLeft } from 'lucide-react'
import { Category } from '@/services/restaurantDataService'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (category: Partial<Category>) => Promise<void>
  category?: Category | null
}

export function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
    isActive: true
  })
  const [loading, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with category data when editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        order: category.order || 0,
        isActive: category.isActive !== false
      })
    } else {
      // Reset form for new category
      setFormData({
        name: '',
        description: '',
        order: 0,
        isActive: true
      })
    }
    setErrors({})
  }, [category, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.order < 0) {
      newErrors.order = 'Order must be 0 or greater'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      // Clean form data to ensure no undefined values
      const cleanFormData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        order: formData.order || 0,
        isActive: Boolean(formData.isActive)
      };

      const categoryData: Partial<Category> = {
        ...cleanFormData,
        ...(category && { id: category.id })
      }
      
      console.log('Submitting category data:', categoryData);
      
      await onSave(categoryData)
      onClose()
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-gray-600 mt-1">
              {category ? 'Update the details of your category' : 'Create a new category to organize your menu'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Tag size={20} />
                Basic Information
              </h3>

              {/* Category Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Main Course, Appetizers, Beverages"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 text-gray-400" size={16} />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of what items belong to this category..."
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Order and Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.order ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                  </div>
                  {errors.order && (
                    <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Lower numbers appear first in menus
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Active (visible to customers)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Preview</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Tag className={`${formData.isActive ? 'text-green-600' : 'text-gray-400'}`} size={16} />
                    </div>
                    <div>
                      <h5 className={`font-medium ${formData.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {formData.name || 'Category Name'}
                      </h5>
                      <p className={`text-sm ${formData.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                        {formData.description || 'Category description will appear here...'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Order: {formData.order}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  {category ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}