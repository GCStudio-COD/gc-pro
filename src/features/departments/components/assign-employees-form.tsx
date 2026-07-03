import { useState, useEffect } from "react"
import { useDepartmentStore, type Department } from "@/store/use-department-store"
import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"

export function AssignEmployeesForm({ department, onSuccess }: { department: Department, onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { role: currentUserRole } = useRoleStore()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch active employees
      const empRes = await fetchApi("/employees?status=Active", {}, currentUserRole)
      if (empRes.ok) {
        let empData = await empRes.json()
        
        // Filter out admin and SuperAdmin
        empData = empData.filter((e: any) => e.role !== 'admin' && e.role !== 'SuperAdmin')
        
        setEmployees(empData)
        
        // Find which employees are already in this department
        const currentlyAssigned = empData
          .filter((e: any) => e.departmentId === department.id)
          .map((e: any) => e.id)
        
        setSelectedEmployees(currentlyAssigned)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load employees")
    } finally {
      setLoading(false)
    }
  }

  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(e => e !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetchApi(`/departments/${department.id}/employees`, {
        method: 'PUT',
        body: JSON.stringify({ employeeIds: selectedEmployees })
      }, currentUserRole)
      if (res.ok) {
        toast.success("Employees assigned successfully")
        onSuccess()
      } else {
        toast.error("Failed to assign employees")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error saving assignments")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Assign Employees to {department.name}</DialogTitle>
        <DialogDescription>
          Select the active employees that belong to this department.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <ScrollArea className="h-64 rounded-md border p-4">
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
            ) : employees.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center p-4">No active employees available.</div>
            ) : (
              employees.map((employee) => {
                const isSelected = selectedEmployees.includes(employee.id)
                return (
                  <div 
                    key={employee.id} 
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${
                      isSelected ? "bg-primary/10 border-primary" : "bg-card border-border hover:bg-muted"
                    }`}
                    onClick={() => toggleEmployee(employee.id)}
                  >
                    <div>
                      <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                      <div className="text-xs text-muted-foreground">{employee.role}</div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
        <div className="mt-4 text-sm text-muted-foreground">
          {!loading && `${selectedEmployees.length} employee(s) selected`}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onSuccess}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSubmitting || loading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Assignments"
          )}
        </Button>
      </DialogFooter>
    </>
  )
}
