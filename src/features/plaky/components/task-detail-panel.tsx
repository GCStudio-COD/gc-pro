import { useState, useEffect } from "react"
import { PlakyTask } from "@/schemas/plaky"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { fetchApi } from "@/lib/api"
import { useAuthStore } from "@/store/use-auth-store"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash2, Type, Layout, AlignLeft, CheckCircle2, UserCircle2, Save, Sparkles, Calendar, Flag } from "lucide-react"

interface TaskDetailPanelProps {
  task: PlakyTask
  board?: any
  isOpen: boolean
  onClose: () => void
  onRefresh: () => void
}

const statusColors: Record<string, string> = {
  "To Do": "bg-slate-500",
  "In Progress": "bg-orange-500",
  "Review": "bg-purple-500",
  "Approved": "bg-blue-500",
  "Done": "bg-green-500",
}

const priorityColors: Record<string, string> = {
  "Low": "text-slate-500",
  "Medium": "text-blue-500",
  "High": "text-orange-500",
  "Urgent": "text-red-500",
}

export function TaskDetailPanel({ task, board, isOpen, onClose, onRefresh }: TaskDetailPanelProps) {
  const { updateTask, deleteTask } = usePlakyApi()
  
  const [name, setName] = useState(task.name)
  const [content, setContent] = useState(task.content || "")
  const [creativeType, setCreativeType] = useState(task.creativeType || "")
  const [description, setDescription] = useState(task.description || "")
  const [status, setStatus] = useState(task.status)
  const [priority, setPriority] = useState(task.priority || "Medium")
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : "")
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || "unassigned")
  const [customFields, setCustomFields] = useState<Record<string, any>>(task.customFields || {})
  const [employees, setEmployees] = useState<any[]>([])
  
  const pathname = usePathname()
  const { role } = useAuthStore()
  const isEmployee = role === 'employee' || Boolean(pathname?.startsWith('/employee'))

  let parsedColumns: any[] = [];
  if (board?.columns) {
    if (typeof board.columns === 'string') {
      try { parsedColumns = JSON.parse(board.columns) } catch(e) {}
    } else if (Array.isArray(board.columns)) {
      parsedColumns = board.columns;
    }
  }

  const getStdName = (id: string, defaultName: string) => {
    const col = parsedColumns.find((c: any) => c.id === id);
    return col ? col.name : defaultName;
  }

  useEffect(() => {
    fetchApi('/employees', {}, role || undefined)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEmployees(data)
      })
      .catch(console.error)
  }, [role])

  // Sync state if task changes
  useEffect(() => {
    setName(task.name)
    setContent(task.content || "")
    setCreativeType(task.creativeType || "")
    setDescription(task.description || "")
    setStatus(task.status)
    setPriority(task.priority || "Medium")
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : "")
    setAssigneeId(task.assigneeId || "unassigned")
    setCustomFields(task.customFields || {})
  }, [task])

  const handleSave = async () => {
    await updateTask(task.id, {
      name,
      content,
      creativeType,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      assigneeId: assigneeId === "unassigned" ? null : assigneeId,
      customFields
    })
    onRefresh()
    onClose()
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id)
      onRefresh()
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[450px] p-0 flex flex-col gap-0 border-l border-border bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden duration-300">
        <SheetHeader className="px-6 py-6 border-b bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Edit Task
          </SheetTitle>
          <SheetDescription className="text-muted-foreground relative z-10">
            Update the details, status, and assignment of this item.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 custom-scrollbar">
          <div className="space-y-5">
            <div className="group space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Type className="w-3.5 h-3.5" /> {getStdName('std_taskName', 'Task Name')}
              </Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="h-11 rounded-xl bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 focus:bg-background transition-all hover:bg-muted/70 font-medium"
                readOnly={isEmployee}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="group space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {getStdName('std_status', 'Status')}
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className={`h-11 rounded-xl border-transparent focus:ring-1 focus:ring-primary/50 transition-all font-medium text-white ${statusColors[status] || 'bg-muted/40'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-muted/20 shadow-xl">
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
              
              <div className="group space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <UserCircle2 className="w-3.5 h-3.5" /> {getStdName('std_person', 'Assignee')}
                </Label>
                <Select value={assigneeId} onValueChange={setAssigneeId} disabled={isEmployee}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/40 border-transparent focus:ring-1 focus:ring-primary/50 hover:bg-muted/70 transition-all font-medium">
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-muted/20 shadow-xl max-h-[200px]">
                    <SelectItem value="unassigned" className="rounded-lg cursor-pointer italic text-muted-foreground">Unassigned</SelectItem>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id} className="rounded-lg cursor-pointer">
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="group space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5" /> Priority
                </Label>
                <Select value={priority} onValueChange={setPriority} disabled={isEmployee}>
                  <SelectTrigger className={`h-11 rounded-xl border-transparent focus:ring-1 focus:ring-primary/50 transition-all font-medium bg-muted/40`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-muted/20 shadow-xl">
                    {Object.entries(priorityColors).map(([p, colorClass]) => (
                      <SelectItem key={p} value={p} className="rounded-lg cursor-pointer">
                        <div className={`flex items-center gap-2 font-medium ${colorClass}`}>
                          {p}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="group space-y-2">
                <Label htmlFor="dueDate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Due Date
                </Label>
                <Input 
                  id="dueDate"
                  type="date"
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  className="h-11 rounded-xl bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 hover:bg-muted/70 focus:bg-background transition-all font-medium"
                  readOnly={isEmployee}
                />
              </div>
            </div>
            
            <div className="group space-y-2">
              <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layout className="w-3.5 h-3.5" /> {getStdName('std_content', 'Content')}
              </Label>
              <Input 
                id="content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="E.g. Product promotion video" 
                className="h-11 rounded-xl bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 hover:bg-muted/70 focus:bg-background transition-all"
                readOnly={isEmployee}
              />
            </div>
            
            <div className="group space-y-2">
              <Label htmlFor="creativeType" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> {getStdName('std_creative', 'Creative')}
              </Label>
              <Input 
                id="creativeType" 
                value={creativeType} 
                onChange={(e) => setCreativeType(e.target.value)} 
                placeholder="E.g. Video, Image, Carousel" 
                className="h-11 rounded-xl bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 hover:bg-muted/70 focus:bg-background transition-all"
                readOnly={isEmployee}
              />
            </div>
            
            <div className="group space-y-2">
              <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5" /> Description
              </Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Add more details about this task..."
                className="min-h-[140px] rounded-xl bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 hover:bg-muted/70 focus:bg-background transition-all resize-none py-3"
                readOnly={isEmployee}
              />
            </div>
            
            {/* Dynamic Custom Fields */}
            {(() => {
              const customCols = parsedColumns.filter((col: any) => !col.id.startsWith('std_'));
              if (customCols.length === 0) return null;
              
              return (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4" /> Custom Properties
                  </h4>
                  <div className="grid gap-4">
                    {customCols.map((col: any) => (
                      <div key={col.id} className="group space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                          {col.name}
                        </Label>
                        <Input 
                          value={customFields[col.id] || ''} 
                          onChange={(e) => setCustomFields(prev => ({ ...prev, [col.id]: e.target.value }))}
                          placeholder={`Enter ${col.name.toLowerCase()}...`}
                          className="h-11 rounded-xl bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 hover:bg-muted/70 focus:bg-background transition-all"
                          readOnly={isEmployee}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
            
          </div>
        </div>
        
        {isEmployee ? (
          <div className="px-6 py-5 border-t bg-background/50 backdrop-blur-md flex justify-end items-center shrink-0">
            <Button 
              onClick={handleSave} 
              className="rounded-xl px-6 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Update Status
            </Button>
          </div>
        ) : (
          <div className="px-6 py-5 border-t bg-background/50 backdrop-blur-md flex justify-between items-center shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl px-3 transition-colors flex items-center gap-2 h-10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} className="rounded-xl px-5 h-10">
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="rounded-xl px-6 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
