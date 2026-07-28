"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { useParams } from "next/navigation"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Board, BoardGroup } from "@/schemas/plaky"
import { BoardTable } from "@/features/plaky/components/board-table"
import { BoardToolbar } from "@/features/plaky/components/board-toolbar"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function BoardPage() {
  const params = useParams()
  const boardId = params.boardId as string
  const spaceId = params.spaceId as string

  const { getBoard } = usePlakyApi()
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<string>("default")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (boardId) {
      loadBoard()
    }
  }, [boardId])

  const loadBoard = async () => {
    setLoading(true)
    const b = await getBoard(boardId)
    if (b) {
      setBoard(b)
    } else {
      toast.error("Board not found")
    }
    setLoading(false)
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
              <h1 className="text-3xl font-bold tracking-tight">{board.name}</h1>
              {board.description && <p className="text-muted-foreground mt-1">{board.description}</p>}
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
