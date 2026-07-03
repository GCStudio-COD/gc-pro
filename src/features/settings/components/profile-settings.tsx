"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"
import { usePathname } from "next/navigation"

export function ProfileSettings() {
  const [user, setUser] = useState<any>(null)
  
  const { role } = useRoleStore()
  const pathname = usePathname()
  
  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  useEffect(() => {
    fetchApi('/auth/me', {}, effectiveRole)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(console.error)
  }, [effectiveRole])

  if (!user) {
    return <div className="text-muted-foreground p-4">Loading profile...</div>
  }

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your public profile and personal details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/avatars/01.png" alt="Profile image" />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Profile Picture</h4>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Change</Button>
                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" defaultValue={user.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" defaultValue={user.lastName} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" defaultValue={user.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              defaultValue="Senior Software Engineer passionate about React and Next.js." 
              className="resize-none h-24"
            />
            <p className="text-xs text-muted-foreground">Brief description for your profile. URLs are hyperlinked.</p>
          </div>

          <Button>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
