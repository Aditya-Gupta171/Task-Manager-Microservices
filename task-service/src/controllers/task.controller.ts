import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskDTO, UpdateTaskDTO } from "../models/task.model";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async createTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const taskData: CreateTaskDTO = {
        ...req.body,
        userId,
      };

      const task = await this.taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error: any) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: error.message || "Error creating task" });
    }
  }

  async getTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const tasks = await this.taskService.getTasks(userId);
      res.json(tasks);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: error.message || "Error fetching tasks" });
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await this.taskService.getTaskById(taskId, userId);
      res.json(task);
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(500).json({ message: error.message || "Error fetching task" });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const taskData: UpdateTaskDTO = req.body;
      const task = await this.taskService.updateTask(taskId, userId, taskData);
      res.json(task);
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(500).json({ message: error.message || "Error updating task" });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      await this.taskService.deleteTask(taskId, userId);
      res.json({ message: "Task deleted successfully" });
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(500).json({ message: error.message || "Error deleting task" });
    }
  }
}