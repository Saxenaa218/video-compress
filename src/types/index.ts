export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  ownerId?: string;
  ownerName?: string;
  dueDate?: string;
  dependencies: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'due_date_reminder' | 'dependency_completed';
  message: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface IntegrationConfig {
  type: 'trello' | 'asana';
  apiKey?: string;
  boardId?: string;
  projectId?: string;
  enabled: boolean;
}
