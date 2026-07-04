import { create } from 'zustand'

export type Role = 'admin' | 'project-manager' | 'employee' | 'Pending' | 'SuperAdmin'

interface AuthStore {
  token: string | null
  role: Role | null
  userId: string | null
  setAuth: (token: string, role: Role, userId: string) => void
  logout: () => void
}

// Helper to safely get from localStorage during initialization
const getStoredAuth = () => {
  if (typeof window === 'undefined') return { token: null, role: null, userId: null }
  try {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role') as Role | null
    const userId = localStorage.getItem('userId')
    return { token, role, userId }
  } catch {
    return { token: null, role: null, userId: null }
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...getStoredAuth(),
  setAuth: (token, role, userId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('userId', userId)
    }
    set({ token, role, userId })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
    }
    set({ token: null, role: null, userId: null })
  },
}))
