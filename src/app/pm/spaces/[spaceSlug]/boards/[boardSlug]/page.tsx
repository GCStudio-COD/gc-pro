"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { useParams } from "next/navigation"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Board, BoardGroup } from "@/schemas/plaky"
import { BoardTable } from "@/features/plaky/components/board-table"
import { BoardToolbar } from "@/features/plaky/components/board-toolbar"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function BoardPage() {
  const params = useParams()
  const boardId = params.boardSlug as string
  const spaceId = params.spaceSlug as string

  const { getBoard } = usePlakyApi()
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<string>("default")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const { updateBoard } = usePlakyApi()

  const toggleBoardStatus = async () => {
    if (!board) return
    const newStatus = board.status === "Completed" ? "Active" : "Completed"
    const updated = await updateBoard(board.id, { status: newStatus })
    if (updated) {
      setBoard({ ...board, status: newStatus })
      toast.success(`Project marked as ${newStatus}`)
    }
  }

  useEffect(() => {
    if (boardId) {
      loadBoard(true)
    }
  }, [boardId])

  const loadBoard = async (showLoading = false) => {
    if (showLoading) setLoading(true)
    const b = await getBoard(boardId)
    if (b) {
      setBoard(b)
    } else {
      toast.error("Board not found")
    }
    if (showLoading) setLoading(false)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[80vh] items-center justify-center w-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    )
  }

  if (!board) {
    return (
      <AppLayout>
        <div className="flex flex-col h-[80vh] items-center justify-center w-full text-center">
          <h2 className="text-2xl font-bold">Board not found</h2>
          <p className="text-muted-foreground mt-2">The board might have been deleted or you don't have access.</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
        {/* Header Section */}
        <div className="flex flex-col p-4 md:px-8 md:pt-8 md:pb-4 border-b bg-background z-10 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{board.name}</h1>
                {board.status === 'Completed' && (
                  <span className="bg-green-500/10 text-green-500 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </span>
                )}
              </div>
              {board.description && <p className="text-muted-foreground mt-1">{board.description}</p>}
            </div>
            <div>
              <Button 
                variant={board.status === 'Completed' ? "outline" : "default"}
                onClick={toggleBoardStatus}
                size="sm"
                className={board.status === 'Completed' ? "text-green-500 hover:text-green-600 border-green-500/50" : "bg-green-600 hover:bg-green-700"}
              >
                {board.status === 'Completed' ? "Mark as Active" : "Mark as Completed"}
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <BoardToolbar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOption={sortOption}
              onSortChange={setSortOption}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-auto bg-muted/20 p-4 md:p-8">
          <BoardTable 
            board={board} 
            onRefresh={loadBoard} 
            searchQuery={searchQuery}
            sortOption={sortOption}
            filterStatus={filterStatus}
          />
        </div>
      </div>
    </AppLayout>
  )
}
