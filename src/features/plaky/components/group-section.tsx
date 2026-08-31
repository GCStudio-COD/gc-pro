import { useState } from "react"
import { Board, BoardGroup, PlakyTask } from "@/schemas/plaky"
import { TaskRow, GROUP_THEMES, statusStyles, GroupTheme } from "./task-row"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronRight, Type, Heading, Link as LinkIcon, Hash, Activity, Tag, Calendar, CalendarDays, Users, X, MoreHorizontal, Trash2, Edit3 } from "lucide-react"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

const EditableHeader = ({ id, defaultName, type, className, parsedColumns, onRename, isEmployee }: {
  id: string; defaultName: string; type: string; className: string; parsedColumns: any[];
  onRename: (id: string, newName: string, type: string) => void;
  isEmployee?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const col = parsedColumns.find((c: any) => c.id === id)
  const name = col ? col.name : defaultName
  const [val, setVal] = useState(name)

  const handleSave = () => {
    setIsEditing(false)
    if (val.trim() && val !== name) {
      onRename(id, val.trim(), type)
    } else {
      setVal(name)
    }
  }

  if (isEditing) {
    return (
      <div className={className}>
        <input 
          autoFocus
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="bg-transparent border-b border-primary outline-none w-full text-center px-1 font-semibold text-white text-xs"
        />
      </div>
    )
  }

  return (
    <div 
      className={`${isEmployee ? '' : 'cursor-pointer hover:bg-white/10'} transition-colors rounded py-0.5 ${className}`}
      onClick={() => !isEmployee && setIsEditing(true)}
      title={isEmployee ? undefined : "Click to rename"}
    >
      {name}
    </div>
  )
}

interface GroupSectionProps {
  board: Board
  group: BoardGroup
  groupIndex?: number
  onRefresh: () => void
  searchQuery: string
  sortOption: string
  filterStatus: string
}

export function GroupSection({ 
  board, 
  group, 
  groupIndex = 0,
  onRefresh, 
  searchQuery, 
  sortOption, 
  filterStatus 
}: GroupSectionProps) {
  const { createTask, updateBoard, deleteGroup, updateGroup } = usePlakyApi()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const [isEditingGroupName, setIsEditingGroupName] = useState(false)
  const [groupNameVal, setGroupNameVal] = useState(group.name)
  const pathname = usePathname()
  const { role } = useAuthStore()
  const isEmployee = role === 'employee' || Boolean(pathname?.startsWith('/employee'))

  const theme: GroupTheme = GROUP_THEMES[groupIndex % GROUP_THEMES.length]

  const handleDeleteGroup = async () => {
    if (confirm(`Are you sure you want to delete the group "${group.name}" and all its tasks?`)) {
      await deleteGroup(group.id)
      onRefresh()
    }
  }

  const handleSaveGroupName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsEditingGroupName(false)
    if (groupNameVal.trim() && groupNameVal !== group.name) {
      await updateGroup(group.id, { name: groupNameVal.trim() })
      onRefresh()
    } else {
      setGroupNameVal(group.name)
    }
  }

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

  const handleRenameColumn = async (colId: string, newName: string, type: string) => {
    let currentCols: any[] = [];
    if (typeof board.columns === 'string') {
      try { currentCols = JSON.parse(board.columns) } catch(e) {}
    } else if (Array.isArray(board.columns)) {
      currentCols = [...board.columns]
    }
    
    const existingIndex = currentCols.findIndex((c: any) => c.id === colId);
    if (existingIndex >= 0) {
      currentCols[existingIndex].name = newName;
    } else {
      currentCols.push({ id: colId, name: newName, type });
    }
    
    await updateBoard(board.id, { columns: currentCols });
    onRefresh();
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
    if (filterStatus && filterStatus !== "all" && task.status !== filterStatus) return false;

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
    <div className="flex flex-col">
      {/* Group Title above table with action menu */}
      <div className="flex items-center gap-2 mb-2 pl-1 group/gh">
        {isEditingGroupName ? (
          <form onSubmit={handleSaveGroupName} className="flex items-center gap-2">
            <Input 
              autoFocus
              className="h-7 text-sm font-bold bg-[#1c1e2d] border-slate-700 max-w-[200px]"
              style={{ color: theme.hex }}
              value={groupNameVal}
              onChange={(e) => setGroupNameVal(e.target.value)}
              onBlur={handleSaveGroupName}
            />
          </form>
        ) : (
          <h3 
            className="font-bold text-base tracking-tight cursor-pointer hover:underline" 
            style={{ color: theme.hex }}
            onClick={() => !isEmployee && setIsEditingGroupName(true)}
            title={isEmployee ? undefined : "Click to rename group"}
          >
            {group.name}
          </h3>
        )}

        <span className="text-xs text-slate-400 font-medium ml-1">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>

        {!isEmployee && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/gh:opacity-100 transition-opacity text-slate-400 hover:text-white rounded ml-1">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 bg-[#242738] border-slate-700 text-slate-200">
              <DropdownMenuItem onClick={() => setIsEditingGroupName(true)} className="cursor-pointer gap-2 focus:bg-white/10 focus:text-white text-xs">
                <Edit3 className="h-3.5 w-3.5" /> Rename Group
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAddingTask(true)} className="cursor-pointer gap-2 focus:bg-white/10 focus:text-white text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteGroup} className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 text-xs">
                <Trash2 className="h-3.5 w-3.5" /> Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          {/* Column Headers Bar with Dropdown Chevron on the left */}
          <div className="flex items-center mb-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">
            {/* Left Chevron Button in group theme color */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-5 h-8 rounded-l-md shrink-0 flex items-center justify-center text-white font-bold shadow-sm transition-transform active:scale-95 select-none"
              style={{ backgroundColor: theme.hex }}
              title={isExpanded ? "Collapse group" : "Expand group"}
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            {/* 1. Task Name Column Header */}
            <EditableHeader 
              isEmployee={isEmployee} 
              id="std_taskName" 
              defaultName="Task Name" 
              type="Text" 
              className="w-[320px] shrink-0 pl-3 flex items-center bg-[#1c1e2d] h-8 border-r border-[#131520]" 
              parsedColumns={parsedColumns} 
              onRename={handleRenameColumn} 
            />

            {/* 2. Person / Assignee Column Header */}
            <EditableHeader 
              isEmployee={isEmployee} 
              id="std_person" 
              defaultName="Person" 
              type="Person" 
              className="w-[110px] shrink-0 flex justify-center items-center bg-[#1c1e2d] h-8 border-r border-[#131520]" 
              parsedColumns={parsedColumns} 
              onRename={handleRenameColumn} 
            />

            {/* 3. Date / Timeline Column Header */}
            <EditableHeader 
              isEmployee={isEmployee} 
              id="std_date" 
              defaultName="Date" 
              type="Date" 
              className="w-[120px] shrink-0 flex justify-center items-center bg-[#1c1e2d] h-8 border-r border-[#131520]" 
              parsedColumns={parsedColumns} 
              onRename={handleRenameColumn} 
            />

            {/* 4. Content Column Header */}
            <EditableHeader 
              isEmployee={isEmployee} 
              id="std_content" 
              defaultName="Content" 
              type="Rich Text" 
              className="w-[150px] shrink-0 flex justify-center items-center bg-[#1c1e2d] h-8 border-r border-[#131520]" 
              parsedColumns={parsedColumns} 
              onRename={handleRenameColumn} 
            />

            {/* 5. Creative Column Header */}
            <EditableHeader 
              isEmployee={isEmployee} 
              id="std_creative" 
              defaultName="Creative" 
              type="Text" 
              className="w-[130px] shrink-0 flex justify-center items-center bg-[#1c1e2d] h-8 border-r border-[#131520]" 
              parsedColumns={parsedColumns} 
              onRename={handleRenameColumn} 
            />

            {/* 6. Status Column Header */}
            <EditableHeader 
              isEmployee={isEmployee} 
              id="std_status" 
              defaultName="Status" 
              type="Status" 
              className="w-[120px] shrink-0 flex justify-center items-center bg-[#1c1e2d] h-8 border-r border-[#131520]" 
              parsedColumns={parsedColumns} 
              onRename={handleRenameColumn} 
            />

            {/* 7. Dynamic Custom Columns */}
            {parsedColumns.filter((col: any) => !col.id.startsWith('std_')).map((col: any) => (
              <div key={col.id} className="w-[120px] shrink-0 h-8 bg-[#1c1e2d] border-r border-[#131520] flex items-center justify-center px-2 group/col relative">
                <EditableHeader isEmployee={isEmployee} id={col.id} defaultName={col.name} type={col.type} className="w-full truncate pr-3 text-center" parsedColumns={parsedColumns} onRename={handleRenameColumn} />
                {!isEmployee && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 absolute right-1 opacity-0 group-hover/col:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full"
                    onClick={(e) => { e.stopPropagation(); handleRemoveColumn(col.id); }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            
            {/* 8. Add Column Button */}
            {!isEmployee && (
              <div className="w-[44px] shrink-0 h-8 bg-[#1c1e2d] rounded-r-md flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded hover:bg-white/10 text-slate-300 hover:text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-[#242738] text-slate-200 border-slate-700 shadow-xl p-1 rounded-xl">
                    <DropdownMenuItem onSelect={() => handleAddColumn('Text', 'Text')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <Type className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Text</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAddColumn('Rich Text', 'Rich Text')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <Heading className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Rich Text</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAddColumn('Link', 'Link')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <LinkIcon className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAddColumn('Numbers', 'Numbers')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <Hash className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Numbers</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAddColumn('Status', 'Status')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <Activity className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Status</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAddColumn('Tag', 'Tag')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <Tag className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Tag</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAddColumn('Date', 'Date')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <Calendar className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Date</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAddColumn('Timeline', 'Timeline')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <CalendarDays className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Timeline</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAddColumn('Person', 'Person')} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg py-2 px-3 focus:bg-white/10 focus:text-white">
                      <Users className="h-4 w-4" />
                      <span className="flex-1 text-sm font-normal">Person</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Tasks List */}
          {isExpanded && (
            <div className="flex flex-col">
              {filteredTasks.map((task) => (
                <TaskRow 
                  key={task.id} 
                  board={board} 
                  task={task} 
                  theme={theme}
                  onRefresh={onRefresh} 
                />
              ))}

              {/* Inline Add Task Form */}
              {isAddingTask && (
                <div className="flex items-center mb-1.5 ml-5">
                  <div className="w-[320px] shrink-0 h-9 bg-[#1d1f2e] px-3 flex items-center gap-2 rounded-l-md border-r border-[#131520]">
                    <form onSubmit={handleAddTask} className="flex flex-1 items-center gap-2">
                      <Input 
                        autoFocus
                        className="h-7 text-xs bg-transparent border-slate-700 text-white"
                        value={newTaskName} 
                        onChange={(e) => setNewTaskName(e.target.value)} 
                        placeholder="Enter item name..." 
                      />
                      <Button type="submit" size="sm" className="h-7 text-xs px-2.5">Add</Button>
                      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                    </form>
                  </div>
                </div>
              )}

              {/* Simple + Add Button Row */}
              {!isEmployee && !isAddingTask && (
                <div className="flex items-center mt-1 ml-5">
                  <button 
                    onClick={() => setIsAddingTask(true)} 
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded hover:bg-white/5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
