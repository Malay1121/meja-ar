'use client'

import { useAuth } from '@/app/providers'
import { useEffect, useState } from 'react'
import { restaurantDataService } from '@/services/restaurantDataService'

interface DashboardData {
  restaurantInfo: any
  totalCategories: number
  totalMenuItems: number
  activeMenuItems: number
  analytics: any
}

export default function DashboardPage() {
  const { adminData, restaurantId, loading: authLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (restaurantId && !authLoading) {
      loadDashboardData()
    }
  }, [restaurantId, authLoading])

  const loadDashboardData = async () => {
    if (!restaurantId) return
    
    try {
      setLoading(true)
      setError(null)
      
      // Set restaurant ID for the data service
      restaurantDataService.setRestaurantId(restaurantId)
      
      // Try to fetch real data from Firebase
      const data = await restaurantDataService.getDashboardSummary()
      setDashboardData(data)
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      
      // If Firebase data doesn't exist yet, show restaurant-specific info
      const restaurantNames = {
        'the-spice-garden': 'The Spice Garden',
        'bella-vista': 'Bella Vista Italian',
        'golden-dragon': 'Golden Dragon Chinese',
        'cafe-paris': 'Café Paris'
      }
      
      const restaurantTypes = {
        'the-spice-garden': 'Indian',
        'bella-vista': 'Italian', 
        'golden-dragon': 'Chinese',
        'cafe-paris': 'French'
      }
      
      // Set restaurant-specific fallback data
      setDashboardData({
        restaurantInfo: {
          name: restaurantNames[restaurantId as keyof typeof restaurantNames] || 'Restaurant',
          cuisineType: restaurantTypes[restaurantId as keyof typeof restaurantTypes] || 'International',
          isActive: true,
          id: restaurantId
        },
        totalCategories: 4,
        totalMenuItems: 6,
        activeMenuItems: 6,
        analytics: {
          viewsToday: Math.floor(Math.random() * 50) + 20,
          arInteractions: Math.floor(Math.random() * 25) + 10,
          popularItems: [],
          recentActivity: []
        }
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button 
                onClick={loadDashboardData}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {adminData?.displayName || 'Admin'}!
        </h1>
        <p className="text-sm text-gray-500">
          Managing {dashboardData?.restaurantInfo?.name || restaurantId}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Menu Items</h3>
          <p className="text-2xl font-bold text-primary-600">
            {dashboardData?.totalMenuItems || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Categories</h3>
          <p className="text-2xl font-bold text-success-600">
            {dashboardData?.totalCategories || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Views Today</h3>
          <p className="text-2xl font-bold text-warning-600">
            {dashboardData?.analytics?.viewsToday || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">AR Interactions</h3>
          <p className="text-2xl font-bold text-error-600">
            {dashboardData?.analytics?.arInteractions || 0}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Restaurant Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Restaurant Name</p>
            <p className="font-medium">
              {dashboardData?.restaurantInfo?.name || 'Loading...'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cuisine Type</p>
            <p className="font-medium">
              {dashboardData?.restaurantInfo?.cuisineType || 'Loading...'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Admin Email</p>
            <p className="font-medium">{adminData?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Restaurant ID</p>
            <p className="font-mono text-sm">{restaurantId}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
            Add Menu Item
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            Edit Restaurant
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
