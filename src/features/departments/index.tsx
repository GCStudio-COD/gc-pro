"use client"

import { useState } from "react"
import { Building, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DepartmentList } from "./components/department-list"
import { DepartmentForm } from "./components/add-department-form"
import { useRoleStore } from "@/store/use-role-store"

export function DepartmentsFeature() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { role } = useRoleStore()

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Departments
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your company departments, budget, and statuses.
          </p>
        </div>

        {role === "admin" && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DepartmentForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DepartmentList />
    </div>
  )
}
