'use client'

import { useAuth } from '@/app/providers'
import { authService } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { adminData, restaurantId } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error: any) {
      toast.error('Error signing out')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { name: 'Menu Items', href: '/dashboard/menu-items', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Categories', href: '/dashboard/categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2' },
    { name: 'Orders', href: '/dashboard/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M8 11v2a4 4 0 008 0v-2m-8 0h8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v2' },
    { name: 'Restaurant Profile', href: '/dashboard/profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">MejaAR Admin</span>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="px-4 mb-6">
            <div className="bg-primary-50 rounded-lg p-3">
              <p className="text-xs font-medium text-primary-600 uppercase tracking-wide">Managing</p>
              <p className="text-sm font-semibold text-primary-900 truncate">{restaurantId}</p>
              <p className="text-xs text-primary-700">{adminData?.role} access</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="sidebar-link group"
              >
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </a>
            ))}
          </nav>

          {/* User Info & Sign Out */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {adminData?.displayName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{adminData?.displayName}</p>
                <p className="text-xs text-gray-500 truncate">{adminData?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${open ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">MejaAR</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Restaurant Info */}
              <div className="mb-6">
                <div className="bg-primary-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-primary-600 uppercase tracking-wide">Managing</p>
                  <p className="text-sm font-semibold text-primary-900">{restaurantId}</p>
                  <p className="text-xs text-primary-700">{adminData?.role} access</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className="sidebar-link group"
                  >
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Mobile User Info */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {adminData?.displayName?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{adminData?.displayName}</p>
                  <p className="text-xs text-gray-500">{adminData?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-3 w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}