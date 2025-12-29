'use client';

import { useState } from 'react';
import type { Issue, IssueStatus, IssuePriority, IssueType, User, Label, Project } from '@/types';
import { cn } from '@/lib/utils';

interface IssueFormProps {
  issue?: Issue;
  projects: Project[];
  users: User[];
  labels: Label[];
  onSubmit: (data: Partial<Issue>) => void;
  onCancel: () => void;
}

export function IssueForm({ issue, projects, users, labels, onSubmit, onCancel }: IssueFormProps) {
  const [formData, setFormData] = useState({
    title: issue?.title || '',
    description: issue?.description || '',
    status: issue?.status || 'open' as IssueStatus,
    priority: issue?.priority || 'medium' as IssuePriority,
    type: issue?.type || 'task' as IssueType,
    projectId: issue?.projectId || projects[0]?.id || '',
    assigneeId: issue?.assignee?.id || '',
    labelIds: issue?.labels.map(l => l.id) || [] as string[],
    dueDate: issue?.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : '',
    gitBranch: issue?.gitBranch || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = users.find(u => u.id === formData.assigneeId);
    const selectedLabels = labels.filter(l => formData.labelIds.includes(l.id));
    
    onSubmit({
      ...formData,
      assignee,
      labels: selectedLabels,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
    });
  };

  const toggleLabel = (labelId: string) => {
    setFormData(prev => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter(id => id !== labelId)
        : [...prev.labelIds, labelId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief summary of the issue"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detailed description of the issue..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project *
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.key})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as IssueType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bug">🐛 Bug</option>
            <option value="feature">✨ Feature</option>
            <option value="task">📋 Task</option>
            <option value="improvement">💡 Improvement</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as IssueStatus })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as IssuePriority })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">↓ Low</option>
            <option value="medium">→ Medium</option>
            <option value="high">↑ High</option>
            <option value="critical">⚠ Critical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <select
            value={formData.assigneeId}
            onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Unassigned</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Git Branch
        </label>
        <input
          type="text"
          value={formData.gitBranch}
          onChange={(e) => setFormData({ ...formData, gitBranch: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., feature/issue-123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Labels
        </label>
        <div className="flex flex-wrap gap-2">
          {labels.map(label => (
            <button
              key={label.id}
              type="button"
              onClick={() => toggleLabel(label.id)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                formData.labelIds.includes(label.id)
                  ? 'ring-2 ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              )}
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
                // @ts-expect-error CSS custom property for ring color
                '--tw-ring-color': label.color
              }}
            >
              {label.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {issue ? 'Update Issue' : 'Create Issue'}
        </button>
      </div>
    </form>
  );
}
