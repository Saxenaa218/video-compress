'use client';

import { useState } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskModal from '@/components/task/TaskModal';
import Header from '@/components/common/Header';
import IntegrationSettings from '@/components/common/IntegrationSettings';
import { Task, TaskStatus } from '@/types';

function TaskManagerApp() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isIntegrationSettingsOpen, setIsIntegrationSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [initialStatus, setInitialStatus] = useState<TaskStatus>('todo');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedTask(undefined);
    setInitialStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="px-4 py-4 flex justify-end">
        <button
          onClick={() => setIsIntegrationSettingsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Integrations
        </button>
      </div>

      <KanbanBoard onTaskClick={handleTaskClick} onAddTask={handleAddTask} />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={selectedTask}
        initialStatus={initialStatus}
      />

      <IntegrationSettings
        isOpen={isIntegrationSettingsOpen}
        onClose={() => setIsIntegrationSettingsOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <TaskProvider>
      <TaskManagerApp />
    </TaskProvider>
  );
}
