"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitBranch, Globe, Loader2, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export function ProjectFiles({ project, onUpdate, effectiveRole }: { project?: any, onUpdate?: () => void, effectiveRole?: string }) {
  const [newNote, setNewNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveNotes = async () => {
    if (!project || !newNote.trim()) return
    setIsSaving(true)
    try {
      const payload = { content: newNote }
      const res = await fetchApi(`/projects/${project.id}/notes`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }, effectiveRole)

      if (res.ok) {
        toast.success("Note added successfully")
        setNewNote("") // Clear the input field
        if (onUpdate) onUpdate()
      } else {
        toast.error("Failed to add note")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Links</CardTitle>
          <CardDescription>External repositories and live URLs for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={project?.githubUrl || "#"} 
              target={project?.githubUrl ? "_blank" : "_self"}
              rel="noreferrer"
              className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${project?.githubUrl ? "hover:bg-muted/50" : "opacity-50 cursor-not-allowed"}`}
            >
              <div className="p-2 bg-primary/10 text-primary rounded">
                <GitBranch className="h-6 w-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-sm">GitHub Repository</p>
                <p className="text-xs text-muted-foreground truncate">
                  {project?.githubUrl || "Not configured"}
                </p>
              </div>
            </a>
            <a 
              href={project?.liveUrl || "#"} 
              target={project?.liveUrl ? "_blank" : "_self"}
              rel="noreferrer"
              className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${project?.liveUrl ? "hover:bg-muted/50" : "opacity-50 cursor-not-allowed"}`}
            >
              <div className="p-2 bg-primary/10 text-primary rounded">
                <Globe className="h-6 w-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-sm">Live URL</p>
                <p className="text-xs text-muted-foreground truncate">
                  {project?.liveUrl || "Not configured"}
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Notes</CardTitle>
          <CardDescription>Keep track of important information, links, and documents here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {project?.notes && project.notes.length > 0 ? (
              <div className="flex flex-col gap-4">
                {project.notes.map((note: any) => (
                  <div key={note.id} className="p-4 rounded-lg border bg-muted/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">
                        {note.creator?.firstName} {note.creator?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No notes yet. Add one below!</p>
            )}

            <div className="flex flex-col gap-4 pt-4 border-t">
              <Textarea 
                placeholder="Write a new note..."
                className="min-h-[100px]"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={effectiveRole === 'employee'}
              />
              {effectiveRole !== 'employee' && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotes} disabled={isSaving || !newNote.trim()}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Add Note
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
