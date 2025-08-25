export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: string;
  userId: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}