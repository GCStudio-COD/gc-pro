import { create } from 'zustand'

export type DepartmentStatus = "Healthy" | "Warning" | "Critical"

export interface Department {
  id: string
  name: string
  head: string
  employees: number
  employeeList: string[]
  status: DepartmentStatus
}

interface DepartmentState {
  departments: Department[]
  addDepartment: (department: Omit<Department, 'id' | 'employeeList' | 'employees'>) => void
  updateDepartment: (id: string, department: Partial<Department>) => void
  deleteDepartment: (id: string) => void
  assignEmployees: (id: string, employees: string[]) => void
}

const initialDepartments: Department[] = [
  { id: "dept-1", name: "Engineering", head: "Alice Johnson", employees: 3, employeeList: ["Alice Smith", "Bob Johnson", "Charlie Brown"], status: "Healthy" },
  { id: "dept-2", name: "Product", head: "Bob Smith", employees: 2, employeeList: ["Diana Prince", "Evan Wright"], status: "Healthy" },
  { id: "dept-3", name: "Marketing", head: "Charlie Davis", employees: 2, employeeList: ["Fiona Gallagher", "George Miller"], status: "Warning" },
  { id: "dept-4", name: "Sales", head: "Diana Prince", employees: 1, employeeList: ["Hannah Abbott"], status: "Healthy" },
]

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: initialDepartments,
  addDepartment: (department) => set((state) => ({
    departments: [...state.departments, { ...department, id: `dept-${Date.now()}`, employees: 0, employeeList: [] }]
  })),
  updateDepartment: (id, updatedFields) => set((state) => ({
    departments: state.departments.map(dept => 
      dept.id === id ? { ...dept, ...updatedFields } : dept
    )
  })),
  deleteDepartment: (id) => set((state) => ({
    departments: state.departments.filter(dept => dept.id !== id)
  })),
  assignEmployees: (id, employees) => set((state) => ({
    departments: state.departments.map(dept => 
      dept.id === id ? { ...dept, employeeList: employees, employees: employees.length } : dept
    )
  }))
}))
