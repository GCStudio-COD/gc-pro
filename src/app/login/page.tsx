"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyingSSO, setIsVerifyingSSO] = useState(true)

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      // SSO Mode - we have a token from the desktop app
      verifyTokenAndLogin(token)
    } else {
      setIsVerifyingSSO(false)
    }
  }, [searchParams])

  const verifyTokenAndLogin = async (token: string) => {
    try {
      // Store token temporarily to fetch user data
      localStorage.setItem("token", token)
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        setAuth(token, data.role, data.id)
        
        // Redirect to appropriate dashboard
        if (data.role === 'admin' || data.role === 'SuperAdmin') {
          router.push('/admin/dashboard')
        } else if (data.role === 'project-manager') {
          router.push('/pm/dashboard')
        } else {
          router.push('/employee/dashboard')
        }
      } else {
        localStorage.removeItem("token")
        setError("Invalid SSO session. Please log in manually.")
        setIsVerifyingSSO(false)
      }
    } catch (err) {
      localStorage.removeItem("token")
      setError("Failed to verify SSO session.")
      setIsVerifyingSSO(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to login")
      }

      const data = await res.json()
      
      // Store real token
      setAuth(data.token, data.role, data.id)

      // Redirect
      if (data.role === 'admin' || data.role === 'SuperAdmin') {
        router.push('/admin/dashboard')
      } else if (data.role === 'project-manager') {
        router.push('/pm/dashboard')
      } else {
        router.push('/employee/dashboard')
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifyingSSO) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Authenticating securely via Desktop App...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>
            Log in to your GC Project Management account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
