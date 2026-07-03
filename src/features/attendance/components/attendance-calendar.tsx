"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DateRange } from "react-day-picker"

interface AttendanceCalendarProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}

export function AttendanceCalendar({ date, setDate }: AttendanceCalendarProps) {
  return (
    <Card className="h-full flex flex-col items-center">
      <CardHeader className="w-full">
        <CardTitle>Select Date</CardTitle>
        <CardDescription>View attendance records by day.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow"
        />
      </CardContent>
    </Card>
  )
}
