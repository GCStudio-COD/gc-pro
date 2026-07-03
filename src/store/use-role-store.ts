import { create } from 'zustand'

type Role = 'admin' | 'project-manager' | 'employee'

interface RoleStore {
  role: Role
  setRole: (role: Role) => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: 'admin', // Default role for mock testing
  setRole: (role) => set({ role }),
}))
