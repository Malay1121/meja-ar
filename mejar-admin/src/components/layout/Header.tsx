'use client'

import { useAuth } from '@/app/providers'
import { OrderNotification } from '@/components/OrderNotification'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { adminData, restaurantId } = useAuth()

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 shadow-sm">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>

      {/* Header content */}
      <div className="flex-1 px-4 flex justify-between items-center sm:px-6 lg:px-8">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900 lg:hidden">
            MejaAR Admin
          </h1>
        </div>

        {/* Right side */}
        <div className="ml-4 flex items-center space-x-4">
          {/* Restaurant status indicator */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 hidden md:inline">
              Connected to {restaurantId}
            </span>
          </div>

          {/* Quick actions */}
          <div className="flex items-center space-x-2">
            <OrderNotification />
          </div>

          {/* Profile picture */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
              <span className="text-sm font-medium text-primary-600">
                {adminData?.displayName?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}