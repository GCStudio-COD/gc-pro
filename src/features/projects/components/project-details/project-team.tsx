import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ProjectTeam({ project }: { project: any }) {
  const teamMembers = project?.employees || []

  if (teamMembers.length === 0) {
    return <div className="p-4 text-muted-foreground">No team members assigned.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {teamMembers.map((member: any) => (
        <Card key={member.id} className="flex flex-row items-center p-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={member.profileImage || ""} alt={member.firstName} />
            <AvatarFallback>{member.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{member.firstName} {member.lastName}</span>
            <span className="text-sm text-muted-foreground">{member.role}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
