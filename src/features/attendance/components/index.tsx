"use client"

import { useState } from "react"
import { DateRange } from "react-day-picker"
import { AttendanceSummary } from "./attendance-summary"
import { AttendanceCalendar } from "./attendance-calendar"
import { AttendanceTable } from "./attendance-table"
import { EmployeeAttendanceStats } from "./employee-attendance-stats"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { fetchApi } from "@/lib/api"

export function AttendanceFeature() {
  const { role } = useRoleStore()
  const pathname = usePathname()
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  })
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [employees, setEmployees] = useState<any[]>([])
  
  const effectiveRole = pathname?.startsWith('/employee') ? 'employee' : role

  useEffect(() => {
    if (effectiveRole !== 'employee') {
      fetchApi('/employees', {}, effectiveRole)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setEmployees(data)
          }
        })
        .catch(console.error)
    }
  }, [effectiveRole])

  return (
    <div className="flex flex-col p-4 md:p-8 w-full max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground mt-1">Monitor daily staff attendance and history.</p>
      </div>

      {effectiveRole !== 'employee' && <AttendanceSummary />}
      
      <div className="flex flex-col lg:flex-row gap-6 items-start h-full">
        <div className="w-full lg:w-auto flex-shrink-0 sticky top-4">
          <AttendanceCalendar date={date} setDate={setDate} />
        </div>
        <div className="w-full flex-1 flex flex-col gap-6">
          {effectiveRole === 'employee' ? (
            <EmployeeAttendanceStats selectedDateRange={date} setSelectedDateRange={setDate} />
          ) : (
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                <div>
                  <h3 className="font-semibold text-lg">Employee View</h3>
                  <p className="text-sm text-muted-foreground">Select an employee to view their specific attendance statistics.</p>
                </div>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees (Total)</SelectItem>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <EmployeeAttendanceStats selectedDateRange={date} setSelectedDateRange={setDate} selectedEmployee={selectedEmployee} />
              <AttendanceTable />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
