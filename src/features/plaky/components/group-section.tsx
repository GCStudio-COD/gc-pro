import { useState } from "react"
import { Board, BoardGroup, PlakyTask } from "@/schemas/plaky"
import { TaskRow } from "./task-row"
import { Button } from "@/components/ui/button"
import { Plus, PlusCircle, ChevronDown, ChevronRight, MoreHorizontal, Type, Heading, Link, Hash, Activity, Tag, Calendar, CalendarDays, Users, Crown, X } from "lucide-react"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface GroupSectionProps {
  board: Board
  group: BoardGroup
  onRefresh: () => void
  searchQuery: string
  sortOption: string
  filterStatus: string
}

export function GroupSection({ board, group, onRefresh, searchQuery, sortOption, filterStatus }: GroupSectionProps) {
  const { createTask, updateBoard } = usePlakyApi()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")

  const handleAddColumn = async (type: string, name: string) => {
    let currentCols = [];
    if (typeof board.columns === 'string') {
      try { currentCols = JSON.parse(board.columns) } catch(e) {}
    } else if (Array.isArray(board.columns)) {
      currentCols = board.columns
    }
    
    await updateBoard(board.id, {
      columns: [...currentCols, { id: Date.now().toString(), name, type }]
    })
    onRefresh()
  }

  const handleRemoveColumn = async (colId: string) => {
    if (!confirm("Are you sure you want to remove this column?")) return;
    
    let currentCols = [];
    if (typeof board.columns === 'string') {
      try { currentCols = JSON.parse(board.columns) } catch(e) {}
    } else if (Array.isArray(board.columns)) {
      currentCols = board.columns
    }
    
    const newCols = currentCols.filter((col: any) => col.id !== colId);
    
    await updateBoard(board.id, {
      columns: newCols
    })
    onRefresh()
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskName.trim()) return
    
    await createTask({
      groupId: group.id,
      name: newTaskName,
      status: "To Do",
      paymentStatus: "Pending",
      order: group.tasks?.length || 0
    })
    
    setNewTaskName("")
    setIsAddingTask(false)
    if (!isExpanded) setIsExpanded(true)
    onRefresh()
  }

  // Filter tasks based on search
  const tasks = group.tasks || []
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filterStatus && filterStatus !== "all" && task.status !== filterStatus) return false;

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const inName = task.name.toLowerCase().includes(q)
      const inContent = (task.content || "").toLowerCase().includes(q)
      const inAssignee = task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}`.toLowerCase().includes(q) : false
      const inCreative = (task.creativeType || "").toLowerCase().includes(q)
      
      let inCustom = false
      if (task.customFields) {
        inCustom = Object.values(task.customFields).some(val => String(val).toLowerCase().includes(q))
      }
      
      if (!inName && !inContent && !inAssignee && !inCreative && !inCustom) {
        return false
      }
    }
    return true
  }).sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name)
    if (sortOption === "name-desc") return b.name.localeCompare(a.name)
    if (sortOption === "date-asc") {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    if (sortOption === "date-desc") {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    }
    return (a.order || 0) - (b.order || 0)
  })

  // If searching and this group has no matches, and search is active, you might want to hide it.
  // But standard Plaky shows the group anyway if we want. We'll hide it if empty during search.
  if (searchQuery && filteredTasks.length === 0) {
    return null
  }

  let parsedColumns = [];
  if (typeof board.columns === 'string') {
    try { parsedColumns = JSON.parse(board.columns) } catch(e) {}
  } else if (Array.isArray(board.columns)) {
    parsedColumns = board.columns;
  }

  return (
    <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Group Header */}
      <div className="flex items-center px-4 py-3 bg-muted/40 border-b">
        <Button variant="ghost" size="icon" className="h-6 w-6 mr-2" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        <h3 className="font-semibold text-lg flex-1">{group.name}</h3>
        <span className="text-muted-foreground text-sm mr-4">{tasks.length} tasks</span>
      </div>

      {/* Table Content */}
      {isExpanded && (
        <div className="overflow-x-auto pb-2">
          <div className="min-w-max">
            {/* Table Header */}
            <div className="relative flex items-center px-4 py-2 bg-muted/20 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
          <div className="w-[300px] shrink-0 pl-8">Task Name</div>
          <div className="w-[120px] shrink-0 flex justify-center">Person</div>
          <div className="w-[100px] shrink-0 flex justify-center">Date</div>
          <div className="w-[150px] shrink-0 flex justify-center">Content</div>
          <div className="w-[120px] shrink-0 flex justify-center">Creative</div>
          <div className="w-[120px] shrink-0 flex justify-center">Status</div>
          
          {parsedColumns.map((col: any) => (
            <div key={col.id} className="w-[120px] shrink-0 flex items-center justify-center px-2 group/col relative">
              <span className="truncate pr-4">{col.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 absolute right-2 opacity-0 group-hover/col:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full"
                onClick={(e) => { e.stopPropagation(); handleRemoveColumn(col.id); }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {/* Spacer for dropdown */}
          <div className="w-[48px] shrink-0" />

          <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-12 border-l border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-muted/50">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#2e3142] text-slate-200 border-none shadow-xl p-1 rounded-xl">
                <DropdownMenuItem onSelect={() => handleAddColumn('Text', 'Text')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <Type className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Text</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddColumn('Rich Text', 'Rich Text')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <Heading className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Rich Text</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddColumn('Link', 'Link')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <Link className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddColumn('Numbers', 'Numbers')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <Hash className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Numbers</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddColumn('Status', 'Status')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <Activity className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Status</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddColumn('Tag', 'Tag')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <Tag className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Tag</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddColumn('Date', 'Date')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Date</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddColumn('Timeline', 'Timeline')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <CalendarDays className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Timeline</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddColumn('Person', 'Person')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-slate-200 transition-colors">
                  <Users className="h-4 w-4" />
                  <span className="flex-1 text-sm font-normal">Person</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      {/* Tasks List */}
            <div className="flex flex-col">
              {filteredTasks.map((task) => (
                <TaskRow 
                  key={task.id} 
                  board={board}
                  task={task} 
                  onRefresh={onRefresh} 
                />
              ))}
          
          {/* Add Task Row */}
          <div className="flex px-4 py-2 border-b hover:bg-muted/10 transition-colors items-center group cursor-pointer" onClick={() => !isAddingTask && setIsAddingTask(true)}>
            {isAddingTask ? (
              <div className="w-full pl-8 py-1">
                <form onSubmit={handleAddTask} className="flex items-center gap-2">
                  <Input 
                    autoFocus
                    className="h-8 max-w-sm"
                    value={newTaskName} 
                    onChange={(e) => setNewTaskName(e.target.value)} 
                    placeholder="New task name" 
                  />
                  <Button type="submit" size="sm" className="h-8">Add</Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8" onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingTask(false);
                  }}>Cancel</Button>
                </form>
              </div>
            ) : (
              <div className="w-full flex items-center">
                <div className="w-5 ml-2 border-l-[3px] border-transparent h-full absolute left-0" />
                <div className="flex items-center text-muted-foreground hover:text-foreground transition-colors py-1 pl-1">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="text-sm">Add Item</span>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      )}
    </div>
  )
}
