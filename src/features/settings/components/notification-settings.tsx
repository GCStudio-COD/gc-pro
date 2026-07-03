"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive alerts and communications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Email Notifications</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Communication emails</Label>
                <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing emails</Label>
                <p className="text-sm text-muted-foreground">Receive emails about new products and features.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Social notifications</Label>
                <p className="text-sm text-muted-foreground">Receive emails for friend requests and follows.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          
          <div className="pt-4">
            <Button>Update preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
