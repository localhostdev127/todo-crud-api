import express, { NextFunction, Request, Response } from "express";
import Todo, { ITodo } from "../models/todo.model";

const router = express.Router();

// Create a new todo
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        const todo = new Todo({ title, description });
        await todo.save();
        res.status(201).json(todo);
    } catch (error: any) {
        next(error)
    }
});

// Get all todos
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error: any) {
        next(error)
    }
});

// Get a single todo
router.get("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) res.status(404).json({ message: "Todo not found" });
        res.json(todo);
    } catch (error: any) {
        next(error)
    }
});

// Update a todo
router.put("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, description, completed } = req.body;
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, completed },
            { new: true }
        );
        if (!todo) res.status(404).json({ message: "Todo not found" });
        res.json(todo);
    } catch (error: any) {
        next(error)
    }
});

// Delete a todo
router.delete("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) res.status(404).json({ message: "Todo not found" });
        res.json({ message: "Todo deleted successfully" });
    } catch (error: any) {
        next(error)
    }
});

export default router;
