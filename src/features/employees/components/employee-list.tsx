"use client"

import { useState, useEffect } from "react"
import { Search } from "@/components/ui/search"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRoleStore } from "@/store/use-role-store"
import { fetchApi } from "@/lib/api"

export function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")
  
  const { role: currentUserRole } = useRoleStore()
  const itemsPerPage = 5

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const res = await fetchApi(`/employees`, {}, currentUserRole)
      if (res.ok) {
        setEmployees(await res.json())
      }
      
      const depRes = await fetchApi('/departments', {}, currentUserRole)
      if (depRes.ok) {
        setDepartments(await depRes.json())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
    
    const intervalId = setInterval(async () => {
      try {
        const res = await fetchApi(`/employees`, {}, currentUserRole)
        if (res.ok) {
          setEmployees(await res.json())
        }
        const depRes = await fetchApi('/departments', {}, currentUserRole)
        if (depRes.ok) {
          setDepartments(await depRes.json())
        }
      } catch (e) {
        console.error("Polling error:", e)
      }
    }, 3000)
    
    return () => clearInterval(intervalId)
  }, [])

  const handleMockApprove = async (id: string, roleToAssign: string) => {
    try {
      const res = await fetchApi(`/employees/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ role: roleToAssign })
      }, currentUserRole)
      if (res.ok) {
        fetchEmployees()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string, roleOfTarget: string) => {
    if (currentUserRole !== 'admin' && currentUserRole !== 'SuperAdmin') return;
    if (roleOfTarget === 'SuperAdmin' && currentUserRole !== 'SuperAdmin') {
      alert("Only a SuperAdmin can remove another SuperAdmin.");
      return;
    }
    
    if (window.confirm("Are you sure you want to completely remove this employee? This action cannot be undone.")) {
      try {
        const res = await fetchApi(`/employees/${id}`, { method: 'DELETE' }, currentUserRole);
        if (res.ok) {
          fetchEmployees();
        } else {
          const data = await res.json();
          alert(data.error || "Failed to remove employee.");
        }
      } catch (e) {
        console.error("Delete error:", e);
      }
    }
  }

  const displayedEmployees = employees.filter((emp) => {
    const matchesSearch = emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = filterDepartment === "All" || emp.departmentId === filterDepartment
    const matchesTab = activeTab === "pending" ? emp.status === "Pending" : emp.status !== "Pending"
    
    return matchesSearch && matchesDepartment && matchesTab
  })

  const totalPages = Math.ceil(displayedEmployees.length / itemsPerPage)
  const currentEmployees = displayedEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const canApprove = currentUserRole === "admin" || currentUserRole === "project-manager"

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <p className="text-muted-foreground mt-1">Manage and view employee directory.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {canApprove && (
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Directory</TabsTrigger>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          </TabsList>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="w-full sm:max-w-sm">
            <Search 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select 
              value={filterDepartment} 
              onValueChange={(value) => {
                setFilterDepartment(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                {(activeTab === "pending" || currentUserRole === "admin" || currentUserRole === "SuperAdmin") && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={(activeTab === "pending" || currentUserRole === "admin" || currentUserRole === "SuperAdmin") ? 4 : 3} className="h-24 text-center">Loading...</TableCell>
                </TableRow>
              ) : currentEmployees.length > 0 ? (
                currentEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={emp.profileImage} alt={emp.firstName} />
                          <AvatarFallback>{emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{emp.firstName} {emp.lastName}</span>
                          <span className="text-xs text-muted-foreground">{emp.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{emp.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          emp.status === "Active" ? "default" :
                          emp.status === "Pending" ? "outline" :
                          "secondary"
                        }
                        className={
                          emp.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" :
                          emp.status === "Pending" ? "text-amber-500 border-amber-500/50" :
                          ""
                        }
                      >
                        {emp.status}
                      </Badge>
                    </TableCell>
                    {(activeTab === "pending" || currentUserRole === "admin" || currentUserRole === "SuperAdmin") && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {activeTab === "pending" && currentUserRole === "admin" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleMockApprove(emp.id, 'admin')}>Make Admin</Button>
                              <Button size="sm" variant="outline" onClick={() => handleMockApprove(emp.id, 'project-manager')}>Make PM</Button>
                            </>
                          )}
                          {activeTab === "pending" && (
                            <Button size="sm" onClick={() => handleMockApprove(emp.id, 'employee')}>Approve as Employee</Button>
                          )}
                          {(currentUserRole === "admin" || currentUserRole === "SuperAdmin") && (
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(emp.id, emp.role)}>Remove</Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={(activeTab === "pending" || currentUserRole === "admin" || currentUserRole === "SuperAdmin") ? 4 : 3} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Tabs>

      {totalPages > 1 && (
        <Pagination className="mt-4 justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1) }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === i + 1}
                  onClick={(e) => { e.preventDefault(); handlePageChange(i + 1) }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1) }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
