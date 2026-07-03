"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useRoleStore } from "@/store/use-role-store"
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
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()
  const { role } = useRoleStore()
  
  const effectiveRole = pathname?.startsWith('/employee') ? 'employee' : role

  useEffect(() => {
    fetchData()
    
    const intervalId = setInterval(async () => {
      try {
        const res = await fetchApi("/projects", {}, effectiveRole)
        if (res.ok) {
          setProjects(await res.json())
        }
      } catch (e) {
        console.error("Polling error:", e)
      }
    }, 3000)
    
    return () => clearInterval(intervalId)
  }, [effectiveRole])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetchApi("/projects", {}, effectiveRole)
      if (res.ok) {
        setProjects(await res.json())
      } else {
        toast.error("Failed to fetch projects")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter((t: any) => t.status === "Done" || t.status === "Completed").length;
    return Math.round((completed / tasks.length) * 100);
  }

  const filteredProjects = projects.filter((prj) => {
    const matchesSearch = prj.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prj.id.toLowerCase().includes(searchTerm.toLowerCase())
                          
    const progress = calculateProgress(prj.tasks);
    let displayStatus = progress === 100 && prj.tasks?.length > 0 ? "Completed" : prj.status;
    
    // Set to Delayed if not completed and end date has passed (comparing just dates, ignore time)
    if (displayStatus !== "Completed" && prj.endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(prj.endDate);
      end.setHours(0, 0, 0, 0);
      if (end < today) {
        displayStatus = "Delayed";
      }
    }
    
    const matchesStatus = filterStatus === "All" || displayStatus === filterStatus
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track company projects.</p>
        </div>
        {effectiveRole !== 'employee' && (
          <Button asChild>
            <Link href="projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-md border">
        <div className="w-full sm:max-w-sm">
          <Search 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select 
            value={filterStatus} 
            onValueChange={setFilterStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-12">Progress</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((prj) => {
                const progress = calculateProgress(prj.tasks);
                let displayStatus = progress === 100 && prj.tasks?.length > 0 ? "Completed" : prj.status;
                if (displayStatus !== "Completed" && prj.endDate) {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const end = new Date(prj.endDate);
                  end.setHours(0, 0, 0, 0);
                  if (end < today) {
                    displayStatus = "Delayed";
                  }
                }
                const team = prj.employees || []
                
                return (
                  <TableRow 
                    key={prj.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`projects/${prj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`)}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{prj.name}</span>
                        <span className="text-xs text-muted-foreground">{prj.id.substring(0,8)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={displayStatus === "Completed" ? "default" : "outline"}
                        className={
                          displayStatus === "Completed"
                            ? "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white"
                            : displayStatus === "In Progress"
                              ? "text-orange-600 border-orange-500 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30"
                              : displayStatus === "Delayed"
                                ? "text-destructive border-destructive bg-destructive/10"
                                : ""
                        }
                      >
                        {displayStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[300px] pr-12">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Completion</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center -space-x-2">
                        {team.map((member: any, i: number) => (
                          <Avatar key={i} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.profileImage || ""} alt={member.firstName} />
                            <AvatarFallback className="text-xs">{member.firstName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {team.length > 3 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-muted text-[10px] font-medium z-10">
                            +{team.length - 3}
                          </div>
                        )}
                        {team.length === 0 && (
                          <span className="text-xs text-muted-foreground ml-2">Unassigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(prj.endDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
