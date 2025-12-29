'use client';

import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import Column from './Column';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function KanbanBoard({ onTaskClick, onAddTask }: KanbanBoardProps) {
  const { tasks, moveTask } = useTaskContext();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === 'todo').sort((a, b) => a.order - b.order),
      'in-progress': tasks.filter((t) => t.status === 'in-progress').sort((a, b) => a.order - b.order),
      done: tasks.filter((t) => t.status === 'done').sort((a, b) => a.order - b.order),
    };
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragOver() {
    // Handle drag over for visual feedback
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if dropping on a column
    const targetStatus = columns.find((col) => col.id === overId)?.id;
    if (targetStatus) {
      // Dropped directly on a column
      const targetTasks = tasksByStatus[targetStatus];
      moveTask(activeId, targetStatus, targetTasks.length);
      return;
    }

    // Check if dropping on another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      const newStatus = overTask.status;
      const targetTasks = tasksByStatus[newStatus];
      const overIndex = targetTasks.findIndex((t) => t.id === overId);

      if (activeTask.status === newStatus) {
        // Same column - reorder
        const activeIndex = targetTasks.findIndex((t) => t.id === activeId);
        if (activeIndex !== overIndex) {
          moveTask(activeId, newStatus, overIndex);
        }
      } else {
        // Different column - move
        moveTask(activeId, newStatus, overIndex);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-6 p-6 overflow-x-auto min-h-screen">
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id]}
            onTaskClick={onTaskClick}
            onAddTask={() => onAddTask(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3">
            <TaskCard task={activeTask} onClick={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
