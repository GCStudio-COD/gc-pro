import { z } from "zod"

export const projectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }),

  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().min(1, { message: "End date is required." }),
  priority: z.enum(["Low", "Medium", "High", "Critical"], {
    message: "Please select a priority.",
  }),
  status: z.enum(["Planning", "In Progress", "On Hold", "Completed"], {
    message: "Please select a status.",
  }),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  clientName: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
