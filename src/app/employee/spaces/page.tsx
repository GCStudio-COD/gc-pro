"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Plus, FolderPlus, Settings2, MoreHorizontal, FolderOpen, ChevronRight, CheckCircle2 } from "lucide-react"
import { usePlakyApi } from "@/hooks/use-plaky-api"
import { Space, Workspace } from "@/schemas/plaky"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"

export default function SpacesPage() {
  const { getSpaces, createSpace, getWorkspaces, createWorkspace, createBoard } = usePlakyApi()
  const [spaces, setSpaces] = useState<Space[]>([])
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [newSpaceName, setNewSpaceName] = useState("")
  const [newSpaceColor, setNewSpaceColor] = useState("#4f46e5")
  const [isSpaceDialogOpen, setIsSpaceDialogOpen] = useState(false)

  const [newBoardName, setNewBoardName] = useState("")
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null)
  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const ws = await getWorkspaces()
    let currentWs = ws[0]
    if (!currentWs) {
      currentWs = await createWorkspace("Goal Creatives") as Workspace
    }
    setWorkspace(currentWs)

    const sp = await getSpaces()
    setSpaces(sp)
    setIsLoading(false)
  }

  const handleCreateSpace = async () => {
    if (!workspace) {
      toast.error("Workspace is not initialized. Please ensure the backend is updated and running.")
      return
    }
    const sp = await createSpace({
      workspaceId: workspace.id,
      name: newSpaceName,
      color: newSpaceColor
    })
    if (sp) {
      setIsSpaceDialogOpen(false)
      setNewSpaceName("")
      loadData()
    }
  }

  const handleCreateBoard = async () => {
    if (!selectedSpaceId) return
    const bd = await createBoard({
      spaceId: selectedSpaceId,
      name: newBoardName
    })
    if (bd) {
      setIsBoardDialogOpen(false)
      setNewBoardName("")
      setSelectedSpaceId(null)
      loadData()
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Spaces & Boards</h1>
            <p className="text-muted-foreground mt-1">View your organization's workspaces and boards.</p>
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 border rounded-lg border-dashed">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground animate-pulse">Loading workspaces...</p>
            </div>
          ) : (
            <>
              {spaces.map((space: any) => (
                <Card key={space.id} className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: space.color || '#4f46e5' }}>
                        {space.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{space.name}</CardTitle>
                        <CardDescription>{space.boards?.length || 0} clients</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {space.boards && space.boards.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {space.boards.map((board: any) => (
                          <div key={board.id} className="relative group/board">
                            <Link href={`/employee/spaces/${space.slug || space.id}/boards/${board.slug || board.id}`}>
                              <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors group-hover/board:border-primary">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-medium group-hover/board:text-primary transition-colors pr-8">{board.name}</h3>
                                  {board.status === 'Completed' && (
                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Click to open client</p>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-4 py-8 text-center border rounded-lg border-dashed">
                        No clients in this space yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {spaces.length === 0 && (
                <div className="text-center py-12 border rounded-lg border-dashed">
                  <FolderPlus className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium">No spaces found</h3>
                  <p className="text-muted-foreground mb-4">Ask an administrator to create a space.</p>
                </div>
              )}
            </>
          )}
        </div>

        <Dialog open={isBoardDialogOpen} onOpenChange={setIsBoardDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new Board</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="boardName">Board Name</Label>
                <Input id="boardName" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="e.g. Client X" />
              </div>
            </div>
            <Button onClick={handleCreateBoard} disabled={!newBoardName}>Create Board</Button>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
