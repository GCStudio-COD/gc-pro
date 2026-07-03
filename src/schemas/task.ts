import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(3, { message: "Task title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }),
  project: z.string().min(1, { message: "Please select an associated project." }),
  assignee: z.string().min(1, { message: "Please assign this task to someone." }),
  dueDate: z.string().min(1, { message: "Due date is required." }),
  priority: z.enum(["Low", "Medium", "High", "Critical"], {
    message: "Please select a priority.",
  }),
  status: z.enum(["To Do", "In Progress", "Done"], {
    message: "Please select a status.",
  }),
})

export type TaskFormValues = z.infer<typeof taskSchema>
