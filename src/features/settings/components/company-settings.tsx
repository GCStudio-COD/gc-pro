"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function CompanySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Update your organization's core details and branding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 rounded-md">
              <AvatarImage src="/avatars/company-logo.png" alt="Company Logo" />
              <AvatarFallback className="rounded-md">INC</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Workspace Logo</h4>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Upload new</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" defaultValue="Acme Corporation" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input id="website" defaultValue="https://acme.example.com" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" defaultValue="Software Development" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Input id="size" defaultValue="50-200 employees" />
            </div>
          </div>

          <Button>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
