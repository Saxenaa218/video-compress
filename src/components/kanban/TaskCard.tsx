'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getDueDateStatus(dueDate: string | undefined) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  if (isPast(date) && !isToday(date)) {
    return { label: 'Overdue', className: 'text-red-600' };
  }
  if (isToday(date)) {
    return { label: 'Due today', className: 'text-orange-600' };
  }
  if (isTomorrow(date)) {
    return { label: 'Due tomorrow', className: 'text-yellow-600' };
  }
  return { label: format(date, 'MMM d'), className: 'text-gray-600' };
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer
        hover:shadow-md transition-shadow duration-200
        ${isDragging ? 'opacity-50 shadow-lg ring-2 ring-blue-400' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {task.ownerName && (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                {task.ownerName.charAt(0)}
              </div>
              <span className="text-gray-600 hidden sm:inline">{task.ownerName.split(' ')[0]}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.dependencies.length > 0 && (
            <span className="text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {task.dependencies.length}
            </span>
          )}

          {task.comments.length > 0 && (
            <span className="text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {task.comments.length}
            </span>
          )}

          {dueDateStatus && (
            <span className={`flex items-center gap-1 ${dueDateStatus.className}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dueDateStatus.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
