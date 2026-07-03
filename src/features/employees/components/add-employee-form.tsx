"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"

import { employeeSchema, EmployeeFormValues } from "@/schemas/employee"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"

export function AddEmployeeForm() {
  const router = useRouter()
  const pathname = usePathname()
  const { role } = useRoleStore()
  
  let effectiveRole = role
  if (pathname?.startsWith('/admin')) effectiveRole = 'admin'
  else if (pathname?.startsWith('/pm')) effectiveRole = 'project-manager'
  else if (pathname?.startsWith('/employee')) effectiveRole = 'employee'

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [departments, setDepartments] = useState<any[]>([])

  useEffect(() => {
    fetchApi('/departments', {}, effectiveRole)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDepartments(data)
      })
      .catch(console.error)
  }, [effectiveRole])

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      role: "",
      status: "Active",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create local preview URL
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      form.setValue("profileImage", file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    form.setValue("profileImage", undefined)
  }

  async function onSubmit(data: EmployeeFormValues) {
    setIsSubmitting(true)
    
    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    console.log("Submitted Data:", data)
    
    setIsSubmitting(false)
    toast.success("Employee added successfully!", {
      description: `${data.firstName} ${data.lastName} has been added to the directory.`,
    })
    
    // Navigate back to employee list
    router.push("/employees")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Employee</CardTitle>
        <CardDescription>Fill out the form below to create a new employee profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Image Upload Area */}
            <div className="flex flex-col space-y-4">
              <FormLabel>Profile Image</FormLabel>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-border border-dashed">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <Upload className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={handleImageChange}
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                      Upload Image
                    </Button>
                    {imagePreview && (
                      <Button type="button" variant="ghost" size="icon" onClick={removeImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 256x256px (JPG, PNG, WEBP)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Employee"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
