import { z } from "zod"

export const employeeSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  department: z.string().min(1, { message: "Please select a department." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  status: z.enum(["Active", "Inactive", "On Leave"], {
    message: "Please select a status.",
  }),
  profileImage: z.any().optional(), // Can hold a File object or be empty
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>
