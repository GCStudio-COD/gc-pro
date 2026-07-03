"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { useRouter } from "next/navigation"

export function NewMeetingForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [type, setType] = useState("Internal")
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const { role } = useRoleStore()
  const router = useRouter()
  
  const effectiveRole = 'admin' // Only admins can create meetings

  useEffect(() => {
    fetchApi('/employees', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEmployees(data)
      })
      .catch(err => console.error("Failed to fetch employees", err))
  }, [effectiveRole])

  const toggleParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const startDateTime = new Date(`${date}T${startTime}`).toISOString()
      const endDateTime = new Date(`${date}T${endTime}`).toISOString()

      const res = await fetchApi('/meetings', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          startTime: startDateTime,
          endTime: endDateTime,
          type,
          participantsIds: selectedParticipants
        })
      }, effectiveRole)

      if (!res.ok) {
        throw new Error('Failed to create meeting')
      }

      router.push('/admin/meetings')
    } catch (err: any) {
      setError(err.message || "An error occurred")
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule Meeting</h1>
        <p className="text-muted-foreground mt-1">Create a new meeting or event.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
          <CardDescription>Enter the information for the new event.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g. Q3 Roadmap Planning" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Agenda and goals for the meeting..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" required value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Meeting Type</Label>
              <select 
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={type} 
                onChange={e => setType(e.target.value)}
              >
                <option value="Internal">Internal</option>
                <option value="Client">Client</option>
                <option value="Team">Team</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Select Participants</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                {employees.map(emp => (
                  <div key={emp.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`emp-${emp.id}`} 
                      checked={selectedParticipants.includes(emp.id)}
                      onChange={() => toggleParticipant(emp.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`emp-${emp.id}`} className="text-sm cursor-pointer">
                      {emp.firstName} {emp.lastName} <span className="text-muted-foreground">({emp.role})</span>
                    </label>
                  </div>
                ))}
                {employees.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">Loading employees...</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Scheduling..." : "Schedule Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
