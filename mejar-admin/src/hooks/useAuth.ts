import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>({
    id: 'demo-user',
    email: 'demo@spicegarden.com',
    name: 'Demo User'
  })
  const [loading, setLoading] = useState(false)

  // For now, return a mock user. In production, this would handle Firebase Auth
  return {
    user,
    loading,
    signIn: (email: string, password: string) => Promise.resolve(),
    signOut: () => Promise.resolve(),
    signUp: (email: string, password: string) => Promise.resolve()
  }
}