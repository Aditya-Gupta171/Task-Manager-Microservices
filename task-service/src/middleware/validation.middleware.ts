import { Request, Response, NextFunction } from "express";

export const validateCreateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Task title is required" });
  }

  next();
};

export const validateUpdateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, completed } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ message: "Task title cannot be empty" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "Completed status must be a boolean" });
  }

  next();
};