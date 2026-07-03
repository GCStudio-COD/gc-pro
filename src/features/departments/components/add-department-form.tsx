"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { departmentSchema, DepartmentFormValues } from "@/schemas/department"
import { useDepartmentStore, type Department } from "@/store/use-department-store"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function DepartmentForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: Department }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState<{ id: string, name: string }[]>([])
  
  const { addDepartment, updateDepartment } = useDepartmentStore()
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/employees', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const validEmployees = data
            .filter((emp: any) => emp.role !== 'admin' && emp.role !== 'SuperAdmin')
            .map((emp: any) => ({
              id: emp.id,
              name: `${emp.firstName} ${emp.lastName}`
            }))
          setEmployees(validEmployees)
        }
      })
      .catch(console.error)
  }, [effectiveRole])

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      head: initialData?.head || "",
      employees: initialData?.employees || 0,
      status: initialData?.status || "Healthy",
    },
  })

  async function onSubmit(data: DepartmentFormValues) {
    setIsSubmitting(true)
    
    try {
      const payload = {
        name: data.name,
        headId: data.head, // the Select value will now store the employee ID
        status: "Healthy"
      }
      
      let res;
      if (initialData) {
        res = await fetchApi(`/departments/${initialData.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        }, effectiveRole)
      } else {
        res = await fetchApi('/departments', {
          method: 'POST',
          body: JSON.stringify(payload)
        }, effectiveRole)
      }

      if (res.ok) {
        toast.success(initialData ? "Department updated successfully" : "Department created successfully")
        if (onSuccess) onSuccess()
      } else {
        toast.error("Failed to save department")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Department" : "Add New Department"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Make changes to the department details." : "Create a new department and assign its head."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
               <FormItem>
                 <FormLabel>Department Name</FormLabel>
                 <FormControl>
                   <Input placeholder="e.g. Engineering" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="head"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Head</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department head" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />


          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Saving..." : "Creating..."}
                </>
              ) : (
                initialData ? "Save Changes" : "Create Department"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
