'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task, Notification, TaskStatus, Comment, TeamMember } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
  getStoredTasks,
  setStoredTasks,
  getStoredNotifications,
  setStoredNotifications,
  mockTeamMembers,
} from '@/lib/store';

interface TaskContextType {
  tasks: Task[];
  notifications: Notification[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'order'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) => void;
  addComment: (taskId: string, content: string, authorId: string, authorName: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount - this is the intended pattern for hydration
    /* eslint-disable react-hooks/set-state-in-effect */
    setTasks(getStoredTasks());
    setNotifications(getStoredNotifications());
    setIsLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const addNotificationInternal = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      setStoredNotifications(updated);
      return updated;
    });
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'order'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      comments: [],
      order: tasks.filter((t) => t.status === taskData.status).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => {
      const updated = [...prev, newTask];
      setStoredTasks(updated);
      return updated;
    });

    if (taskData.ownerId) {
      addNotificationInternal({
        type: 'task_assigned',
        message: `You have been assigned to "${taskData.title}"`,
        taskId: newTask.id,
      });
    }

    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === id);
      if (taskIndex === -1) return prev;

      const oldTask = prev[taskIndex];
      const updatedTask = { ...oldTask, ...updates, updatedAt: new Date().toISOString() };
      const updated = [...prev];
      updated[taskIndex] = updatedTask;
      setStoredTasks(updated);

      // Send notifications for relevant changes
      if (updates.ownerId && updates.ownerId !== oldTask.ownerId) {
        addNotificationInternal({
          type: 'task_assigned',
          message: `You have been assigned to "${updatedTask.title}"`,
          taskId: id,
        });
      }

      if (updates.status && updates.status !== oldTask.status) {
        addNotificationInternal({
          type: 'task_updated',
          message: `Task "${updatedTask.title}" moved to ${updates.status}`,
          taskId: id,
        });

        // Notify if a dependency is completed
        if (updates.status === 'done') {
          const dependentTasks = prev.filter((t) => t.dependencies.includes(id));
          dependentTasks.forEach((depTask) => {
            addNotificationInternal({
              type: 'dependency_completed',
              message: `Dependency "${updatedTask.title}" for task "${depTask.title}" has been completed`,
              taskId: depTask.id,
            });
          });
        }
      }

      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      setStoredTasks(updated);
      return updated;
    });
  };

  const moveTask = (taskId: string, newStatus: TaskStatus, newOrder: number) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = prev[taskIndex];
      const oldStatus = task.status;

      // Get all tasks in the target column
      const targetColumnTasks = prev
        .filter((t) => t.status === newStatus && t.id !== taskId)
        .sort((a, b) => a.order - b.order);

      // Insert the task at the new position
      targetColumnTasks.splice(newOrder, 0, { ...task, status: newStatus });

      // Update orders for all tasks in target column
      const updatedTargetTasks = targetColumnTasks.map((t, index) => ({
        ...t,
        order: index,
        updatedAt: t.id === taskId ? new Date().toISOString() : t.updatedAt,
      }));

      // Get tasks from other columns
      const otherTasks = prev.filter((t) => t.status !== newStatus && t.id !== taskId);

      // Reorder tasks in the source column if different from target
      if (oldStatus !== newStatus) {
        const sourceColumnTasks = otherTasks
          .filter((t) => t.status === oldStatus)
          .sort((a, b) => a.order - b.order)
          .map((t, index) => ({ ...t, order: index }));

        const remainingTasks = otherTasks.filter((t) => t.status !== oldStatus);
        const updated = [...remainingTasks, ...sourceColumnTasks, ...updatedTargetTasks];
        setStoredTasks(updated);

        addNotificationInternal({
          type: 'task_updated',
          message: `Task "${task.title}" moved to ${newStatus}`,
          taskId,
        });

        if (newStatus === 'done') {
          const dependentTasks = prev.filter((t) => t.dependencies.includes(taskId));
          dependentTasks.forEach((depTask) => {
            addNotificationInternal({
              type: 'dependency_completed',
              message: `Dependency "${task.title}" for task "${depTask.title}" has been completed`,
              taskId: depTask.id,
            });
          });
        }

        return updated;
      }

      const updated = [...otherTasks, ...updatedTargetTasks];
      setStoredTasks(updated);
      return updated;
    });
  };

  const addComment = (taskId: string, content: string, authorId: string, authorName: string) => {
    const comment: Comment = {
      id: uuidv4(),
      taskId,
      authorId,
      authorName,
      content,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = prev[taskIndex];
      const updatedTask = {
        ...task,
        comments: [...task.comments, comment],
        updatedAt: new Date().toISOString(),
      };
      const updated = [...prev];
      updated[taskIndex] = updatedTask;
      setStoredTasks(updated);

      addNotificationInternal({
        type: 'comment_added',
        message: `${authorName} commented on "${task.title}"`,
        taskId,
      });

      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      setStoredNotifications(updated);
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      setStoredNotifications(updated);
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    setStoredNotifications([]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        notifications,
        teamMembers: mockTeamMembers,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        addComment,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
