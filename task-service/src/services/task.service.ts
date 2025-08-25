import { prisma } from "../config/database";  // Changed from default import
import redisClient from "../config/redis";
import { CreateTaskDTO, UpdateTaskDTO } from "../models/task.model";

export class TaskService {
  private cacheExpiryTime = 300; // 5 minutes in seconds

  async createTask(taskData: CreateTaskDTO) {
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        userId: taskData.userId,
        completed: false,
      },
    });

    // Invalidate cache
    await this.invalidateUserTaskCache(taskData.userId);

    return task;
  }

  async getTasks(userId: number) {
    // Try to get from cache first
    const cacheKey = `tasks:${userId}`;
    const cachedTasks = await redisClient.get(cacheKey);

    if (cachedTasks) {
      console.log("Retrieved tasks from cache");
      return JSON.parse(cachedTasks);
    }

    // If not in cache, get from database
    console.log("Cache miss, fetching from database");
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Store in cache
    await redisClient.set(
      cacheKey,
      JSON.stringify(tasks),
      "EX",
      this.cacheExpiryTime
    );

    return tasks;
  }

  async getTaskById(taskId: number, userId: number) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  async updateTask(taskId: number, userId: number, data: UpdateTaskDTO) {
    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        description: data.description !== undefined ? data.description : undefined,
        completed: data.completed !== undefined ? data.completed : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    // Invalidate cache
    await this.invalidateUserTaskCache(userId);

    return updatedTask;
  }

  async deleteTask(taskId: number, userId: number) {
    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    // Invalidate cache
    await this.invalidateUserTaskCache(userId);

    return { success: true };
  }

  private async invalidateUserTaskCache(userId: number) {
    const cacheKey = `tasks:${userId}`;
    await redisClient.del(cacheKey);
  }
}