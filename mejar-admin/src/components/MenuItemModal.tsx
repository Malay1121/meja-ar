'use client'

import { useState, useEffect } from 'react'
import { X, Upload, IndianRupee, Tag, Clock, Utensils } from 'lucide-react'
import { MenuItem, Category } from '@/services/restaurantDataService'

interface MenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Partial<MenuItem>) => Promise<void>
  item?: MenuItem | null
  categories: Category[]
}

export function MenuItemModal({ isOpen, onClose, onSave, item, categories }: MenuItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    imageUrl: '',
    isVegetarian: false,
    isSpicy: false,
    isActive: true,
    preparationTime: 15,
    ingredients: [] as string[],
    allergens: [] as string[],
    arModel: {
      enabled: false,
      modelUrl: ''
    }
  })
  const [loading, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ingredientInput, setIngredientInput] = useState('')
  const [allergenInput, setAllergenInput] = useState('')

  // Initialize form with item data when editing
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        categoryId: item.categoryId || '',
        imageUrl: item.imageUrl || '',
        isVegetarian: item.isVegetarian || false,
        isSpicy: item.isSpicy || false,
        isActive: item.isActive !== false,
        preparationTime: item.preparationTime || 15,
        ingredients: item.ingredients || [],
        allergens: item.allergens || [],
        arModel: {
          enabled: item.arModel?.enabled || false,
          modelUrl: item.arModel?.modelUrl || ''
        }
      })
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: categories[0]?.id || '',
        imageUrl: '',
        isVegetarian: false,
        isSpicy: false,
        isActive: true,
        preparationTime: 15,
        ingredients: [],
        allergens: [],
        arModel: { enabled: false, modelUrl: '' }
      })
    }
    setErrors({})
  }, [item, categories, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }
    if (formData.preparationTime < 1) {
      newErrors.preparationTime = 'Preparation time must be at least 1 minute'
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
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        categoryId: formData.categoryId || '',
        imageUrl: formData.imageUrl || '',
        isVegetarian: Boolean(formData.isVegetarian),
        isSpicy: Boolean(formData.isSpicy),
        isActive: Boolean(formData.isActive),
        preparationTime: formData.preparationTime || 15,
        ingredients: formData.ingredients || [],
        allergens: formData.allergens || [],
        arModel: formData.arModel || { enabled: false, modelUrl: '' }
      };

      const itemData: Partial<MenuItem> = {
        ...cleanFormData,
        ...(item && { id: item.id })
      }
      
      console.log('Submitting menu item data:', itemData);
      
      await onSave(itemData)
      onClose()
    } catch (error) {
      console.error('Error saving menu item:', error)
    } finally {
      setSaving(false)
    }
  }

  const addIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients.includes(ingredientInput.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }))
      setIngredientInput('')
    }
  }

  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i !== ingredient)
    }))
  }

  const addAllergen = () => {
    if (allergenInput.trim() && !formData.allergens.includes(allergenInput.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, allergenInput.trim()]
      }))
      setAllergenInput('')
    }
  }

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <p className="text-gray-600 mt-1">
              {item ? 'Update the details of your menu item' : 'Create a new dish for your menu'}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Utensils size={20} />
                  Basic Information
                </h3>

                {/* Item Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Chicken Butter Masala"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your dish, ingredients, and what makes it special..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Price and Category Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price * (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        className={`w-full pl-9 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.categoryId ? 'border-red-300' : 'border-gray-300'
                        } appearance-none bg-white`}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                    )}
                  </div>
                </div>

                {/* Preparation Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Time (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      min="1"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 15 }))}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.preparationTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="15"
                    />
                  </div>
                  {errors.preparationTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.preparationTime}</p>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Ingredients</h4>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Add an ingredient and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map(ingredient => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Upload size={20} />
                  Image
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Properties */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Properties</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isSpicy}
                      onChange={(e) => setFormData(prev => ({ ...prev, isSpicy: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Spicy</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.arModel.enabled}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        arModel: { ...prev.arModel, enabled: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">AR Model Available</span>
                  </label>
                </div>

                {formData.arModel.enabled && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AR Model URL
                    </label>
                    <input
                      type="url"
                      value={formData.arModel.modelUrl}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        arModel: { ...prev.arModel, modelUrl: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="https://example.com/model.glb"
                    />
                  </div>
                )}
              </div>

              {/* Allergens */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Allergens</h4>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Add an allergen and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addAllergen}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.allergens.map(allergen => (
                    <span
                      key={allergen}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                    >
                      {allergen}
                      <button
                        type="button"
                        onClick={() => removeAllergen(allergen)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
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
                  {item ? 'Update Item' : 'Create Item'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}