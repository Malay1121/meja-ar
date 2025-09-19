'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { authService, RestaurantAdmin } from '@/lib/auth'
import { Toaster } from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  adminData: RestaurantAdmin | null
  restaurantId: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  adminData: null,
  restaurantId: null,
  loading: true 
})

export const useAuth = () => useContext(AuthContext)

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminData, setAdminData] = useState<RestaurantAdmin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Get admin data by Firebase UID
        const adminInfo = await authService.getAdminDataByUID(user.uid)
        setAdminData(adminInfo)
      } else {
        setAdminData(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const contextValue: AuthContextType = {
    user,
    adminData,
    restaurantId: adminData?.restaurantId || null,
    loading
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </AuthContext.Provider>
  )
}