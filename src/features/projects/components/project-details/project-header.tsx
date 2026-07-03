import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target, Flag, Building } from "lucide-react"

export function ProjectHeader({ project }: { project: any }) {
  const calculateProgress = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter((t: any) => t.status === "Done" || t.status === "Completed").length;
    return Math.round((completed / tasks.length) * 100);
  }

  const progress = calculateProgress(project.tasks)
  let displayStatus = progress === 100 && project.tasks?.length > 0 ? "Completed" : project.status;
  if (displayStatus !== "Completed" && project.endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(project.endDate);
    end.setHours(0, 0, 0, 0);
    if (end < today) {
      displayStatus = "Delayed";
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-muted-foreground">{project.id.substring(0,8)} • {project.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={project.priority === 'Critical' ? 'destructive' : 'secondary'} className="w-fit text-sm px-3 py-1">{project.priority} Priority</Badge>
                <Badge 
                  variant={displayStatus === "Completed" ? "default" : "outline"} 
                  className={`w-fit text-sm px-3 py-1 ${
                    displayStatus === "Completed"
                      ? "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white"
                      : displayStatus === "In Progress"
                        ? "text-orange-600 border-orange-500 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30"
                        : displayStatus === "Delayed"
                          ? "text-destructive border-destructive bg-destructive/10"
                          : ""
                  }`}
                >
                  {displayStatus}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flag className="h-4 w-4" />
                <span>Deadline: {new Date(project.endDate).toLocaleDateString()}</span>
              </div>
              {project.githubUrl && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:underline text-primary">GitHub</a>
                </div>
              )}
              {project.liveUrl && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:underline text-primary">Live URL</a>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-1/3 p-4 rounded-lg bg-muted/50 border flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Project Progress</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {project.tasks?.filter((t:any) => t.status === "Done").length || 0} of {project.tasks?.length || 0} Tasks completed
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
