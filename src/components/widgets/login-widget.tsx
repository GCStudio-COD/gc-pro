"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"
import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff } from "lucide-react"

type AuthMode = "login" | "signup" | "otp" | "forgot-password" | "reset-password";

export function LoginWidget() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullname, setFullname] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [signupEmail, setSignupEmail] = useState("")

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyingSSO, setIsVerifyingSSO] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

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
      
      const res = await fetchApi('/auth/me', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        const userRole = data.role || data.employee?.role;
        const userId = data.id || data.employee?.id;

        setAuth(token, userRole, userId)
        
        // Redirect to appropriate dashboard
        if (userRole === 'admin' || userRole === 'SuperAdmin') {
          router.push('/admin/dashboard')
        } else if (userRole === 'project-manager') {
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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match!")
        }
        const nameParts = (fullname || '').trim().split(' ')
        const firstName = nameParts[0] || 'User'
        const lastName = nameParts.slice(1).join(' ') || '-'

        const res = await fetchApi('/auth/signup/request', {
          method: "POST",
          body: JSON.stringify({ email, password, fullname, firstName, lastName })
        })
        const data = await res.json()
        if (res.ok) {
          setSignupEmail(email)
          setAuthMode('otp')
        } else {
          throw new Error(data.error || "Failed to sign up")
        }
      } else if (authMode === 'otp') {
        const res = await fetchApi('/auth/signup/verify', {
          method: "POST",
          body: JSON.stringify({ email: signupEmail, otp })
        })
        const data = await res.json()
        if (res.ok) {
          alert(data.message || "Verified successfully! Waiting for Admin approval.")
          setAuthMode('login')
        } else {
          throw new Error(data.error || "OTP Verification failed")
        }
      } else if (authMode === 'forgot-password') {
        const res = await fetchApi('/auth/forgot-password/request', {
          method: "POST",
          body: JSON.stringify({ email })
        })
        const data = await res.json()
        if (res.ok) {
          setSignupEmail(email)
          setAuthMode('reset-password')
        } else {
          throw new Error(data.error || "Failed to request reset")
        }
      } else if (authMode === 'reset-password') {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match!")
        }
        const res = await fetchApi('/auth/forgot-password/reset', {
          method: "POST",
          body: JSON.stringify({ email: signupEmail, otp, newPassword: password })
        })
        const data = await res.json()
        if (res.ok) {
          alert(data.message || "Password reset successfully!")
          setAuthMode('login')
        } else {
          throw new Error(data.error || "Reset failed")
        }
      } else {
        // login
        const res = await fetchApi('/auth/login', {
          method: "POST",
          body: JSON.stringify({ email, password })
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to login")
        }
        
        const userRole = data.role || data.employee?.role;
        const userId = data.id || data.employee?.id;

        // Store real token
        setAuth(data.token, userRole, userId)

        // Redirect
        if (userRole === 'admin' || userRole === 'SuperAdmin') {
          router.push('/admin/dashboard')
        } else if (userRole === 'project-manager') {
          router.push('/pm/dashboard')
        } else {
          router.push('/employee/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
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
          <CardTitle className="text-2xl font-bold tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : 
             authMode === 'signup' ? 'Create Account' : 
             authMode === 'forgot-password' ? 'Reset Password' : 
             authMode === 'reset-password' ? 'New Password' : 'Verify Email'}
          </CardTitle>
          <CardDescription>
            {authMode === 'login' && 'Log in to your GC Project Management account'}
            {authMode === 'signup' && 'Sign up for a new account'}
            {authMode === 'otp' && `An OTP has been sent to ${signupEmail}. Please enter it below.`}
            {authMode === 'forgot-password' && "Enter your email address and we'll send you a code to reset your password."}
            {authMode === 'reset-password' && `An OTP has been sent to ${signupEmail}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="John Doe"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
            )}

            {(authMode === 'login' || authMode === 'signup' || authMode === 'forgot-password') && (
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
            )}

            {(authMode === 'login' || authMode === 'signup' || authMode === 'reset-password') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{authMode === 'reset-password' ? 'New Password' : 'Password'}</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {authMode === 'login' && (
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => {
                        setAuthMode('forgot-password');
                        setError("");
                      }} 
                      className="text-sm font-medium text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {(authMode === 'signup' || authMode === 'reset-password') && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {(authMode === 'otp' || authMode === 'reset-password') && (
              <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center tracking-widest text-lg font-semibold"
                  required
                />
              </div>
            )}
            
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                authMode === 'login' ? 'Log in' :
                authMode === 'signup' ? 'Sign up' :
                authMode === 'forgot-password' ? 'Send Code' :
                authMode === 'reset-password' ? 'Reset Password' : 'Verify OTP'
              )}
            </Button>
          </form>

          {(authMode === 'login' || authMode === 'signup') && (
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                type="button" 
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setError("");
                }} 
                className="font-medium text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          )}

          {(authMode === 'otp' || authMode === 'forgot-password' || authMode === 'reset-password') && (
            <div className="mt-4 text-center text-sm">
              <button 
                type="button" 
                onClick={() => {
                  setAuthMode('login');
                  setError("");
                }} 
                className="font-medium text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Back to Log in
              </button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
