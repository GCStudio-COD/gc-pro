"use client"

import { useState, useEffect } from "react"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DepartmentForm } from "./add-department-form"
import { AssignEmployeesForm } from "./assign-employees-form"
import { Card, CardContent } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export function DepartmentList() {
  const [departments, setDepartments] = useState<any[]>([])
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  const [editingDepartment, setEditingDepartment] = useState<any | null>(null)
  const [assigningDepartment, setAssigningDepartment] = useState<any | null>(null)

  const fetchDepartments = async () => {
    try {
      const res = await fetchApi('/departments', {}, effectiveRole)
      if (res.ok) {
        const data = await res.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [effectiveRole])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetchApi(`/departments/${id}`, { method: 'DELETE' }, effectiveRole)
      if (res.ok) {
        toast.success("Department deleted successfully")
        fetchDepartments()
      } else {
        toast.error("Failed to delete department")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    }
  }

  const handleSuccess = () => {
    setEditingDepartment(null)
    setAssigningDepartment(null)
    fetchDepartments()
  }

  if (departments.length === 0) {
    return (
      <Card className="mt-6 border-dashed bg-transparent">
        <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <p>No departments found.</p>
          <p className="text-sm">Click "Add Department" to create one.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="rounded-md border bg-card text-card-foreground mt-6 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department Name</TableHead>
            <TableHead>Head</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell className="font-medium">{dept.name}</TableCell>
              <TableCell>{dept.head ? `${dept.head.firstName} ${dept.head.lastName}` : "Unassigned"}</TableCell>
              <TableCell>{dept.employees?.length || 0}</TableCell>
              <TableCell>
                <Badge variant={dept.status === "Healthy" ? "default" : dept.status === "Warning" ? "secondary" : "destructive"}>
                  {dept.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setAssigningDepartment(dept)}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Assign Employees</span>
                    </DropdownMenuItem>
                    
                    {role === "admin" && (
                      <>
                        <DropdownMenuItem onClick={() => setEditingDepartment(dept)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={!!editingDepartment} onOpenChange={(open) => !open && setEditingDepartment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {editingDepartment && (
            <DepartmentForm 
              initialData={{ ...editingDepartment, head: editingDepartment.headId }} 
              onSuccess={handleSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!assigningDepartment} onOpenChange={(open) => !open && setAssigningDepartment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {assigningDepartment && (
            <AssignEmployeesForm 
              department={assigningDepartment} 
              onSuccess={handleSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
