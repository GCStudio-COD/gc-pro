import * as z from "zod"

export const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  head: z.string().min(2, "Department head must be at least 2 characters"),
  employees: z.coerce.number().default(0),
  status: z.enum(["Healthy", "Warning", "Critical"]).default("Healthy"),
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>
