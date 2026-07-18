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
  const [chartData, setChartData] = useState<{labels: string[], expected: number[], actual: number[]}>({
    labels: [],
    expected: [],
    actual: []
  })

  useEffect(() => {
    const effectiveRole = typeof window !== 'undefined' && window.location.pathname.startsWith('/employee') ? 'employee' : 'admin'
    
    fetchApi('/attendance', {}, effectiveRole)
      .then(res => res.json())
      .then(logs => {
        if (!Array.isArray(logs)) return;
        
        let totalSeconds = 0;
        let distinctPresences = new Set();
        
        let filteredLogs = logs;
        
        // Filter by selectedDateRange
        if (selectedDateRange?.from) {
          const fromTime = startOfDay(selectedDateRange.from).getTime();
          const toTime = selectedDateRange.to 
            ? startOfDay(selectedDateRange.to).getTime() + 86400000 - 1 // end of day
            : fromTime + 86400000 - 1;
            
          filteredLogs = logs.filter(log => {
            const logTime = new Date(log.date || log.checkInTime).getTime();
            return logTime >= fromTime && logTime <= toTime;
          });
        }
        
        let uniqueEmployees = new Set();
        
        for (const log of filteredLogs) {
          if (selectedEmployee !== "all" && log.employeeId !== selectedEmployee) continue;
          
          let duration = log.durationSeconds || 0;
          // Include time for active shifts
          if (!log.checkOutTime && log.checkInTime) {
            const now = new Date().getTime();
            const checkIn = new Date(log.checkInTime).getTime();
            if (now > checkIn) {
              duration += Math.floor((now - checkIn) / 1000);
            }
          }
          
          totalSeconds += duration;
          
          const dayStr = new Date(log.date || log.checkInTime).toDateString();
          distinctPresences.add(`${log.employeeId}-${dayStr}`);
          uniqueEmployees.add(log.employeeId);
        }
        
        setRealDailySeconds(totalSeconds);
        setRealPresent(distinctPresences.size);
        setRealAbsent(0); // Absent requires knowing expected work days, keeping it 0 for now
        
        // Calculate chart data
        const numEmployees = selectedEmployee === "all" ? Math.max(1, uniqueEmployees.size) : 1;
        
        const labels: string[] = [];
        const expected: number[] = [];
        const actual: number[] = [];
        const actualHoursByDate: Record<string, number> = {};
        
        for (const log of filteredLogs) {
          if (selectedEmployee !== "all" && log.employeeId !== selectedEmployee) continue;
          let duration = log.durationSeconds || 0;
          if (!log.checkOutTime && log.checkInTime) {
            const now = new Date().getTime();
            const checkIn = new Date(log.checkInTime).getTime();
            if (now > checkIn) {
              duration += Math.floor((now - checkIn) / 1000);
            }
          }
          const dayStr = new Date(log.date || log.checkInTime).toDateString();
          if (!actualHoursByDate[dayStr]) actualHoursByDate[dayStr] = 0;
          actualHoursByDate[dayStr] += (duration / 3600);
        }
        
        if (selectedDateRange?.from) {
          const fromTime = startOfDay(selectedDateRange.from).getTime();
          const toTime = selectedDateRange.to 
            ? startOfDay(selectedDateRange.to).getTime() + 86400000 - 1
            : fromTime + 86400000 - 1;
            
          let currentDayTime = fromTime;
          while (currentDayTime <= toTime) {
            const currentDay = new Date(currentDayTime);
            const dayStr = currentDay.toDateString();
            
            labels.push(format(currentDay, "MMM d"));
            
            const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
            expected.push(isWeekend ? 0 : 8 * numEmployees);
            actual.push(actualHoursByDate[dayStr] || 0);
            
            currentDayTime += 86400000;
          }
        }
        
        setChartData({ labels, expected, actual });
      })
      .catch(console.error)
  }, [selectedEmployee, selectedDateRange])

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

  const formatSeconds = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  }

  const totalTime = formatSeconds(realDailySeconds)
  const present = realPresent.toString()
  const absent = realAbsent.toString()

  // Determine header text format based on date range
  let dateString = "No date selected"
  if (selectedDateRange?.from) {
    if (!selectedDateRange.to || selectedDateRange.from.getTime() === selectedDateRange.to.getTime()) {
      dateString = `Viewing data for: ${format(selectedDateRange.from, "MMM d, yyyy")}`
    } else {
      dateString = `Viewing data from: ${format(selectedDateRange.from, "MMM d, yyyy")} to: ${format(selectedDateRange.to, "MMM d, yyyy")}`
    }
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Expected Hours',
        data: chartData.expected,
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
        data: chartData.actual,
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
