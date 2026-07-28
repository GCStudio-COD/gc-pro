"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Plus, FolderPlus, Settings2, MoreHorizontal } from "lucide-react"
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
    const ws = await getWorkspaces()
    let currentWs = ws[0]
    if (!currentWs) {
      currentWs = await createWorkspace("Goal Creatives") as Workspace
    }
    setWorkspace(currentWs)
    
    const sp = await getSpaces()
    setSpaces(sp)
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
      <div className="flex flex-col gap-6 p-4 md:p-8 w-full mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Spaces & Boards</h1>
            <p className="text-muted-foreground mt-1">Manage your organization's workspaces and boards.</p>
          </div>
          
          <Dialog open={isSpaceDialogOpen} onOpenChange={setIsSpaceDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Space
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new Space</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Space Name</Label>
                  <Input id="name" value={newSpaceName} onChange={(e) => setNewSpaceName(e.target.value)} placeholder="e.g. GC Performance Marketing" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    {['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'].map(c => (
                      <div 
                        key={c}
                        onClick={() => setNewSpaceColor(c)}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${newSpaceColor === c ? 'border-primary' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateSpace} disabled={!newSpaceName}>Create Space</Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {spaces.map(space => (
            <Card key={space.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold" style={{ backgroundColor: space.color || '#4f46e5' }}>
                    {space.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{space.name}</CardTitle>
                    <CardDescription>{space.boards?.length || 0} boards</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedSpaceId(space.id)
                  setIsBoardDialogOpen(true)
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Board
                </Button>
              </CardHeader>
              <CardContent>
                {space.boards && space.boards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {space.boards.map((board: any) => (
                      <Link key={board.id} href={`/pm/spaces/${space.id}/boards/${board.id}`}>
                        <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors group">
                          <h3 className="font-medium group-hover:text-primary transition-colors">{board.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">Click to open board</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground mt-4 py-8 text-center border rounded-lg border-dashed">
                    No boards in this space yet. Create one to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {spaces.length === 0 && (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <FolderPlus className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium">No spaces found</h3>
              <p className="text-muted-foreground mb-4">Create your first space to start organizing your work.</p>
              <Button onClick={() => setIsSpaceDialogOpen(true)}>
                Create Space
              </Button>
            </div>
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
