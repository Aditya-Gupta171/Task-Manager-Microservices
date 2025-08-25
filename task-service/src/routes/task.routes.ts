import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  validateCreateTask,
  validateUpdateTask,
} from "../middleware/validation.middleware";

const router = Router();
const taskController = new TaskController();


router.use(authMiddleware);

// Create a new task
router.post(
  "/",
  validateCreateTask,
  taskController.createTask.bind(taskController)
);

// Get all tasks for the authenticated user
router.get("/", taskController.getTasks.bind(taskController));

// Get a specific task by ID
router.get("/:id", taskController.getTaskById.bind(taskController));

// Update a task
router.put(
  "/:id",
  validateUpdateTask,
  taskController.updateTask.bind(taskController)
);

// Delete a task
router.delete("/:id", taskController.deleteTask.bind(taskController));

export default router;