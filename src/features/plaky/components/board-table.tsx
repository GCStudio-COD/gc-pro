import { useState } from "react"
import { Board, BoardGroup } from "@/schemas/plaky"
import { GroupSection } from "./group-section"
import { Button } from "@/components/ui/button"
import { Plus, PlusCircle } from "lucide-react"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

interface BoardTableProps {
  board: Board
  onRefresh: () => void
  searchQuery: string
  sortOption: string
  filterStatus: string
}

export function BoardTable({ board, onRefresh, searchQuery, sortOption, filterStatus }: BoardTableProps) {
  const { createGroup } = usePlakyApi()
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const pathname = usePathname()
  const { role } = useAuthStore()
  const isEmployee = role === 'employee' || Boolean(pathname?.startsWith('/employee'))

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    
    await createGroup({
      boardId: board.id,
      name: newGroupName,
      order: board.groups?.length || 0
    })
    
    setNewGroupName("")
    setIsAddingGroup(false)
    onRefresh()
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {board.groups?.map((group) => (
        <GroupSection 
          key={group.id} 
          board={board}
          group={group} 
          onRefresh={onRefresh} 
          searchQuery={searchQuery}
          sortOption={sortOption}
          filterStatus={filterStatus}
        />
      ))}
      
      {(!board.groups || board.groups.length === 0) && (
        <div className="text-center py-12 border rounded-lg border-dashed bg-card/50">
          <p className="text-muted-foreground mb-4">This board is empty. Create a group to add tasks.</p>
        </div>
      )}

      {!isEmployee && (
        isAddingGroup ? (
          <form onSubmit={handleAddGroup} className="flex items-center gap-2 max-w-sm pl-4">
            <Input 
              autoFocus
              value={newGroupName} 
              onChange={(e) => setNewGroupName(e.target.value)} 
              placeholder="New Group Name" 
            />
            <Button type="submit" size="sm">Add</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingGroup(false)}>Cancel</Button>
          </form>
        ) : (
          <div className="flex items-center px-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground pl-1" onClick={() => setIsAddingGroup(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Group
            </Button>
          </div>
        )
      )}
    </div>
  )
}
