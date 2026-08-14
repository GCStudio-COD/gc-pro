import { z } from "zod";

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
  spaces: z.array(z.any()).optional(),
});

export const spaceSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  boards: z.array(z.any()).optional(),
});

export const boardSchema = z.object({
  id: z.string(),
  spaceId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  isFavorite: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  columns: z.any().optional(),
  groups: z.array(z.any()).optional(),
});

export const groupSchema = z.object({
  id: z.string(),
  boardId: z.string(),
  name: z.string().min(1, "Name is required"),
  order: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
  tasks: z.array(z.any()).optional(),
});

export const plakyTaskSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  parentTaskId: z.string().nullable().optional(),
  name: z.string().min(1, "Name is required"),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  creativeType: z.string().nullable().optional(),
  paymentStatus: z.string().default("Pending"),
  status: z.string().default("To Do"),
  priority: z.string().optional(),
  description: z.string().nullable().optional(),
  order: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
  customFields: z.any().optional(),
  subTasks: z.array(z.any()).optional(),
  assignee: z.any().optional(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type Space = z.infer<typeof spaceSchema>;
export type Board = z.infer<typeof boardSchema>;
export type BoardGroup = z.infer<typeof groupSchema>;
export type PlakyTask = z.infer<typeof plakyTaskSchema>;
