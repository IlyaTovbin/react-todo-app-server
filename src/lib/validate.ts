import { z } from "zod";

const createTodoSchema = z.object({
  title: z.string().min(1),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
});

export {createTodoSchema, updateTodoSchema};