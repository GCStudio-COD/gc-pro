import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, UserCheck, UserX } from "lucide-react"
import { DateRange } from "react-day-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subDays, startOfDay, format } from "date-fns"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { fetchApi } from "@/lib/api"

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController
)

interface EmployeeAttendanceStatsProps {
  selectedDateRange: DateRange | undefined
  setSelectedDateRange: (range: DateRange | undefined) => void
  selectedEmployee?: string
}

export function EmployeeAttendanceStats({ selectedDateRange, setSelectedDateRange, selectedEmployee = "all" }: EmployeeAttendanceStatsProps) {
  const [timeframe, setTimeframe] = useState("Daily")
  const [interpolation, setInterpolation] = useState<"monotone" | "default" | "linear" | "stepped">("monotone")
  const [realDailySeconds, setRealDailySeconds] = useState<number>(0)
  const [realPresent, setRealPresent] = useState<number>(0)
  const [realAbsent, setRealAbsent] = useState<number>(0)

  useEffect(() => {
    const effectiveRole = typeof window !== 'undefined' && window.location.pathname.startsWith('/employee') ? 'employee' : 'admin'
    
    if (effectiveRole === 'employee') {
      fetchApi('/attendance/status', {}, effectiveRole)
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.accumulatedShiftSeconds === 'number') {
            setRealDailySeconds(data.accumulatedShiftSeconds)
            setRealPresent(1)
            setRealAbsent(0)
          }
        })
        .catch(console.error)
    } else {
      // Admin/PM: Fetch all attendance and filter by selectedEmployee
      fetchApi('/attendance', {}, effectiveRole)
        .then(res => res.json())
        .then(logs => {
          if (!Array.isArray(logs)) return;
          
          let totalSeconds = 0;
          let presentCount = 0;
          
          // Filter logs for today
          const todayStr = new Date().toDateString();
          const todayLogs = logs.filter(log => new Date(log.date).toDateString() === todayStr);
          
          let employeesWithLogs = new Set();
          
          for (const log of todayLogs) {
            if (selectedEmployee !== "all" && log.employeeId !== selectedEmployee) continue;
            
            totalSeconds += (log.durationSeconds || 0);
            employeesWithLogs.add(log.employeeId);
          }
          
          presentCount = employeesWithLogs.size;
          
          // Calculate average if "all" is selected
          if (selectedEmployee === "all" && presentCount > 0) {
            totalSeconds = Math.floor(totalSeconds / presentCount);
          }
          
          setRealDailySeconds(totalSeconds);
          setRealPresent(presentCount);
          setRealAbsent(0); // We would need total employee count to calculate absent properly
        })
        .catch(console.error)
    }
  }, [selectedEmployee])

  // Update date range when timeframe changes
  useEffect(() => {
    const today = new Date()
    if (timeframe === "Daily") {
      setSelectedDateRange({ from: startOfDay(today), to: startOfDay(today) })
    } else if (timeframe === "Weekly") {
      setSelectedDateRange({ from: startOfDay(subDays(today, 7)), to: startOfDay(today) })
    } else if (timeframe === "Monthly") {
      setSelectedDateRange({ from: startOfDay(subDays(today, 30)), to: startOfDay(today) })
    }
  }, [timeframe, setSelectedDateRange])

  // Mock data calculation based on timeframe
  let totalTime = "40h 30m"
  let present = "5"
  let absent = "0"

  const formatSeconds = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  }

  if (timeframe === "Daily") {
    totalTime = formatSeconds(realDailySeconds)
    present = realPresent.toString()
    absent = realAbsent.toString()
  } else if (timeframe === "Weekly") {
    totalTime = selectedEmployee === "alice" ? "45h 30m" : selectedEmployee === "bob" ? "33h 00m" : "40h 00m"
    present = selectedEmployee === "bob" ? "4" : "5"
    absent = selectedEmployee === "bob" ? "1" : "0"
  } else if (timeframe === "Monthly") {
    totalTime = selectedEmployee === "alice" ? "185h 45m" : selectedEmployee === "bob" ? "142h 15m" : "160h 00m"
    present = selectedEmployee === "alice" ? "22" : selectedEmployee === "bob" ? "18" : "20"
    absent = selectedEmployee === "alice" ? "0" : selectedEmployee === "bob" ? "4" : "2"
  }

  // Determine header text format based on date range
  let dateString = "No date selected"
  if (selectedDateRange?.from) {
    if (!selectedDateRange.to || selectedDateRange.from.getTime() === selectedDateRange.to.getTime()) {
      dateString = `Viewing data for: ${format(selectedDateRange.from, "dd/MM/yy")}`
    } else {
      dateString = `Viewing data from: ${format(selectedDateRange.from, "dd/MM/yy")} to: ${format(selectedDateRange.to, "dd/MM/yy")}`
    }
  }

  // Mock chart data for double line chart (Expected vs Actual Hours)
  const labels = timeframe === "Daily" ? ["Today"] : timeframe === "Weekly" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Week 1", "Week 2", "Week 3", "Week 4"]
  
  const dataset1Values = timeframe === "Daily" ? [8] : timeframe === "Weekly" ? [8, 8, 8, 8, 8, 0, 0] : [40, 40, 40, 40]
  
  // Base values
  let baseActual = timeframe === "Daily" ? [8.25] : timeframe === "Weekly" ? [8.5, 7.5, 8, 4, 8.5, 0, 0] : [42, 38, 40, 44]
  
  // Modify values based on selected employee to simulate real data changes
  if (selectedEmployee === "alice") {
    baseActual = baseActual.map(v => v > 0 ? v + 1 : 0) // Alice overworks
  } else if (selectedEmployee === "bob") {
    baseActual = baseActual.map(v => v > 0 ? Math.max(0, v - 1.5) : 0) // Bob underworks
  } else if (selectedEmployee === "charlie") {
    baseActual = baseActual.map(v => v > 0 ? 8 : 0) // Charlie is perfectly on time
  }

  const dataset2Values = baseActual

  const data = {
    labels: labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Expected Hours',
        data: dataset1Values,
        borderColor: '#ff6384', // pink/red line
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 3,
        cubicInterpolationMode: interpolation === "monotone" || interpolation === "default" ? interpolation : undefined,
        tension: interpolation === "linear" || interpolation === "stepped" ? 0 : 0.4,
        stepped: interpolation === "stepped",
        pointBackgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointBorderColor: '#ff6384',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        type: 'line' as const,
        label: 'Actual Hours',
        data: dataset2Values,
        borderColor: '#36a2eb', // blue line
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 3,
        cubicInterpolationMode: interpolation === "monotone" || interpolation === "default" ? interpolation : undefined,
        tension: interpolation === "linear" || interpolation === "stepped" ? 0 : 0.4,
        stepped: interpolation === "stepped",
        pointBackgroundColor: 'rgba(54, 162, 235, 0.5)',
        pointBorderColor: '#36a2eb',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(var(--border))',
          drawBorder: false,
        },
      },
      y: {
        grid: {
          color: 'hsl(var(--border))',
          drawBorder: false,
        },
      },
    },
  }

  return (
    <Card className="flex-1 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Attendance Statistics</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{dateString}</p>
        </div>
        <div className="w-32">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20 flex flex-col justify-center items-center p-6 text-center">
            <Clock className="h-8 w-8 text-primary mb-4" />
            <div className="text-3xl font-bold text-primary">{totalTime}</div>
            <p className="text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">Total Time Logged</p>
          </Card>
          
          <Card className="bg-emerald-500/5 border-emerald-500/20 flex flex-col justify-center items-center p-6 text-center">
            <UserCheck className="h-8 w-8 text-emerald-500 mb-4" />
            <div className="text-3xl font-bold text-emerald-500">{present}</div>
            <p className="text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">Days Present</p>
          </Card>
          
          <Card className="bg-destructive/5 border-destructive/20 flex flex-col justify-center items-center p-6 text-center">
            <UserX className="h-8 w-8 text-destructive mb-4" />
            <div className="text-3xl font-bold text-destructive">{absent}</div>
            <p className="text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">Days Absent</p>
          </Card>
        </div>

        <div className="flex-1 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hours Logged ({timeframe})</h3>
            
            {/* Interpolation Mode Selector for the Line Chart */}
            <div className="w-40">
              <Select value={interpolation} onValueChange={(val: any) => setInterpolation(val)}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Interpolation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monotone">Monotone (Smooth)</SelectItem>
                  <SelectItem value="default">Default (Smooth)</SelectItem>
                  <SelectItem value="linear">Linear (Straight)</SelectItem>
                  <SelectItem value="stepped">Stepped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full flex-1 relative" style={{ minHeight: '300px' }}>
            <Line options={options} data={data} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
