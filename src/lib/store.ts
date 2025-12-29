import { Task, TeamMember, Notification, TaskStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock team members
export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com' },
];

// Mock tasks for initial data
export const mockTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Design homepage mockup',
    description: 'Create wireframes and high-fidelity mockups for the new homepage design',
    status: 'todo',
    priority: 'high',
    ownerId: '1',
    ownerName: 'John Doe',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    dependencies: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: uuidv4(),
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'in-progress',
    priority: 'medium',
    ownerId: '2',
    ownerName: 'Jane Smith',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    dependencies: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: uuidv4(),
    title: 'Write unit tests',
    description: 'Add comprehensive unit tests for core components',
    status: 'todo',
    priority: 'medium',
    ownerId: '3',
    ownerName: 'Bob Johnson',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    dependencies: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: uuidv4(),
    title: 'Database schema design',
    description: 'Design and document the database schema for the application',
    status: 'done',
    priority: 'high',
    ownerId: '4',
    ownerName: 'Alice Williams',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dependencies: [],
    comments: [
      {
        id: uuidv4(),
        taskId: '',
        authorId: '1',
        authorName: 'John Doe',
        content: 'Great work on this! The schema looks solid.',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 0,
  },
];

// Local storage keys
const TASKS_KEY = 'task_manager_tasks';
const NOTIFICATIONS_KEY = 'task_manager_notifications';

// Helper functions for local storage
export function getStoredTasks(): Task[] {
  if (typeof window === 'undefined') return mockTasks;
  const stored = localStorage.getItem(TASKS_KEY);
  if (!stored) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
    return mockTasks;
  }
  return JSON.parse(stored);
}

export function setStoredTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function getStoredNotifications(): Notification[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(NOTIFICATIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function setStoredNotifications(notifications: Notification[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
  const newNotification: Notification = {
    ...notification,
    id: uuidv4(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  const notifications = getStoredNotifications();
  setStoredNotifications([newNotification, ...notifications]);
  return newNotification;
}

export function getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);
}
