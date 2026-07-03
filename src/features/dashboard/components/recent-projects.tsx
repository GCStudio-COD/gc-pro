import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const projects = [
  {
    id: "PRJ-01",
    name: "Website Redesign",
    status: "In Progress",
    progress: 75,
    team: [
      { name: "Alice", avatar: "/avatars/01.png" },
      { name: "Bob", avatar: "/avatars/02.png" },
    ],
  },
  {
    id: "PRJ-02",
    name: "Mobile App V2",
    status: "Planning",
    progress: 20,
    team: [{ name: "Charlie", avatar: "/avatars/03.png" }],
  },
  {
    id: "PRJ-03",
    name: "Database Migration",
    status: "Completed",
    progress: 100,
    team: [
      { name: "Dave", avatar: "/avatars/04.png" },
      { name: "Eve", avatar: "/avatars/05.png" },
      { name: "Frank", avatar: "/avatars/06.png" },
    ],
  },
]

export function RecentProjects() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>You have 3 active projects this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div>{project.name}</div>
                  <div className="text-xs text-muted-foreground">{project.id}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      project.status === "Completed"
                        ? "default"
                        : project.status === "In Progress"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="w-[60%]" />
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end -space-x-2">
                    {project.team.map((member, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
