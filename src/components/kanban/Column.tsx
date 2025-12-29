'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

function getColumnColor(status: TaskStatus) {
  switch (status) {
    case 'todo':
      return 'border-gray-300 bg-gray-50';
    case 'in-progress':
      return 'border-blue-300 bg-blue-50';
    case 'done':
      return 'border-green-300 bg-green-50';
    default:
      return 'border-gray-300 bg-gray-50';
  }
}

function getColumnHeaderColor(status: TaskStatus) {
  switch (status) {
    case 'todo':
      return 'text-gray-700';
    case 'in-progress':
      return 'text-blue-700';
    case 'done':
      return 'text-green-700';
    default:
      return 'text-gray-700';
  }
}

export default function Column({ id, title, tasks, onTaskClick, onAddTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-h-[500px] w-full md:w-80 rounded-xl border-2 ${getColumnColor(id)}
        ${isOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
        transition-all duration-200
      `}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className={`font-semibold text-lg ${getColumnHeaderColor(id)}`}>
              {title}
            </h2>
            <span className="bg-white text-gray-600 text-sm px-2 py-0.5 rounded-full border">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={onAddTask}
            className="p-1 hover:bg-white rounded-lg transition-colors duration-200"
            aria-label={`Add task to ${title}`}
          >
            <svg
              className="w-5 h-5 text-gray-500 hover:text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <svg
              className="w-8 h-8 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
