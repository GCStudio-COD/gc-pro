"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { fetchApi } from "@/lib/api"
import { CheckSquare, Clock, CalendarDays, KanbanSquare, Play, Check } from "lucide-react"

export default function EmployeeTasksPage() {
  const { token } = useAuthStore()
  const [boards, setBoards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetchApi('/plaky/my-boards')
        if (res.ok) {
          const data = await res.json()
          setBoards(data)
        }
      } catch (err) {
        console.error("Failed to fetch my tasks", err)
      } finally {
        setIsLoading(false)
      }
    }
    if (token) fetchTasks()
  }, [token])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Review': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">My Assigned Tasks</h1>
          <p className="text-muted-foreground text-sm">View and manage all tasks assigned to you across all projects.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : boards.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Tasks Assigned</h3>
          <p className="text-muted-foreground">You currently have no tasks assigned to you. Enjoy your day!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {boards.map(board => (
            <div key={board.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
                <KanbanSquare className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{board.name}</h2>
                <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {board.tasks.length} {board.tasks.length === 1 ? 'Task' : 'Tasks'}
                </span>
              </div>
              
              <div className="divide-y divide-border">
                {board.tasks.map((task: any) => (
                  <div key={task.id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-base mb-1" style={{ 
                        textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                        color: task.status === 'Done' ? 'var(--muted-foreground)' : 'inherit'
                      }}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>Added {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-border sm:border-0 justify-between sm:justify-end">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
