import { useState, useEffect } from "react"
import { PlakyTask, Board } from "@/schemas/plaky"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, MoreHorizontal, Subtitles, User, Trash2, Edit3, MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { TaskDetailPanel } from "./task-detail-panel"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

export interface GroupTheme {
  name: string
  color: string
  bg: string
  text: string
  border: string
  lightBg: string
  hex: string
}

export const GROUP_THEMES: GroupTheme[] = [
  { name: 'blue', color: '#0085ff', bg: 'bg-[#0085ff]', text: 'text-[#0085ff]', border: 'border-[#0085ff]', lightBg: 'bg-[#0085ff]/15', hex: '#0085ff' },
  { name: 'coral', color: '#f95e38', bg: 'bg-[#f95e38]', text: 'text-[#f95e38]', border: 'border-[#f95e38]', lightBg: 'bg-[#f95e38]/15', hex: '#f95e38' },
  { name: 'purple', color: '#8b5cf6', bg: 'bg-[#8b5cf6]', text: 'text-[#8b5cf6]', border: 'border-[#8b5cf6]', lightBg: 'bg-[#8b5cf6]/15', hex: '#8b5cf6' },
  { name: 'pink', color: '#ec4899', bg: 'bg-[#ec4899]', text: 'text-[#ec4899]', border: 'border-[#ec4899]', lightBg: 'bg-[#ec4899]/15', hex: '#ec4899' },
  { name: 'amber', color: '#f59e0b', bg: 'bg-[#f59e0b]', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]', lightBg: 'bg-[#f59e0b]/15', hex: '#f59e0b' },
]

export const STATUS_OPTIONS = [
  { name: "To Do", hex: "#0085ff", bg: "bg-[#0085ff]" },
  { name: "In Progress", hex: "#fdab3d", bg: "bg-[#fdab3d]" },
  { name: "Review", hex: "#a25ddc", bg: "bg-[#a25ddc]" },
  { name: "Approved", hex: "#00c5d2", bg: "bg-[#00c5d2]" },
  { name: "Done", hex: "#00c875", bg: "bg-[#00c875]" },
]

export const statusStyles: Record<string, { bg: string; text: string; hex: string }> = {
  "Done": { bg: "bg-[#00c875]", text: "text-white", hex: "#00c875" },
  "Complete": { bg: "bg-[#00c875]", text: "text-white", hex: "#00c875" },
  "Completed": { bg: "bg-[#00c875]", text: "text-white", hex: "#00c875" },
  "In Progress": { bg: "bg-[#fdab3d]", text: "text-white", hex: "#fdab3d" },
  "Review": { bg: "bg-[#a25ddc]", text: "text-white", hex: "#a25ddc" },
  "Approved": { bg: "bg-[#00c5d2]", text: "text-white", hex: "#00c5d2" },
  "To Do": { bg: "bg-[#0085ff]", text: "text-white", hex: "#0085ff" },
}

export const getStatusStyle = (status?: string) => {
  if (!status) return { bg: "bg-[#0085ff]", text: "text-white", hex: "#0085ff" };
  const found = statusStyles[status];
  if (found) return found;
  const s = status.trim().toLowerCase();
  if (s.includes("done") || s.includes("comp")) return { bg: "bg-[#00c875]", text: "text-white", hex: "#00c875" };
  if (s.includes("prog")) return { bg: "bg-[#fdab3d]", text: "text-white", hex: "#fdab3d" };
  if (s.includes("rev")) return { bg: "bg-[#a25ddc]", text: "text-white", hex: "#a25ddc" };
  if (s.includes("appr")) return { bg: "bg-[#00c5d2]", text: "text-white", hex: "#00c5d2" };
  return { bg: "bg-[#0085ff]", text: "text-white", hex: "#0085ff" };
}

interface TaskRowProps {
  board?: Board
  task: PlakyTask
  onRefresh: () => void
  isSubtask?: boolean
  theme?: GroupTheme
}

function CustomFieldCell({
  colId,
  initialValue,
  onSave,
  readOnly
}: {
  colId: string;
  initialValue: string;
  onSave: (colId: string, value: string) => Promise<void>;
  readOnly?: boolean;
}) {
  const [val, setVal] = useState(initialValue)

  useEffect(() => {
    setVal(initialValue)
  }, [initialValue])

  const handleBlur = () => {
    if (val !== initialValue) {
      onSave(colId, val)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }

  return (
    <Input
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="h-7 text-xs border-transparent hover:border-input focus:border-input bg-transparent text-center font-medium text-slate-200"
      placeholder="-"
      readOnly={readOnly}
    />
  )
}

export function TaskRow({ board, task, onRefresh, isSubtask = false, theme = GROUP_THEMES[0] }: TaskRowProps) {
  const { updateTask, createTask, deleteTask } = usePlakyApi()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [newSubtaskName, setNewSubtaskName] = useState("")

  const pathname = usePathname()
  const { role } = useAuthStore()
  const isEmployee = role === 'employee' || Boolean(pathname?.startsWith('/employee'))

  const handleCustomFieldChange = async (colId: string, value: string) => {
    const customFields = { ...(task.customFields || {}), [colId]: value }
    await updateTask(task.id, { customFields })
    onRefresh()
  }

  const handleStatusChange = async (val: string) => {
    await updateTask(task.id, { status: val })
    onRefresh()
  }

  const handleDeleteTask = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id)
      onRefresh()
    }
  }

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskName.trim()) return
    
    await createTask({
      groupId: task.groupId,
      parentTaskId: task.id,
      name: newSubtaskName,
      status: "To Do",
      paymentStatus: "Pending"
    })
    
    setNewSubtaskName("")
    setIsAddingSubtask(false)
    if (!isExpanded) setIsExpanded(true)
    onRefresh()
  }

  const assigneeName = task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : ""
  const hasSubtasks = task.subTasks && task.subTasks.length > 0

  let parsedColumns = [];
  if (board?.columns) {
    if (typeof board.columns === 'string') {
      try { parsedColumns = JSON.parse(board.columns) } catch(e) {}
    } else if (Array.isArray(board.columns)) {
      parsedColumns = board.columns;
    }
  }

  const statusStyle = getStatusStyle(task.status)

  return (
    <>
      <div className={`group flex items-center transition-all duration-150 whitespace-nowrap mb-1.5 ${isSubtask ? 'ml-6' : ''}`}>
        
        {/* Left colored vertical tab */}
        <div 
          className="w-5 h-10 rounded-l-md shrink-0 flex items-center justify-center text-white/80 cursor-grab select-none shadow-sm transition-opacity"
          style={{ backgroundColor: theme.hex }}
          title="Drag row"
        >
          <MoreVertical className="h-3 w-3 opacity-60" />
        </div>

        {/* 1. Task Name Cell */}
        <div className="w-[320px] shrink-0 h-10 bg-[#1c1e2d] hover:bg-[#23263b] px-3 flex items-center gap-2 border-r border-[#131520] transition-colors">
          {!isSubtask && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 shrink-0 p-0 text-slate-400 hover:text-white" 
              onClick={() => setIsExpanded(!isExpanded)} 
              disabled={!hasSubtasks && !isAddingSubtask}
            >
              {(hasSubtasks || isAddingSubtask) ? (
                isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <span className="w-3.5" />
              )}
            </Button>
          )}
          {isSubtask && <div className="w-4 border-l-2 border-b-2 border-slate-600 h-3 rounded-bl-sm shrink-0" />}
          
          <div 
            className="truncate font-medium text-[13px] text-slate-100 cursor-pointer hover:text-primary transition-colors flex-1"
            onClick={() => setIsPanelOpen(true)}
          >
            {task.name}
          </div>

          {hasSubtasks && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-white/10 px-1.5 py-0.5 rounded font-mono shrink-0">
              <Subtitles className="h-3 w-3" /> {task.subTasks?.length}
            </span>
          )}
          
          {!isSubtask && !isEmployee && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white" 
              onClick={() => setIsAddingSubtask(true)}
              title="Add Subtask"
            >
              <Subtitles className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* 2. Person / Assignee Column */}
        <div className="w-[110px] shrink-0 h-10 bg-[#1c1e2d] hover:bg-[#23263b] px-2 flex items-center justify-center border-r border-[#131520] transition-colors">
          {task.assignee ? (
            <div className="flex items-center justify-center cursor-pointer" onClick={() => setIsPanelOpen(true)} title={assigneeName}>
              <Avatar className="h-6 w-6 ring-2 ring-white/10 shadow-sm">
                <AvatarImage src={task.assignee.profileImage || ""} />
                <AvatarFallback className="text-[10px] bg-primary/40 text-primary-foreground font-bold">{assigneeName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-slate-600 flex items-center justify-center cursor-pointer text-muted-foreground hover:bg-white/10 hover:border-slate-400 transition-colors" onClick={() => setIsPanelOpen(true)}>
              <User className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* 3. Date / Timeline Column (Blue pill) */}
        <div className="w-[120px] shrink-0 h-10 bg-[#1c1e2d] hover:bg-[#23263b] px-2 flex items-center justify-center border-r border-[#131520] transition-colors">
          {task.dueDate ? (
            <span 
              className="bg-[#0073ea] hover:bg-[#0081ff] text-white text-xs font-semibold px-3 py-1 rounded-md shadow-sm truncate max-w-[105px] cursor-pointer text-center transition-colors"
              onClick={() => setIsPanelOpen(true)}
            >
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ) : (
            <span className="text-slate-500 text-xs cursor-pointer hover:text-slate-300" onClick={() => setIsPanelOpen(true)}>-</span>
          )}
        </div>

        {/* 4. Content Column */}
        <div className="w-[150px] shrink-0 h-10 bg-[#1c1e2d] hover:bg-[#23263b] px-2 flex items-center justify-center text-xs text-slate-300 truncate border-r border-[#131520] transition-colors cursor-pointer" onClick={() => setIsPanelOpen(true)}>
          <span className="truncate max-w-[130px]">{task.content || '-'}</span>
        </div>

        {/* 5. Creative Column */}
        <div className="w-[130px] shrink-0 h-10 bg-[#1c1e2d] hover:bg-[#23263b] px-2 flex items-center justify-center text-xs text-slate-300 truncate border-r border-[#131520] transition-colors cursor-pointer" onClick={() => setIsPanelOpen(true)}>
          <span className="truncate max-w-[110px]">{task.creativeType || '-'}</span>
        </div>

        {/* 6. Status Column (Solid colored pill) */}
        <div className="w-[120px] shrink-0 h-10 bg-[#1c1e2d] hover:bg-[#23263b] px-2 flex items-center justify-center border-r border-[#131520] transition-colors">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="h-7 w-full text-xs font-semibold text-white rounded-md shadow-sm flex items-center justify-center px-2 hover:opacity-90 active:scale-95 transition-all select-none cursor-pointer"
                style={{ backgroundColor: statusStyle.hex }}
              >
                <span className="truncate">{task.status || "To Do"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-36 bg-[#242738] border-slate-700 text-slate-200 p-1 rounded-xl shadow-xl">
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuItem 
                  key={opt.name} 
                  onClick={() => handleStatusChange(opt.name)}
                  className="rounded-lg cursor-pointer flex items-center gap-2 px-2.5 py-1.5 focus:bg-white/10 focus:text-white"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: opt.hex }} />
                  <span className="text-xs font-medium">{opt.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 7. Dynamic Custom Columns */}
        {parsedColumns.filter((col: any) => !col.id.startsWith('std_')).map((col: any) => {
          const value = task.customFields?.[col.id] || ''
          return (
            <div key={col.id} className="w-[120px] shrink-0 h-10 bg-[#1c1e2d] hover:bg-[#23263b] px-2 flex items-center justify-center border-r border-[#131520] transition-colors">
              <CustomFieldCell
                colId={col.id}
                initialValue={value}
                onSave={handleCustomFieldChange}
                readOnly={isEmployee}
              />
            </div>
          )
        })}
        
        {/* Row Action Menu */}
        <div className="w-[44px] shrink-0 h-10 bg-[#1c1e2d] hover:bg-[#23263b] rounded-r-md flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-[#242738] border-slate-700 text-slate-200">
              <DropdownMenuItem onClick={() => setIsPanelOpen(true)} className="cursor-pointer gap-2 focus:bg-white/10 focus:text-white">
                <Edit3 className="h-4 w-4" /> Edit Details
              </DropdownMenuItem>
              {!isSubtask && !isEmployee && (
                <DropdownMenuItem onClick={() => setIsAddingSubtask(true)} className="cursor-pointer gap-2 focus:bg-white/10 focus:text-white">
                  <Subtitles className="h-4 w-4" /> Add Subtask
                </DropdownMenuItem>
              )}
              {!isEmployee && (
                <DropdownMenuItem onClick={handleDeleteTask} className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash2 className="h-4 w-4" /> Delete Task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Subtasks rendering */}
      {isExpanded && !isSubtask && (
        <div className="flex flex-col pl-4 my-1">
          {task.subTasks?.map(subtask => (
            <TaskRow 
              key={subtask.id} 
              board={board} 
              task={subtask} 
              onRefresh={onRefresh} 
              isSubtask={true} 
              theme={theme}
            />
          ))}
          
          {isAddingSubtask && (
            <div className="flex px-4 py-2 rounded-md border border-dashed border-slate-700 items-center bg-[#1d1f2e]/60 ml-6 max-w-md my-1">
              <form onSubmit={handleAddSubtask} className="flex flex-1 items-center gap-2">
                <Input 
                  autoFocus
                  className="h-7 text-xs bg-transparent border-slate-700 text-white"
                  value={newSubtaskName} 
                  onChange={(e) => setNewSubtaskName(e.target.value)} 
                  placeholder="New subtask name" 
                />
                <Button type="submit" size="sm" className="h-7 text-xs">Add</Button>
                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsAddingSubtask(false)}>Cancel</Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Task Detail Panel Modal */}
      {isPanelOpen && (
        <TaskDetailPanel 
          task={task} 
          board={board}
          isOpen={isPanelOpen} 
          onClose={() => setIsPanelOpen(false)} 
          onRefresh={onRefresh} 
        />
      )}
    </>
  )
}
