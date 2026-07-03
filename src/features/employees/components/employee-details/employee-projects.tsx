import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const projects = [
  { id: "PRJ-01", name: "Website Redesign", role: "Lead Developer", status: "In Progress", progress: 75, deadline: "2026-08-15" },
  { id: "PRJ-05", name: "Authentication API", role: "Contributor", status: "Completed", progress: 100, deadline: "2026-05-20" },
  { id: "PRJ-12", name: "Mobile App V2", role: "Reviewer", status: "Planning", progress: 15, deadline: "2026-11-01" },
]

export function EmployeeProjects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription>{project.id}</CardDescription>
              </div>
              <Badge variant={project.status === "Completed" ? "default" : project.status === "In Progress" ? "secondary" : "outline"}>
                {project.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{project.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deadline:</span>
                <span className="font-medium">{project.deadline}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
