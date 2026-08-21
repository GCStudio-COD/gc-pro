import { useState, useEffect } from "react"
import { PlakyTask, Board } from "@/schemas/plaky"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronRight, MessageSquare, Paperclip, MoreHorizontal, Subtitles, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TaskDetailPanel } from "./task-detail-panel"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

interface TaskRowProps {
  board?: Board
  task: PlakyTask
  onRefresh: () => void
  isSubtask?: boolean
}

const statusColors: Record<string, string> = {
  "To Do": "bg-slate-500",
  "In Progress": "bg-orange-500",
  "Review": "bg-purple-500",
  "Approved": "bg-blue-500",
  "Complete": "bg-green-500",
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
      className="h-7 text-xs border-transparent hover:border-input focus:border-input bg-transparent text-center"
      placeholder="-"
      readOnly={readOnly}
    />
  )
}



export function TaskRow({ board, task, onRefresh, isSubtask = false }: TaskRowProps) {
  const { updateTask, createTask } = usePlakyApi()
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

  return (
    <>
      <div className={`group flex items-center px-4 py-2 border-b hover:bg-muted/10 transition-colors whitespace-nowrap overflow-x-auto hide-scrollbar ${isSubtask ? 'bg-muted/5' : ''}`}>
        
        {/* Name Column */}
        <div className="w-[300px] shrink-0 flex items-center gap-2">
          {!isSubtask && (
            <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0 p-0" onClick={() => setIsExpanded(!isExpanded)} disabled={!hasSubtasks && !isAddingSubtask}>
              {(hasSubtasks || isAddingSubtask) ? (
                isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
              ) : (
                <span className="w-3" />
              )}
            </Button>
          )}
          {isSubtask && <div className="w-5 ml-6 border-l-2 border-b-2 border-muted h-4 rounded-bl-sm shrink-0" />}
          
          <div 
            className="truncate font-medium text-sm cursor-pointer hover:text-primary transition-colors flex-1"
            onClick={() => setIsPanelOpen(true)}
          >
            {task.name}
          </div>
          
          {!isSubtask && !isEmployee && (
            <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsAddingSubtask(true)}>
              <Subtitles className="h-3 w-3 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Person Column */}
        <div className="w-[120px] shrink-0 flex justify-center">
          {task.assignee ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsPanelOpen(true)}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.profileImage || ""} />
                <AvatarFallback className="text-[10px]">{assigneeName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs truncate max-w-[80px]">{assigneeName}</span>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed flex items-center justify-center cursor-pointer text-muted-foreground hover:bg-muted" onClick={() => setIsPanelOpen(true)}>
              <User className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Date Column */}
        <div className="w-[100px] shrink-0 flex justify-center">
          <span className="text-xs text-muted-foreground cursor-pointer" onClick={() => setIsPanelOpen(true)}>
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
          </span>
        </div>

        {/* Content Column */}
        <div className="w-[150px] shrink-0 flex justify-center">
          <span className="text-xs truncate max-w-[120px] text-muted-foreground cursor-pointer" onClick={() => setIsPanelOpen(true)}>
            {task.content || '-'}
          </span>
        </div>

        {/* Creative Column */}
        <div className="w-[120px] shrink-0 flex justify-center">
          <span className="text-xs truncate text-muted-foreground cursor-pointer" onClick={() => setIsPanelOpen(true)}>
            {task.creativeType || '-'}
          </span>
        </div>

        {/* Status Column */}
        <div className="w-[120px] shrink-0 flex justify-center">
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className={`h-7 text-xs border-0 text-white font-medium ${statusColors[task.status] || 'bg-slate-500'}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusColors).map(([s, color]) => (
                <SelectItem key={s} value={s} className="rounded-lg cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    {s}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Columns */}
        {parsedColumns.map((col: any) => {
          const value = task.customFields?.[col.id] || ''
          return (
            <div key={col.id} className="w-[120px] shrink-0 flex justify-center px-2">
              <CustomFieldCell
                colId={col.id}
                initialValue={value}
                onSave={handleCustomFieldChange}
                readOnly={isEmployee}
              />
            </div>
          )
        })}
        
        <div className="w-[48px] shrink-0" />
      </div>

      {/* Subtasks rendering */}
      {isExpanded && !isSubtask && (
        <div className="flex flex-col">
          {task.subTasks?.map(subtask => (
            <TaskRow key={subtask.id} board={board} task={subtask} onRefresh={onRefresh} isSubtask={true} />
          ))}
          
          {isAddingSubtask && (
            <div className="flex px-4 py-2 border-b items-center bg-muted/5">
              <div className="w-[300px] shrink-0 flex items-center gap-2 pl-8">
                <div className="w-5 ml-6 border-l-2 border-b-2 border-muted h-4 rounded-bl-sm shrink-0" />
                <form onSubmit={handleAddSubtask} className="flex flex-1 items-center gap-2">
                  <Input 
                    autoFocus
                    className="h-7 text-xs"
                    value={newSubtaskName} 
                    onChange={(e) => setNewSubtaskName(e.target.value)} 
                    placeholder="New subtask name" 
                  />
                  <Button type="submit" size="sm" className="h-7 text-xs">Add</Button>
                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsAddingSubtask(false)}>Cancel</Button>
                </form>
              </div>
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
