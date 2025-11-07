import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { createTodoSchema, updateTodoSchema } from "./lib/validate";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = createTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json(parsed.error.format());
  }
  try {
    const newTodo = await prisma.todo.create({ data: parsed.data });
    res.status(201).json(newTodo);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = updateTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json(parsed.error.format());
  }
  try {
    const todo = await prisma.todo.update({where: {id}, data: parsed.data});
    res.status(201).json(todo);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Id No Found" });
  }
});

export default router;
